package com.opesware.banking.ledger;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;

public record LedgerRequest(
    @NotNull UUID commandId,
    @NotNull UUID authorizationId,
    @NotBlank @Size(min=3, max=160) String sourceReference,
    @NotNull UUID accountingPeriodId,
    @NotEmpty @Size(min=2, max=500) List<@Valid Entry> lines
) {
    public enum Side { DEBIT, CREDIT }

    public record Entry(
        @NotNull UUID accountId,
        @NotNull Side side,
        @NotNull @Min(1) @Max(9000000000000000L) Long amountMinor,
        @NotBlank @Pattern(regexp="^[A-Z]{3}$") String currency
    ) {}
}
