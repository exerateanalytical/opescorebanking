package com.opesware.banking.ops;

import com.opesware.banking.config.BankConnections;
import com.opesware.banking.ledger.LedgerService;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.sql.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public final class EvidenceService {
 public record FileRecord(String fileName,String sha256,String status,byte[] bytes){}
 private final BankConnections bankConnections;
 private final OpsSigner signer;
 public EvidenceService(BankConnections banks,OpsSigner signer) {
  this.bankConnections=banks;this.signer=signer;
 }
 public static String sha256(byte[] bytes){
  try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));}
  catch(NoSuchAlgorithmException x){throw new IllegalStateException("SHA-256 missing",x);}
 }
 public String upload(UUID bank,String domain,UUID evidenceId,String name,
  String mime,byte[] content,String issuer,String subject){
  if(content==null||content.length<1||content.length>1048576 ||
     name==null||!name.matches("[A-Za-z0-9._-]{3,140}") ||
     (mime==null||!Set.of("application/pdf","application/json","text/plain","image/png","image/jpeg").contains(mime)))
   throw problem(HttpStatus.UNPROCESSABLE_ENTITY,"UNSAFE_EVIDENCE_FILE");
  String digest=sha256(content);
  OpsSigner.Proof proof=signer.sign(bank,"UPLOAD",domain,evidenceId,0,
    evidenceId.toString(),digest+":"+name+":"+mime,null,null,issuer,subject);
  try(Connection c=bankConnections.open(bank)){
   boolean attempted=false;
   try{
    c.setAutoCommit(false);assertScope(c,bank);timeouts(c);
    String receipt;
    try(PreparedStatement s=c.prepareStatement(
     "SELECT opes_core.ops_upload_evidence(?,?,?,?,?,?,?,?,?,?,?)::text")){
     s.setString(1,domain);s.setObject(2,evidenceId);s.setString(3,name);s.setString(4,mime);
     s.setBytes(5,content);s.setString(6,digest);s.setString(7,issuer);s.setString(8,subject);
     s.setObject(9,proof.nonce());s.setLong(10,proof.expiry());s.setString(11,proof.signature());
     try(ResultSet rs=s.executeQuery()){
      if(!rs.next()||rs.getString(1)==null)throw problem(HttpStatus.SERVICE_UNAVAILABLE,"EVIDENCE_COMMIT_FAILED");
      receipt=rs.getString(1);
     }
    }
    attempted=true;c.commit();return receipt;
   }catch(SQLException e){rollback(c);
    if(attempted)throw problem(HttpStatus.SERVICE_UNAVAILABLE,"UNKNOWN_PENDING_RECONCILIATION");
    throw dbError(e);
   }catch(RuntimeException e){rollback(c);throw e;}
  }catch(SQLException e){throw problem(HttpStatus.SERVICE_UNAVAILABLE,"BANK_DATABASE_UNAVAILABLE");}
 }
 public String review(UUID bank,String domain,UUID evidenceId,String decision,String issuer,String subject){
  if(decision==null||!Set.of("APPROVE","REJECT").contains(decision))
   throw problem(HttpStatus.BAD_REQUEST,"INVALID_EVIDENCE_DECISION");
  OpsSigner.Proof proof=signer.sign(bank,"VERIFY",domain,evidenceId,0,
   evidenceId.toString(),null,null,decision,issuer,subject);
  try(Connection c=bankConnections.open(bank)){
   boolean attempted=false;
   try{
    c.setAutoCommit(false);assertScope(c,bank);timeouts(c);
    String receipt;
    try(PreparedStatement s=c.prepareStatement(
      "SELECT opes_core.ops_verify_evidence(?,?,?,?,?,?,?,?)::text")){
     s.setString(1,domain);s.setObject(2,evidenceId);s.setString(3,decision);
     s.setString(4,issuer);s.setString(5,subject);
     s.setObject(6,proof.nonce());s.setLong(7,proof.expiry());s.setString(8,proof.signature());
     try(ResultSet rs=s.executeQuery()){
      if(!rs.next()||rs.getString(1)==null)throw problem(HttpStatus.SERVICE_UNAVAILABLE,"EVIDENCE_REVIEW_FAILED");
      receipt=rs.getString(1);
     }
    }
    attempted=true;c.commit();return receipt;
   }catch(SQLException e){rollback(c);
     if(attempted)throw problem(HttpStatus.SERVICE_UNAVAILABLE,"UNKNOWN_PENDING_RECONCILIATION");
     throw dbError(e);
   }catch(RuntimeException e){rollback(c);throw e;}
  }catch(SQLException e){throw problem(HttpStatus.SERVICE_UNAVAILABLE,"BANK_DATABASE_UNAVAILABLE");}
 }
 public FileRecord read(UUID bank,String domain,UUID evidenceId,String issuer,String subject) {
  OpsSigner.Proof proof=signer.sign(bank,"EVIDENCE_READ",domain,evidenceId,0,
   evidenceId.toString(),null,null,null,issuer,subject);
  try(Connection c=bankConnections.open(bank)){
   try{
    c.setAutoCommit(false);assertScope(c,bank);timeouts(c);
    FileRecord data;
    try(PreparedStatement s=c.prepareStatement(
      "SELECT file_name,media_type,checksum,data,status FROM opes_core.ops_get_evidence(?,?,?,?,?,?,?)")){
     s.setString(1,domain);s.setObject(2,evidenceId);s.setString(3,issuer);s.setString(4,subject);
     s.setObject(5,proof.nonce());s.setLong(6,proof.expiry());s.setString(7,proof.signature());
     try(ResultSet rs=s.executeQuery()){
      if(!rs.next())throw problem(HttpStatus.NOT_FOUND,"EVIDENCE_NOT_FOUND");
      byte[] bytes=rs.getBytes(4);
      String checksum=rs.getString(3);
      if(bytes==null || !MessageDigest.isEqual(
            sha256(bytes).getBytes(StandardCharsets.US_ASCII),
            checksum.getBytes(StandardCharsets.US_ASCII)))
       throw problem(HttpStatus.SERVICE_UNAVAILABLE,"EVIDENCE_CHECKSUM_MISMATCH");
      data=new FileRecord(rs.getString(1),checksum,rs.getString(5),bytes);
     }
    }
    c.commit();return data;
   }catch(SQLException e){rollback(c);throw dbError(e);}
    catch(RuntimeException e){rollback(c);throw e;}
  }catch(SQLException e){throw problem(HttpStatus.SERVICE_UNAVAILABLE,"BANK_DATABASE_UNAVAILABLE");}
 }
 private static void assertScope(Connection c,UUID bank)throws SQLException {
  try(PreparedStatement s=c.prepareStatement(
    "SELECT opes_core.current_bank_id()::text,r.rolsuper,r.rolbypassrls "
   +"FROM pg_roles r WHERE r.rolname=session_user")){
   try(ResultSet rs=s.executeQuery()){
    if(!rs.next()||!bank.toString().equals(rs.getString(1))||
      rs.getBoolean(2)||rs.getBoolean(3))
     throw problem(HttpStatus.FORBIDDEN,"BANK_EVIDENCE_PRINCIPAL_DENIED");
   }
  }
 }
 private static void timeouts(Connection c)throws SQLException {
  try(Statement s=c.createStatement()){
   s.execute("SET LOCAL statement_timeout='12s'");
   s.execute("SET LOCAL lock_timeout='8s'");
  }
 }
 private static void rollback(Connection c){try{c.rollback();}catch(SQLException ignored){}}
 private static LedgerService.Problem dbError(SQLException e){
  String sql=e.getSQLState();
  if("42501".equals(sql))return problem(HttpStatus.FORBIDDEN,"EVIDENCE_AUTHORIZATION_DENIED");
  if("23505".equals(sql))return problem(HttpStatus.CONFLICT,"EVIDENCE_ALREADY_FINAL_OR_DUPLICATE");
  if(sql!=null&&(sql.startsWith("22")||sql.startsWith("23")))
   return problem(HttpStatus.UNPROCESSABLE_ENTITY,"EVIDENCE_INTEGRITY_REJECTED");
  return problem(HttpStatus.SERVICE_UNAVAILABLE,"EVIDENCE_DATABASE_UNAVAILABLE");
 }
 private static LedgerService.Problem problem(HttpStatus status,String code){
  return new LedgerService.Problem(status,code);
 }
}
