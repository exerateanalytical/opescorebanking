package com.opesware.banking.ops;

import com.opesware.banking.ledger.LedgerService;
import java.util.*;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/banks/{bankId}/operations/{module}/evidence")
public class EvidenceController {
 private final OpsCatalog catalog;
 private final EvidenceService evidence;
 public EvidenceController(OpsCatalog catalog,EvidenceService evidence){
  this.catalog=catalog;this.evidence=evidence;
 }
 private String domain(String slug){
  String d=slug.toUpperCase(Locale.ROOT);
  if(!slug.equals(d.toLowerCase(Locale.ROOT)))
   throw new LedgerService.Problem(HttpStatus.NOT_FOUND,"UNKNOWN_OPERATIONS_MODULE");
  catalog.require(d);return d;
 }
 @PostMapping(consumes=MediaType.MULTIPART_FORM_DATA_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
 public ResponseEntity<String> upload(@PathVariable UUID bankId,@PathVariable String module,
  @RequestHeader("Evidence-ID") UUID evidenceId,@RequestPart("file") MultipartFile file,
  @AuthenticationPrincipal Jwt actor) throws java.io.IOException{
  if(file.getSize()<1 || file.getSize()>1048576)
   throw new LedgerService.Problem(HttpStatus.PAYLOAD_TOO_LARGE,"INVALID_EVIDENCE_SIZE");
  String result=evidence.upload(bankId,domain(module),evidenceId,file.getOriginalFilename(),
    file.getContentType(),file.getBytes(),actor.getIssuer().toString(),actor.getSubject());
  return ResponseEntity.status(HttpStatus.CREATED).contentType(MediaType.APPLICATION_JSON).body(result);
 }
 public record ReviewEvidence(String decision){}
 @PostMapping(path="/{evidenceId}/review",consumes=MediaType.APPLICATION_JSON_VALUE,
              produces=MediaType.APPLICATION_JSON_VALUE)
 public ResponseEntity<String> review(@PathVariable UUID bankId,@PathVariable String module,
  @PathVariable UUID evidenceId,@RequestBody ReviewEvidence request,
  @AuthenticationPrincipal Jwt actor){
  if(request==null||request.decision()==null||!Set.of("APPROVE","REJECT").contains(request.decision()))
   throw new LedgerService.Problem(HttpStatus.BAD_REQUEST,"INVALID_EVIDENCE_REVIEW");
  return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
    .body(evidence.review(bankId,domain(module),evidenceId,request.decision(),
             actor.getIssuer().toString(),actor.getSubject()));
 }
 @GetMapping(path="/{evidenceId}",produces=MediaType.APPLICATION_JSON_VALUE)
 public Map<String,Object> metadata(@PathVariable UUID bankId,@PathVariable String module,
  @PathVariable UUID evidenceId,@AuthenticationPrincipal Jwt actor){
  EvidenceService.FileRecord record=evidence.read(bankId,domain(module),evidenceId,
    actor.getIssuer().toString(),actor.getSubject());
  return Map.of("evidenceId",evidenceId.toString(),"fileName",record.fileName(),
    "sha256",record.sha256(),"status",record.status(),"bytes",record.bytes().length);
 }
 @GetMapping(path="/{evidenceId}/download",produces=MediaType.APPLICATION_OCTET_STREAM_VALUE)
 public ResponseEntity<byte[]> download(@PathVariable UUID bankId,@PathVariable String module,
  @PathVariable UUID evidenceId,@AuthenticationPrincipal Jwt actor) {
  EvidenceService.FileRecord data=evidence.read(bankId,domain(module),evidenceId,
    actor.getIssuer().toString(),actor.getSubject());
  return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM)
   .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\""+data.fileName()+"\"")
   .header(HttpHeaders.CACHE_CONTROL,"no-store, private")
   .header("X-Content-Type-Options","nosniff")
   .header("X-OPES-SHA256",data.sha256())
   .body(data.bytes());
 }
}
