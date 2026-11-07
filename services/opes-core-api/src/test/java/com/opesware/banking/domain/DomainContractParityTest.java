package com.opesware.banking.domain;

import java.io.InputStream;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;

public class DomainContractParityTest {
    @Test
    void all25OpenApiSchemasMatchJavaDomainOperations() throws Exception {
        var mapper = JsonMapper.builder().build();
        var catalog = new DomainCatalog(mapper);
        int operations = 0;
        for (var domain : catalog.domains().values()) {
            try (InputStream is = getClass().getResourceAsStream(
                  "/contracts/" + domain.id() + ".openapi.json")) {
                assertNotNull(is, "OpenAPI missing: "+domain.id());
                JsonNode spec = mapper.readTree(is);
                assertTrue(spec.path("openapi").asText().startsWith("3.1"),domain.id());
                String base = "/v1/banks/{bankId}/"
                    + domain.id().toLowerCase(Locale.ROOT) + "/";
                for (int index = 0; index < 3; index++) {
                    String path = base + domain.actions().get(index);
                    JsonNode operation = spec.path("paths").path(path).path("post");
                    assertFalse(operation.isMissingNode(),path);
                    assertFalse(operation.path("operationId").asText().isBlank(),path);
                    String schemaName = switch(index) {
                        case 0 -> "CreateCandidate";
                        case 1 -> "SubmitCandidate";
                        default -> "ReviewCandidate";
                    };
                    String ref = operation.path("requestBody").path("content")
                        .path("application/json").path("schema").path("$ref").asText();
                    assertEquals("#/components/schemas/"+schemaName,ref,path);
                    operations++;
                }
                var read = spec.path("paths")
                    .path(base+"candidates/{aggregateId}").path("get");
                assertFalse(read.isMissingNode(),domain.id()+" missing read endpoint");
                operations++;
                JsonNode create = spec.path("components").path("schemas")
                    .path("CreateCandidate");
                Set<String> apiProperties = new HashSet<>();
                create.path("properties").propertyNames().forEach(apiProperties::add);
                assertTrue(apiProperties.contains("aggregateId"));
                assertTrue(apiProperties.contains("expectedVersion"));
                for (var field : domain.fields()) {
                    assertTrue(apiProperties.contains(field.name()),
                        domain.id()+" missing "+field.name());
                }
                if (domain.id().equals("LED")) {
                    assertEquals(200,create.path("properties").path("journalLines")
                        .path("maxItems").asInt());
                }
            }
        }
        assertEquals(100, operations);
    }
}
