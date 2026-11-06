package com.opesware.banking.domain;

import com.opesware.banking.ledger.LedgerService;
import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.JsonNodeFactory;
import tools.jackson.databind.node.ObjectNode;

class DomainCatalogTest {
    private final DomainCatalog catalog=new DomainCatalog(JsonMapper.builder().build());
    private static final String ID="11111111-1111-4111-8111-111111111111";
    @Test void all25RequireExactProductionContractsAndStageActions() {
        assertEquals(25,catalog.domains().size());
        for(DomainCatalog.Domain domain:catalog.domains().values()) {
            assertEquals(3,domain.actions().size(),domain.id());
            ObjectNode body=JsonNodeFactory.instance.objectNode();
            body.put("aggregateId",ID);body.put("expectedVersion",0);
            for(DomainCatalog.Field field:domain.fields()) sample(body,field);
            DomainCatalog.Command result=catalog.validate(domain.id(),domain.actions().get(0),body);
            assertEquals(0,result.stage(),domain.id());
            assertEquals(domain.id(),result.domain());
            assertTrue(result.fieldsJson().contains(domain.fields().get(0).name()));
            body.put("unexpectedPermission","true");
            assertThrows(LedgerService.Problem.class,
               ()->catalog.validate(domain.id(),domain.actions().get(0),body));
            ObjectNode submit=JsonNodeFactory.instance.objectNode();
            submit.put("aggregateId",ID);submit.put("expectedVersion",1);
            submit.put(domain.submitEvidence(),ID);
            assertEquals(1,catalog.validate(domain.id(),domain.actions().get(1),submit).stage());
            ObjectNode review=JsonNodeFactory.instance.objectNode();
            review.put("aggregateId",ID);review.put("expectedVersion",2);
            review.put(domain.reviewEvidence(),ID);review.put("decision","ACCEPT");
            assertEquals(2,catalog.validate(domain.id(),domain.actions().get(2),review).stage());
        }
    }
    @Test void amountCannotUseFloatOrUnsafeInteger() {
        var d=catalog.require("CRD");
        ObjectNode body=JsonNodeFactory.instance.objectNode();
        body.put("aggregateId",ID);body.put("expectedVersion",0);
        for(var f:d.fields()) sample(body,f);
        body.put("principalMinor",1.5);
        assertThrows(LedgerService.Problem.class,()->catalog.validate("CRD",d.actions().get(0),body));
        body.put("principalMinor","9000000000000001");
        assertThrows(LedgerService.Problem.class,()->catalog.validate("CRD",d.actions().get(0),body));
    }
    @Test void unbalancedJournalDraftIsRejectedBeforeDatabaseWrite() {
        var d=catalog.require("LED");
        ObjectNode body=JsonNodeFactory.instance.objectNode();
        body.put("aggregateId",ID);body.put("expectedVersion",0);
        for(var f:d.fields()) sample(body,f);
        var list=(tools.jackson.databind.node.ArrayNode)body.get("journalLines");
        ((ObjectNode)list.get(1)).put("amountMinor","200");
        assertThrows(LedgerService.Problem.class,()->catalog.validate("LED",d.actions().get(0),body));
    }
    private static void sample(ObjectNode body,DomainCatalog.Field field) {
        String t=field.type();
        if(t.startsWith("enum:")){body.put(field.name(),t.substring(5).split(",")[0]);return;}
        switch(t) {
            case "uuid" -> body.put(field.name(),ID);
            case "text" -> body.put(field.name(),"OPES-CI-REVIEW");
            case "date" -> body.put(field.name(),"2026-11-06");
            case "dateTime" -> body.put(field.name(),"2026-11-06T10:00:00Z");
            case "month" -> body.put(field.name(),"2026-11");
            case "minor" -> body.put(field.name(),"1000");
            case "int" -> body.put(field.name(),10);
            case "bool" -> body.put(field.name(),false);
            case "currency" -> body.put(field.name(),"XAF");
            case "country" -> body.put(field.name(),"CM");
            case "sha256" -> body.put(field.name(),"a".repeat(64));
            case "uri" -> body.put(field.name(),"https://system.example.org/callback");
            case "scopeList" -> body.putArray(field.name()).add("review.read");
            case "uuidList" -> body.putArray(field.name()).add(ID);
            case "journalLines" -> {
                var l=body.putArray(field.name());
                l.addObject().put("accountId","11111111-1111-4111-8111-111111111111")
                 .put("side","DEBIT").put("amountMinor","100").put("currency","XAF");
                l.addObject().put("accountId","22222222-2222-4222-8222-222222222222")
                 .put("side","CREDIT").put("amountMinor","100").put("currency","XAF");
            }
            default -> throw new IllegalArgumentException(t);
        }
    }
}
