package com.opesware.banking.ops;

import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

class OpsCatalogTest {
 private final JsonMapper mapper=JsonMapper.builder().build();
 private final OpsCatalog catalog=new OpsCatalog(mapper);
 private ObjectNode build(String domain){
  ObjectNode row=mapper.createObjectNode();
  for(OpsCatalog.Field f:catalog.require(domain).fields()){
   String n=f.name();
   if(f.type().equals("integer"))row.put(n,1);
   else if(f.type().equals("uuid"))row.put(n,"11111111-1111-4111-8111-111111111111");
   else if(f.type().equals("date"))row.put(n,"2026-11-07");
   else if(f.type().equals("timestamptz"))row.put(n,"2026-11-07T00:00:00Z");
   else if(n.endsWith("Sha")||n.equals("buildSha")||
       n.equals("artifactSha")||n.equals("specificationSha")||n.equals("restoreSha"))
    row.put(n,"a".repeat(64));
   else if(n.equals("category"))row.put(n,"OPERATIONS");
   else if(n.equals("compatibility"))row.put(n,"BACKWARD");
   else if(n.equals("environment")||n.equals("targetEnvironment"))row.put(n,"STAGING");
   else if(n.equals("observedStatus"))row.put(n,"HEALTHY");
   else if(n.equals("incidentRef"))row.put(n,"NONE");
   else if(n.equals("semanticVersion")||n.equals("releaseVersion"))row.put(n,"1.0.0");
   else row.put(n,"OPES-CONTRACT-V1");
  }
  if(domain.equals("TST"))row.put("passedCount",1);
  return row;
 }
 @Test void validSixModulesAndRejectExtraFields(){
  assertEquals(6,catalog.all().size());
  for(var module:catalog.all()){
   ObjectNode row=build(module.id());
   assertFalse(catalog.validate(module.id(),row).isBlank());
   row.put("extraPermission","yes");
   assertThrows(RuntimeException.class,()->catalog.validate(module.id(),row));
  }
 }
 @Test void governanceReviewMustFollowEffectiveDate(){
  var row=build("GOV");row.put("effectiveDate","2027-01-01");
  assertThrows(RuntimeException.class,()->catalog.validate("GOV",row));
 }
 @Test void testEvidenceCannotBeZero(){
  var row=build("TST");row.put("passedCount",0);row.put("failedCount",0);
  assertThrows(RuntimeException.class,()->catalog.validate("TST",row));
 }
 @Test void cannotRecordDownInfrastructureWithoutIncident(){
  var row=build("INF");row.put("observedStatus","DOWN");
  assertThrows(RuntimeException.class,()->catalog.validate("INF",row));
 }
}
