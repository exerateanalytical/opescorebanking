package com.opesware.banking.ops;

import java.io.*;
import java.time.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import com.opesware.banking.ledger.LedgerService;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@Component
public final class OpsCatalog {
 public record Field(String name,String type){}
 public record Definition(String id,String label,String businessReferenceField,String revisionField,List<Field> fields){}
 private final Map<String,Definition> definitions;
 private static final Map<String,Set<String>> CHOICES=Map.of(
  "category",Set.of("OPERATIONS","RISK","COMPLIANCE","SECURITY","FINANCE"),
  "compatibility",Set.of("BACKWARD","FULL","NONE"),
  "environment",Set.of("STAGING","PREPROD","PRODUCTION"),
  "targetEnvironment",Set.of("STAGING","PREPROD","PRODUCTION"),
  "observedStatus",Set.of("HEALTHY","DEGRADED","DOWN"));
 public OpsCatalog(JsonMapper mapper) {
  try(InputStream in=Objects.requireNonNull(
     OpsCatalog.class.getResourceAsStream("/contracts/ops-modules-v1.json"))){
   JsonNode source=mapper.readTree(in);
   Map<String,Definition> out=new LinkedHashMap<>();
   for(JsonNode d:source.path("modules")){
    List<Field> fields=new ArrayList<>();
    for(JsonNode f:d.path("fields"))fields.add(new Field(f.path("name").asText(),f.path("type").asText()));
    Definition def=new Definition(d.path("id").asText(),d.path("label").asText(),
      d.path("businessReferenceField").asText(),d.path("revisionField").asText(),List.copyOf(fields));
    if(out.put(def.id(),def)!=null)throw new IllegalStateException("Duplicate control module");
   }
   if(!out.keySet().equals(Set.of("GOV","ARC","TST","INF","DR","REL"))||
     source.path("realDeployment").asBoolean(true))
    throw new IllegalStateException("Unreviewed control module registry");
   definitions=Map.copyOf(out);
  }catch(IOException e){throw new IllegalStateException("Cannot read control-module catalog",e);}
 }
 public Collection<Definition> all(){return definitions.values();}
 public Definition require(String domain){
  Definition d=definitions.get(domain);
  if(d==null)fail("UNKNOWN_OPERATIONS_MODULE");
  return d;
 }
 public String validate(String domain,JsonNode body){
  Definition d=require(domain);
  if(body==null||!body.isObject()||body.size()!=d.fields().size())
   fail("CONTROL_FIELDS_MISSING_OR_EXTRA");
  Set<String> names=new HashSet<>();
  for(Field f:d.fields())names.add(f.name());
  for(String key:body.propertyNames())if(!names.contains(key))fail("UNKNOWN_CONTROL_FIELD");
  for(Field f:d.fields()){
   JsonNode v=body.path(f.name());
   if(v.isMissingNode()||v.isNull())fail("MISSING_CONTROL_FIELD");
   switch(f.type()){
    case "uuid" -> {
     if(!v.isTextual())fail("INVALID_UUID");
     try{UUID u=UUID.fromString(v.asText());if(!u.toString().equals(v.asText()))fail("NON_CANONICAL_UUID");}
     catch(IllegalArgumentException x){fail("INVALID_UUID");}
    }
    case "integer" -> {if(!v.isIntegralNumber()||v.longValue()<0||v.longValue()>10000000)
      fail("INVALID_INTEGER");}
    case "text" -> {if(!v.isTextual()||v.asText().length()<3||v.asText().length()>4000||
      v.asText().chars().anyMatch(Character::isISOControl))fail("INVALID_TEXT");}
    case "date" -> {try{if(!v.isTextual())fail("INVALID_DATE");LocalDate.parse(v.asText());}
     catch(RuntimeException x){fail("INVALID_DATE");}}
    case "timestamptz" -> {try{if(!v.isTextual())fail("INVALID_TIMESTAMP");OffsetDateTime.parse(v.asText());}
     catch(RuntimeException x){fail("INVALID_TIMESTAMP");}}
    default -> fail("UNKNOWN_CONTROL_FIELD_TYPE");
   }
   String k=f.name();
   if(k.endsWith("Sha")||k.equals("buildSha")||k.equals("specificationSha")||
      k.equals("artifactSha")||k.equals("restoreSha"))
    if(!v.isTextual()||!v.asText().matches("[0-9a-f]{64}"))fail("INVALID_SHA256");
   Set<String> choice=CHOICES.get(k);
   if(choice!=null&&(!v.isTextual()||!choice.contains(v.asText())))fail("INVALID_CONTROL_CLASSIFICATION");
  }
  if(domain.equals("GOV")&&LocalDate.parse(body.path("reviewDate").asText())
     .isBefore(LocalDate.parse(body.path("effectiveDate").asText())))fail("POLICY_REVIEW_BEFORE_EFFECTIVE");
  if(domain.equals("TST")&&body.path("passedCount").asInt()+body.path("failedCount").asInt()==0)
    fail("EMPTY_TEST_RUN");
  if(domain.equals("INF")&&body.path("observedStatus").asText().equals("DOWN")&&
      body.path("incidentRef").asText().equals("NONE"))fail("INCIDENT_REFERENCE_REQUIRED");
  if(domain.equals("ARC")||domain.equals("REL")){
   String key=domain.equals("ARC")?"semanticVersion":"releaseVersion";
   if(!body.path(key).asText().matches("[0-9]{1,5}\\.[0-9]{1,5}\\.[0-9]{1,5}"))
    fail("SEMVER_REQUIRED");
  }
  String reference=body.path(d.businessReferenceField()).asText();
  int revision=body.path(d.revisionField()).asInt();
  if(reference.length()<3||reference.length()>120||revision<1||revision>100000)
   fail("INVALID_BUSINESS_REVISION");
  return body.toString();
 }
 private static void fail(String code){throw new LedgerService.Problem(HttpStatus.UNPROCESSABLE_ENTITY,code);}
}
