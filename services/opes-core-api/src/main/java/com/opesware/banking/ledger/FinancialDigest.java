package com.opesware.banking.ledger;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.UUID;

public final class FinancialDigest {
    private FinancialDigest() {}

    // Canonical v1: length-delimited fields in documented, caller-visible order.
    // Do not change without a versioned migration/idempotency compatibility policy.
    public static String sha256(UUID bankId, LedgerRequest request) {
        StringBuilder s = new StringBuilder("OPES-LEDGER-REQUEST-v1\n");
        add(s, bankId.toString());
        add(s, request.commandId().toString());
        add(s, request.authorizationId().toString());
        add(s, request.sourceReference());
        add(s, request.accountingPeriodId().toString());
        s.append(request.lines().size()).append('\n');
        for (LedgerRequest.Entry l : request.lines()) {
            add(s, l.accountId().toString());
            add(s, l.side().name());
            add(s, Long.toString(l.amountMinor()));
            add(s, l.currency());
        }
        try {
            return HexFormat.of().formatHex(
                MessageDigest.getInstance("SHA-256").digest(
                    s.toString().getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    private static void add(StringBuilder s, String v) {
        s.append(v.length()).append(':').append(v).append('\n');
    }

    public static void requireBalanced(LedgerRequest request) {
        if (request == null || request.lines() == null
            || request.lines().size() < 2 || request.lines().size() > 500) {
            throw new IllegalArgumentException("Invalid journal line count");
        }
        java.util.Map<String, java.math.BigInteger> net = new java.util.HashMap<>();
        java.util.Set<UUID> distinctAccounts = new java.util.HashSet<>();
        for (LedgerRequest.Entry l : request.lines()) {
            if (l == null || l.accountId() == null || l.side() == null
                || l.currency() == null || !l.currency().matches("[A-Z]{3}")
                || l.amountMinor() == null || l.amountMinor() <= 0L
                || l.amountMinor() > 9000000000000000L) {
                throw new IllegalArgumentException("Invalid exact monetary entry");
            }
            distinctAccounts.add(l.accountId());
            java.math.BigInteger amount = java.math.BigInteger.valueOf(l.amountMinor());
            if (l.side() == LedgerRequest.Side.CREDIT) amount = amount.negate();
            net.merge(l.currency(), amount, java.math.BigInteger::add);
        }
        if (distinctAccounts.size() < 2
            || net.values().stream().anyMatch(x -> x.signum() != 0)) {
            throw new IllegalArgumentException("Unbalanced journal by currency");
        }
    }
}
