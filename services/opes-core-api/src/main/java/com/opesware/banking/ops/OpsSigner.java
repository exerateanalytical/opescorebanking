package com.opesware.banking.ops;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermission;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public final class OpsSigner {
 public record Proof(UUID nonce,long expiry,String signature){}
 private final Map<UUID,byte[]> keys;
 public OpsSigner(@Value("${OPES_OPS_HMAC_KEYS_FILE}") String name) {
  try{
   Path file=Path.of(name).toAbsolutePath().normalize();
   if(!Files.isRegularFile(file,LinkOption.NOFOLLOW_LINKS))
    throw new IllegalStateException("Missing independently provisioned bank HMAC file");
   for(PosixFilePermission p:Files.getPosixFilePermissions(file))
    if(p!=PosixFilePermission.OWNER_READ&&p!=PosixFilePermission.OWNER_WRITE)
     throw new IllegalStateException("Bank signing secrets must be POSIX owner-only");
   Properties values=new Properties();
   try(var in=Files.newInputStream(file)){values.load(in);}
   Map<UUID,byte[]> map=new HashMap<>();
   for(String raw:values.stringPropertyNames()){
    String hex=values.getProperty(raw);
    if(!hex.matches("[0-9a-f]{64,128}")||hex.length()%2!=0)
     throw new IllegalStateException("Invalid bank secret");
    map.put(UUID.fromString(raw),HexFormat.of().parseHex(hex));
   }
   if(map.isEmpty())throw new IllegalStateException("No operator signing keys configured");
   keys=Map.copyOf(map);
  }catch(IOException|UnsupportedOperationException ex){throw new IllegalStateException("Cannot read operator keys",ex);}
 }
 public Proof sign(UUID bank,String op,String domain,UUID id,int version,String idem,String payload,
                   UUID evidence,String decision,String issuer,String subject){
  byte[] key=keys.get(bank);
  if(key==null)throw new IllegalStateException("No signing key for requested institution");
  UUID nonce=UUID.randomUUID();
  long expiry=Instant.now().getEpochSecond()+30;
  return new Proof(nonce,expiry,hmac(key,message(bank,op,domain,id,version,idem,payload,evidence,
                                               decision,issuer,subject,nonce,expiry)));
 }
 public static String message(UUID bank,String op,String domain,UUID id,int version,String idem,
    String payload,UUID evidence,String decision,String issuer,String subject,UUID nonce,long expiry){
  StringBuilder s=new StringBuilder("OPES-OPS-v1\n");
  String[] parts={bank.toString(),op,domain,id==null?"":id.toString(),Integer.toString(version),
     idem==null?"":idem,payload==null?"":payload,evidence==null?"":evidence.toString(),
     decision==null?"":decision,issuer,subject,nonce.toString(),Long.toString(expiry)};
  for(String v:parts)s.append(v.getBytes(StandardCharsets.UTF_8).length).append(':').append(v).append('\n');
  return s.toString();
 }
 public static String hmac(byte[] secret,String message){
  try{Mac mac=Mac.getInstance("HmacSHA256");mac.init(new SecretKeySpec(secret,"HmacSHA256"));
   return HexFormat.of().formatHex(mac.doFinal(message.getBytes(StandardCharsets.UTF_8)));
  }catch(GeneralSecurityException e){throw new IllegalStateException("HMAC unavailable",e);}
 }
}
