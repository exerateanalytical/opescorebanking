package com.opesware.banking.domain;

import com.opesware.banking.config.BankConnections;
import com.opesware.banking.ledger.LedgerService;
import java.sql.*;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/** Real PostgreSQL-backed review command service; NEVER executes banking effects. */
@Service
public final class DomainService {
    private final BankConnections connections;
    public DomainService(BankConnections connections) { this.connections=connections; }

    public String apply(UUID bank, String issuer, String subject, UUID correlation,
                        String key, DomainCatalog.Command cmd) {
        principal(issuer, subject);
        if (key == null || !key.matches("[A-Za-z0-9._:-]{16,128}")) {
            throw new LedgerService.Problem(HttpStatus.BAD_REQUEST, "INVALID_IDEMPOTENCY_KEY");
        }
        try (Connection c=connections.open(bank)) {
            boolean commitAttempted=false;
            try {
                c.setAutoCommit(false);
                requireBoundBank(c,bank);
                try (Statement s=c.createStatement()) {
                    s.execute("SET LOCAL statement_timeout='12s'");
                    s.execute("SET LOCAL lock_timeout='8s'");
                }
                String result;
                try (PreparedStatement s=c.prepareStatement(
                    "SELECT opes_core.apply_review(?,?,?,?,?,?::jsonb,?,?,?,?,?)::text")) {
                    s.setString(1,cmd.domain());s.setInt(2,cmd.stage());
                    s.setObject(3,cmd.aggregate());s.setLong(4,cmd.expectedVersion());
                    s.setString(5,key);
                    if (cmd.fieldsJson()==null) s.setNull(6,Types.VARCHAR);
                    else s.setString(6,cmd.fieldsJson());
                    if (cmd.evidence()==null) s.setNull(7,Types.OTHER);
                    else s.setObject(7,cmd.evidence());
                    if (cmd.decision()==null) s.setNull(8,Types.VARCHAR);
                    else s.setString(8,cmd.decision());
                    s.setString(9,issuer);s.setString(10,subject);s.setObject(11,correlation);
                    try (ResultSet rs=s.executeQuery()) {
                        if (!rs.next() || rs.getString(1)==null)
                            throw problem(HttpStatus.SERVICE_UNAVAILABLE,"INVALID_REVIEW_COMMIT");
                        result=rs.getString(1);
                    }
                }
                commitAttempted=true;
                c.commit();
                return result;
            } catch (SQLException e) {
                rollback(c);
                if(commitAttempted) throw problem(HttpStatus.SERVICE_UNAVAILABLE,
                    "UNKNOWN_PENDING_RECONCILIATION");
                throw databaseError(e);
            } catch (RuntimeException e) { rollback(c);throw e; }
        } catch (SQLException e) { throw problem(HttpStatus.SERVICE_UNAVAILABLE,"BANK_DATABASE_UNAVAILABLE"); }
    }

    public String read(UUID bank,String issuer,String subject,UUID correlation,
                       String domain,UUID aggregate) {
        principal(issuer,subject);
        try (Connection c=connections.open(bank)) {
            c.setAutoCommit(false);
            c.setReadOnly(true);
            try {
                requireBoundBank(c,bank);
                try (PreparedStatement s=c.prepareStatement(
                    "SELECT opes_core.read_review(?,?,?,?,?)::text")) {
                    s.setString(1,domain);s.setObject(2,aggregate);
                    s.setString(3,issuer);s.setString(4,subject);s.setObject(5,correlation);
                    try(ResultSet rs=s.executeQuery()) {
                        if (!rs.next() || rs.getString(1)==null)
                            throw problem(HttpStatus.NOT_FOUND,"BANK_CASE_NOT_FOUND");
                        return rs.getString(1);
                    }
                }
            } catch(SQLException e) { throw databaseError(e); }
            finally {rollback(c);}
        }catch(SQLException e){throw problem(HttpStatus.SERVICE_UNAVAILABLE,"BANK_DATABASE_UNAVAILABLE");}
    }

    private static void principal(String issuer,String subject) {
        if(issuer==null || !issuer.startsWith("https://") ||
           subject==null || subject.isBlank())
            throw problem(HttpStatus.FORBIDDEN,"AUTHENTICATED_BANK_ACTOR_REQUIRED");
    }

    private static void requireBoundBank(Connection c,UUID bank) throws SQLException {
        if(bank==null)throw problem(HttpStatus.FORBIDDEN,"BANK_CONTEXT_REQUIRED");
        try(PreparedStatement s=c.prepareStatement(
            "SELECT opes_core.current_bank_id()::text,r.rolsuper,r.rolbypassrls,"
           +"r.rolcreatedb,r.rolcreaterole FROM pg_roles r WHERE r.rolname=session_user")) {
            try(ResultSet rs=s.executeQuery()) {
                if(!rs.next() || !bank.toString().equals(rs.getString(1)) ||
                    rs.getBoolean(2) || rs.getBoolean(3) || rs.getBoolean(4) || rs.getBoolean(5))
                    throw problem(HttpStatus.FORBIDDEN,"DATABASE_BANK_SCOPE_DENIED");
            }
        }
    }

    private static void rollback(Connection c) {
        try {c.rollback();}catch(SQLException ignored) { /* resolve by authoritative GET */ }
    }
    private static LedgerService.Problem databaseError(SQLException e) {
        String s=e.getSQLState();
        if("42501".equals(s))return problem(HttpStatus.FORBIDDEN,"BANK_REVIEW_PERMISSION_DENIED");
        if("23505".equals(s))return problem(HttpStatus.CONFLICT,"VERSION_OR_IDEMPOTENCY_CONFLICT");
        if(s!=null && (s.startsWith("22") || s.equals("23514") ||
            s.equals("23502") || s.equals("23503")))
            return problem(HttpStatus.UNPROCESSABLE_ENTITY,"BANK_REVIEW_RULE_VIOLATION");
        return problem(HttpStatus.SERVICE_UNAVAILABLE,"BANK_REVIEW_TRANSACTION_UNAVAILABLE");
    }
    private static LedgerService.Problem problem(HttpStatus status,String code) {
        return new LedgerService.Problem(status,code);
    }
}
