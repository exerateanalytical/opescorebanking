package com.opesware.banking.domain;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import com.opesware.banking.ledger.LedgerService;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.JsonNodeFactory;
import tools.jackson.databind.node.ObjectNode;

/**
 * Independently versioned source-backed 25-domain contract registry.
 * Strictly validates fields before a real PostgreSQL transaction.
 * "REVIEWED_NOT_EFFECTIVE" is intentionally not a banking effect.
 */
@Component
public final class DomainCatalog {
    public record Field(String name, String type) {}
    public record Domain(String id, List<String> actions, List<Field> fields,
                         String submitEvidence, String reviewEvidence) {}
    public record Command(String domain, int stage, UUID aggregate, long expectedVersion,
                          String fieldsJson, UUID evidence, String decision) {}

    private final Map<String, Domain> domains;
    private final JsonMapper mapper;
    private static final BigInteger MAX_MINOR = new BigInteger("9000000000000000");
    private static final Pattern SCOPE = Pattern.compile("[A-Za-z][A-Za-z0-9.:_-]{1,79}");

    public DomainCatalog(JsonMapper mapper) {
        this.mapper = Objects.requireNonNull(mapper);
        try (InputStream in = Objects.requireNonNull(
                DomainCatalog.class.getResourceAsStream("/contracts/domain-catalog.json"),
                "Production domain catalog missing")) {
            JsonNode root = mapper.readTree(in);
            Map<String, Domain> m = new LinkedHashMap<>();
            for (JsonNode item : root.path("domains")) {
                List<String> actions = new ArrayList<>();
                for (JsonNode action : item.path("actions")) actions.add(action.asText());
                List<Field> fields = new ArrayList<>();
                for (JsonNode field : item.path("fields")) {
                    fields.add(new Field(field.path("name").asText(),
                                         field.path("type").asText()));
                }
                Domain domain = new Domain(item.path("id").asText(),
                        List.copyOf(actions), List.copyOf(fields),
                        item.path("submitEvidence").asText(), item.path("reviewEvidence").asText());
                if (actions.size() != 3 || fields.size() < 5 ||
                    m.put(domain.id(), domain) != null) {
                    throw new IllegalStateException("Corrupt 25-domain registry");
                }
            }
            if (m.size() != 25 || !root.path("domainCount").isIntegralNumber()
                    || root.path("domainCount").asInt() != 25
                    || root.path("productionAccepted").asBoolean(true)) {
                throw new IllegalStateException("Unexpected domain registry or acceptance claim");
            }
            this.domains = Map.copyOf(m);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to load domain registry", e);
        }
    }

    public Map<String, Domain> domains() { return domains; }
    public Domain require(String domain) {
        Domain result = domains.get(domain);
        if (result == null) bad("UNKNOWN_BANKING_DOMAIN");
        return result;
    }
    public Command validate(String domainId, String action, JsonNode body) {
        Domain domain = require(domainId);
        int stage = domain.actions().indexOf(action);
        if (stage < 0 || body == null || !body.isObject()) bad("UNKNOWN_OR_INVALID_DOMAIN_ACTION");
        UUID aggregate = canonicalUuid(body.path("aggregateId"));
        JsonNode expectedNode = body.path("expectedVersion");
        if (!expectedNode.isIntegralNumber()) bad("EXPECTED_VERSION_REQUIRED");
        long version = expectedNode.longValue();
        if (version < 0 || version > 2147483647L || (stage == 0 && version != 0)
                || (stage == 1 && version < 1) || (stage == 2 && version < 2)) {
            bad("INVALID_DOMAIN_EXPECTED_VERSION");
        }
        Set<String> allowed = new HashSet<>(List.of("aggregateId","expectedVersion"));
        ObjectNode collected = JsonNodeFactory.instance.objectNode();
        UUID evidence = null;
        String decision = null;
        if (stage == 0) {
            for (Field field : domain.fields()) {
                allowed.add(field.name());
                JsonNode value = body.get(field.name());
                requireFieldType(value, field.type());
                collected.set(field.name(), value);
            }
        } else {
            String evidenceName = stage == 1 ? domain.submitEvidence() : domain.reviewEvidence();
            allowed.add(evidenceName);
            evidence = canonicalUuid(body.path(evidenceName));
            if (stage == 2) {
                allowed.add("decision");
                decision = body.path("decision").asText("");
                if (!decision.equals("ACCEPT") && !decision.equals("REJECT")) {
                    bad("INVALID_REVIEW_DECISION");
                }
            }
        }
        if (body.size() != allowed.size()) bad("MISSING_DOMAIN_FIELDS");
        for (String name : body.propertyNames())
            if (!allowed.contains(name)) bad("UNKNOWN_DOMAIN_FIELD");
        return new Command(domainId, stage, aggregate, version,
                stage == 0 ? collected.toString() : null, evidence, decision);
    }

    private static UUID canonicalUuid(JsonNode node) {
        if (node == null || !node.isTextual()) bad("INVALID_UUID");
        String value = node.asText();
        try {
            UUID u = UUID.fromString(value);
            if (!u.toString().equals(value.toLowerCase(Locale.ROOT))) bad("NON_CANONICAL_UUID");
            return u;
        } catch (IllegalArgumentException e) {
            bad("INVALID_UUID");
            return null;
        }
    }

    private static void requireFieldType(JsonNode v, String type) {
        if (v == null || v.isNull()) bad("REQUIRED_DOMAIN_FIELD_MISSING");
        if (type.startsWith("enum:")) {
            if (!v.isTextual() ||
                !Arrays.asList(type.substring(5).split(",")).contains(v.asText()))
                bad("INVALID_DOMAIN_ENUM");
            return;
        }
        switch (type) {
            case "uuid" -> canonicalUuid(v);
            case "text" -> {
                if (!v.isTextual() || v.asText().isBlank() ||
                    v.asText().length() > 4000 || v.asText().chars().anyMatch(Character::isISOControl))
                    bad("INVALID_DOMAIN_TEXT");
            }
            case "minor" -> {
                if (!v.isTextual() || !v.asText().matches("^(0|[1-9][0-9]{0,15})$")
                    || new BigInteger(v.asText()).compareTo(MAX_MINOR) > 0) bad("INVALID_MINOR_UNITS");
            }
            case "int" -> {
                if (!v.isIntegralNumber() || v.longValue()<0 || v.longValue()>1000000)
                    bad("INVALID_DOMAIN_INTEGER");
            }
            case "currency" -> {
                if (!v.isTextual() || !v.asText().matches("[A-Z]{3}")) bad("INVALID_CURRENCY");
            }
            case "country" -> {
                if (!v.isTextual() || !v.asText().matches("[A-Z]{2}")) bad("INVALID_COUNTRY");
            }
            case "sha256" -> {
                if (!v.isTextual() || !v.asText().matches("[0-9a-f]{64}")) bad("INVALID_SHA256");
            }
            case "month" -> {
                if (!v.isTextual() || !v.asText().matches("[0-9]{4}-(0[1-9]|1[0-2])"))
                    bad("INVALID_MONTH");
            }
            case "uri" -> {
                if (!v.isTextual() || !v.asText().matches("https://[^\\s]{3,2048}"))
                    bad("INVALID_HTTPS_URI");
            }
            case "date" -> {
                try {
                    if (!v.isTextual()) bad("INVALID_DATE");
                    LocalDate.parse(v.asText());
                } catch (RuntimeException e) { bad("INVALID_DATE"); }
            }
            case "dateTime" -> {
                try {
                    if (!v.isTextual()) bad("INVALID_DATE_TIME");
                    OffsetDateTime.parse(v.asText());
                } catch (RuntimeException e) { bad("INVALID_DATE_TIME"); }
            }
            case "bool" -> { if (!v.isBoolean()) bad("INVALID_BOOLEAN"); }
            case "uuidList" -> {
                if (!v.isArray() || v.size() < 1 || v.size() > 50) bad("INVALID_UUID_LIST");
                for (JsonNode e : v) canonicalUuid(e);
            }
            case "scopeList" -> {
                if (!v.isArray() || v.size()<1 || v.size()>30) bad("INVALID_SCOPE_LIST");
                for (JsonNode e : v)
                    if (!e.isTextual() || !SCOPE.matcher(e.asText()).matches()) bad("INVALID_SCOPE");
            }
            case "journalLines" -> requireBalancedCandidateLines(v);
            default -> bad("UNSUPPORTED_DOMAIN_FIELD_TYPE");
        }
    }

    private static void requireBalancedCandidateLines(JsonNode lines) {
        if (!lines.isArray() || lines.size()<2 || lines.size()>500) bad("INVALID_DRAFT_JOURNAL");
        Map<String,BigInteger> perCurrency = new HashMap<>();
        Set<UUID> accounts = new HashSet<>();
        for (JsonNode line : lines) {
            if (!line.isObject() || line.size()!=4) bad("INVALID_DRAFT_LINE");
            for (String name : line.propertyNames())
                if (!Set.of("accountId","side","amountMinor","currency").contains(name))
                    bad("INVALID_DRAFT_LINE");
            accounts.add(canonicalUuid(line.path("accountId")));
            JsonNode side = line.path("side");
            if (!side.isTextual() || !Set.of("DEBIT","CREDIT").contains(side.asText()))
                bad("INVALID_DRAFT_LINE_SIDE");
            JsonNode currency = line.path("currency");
            requireFieldType(currency,"currency");
            JsonNode minor = line.path("amountMinor");
            requireFieldType(minor,"minor");
            BigInteger amount = new BigInteger(minor.asText());
            if (amount.signum()==0) bad("ZERO_JOURNAL_ENTRY");
            if (side.asText().equals("CREDIT")) amount=amount.negate();
            perCurrency.merge(currency.asText(),amount,BigInteger::add);
        }
        if (accounts.size()<2 || perCurrency.values().stream().anyMatch(x->x.signum()!=0))
            bad("UNBALANCED_DRAFT_JOURNAL");
    }

    private static void bad(String code) {
        throw new LedgerService.Problem(HttpStatus.UNPROCESSABLE_ENTITY, code);
    }
}
