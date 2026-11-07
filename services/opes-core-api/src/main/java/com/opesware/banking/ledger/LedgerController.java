package com.opesware.banking.ledger;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/banks/{bankId}/ledger")
public class LedgerController {
    private final LedgerService service;
    public LedgerController(LedgerService service) { this.service = service; }

    @PostMapping(path="/journals",consumes=MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> post(@PathVariable UUID bankId,
          @RequestHeader("Idempotency-Key") UUID key,
          @AuthenticationPrincipal Jwt token,
          @Valid @RequestBody LedgerRequest request) {
        if (request == null || !key.equals(request.commandId())) {
            throw new LedgerService.Problem(HttpStatus.BAD_REQUEST, "IDEMPOTENCY_KEY_MISMATCH");
        }
        String receipt = service.post(bankId, token.getIssuer().toString(),
            token.getSubject(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .contentType(MediaType.APPLICATION_JSON)
            .body(receipt);
    }

    @GetMapping(path="/commands/{commandId}",produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> resolve(@PathVariable UUID bankId,
            @PathVariable UUID commandId,
            @AuthenticationPrincipal Jwt token) {
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(service.resolve(bankId, token.getIssuer().toString(),
                token.getSubject(), commandId));
    }
}
