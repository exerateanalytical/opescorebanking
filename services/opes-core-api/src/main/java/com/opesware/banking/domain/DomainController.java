package com.opesware.banking.domain;

import com.opesware.banking.ledger.LedgerService;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

/** Routes 75 declared commands and 25 reads; no financial effects. */
@RestController
@RequestMapping("/v1/banks/{bankId}")
public final class DomainController {
    private final DomainCatalog catalog;
    private final DomainService service;
    public DomainController(DomainCatalog catalog,DomainService service) {
        this.catalog=catalog;this.service=service;
    }
    @PostMapping(path="/{domain}/{action}",
         consumes=MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> command(
       @PathVariable UUID bankId,@PathVariable String domain,@PathVariable String action,
       @RequestHeader("Idempotency-Key") String idempotency,
       @RequestHeader("X-Correlation-ID") UUID correlation,
       @AuthenticationPrincipal Jwt jwt,
       @RequestBody JsonNode body) {
        String code=domain.toUpperCase(Locale.ROOT);
        if(!domain.equals(code.toLowerCase(Locale.ROOT)))
            throw new LedgerService.Problem(HttpStatus.NOT_FOUND,"UNKNOWN_DOMAIN_PATH");
        DomainCatalog.Command validated=catalog.validate(code,action,body);
        String receipt=service.apply(bankId,jwt.getIssuer().toString(),jwt.getSubject(),
                            correlation,idempotency,validated);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
            .contentType(MediaType.APPLICATION_JSON).body(receipt);
    }

    @GetMapping(path="/{domain}/candidates/{aggregateId}",
        produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> read(
       @PathVariable UUID bankId,@PathVariable String domain,@PathVariable UUID aggregateId,
       @RequestHeader("X-Correlation-ID") UUID correlation,@AuthenticationPrincipal Jwt jwt) {
        String code=domain.toUpperCase(Locale.ROOT);
        catalog.require(code);
        String receipt=service.read(bankId,jwt.getIssuer().toString(),jwt.getSubject(),
                                     correlation,code,aggregateId);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(receipt);
    }
}
