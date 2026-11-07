package com.opesware.banking.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermission;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Dedicated authenticated PostgreSQL principal per bank, external mounted secret file.
 * No shared superuser, mutable bank GUC, or client-supplied JDBC credentials.
 *
 * Properties file format: bank.<bank UUID>.url, .user, .password
 * In production the file MUST have restrictive POSIX permissions (0600 or 0400).
 */
@Component
public final class BankConnections {
    private final Map<UUID, HikariDataSource> pools;

    public BankConnections(@Value("${OPES_BANK_CREDENTIALS_FILE}") String fileName) {
        try {
            Path file = Path.of(fileName).toAbsolutePath().normalize();
            if (!Files.isRegularFile(file, LinkOption.NOFOLLOW_LINKS)) {
                throw new IllegalStateException("Secure bank credential mount unavailable");
            }
            Set<PosixFilePermission> permissions = Files.getPosixFilePermissions(file);
            if (permissions.contains(PosixFilePermission.GROUP_READ)
                || permissions.contains(PosixFilePermission.OTHERS_READ)
                || permissions.contains(PosixFilePermission.GROUP_WRITE)
                || permissions.contains(PosixFilePermission.OTHERS_WRITE)
                || permissions.contains(PosixFilePermission.GROUP_EXECUTE)
                || permissions.contains(PosixFilePermission.OTHERS_EXECUTE)) {
                throw new IllegalStateException("Bank credentials must be owner-only");
            }
            Properties p = new Properties();
            try (var stream = Files.newInputStream(file, StandardOpenOption.READ)) {
                p.load(stream);
            }
            Map<UUID, HikariDataSource> result = new HashMap<>();
            try {
                for (String key : p.stringPropertyNames()) {
                    if (!key.startsWith("bank.") || !key.endsWith(".url")) continue;
                    UUID bank = UUID.fromString(key.substring(5, key.length() - 4));
                    if (result.containsKey(bank)) {
                        throw new IllegalStateException("Duplicate bank database binding");
                    }
                    String base = "bank." + bank;
                    String url = Objects.requireNonNull(p.getProperty(base + ".url"));
                    String user = Objects.requireNonNull(p.getProperty(base + ".user"));
                    String password = Objects.requireNonNull(p.getProperty(base + ".password"));
                    if (!url.startsWith("jdbc:postgresql://")
                        || !url.contains("sslmode=verify-full")
                        || !url.contains("sslrootcert=")
                        || user.isBlank() || password.isBlank()
                        || user.equals("postgres") || user.equals("opes_migrator")) {
                        throw new IllegalStateException("Unsafe bank PostgreSQL connection");
                    }
                    HikariConfig config = new HikariConfig();
                    config.setJdbcUrl(url);
                    config.setUsername(user);
                    config.setPassword(password);
                    config.setMaximumPoolSize(6);
                    config.setMinimumIdle(0);
                    config.setConnectionTimeout(5000);
                    config.setValidationTimeout(4000);
                    config.setPoolName("opes-bank-" + bank.toString().substring(0, 8));
                    result.put(bank, new HikariDataSource(config));
                }
                if (result.isEmpty()) {
                    throw new IllegalStateException("No configured bank PostgreSQL principals");
                }
                pools = Map.copyOf(result);
            } catch (RuntimeException e) {
                result.values().forEach(HikariDataSource::close);
                throw e;
            }
        } catch (IOException | UnsupportedOperationException e) {
            throw new IllegalStateException("Cannot securely load bank credentials", e);
        }
    }

    public Connection open(UUID bankId) throws SQLException {
        HikariDataSource ds = pools.get(bankId);
        if (ds == null) {
            // Existence of an unconfigured bank is never disclosed through HTTP.
            throw new SQLException("Bank principal unavailable", "08001");
        }
        return ds.getConnection();
    }

    @PreDestroy
    public void close() {
        pools.values().forEach(HikariDataSource::close);
    }
}
