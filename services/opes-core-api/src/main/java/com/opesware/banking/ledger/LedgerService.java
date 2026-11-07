package com.opesware.banking.ledger;

import com.opesware.banking.config.BankConnections;
import java.sql.*;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public final class LedgerService {
    private final BankConnections banks;
    public LedgerService(BankConnections banks) { this.banks = banks; }

    public String post(UUID bank, String issuer, String subject, LedgerRequest request) {
        requireIdentity(bank, issuer, subject);
        FinancialDigest.requireBalanced(request);
        String digest = FinancialDigest.sha256(bank, request);
        String entries = jsonLines(request);
        try (Connection c = banks.open(bank)) {
            boolean commitAttempted = false;
            try {
                c.setAutoCommit(false);
                c.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
                assertBoundBank(c, bank);
                try (Statement timeout = c.createStatement()) {
                    timeout.execute("SET LOCAL statement_timeout = '12s'");
                    timeout.execute("SET LOCAL lock_timeout = '8s'");
                }
                String receipt;
                try (PreparedStatement stmt = c.prepareStatement(
                    "SELECT opes_core.post_journal(?, ?, ?, ?, ?, ?::jsonb, ?, ?)::text")) {
                    stmt.setObject(1, request.commandId());
                    stmt.setObject(2, request.authorizationId());
                    stmt.setString(3, request.sourceReference());
                    stmt.setObject(4, request.accountingPeriodId());
                    stmt.setString(5, digest);
                    stmt.setString(6, entries);
                    stmt.setString(7, issuer);
                    stmt.setString(8, subject);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (!rs.next() || rs.getString(1) == null) {
                            throw new Problem(HttpStatus.SERVICE_UNAVAILABLE, "INVALID_POSTING_RESULT");
                        }
                        receipt = rs.getString(1);
                    }
                }
                commitAttempted = true;
                c.commit(); // No success/receipt is sent until COMMIT returns.
                return receipt;
            } catch (SQLException e) {
                safelyRollback(c);
                if (commitAttempted) {
                    throw new Problem(HttpStatus.SERVICE_UNAVAILABLE,
                        "UNKNOWN_PENDING_RECONCILIATION");
                }
                throw databaseError(e);
            } catch (RuntimeException e) {
                safelyRollback(c);
                throw e;
            }
        } catch (SQLException e) {
            throw new Problem(HttpStatus.SERVICE_UNAVAILABLE, "BANK_DATABASE_UNAVAILABLE");
        }
    }

    public String resolve(UUID bank, String issuer, String subject, UUID commandId) {
        requireIdentity(bank, issuer, subject);
        try (Connection c = banks.open(bank)) {
            c.setAutoCommit(false);
            c.setReadOnly(true);
            try {
                assertBoundBank(c, bank);
                try (PreparedStatement stmt = c.prepareStatement(
                    "SELECT opes_core.resolve_command(?, ?, ?)::text")) {
                    stmt.setObject(1, commandId);
                    stmt.setString(2, issuer);
                    stmt.setString(3, subject);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (!rs.next() || rs.getString(1) == null) {
                            throw new Problem(HttpStatus.NOT_FOUND, "COMMAND_NOT_FOUND");
                        }
                        return rs.getString(1);
                    }
                }
            } catch (SQLException e) {
                throw databaseError(e);
            } finally {
                safelyRollback(c);
            }
        } catch (SQLException e) {
            throw new Problem(HttpStatus.SERVICE_UNAVAILABLE, "BANK_DATABASE_UNAVAILABLE");
        }
    }

    private static void requireIdentity(UUID bank, String issuer, String subject) {
        if (bank == null || issuer == null || !issuer.startsWith("https://")
            || subject == null || subject.isBlank()) {
            throw new Problem(HttpStatus.FORBIDDEN, "VERIFIED_BANK_IDENTITY_REQUIRED");
        }
    }

    private static void assertBoundBank(Connection c, UUID expected) throws SQLException {
        try (PreparedStatement stmt = c.prepareStatement(
            "SELECT opes_core.current_bank_id()::text, "
          + "r.rolsuper, r.rolbypassrls, r.rolcreatedb, r.rolcreaterole "
          + "FROM pg_roles r WHERE r.rolname=session_user")) {
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()
                    || !expected.toString().equals(rs.getString(1))
                    || rs.getBoolean(2) || rs.getBoolean(3)
                    || rs.getBoolean(4) || rs.getBoolean(5)) {
                    throw new Problem(HttpStatus.FORBIDDEN, "BANK_PRINCIPAL_SCOPE_DENIED");
                }
            }
        }
    }

    private static String jsonLines(LedgerRequest r) {
        StringBuilder s = new StringBuilder("[");
        int i = 0;
        for (LedgerRequest.Entry l : r.lines()) {
            if (i++ > 0) s.append(',');
            s.append("{\"accountId\":\"").append(l.accountId())
             .append("\",\"side\":\"").append(l.side())
             .append("\",\"amountMinor\":").append(l.amountMinor())
             .append(",\"currency\":\"").append(l.currency())
             .append("\"}");
        }
        return s.append(']').toString();
    }

    private static Problem databaseError(SQLException e) {
        String state = e.getSQLState();
        if ("42501".equals(state)) {
            return new Problem(HttpStatus.FORBIDDEN, "BANK_AUTHORIZATION_DENIED");
        }
        if ("23505".equals(state)) {
            return new Problem(HttpStatus.CONFLICT, "IDEMPOTENCY_OR_VERSION_CONFLICT");
        }
        if ("23514".equals(state) || "22023".equals(state) || "22003".equals(state)) {
            return new Problem(HttpStatus.UNPROCESSABLE_ENTITY, "FINANCIAL_RULE_VIOLATION");
        }
        return new Problem(HttpStatus.SERVICE_UNAVAILABLE, "BANK_TRANSACTION_UNAVAILABLE");
    }

    private static void safelyRollback(Connection c) {
        try { c.rollback(); } catch (SQLException ignored) {
            // Caller must query authoritative command status; never assume rollback.
        }
    }

    public static class Problem extends RuntimeException {
        private final HttpStatus status;
        private final String code;
        public Problem(HttpStatus status, String code) {
            super(code);
            this.status = status;
            this.code = code;
        }
        public HttpStatus status() { return status; }
        public String code() { return code; }
    }
}
