package com.opesware.banking.ops;

import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class OpsSignerTest {
 @Test void signatureBindsOperatorBankIdempotencyAndPayload(){
  UUID bank=UUID.fromString("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
  UUID item=UUID.fromString("11111111-1111-4111-8111-111111111111");
  UUID nonce=UUID.fromString("33333333-3333-4333-8333-333333333333");
  byte[] secret=new byte[32];Arrays.fill(secret,(byte)0xAB);
  String request=OpsSigner.message(bank,"CREATE","GOV",item,0,
    "OPERATIONS-IDEMPOTENCY-001","{\"title\":\"OPES\"}",null,null,
    "https://issuer.example.org","maker-001",nonce,1783470000L);
  String sig=OpsSigner.hmac(secret,request);
  assertEquals(64,sig.length());
  assertEquals(sig,OpsSigner.hmac(secret,request));
  assertNotEquals(sig,OpsSigner.hmac(secret,request.replace("maker-001","checker-002")));
  assertNotEquals(sig,OpsSigner.hmac(secret,request.replace("OPES-OPS-v1","OPES-OPS-v2")));
 }
}
