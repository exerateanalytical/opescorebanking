package com.opesware.banking.ops;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class EvidenceChecksumTest {
 @Test void sha256MatchesReferenceAndDetectsTampering() throws Exception {
  byte[] artifact="OPES BANK CONTROL EVIDENCE".getBytes(StandardCharsets.UTF_8);
  String calculated=EvidenceService.sha256(artifact);
  String manual=HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(artifact));
  assertEquals(manual,calculated);
  artifact[0]^=1;
  assertNotEquals(manual,EvidenceService.sha256(artifact));
 }
}
