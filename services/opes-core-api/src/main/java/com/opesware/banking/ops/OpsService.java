package com.opesware.banking.ops;

import com.opesware.banking.config.BankConnections;
import com.opesware.banking.ledger.LedgerService;
import java.sql.*;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public final class OpsService {
 private final BankConnections banks;private final OpsSigner signer;
 public OpsService(BankConnections banks,OpsSigner signer){this.banks=banks;this.signer=signer;}
 public String execute(UUID bank,String domain,UUID id,String operation,int version,String key,
           String payload,UUID evidence,String decision,String issuer,String subject){
  if(id==null||version<0||version>100000||key==null||
     !key.matches("[A-Za-z0-9._:-]{16,128}"))
    throw problem(HttpStatus.BAD_REQUEST,"INVALID_CONTROL_IDEMPOTENCY_OR_VERSION");
  OpsSigner.Proof proof=signer.sign(bank,operation,domain,id,version,key,payload,evidence,decision,issuer,subject);
  try(Connection c=banks.open(bank)){
   boolean attemptingCommit=false;
   try{
    c.setAutoCommit(false);bankScope(c,bank);timeouts(c);
    String receipt;
    try(PreparedStatement s=c.prepareStatement(
        "SELECT opes_core.ops_execute(?,?,?,?,?,?,?,?,?,?,?,?,?)::text")){
     s.setString(1,domain);s.setObject(2,id);s.setString(3,operation);s.setInt(4,version);
     s.setString(5,key);
     if(payload==null)s.setNull(6,Types.VARCHAR);else s.setString(6,payload);
     if(evidence==null)s.setNull(7,Types.OTHER);else s.setObject(7,evidence);
     if(decision==null)s.setNull(8,Types.VARCHAR);else s.setString(8,decision);
     s.setString(9,issuer);s.setString(10,subject);s.setObject(11,proof.nonce());
     s.setLong(12,proof.expiry());s.setString(13,proof.signature());
     try(ResultSet rs=s.executeQuery()){
      if(!rs.next()||rs.getString(1)==null)
       throw problem(HttpStatus.SERVICE_UNAVAILABLE,"CONTROL_RECEIPT_MISSING");
      receipt=rs.getString(1);
     }
    }
    attemptingCommit=true;c.commit();return receipt;
   }catch(SQLException e){
    rollback(c);
    if(attemptingCommit)throw problem(HttpStatus.SERVICE_UNAVAILABLE,"UNKNOWN_PENDING_RECONCILIATION");
    throw sqlProblem(e);
   }catch(RuntimeException e){rollback(c);throw e;}
  }catch(SQLException e){throw problem(HttpStatus.SERVICE_UNAVAILABLE,"BANK_DATABASE_UNAVAILABLE");}
 }
 public String read(UUID bank,String domain,UUID id,String operation,String state,
                    int limit,int offset,String issuer,String subject){
  if(limit<1||limit>100||offset<0||offset>10000||
      (state!=null&&!java.util.Set.of("DRAFT","PENDING_APPROVAL","APPROVED_RECORD",
            "REJECTED","RETIRED").contains(state)))
   throw problem(HttpStatus.BAD_REQUEST,"INVALID_CONTROL_QUERY");
  // Exact PostgreSQL jsonb_build_object()::text field order. Auth binds all filters.
  String payload="{\"limit\": "+limit+", \"offset\": "+offset+", \"state\": "+
          (state==null?"null":"\""+state+"\"")+"}";
  OpsSigner.Proof proof=signer.sign(bank,operation,domain,id,0,"",payload,null,null,issuer,subject);
  try(Connection c=banks.open(bank)){
   try{
    c.setAutoCommit(false);bankScope(c,bank);timeouts(c);
    String value;
    try(PreparedStatement s=c.prepareStatement("SELECT opes_core.ops_read(?,?,?,?,?,?,?,?,?,?,?)::text")){
     s.setString(1,domain);
     if(id==null)s.setNull(2,Types.OTHER);else s.setObject(2,id);
     s.setString(3,operation);
     if(state==null)s.setNull(4,Types.VARCHAR);else s.setString(4,state);
     s.setInt(5,limit);s.setInt(6,offset);s.setString(7,issuer);s.setString(8,subject);
     s.setObject(9,proof.nonce());s.setLong(10,proof.expiry());s.setString(11,proof.signature());
     try(ResultSet rs=s.executeQuery()){
      if(!rs.next()||rs.getString(1)==null)
       throw problem(HttpStatus.NOT_FOUND,"CONTROL_ITEM_NOT_FOUND");
      value=rs.getString(1);
     }
    }
    c.commit();return value;
   }catch(SQLException e){rollback(c);throw sqlProblem(e);}
    catch(RuntimeException e){rollback(c);throw e;}
  }catch(SQLException e){throw problem(HttpStatus.SERVICE_UNAVAILABLE,"BANK_DATABASE_UNAVAILABLE");}
 }
 private static void bankScope(Connection c,UUID bank)throws SQLException{
  try(PreparedStatement s=c.prepareStatement(
    "SELECT opes_core.current_bank_id()::text,r.rolsuper,r.rolbypassrls,r.rolcreatedb,r.rolcreaterole "
    +"FROM pg_roles r WHERE r.rolname=session_user")){
   try(ResultSet rs=s.executeQuery()){
    if(!rs.next()||!bank.toString().equals(rs.getString(1))||rs.getBoolean(2)||
       rs.getBoolean(3)||rs.getBoolean(4)||rs.getBoolean(5))
      throw problem(HttpStatus.FORBIDDEN,"BANK_PRINCIPAL_SCOPE_DENIED");
   }
  }
 }
 private static void timeouts(Connection c)throws SQLException{
  try(Statement s=c.createStatement()){s.execute("SET LOCAL statement_timeout='12s'");
   s.execute("SET LOCAL lock_timeout='8s'");}
 }
 private static void rollback(Connection c){try{c.rollback();}catch(SQLException ignored){}}
 private static LedgerService.Problem sqlProblem(SQLException e){
  String x=e.getSQLState();
  if("42501".equals(x))return problem(HttpStatus.FORBIDDEN,"OPERATOR_AUTHORIZATION_DENIED");
  if("23505".equals(x))return problem(HttpStatus.CONFLICT,"CONTROL_CONFLICT");
  if(x!=null&&(x.startsWith("22")||x.startsWith("23")))
   return problem(HttpStatus.UNPROCESSABLE_ENTITY,"CONTROL_BUSINESS_RULE_REJECTED");
  return problem(HttpStatus.SERVICE_UNAVAILABLE,"CONTROL_TRANSACTION_UNAVAILABLE");
 }
 private static LedgerService.Problem problem(HttpStatus status,String code){
  return new LedgerService.Problem(status,code);
 }
}
