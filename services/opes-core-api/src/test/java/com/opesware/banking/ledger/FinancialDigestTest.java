package com.opesware.banking.ledger;

import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FinancialDigestTest {
    static final UUID BANK = UUID.fromString("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    static LedgerRequest request(long debit, long credit) {
        return new LedgerRequest(
            UUID.fromString("11111111-1111-4111-8111-111111111111"),
            UUID.fromString("22222222-2222-4222-8222-222222222222"),
            "OPES-TRANSFER-REFERENCE",
            UUID.fromString("33333333-3333-4333-8333-333333333333"),
            List.of(
                new LedgerRequest.Entry(
                    UUID.fromString("44444444-4444-4444-8444-444444444444"),
                    LedgerRequest.Side.DEBIT, debit, "XAF"),
                new LedgerRequest.Entry(
                    UUID.fromString("55555555-5555-4555-8555-555555555555"),
                    LedgerRequest.Side.CREDIT, credit, "XAF")));
    }

    @Test void exactMinorUnitBalance() {
        assertDoesNotThrow(() -> FinancialDigest.requireBalanced(request(450, 450)));
        assertThrows(IllegalArgumentException.class,
            () -> FinancialDigest.requireBalanced(request(450, 449)));
    }
    @Test void idempotencyDigestDeterministicAndSensitiveToEconomicValue() {
        String digest = FinancialDigest.sha256(BANK, request(450, 450));
        assertEquals(64, digest.length());
        assertEquals(digest, FinancialDigest.sha256(BANK, request(450, 450)));
        assertNotEquals(digest, FinancialDigest.sha256(BANK, request(450, 449)));
    }
    @Test void rejectsZeroAndOverflowOfAllowedDomainUnits() {
        assertThrows(IllegalArgumentException.class,
            () -> FinancialDigest.requireBalanced(request(0, 0)));
        assertThrows(IllegalArgumentException.class,
            () -> FinancialDigest.requireBalanced(request(9000000000000001L, 9000000000000001L)));
    }
}
