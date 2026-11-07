package com.opesware.banking.ops;

import com.opesware.banking.ledger.LedgerService;
import java.util.*;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

@RestController
@RequestMapping("/v1/banks/{bankId}/operations/{module}")
public final class OpsController {
 private final OpsCatalog catalog;private final OpsService service;
 public OpsController(OpsCatalog catalog,OpsService service){this.catalog=catalog;this.service=service;}
 private String domain(String slug){
  String code=slug.toUpperCase(Locale.ROOT);
  if(!slug.equals(code.toLowerCase(Locale.ROOT)))
   throw new LedgerService.Problem(HttpStatus.NOT_FOUND,"UNKNOWN_CONTROL_MODULE");
  catalog.require(code);return code;
 }
 @PostMapping(path="/items",consumes=MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
 public ResponseEntity<String> create(@PathVariable UUID bankId,@PathVariable String module,
  @RequestHeader("Idempotency-Key") String key,@AuthenticationPrincipal Jwt jwt,
  @RequestBody JsonNode input){
  if(input==null||!input.isObject()||input.size()!=2||
    !input.path("itemId").isTextual()||!input.path("fields").isObject())
   throw new LedgerService.Problem(HttpStatus.BAD_REQUEST,"INVALID_CONTROL_ENVELOPE");
  UUID id;try{id=UUID.fromString(input.path("itemId").asText());}
  catch(IllegalArgumentException e){throw new LedgerService.Problem(HttpStatus.BAD_REQUEST,"INVALID_CONTROL_ID");}
  String d=domain(module),fields=catalog.validate(d,input.path("fields"));
  return ResponseEntity.status(HttpStatus.CREATED).contentType(MediaType.APPLICATION_JSON)
   .body(service.execute(bankId,d,id,"CREATE",0,key,fields,null,null,
      jwt.getIssuer().toString(),jwt.getSubject()));
 }
 public record Transition(int expectedVersion,UUID evidenceId,String decision){}
 @PostMapping(path="/items/{itemId}/{transition}",
      consumes=MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
 public ResponseEntity<String> transition(@PathVariable UUID bankId,@PathVariable String module,
   @PathVariable UUID itemId,@PathVariable String transition,
   @RequestHeader("Idempotency-Key") String key,@AuthenticationPrincipal Jwt jwt,
   @RequestBody Transition request){
  String op=switch(transition){
   case "submit" -> "SUBMIT";case "decision" -> "DECIDE";case "retire" -> "RETIRE";
   default -> throw new LedgerService.Problem(HttpStatus.NOT_FOUND,"UNKNOWN_CONTROL_ACTION");
  };
  if(request==null||request.evidenceId()==null ||
    (op.equals("DECIDE")&&!Set.of("APPROVE","REJECT").contains(request.decision())) ||
    (!op.equals("DECIDE")&&request.decision()!=null))
   throw new LedgerService.Problem(HttpStatus.BAD_REQUEST,"INVALID_CONTROL_DECISION");
  return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
   .body(service.execute(bankId,domain(module),itemId,op,request.expectedVersion(),
     key,null,request.evidenceId(),request.decision(),
     jwt.getIssuer().toString(),jwt.getSubject()));
 }
 @GetMapping(path="/items",produces=MediaType.APPLICATION_JSON_VALUE)
 public ResponseEntity<String> list(@PathVariable UUID bankId,@PathVariable String module,
   @RequestParam(required=false) String state,
   @RequestParam(defaultValue="50") int limit,@RequestParam(defaultValue="0") int offset,
   @AuthenticationPrincipal Jwt jwt){
  return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
   .body(service.read(bankId,domain(module),null,"LIST",state,limit,offset,
       jwt.getIssuer().toString(),jwt.getSubject()));
 }
 @GetMapping(path="/items/{itemId}",produces=MediaType.APPLICATION_JSON_VALUE)
 public ResponseEntity<String> get(@PathVariable UUID bankId,@PathVariable String module,
   @PathVariable UUID itemId,@AuthenticationPrincipal Jwt jwt){
  return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
   .body(service.read(bankId,domain(module),itemId,"READ",null,50,0,
       jwt.getIssuer().toString(),jwt.getSubject()));
 }
 @GetMapping(path="/items/{itemId}/history",produces=MediaType.APPLICATION_JSON_VALUE)
 public ResponseEntity<String> history(@PathVariable UUID bankId,@PathVariable String module,
    @PathVariable UUID itemId,@RequestParam(defaultValue="50") int limit,
    @RequestParam(defaultValue="0") int offset,@AuthenticationPrincipal Jwt jwt){
  return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
   .body(service.read(bankId,domain(module),itemId,"HISTORY",null,limit,offset,
       jwt.getIssuer().toString(),jwt.getSubject()));
 }
}
