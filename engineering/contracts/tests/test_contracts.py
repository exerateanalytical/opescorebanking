"""Tests strict domain-specific command contracts; not service integration tests."""
import json
import pathlib
import unittest
from jsonschema import Draft202012Validator

ROOT=pathlib.Path(__file__).resolve().parents[1]
DOMAINS=("CIF","PRD","ACT","LED")
DATA={d:json.loads((ROOT/d/"openapi.json").read_text()) for d in DOMAINS}
U="11111111-1111-4111-8111-111111111111"
def valid(domain,model,payload):
    schema={"$ref":f"#/components/schemas/{model}","components":DATA[domain]["components"]}
    Draft202012Validator.check_schema(schema)
    return list(Draft202012Validator(schema).iter_errors(payload))

class DomainContractTests(unittest.TestCase):
    def test_operations_have_actual_field_specific_request_schemas(self):
        for domain,spec in DATA.items():
            self.assertEqual(spec["openapi"],"3.1.0")
            commands=[v["post"] for p,v in spec["paths"].items() if "post" in v]
            self.assertEqual(len(commands),3)
            for op in commands:
                self.assertIn("security",op)
                self.assertIn("x-permission",op)
                self.assertIn("409",op["responses"])
                self.assertIn("422",op["responses"])
                self.assertTrue(any(p["name"]=="Idempotency-Key" for p in op["parameters"]))
                model=op["requestBody"]["content"]["application/json"]["schema"]["$ref"].split("/")[-1]
                shape=spec["components"]["schemas"][model]
                self.assertEqual(shape["type"],"object")
                self.assertFalse(shape["additionalProperties"])
                self.assertGreaterEqual(len(shape["required"]),4)
                self.assertNotIn("payload",shape["properties"])
                Draft202012Validator.check_schema(shape)

    def test_cif_create_party_rejects_hidden_fields_and_wrong_consent(self):
        x={"partyType":"INDIVIDUAL","legalName":"Synthetic Person",
           "countryOfResidence":"CM","consentEvidenceId":U,"riskTier":"STANDARD"}
        self.assertFalse(valid("CIF","CreateParty",x))
        self.assertTrue(valid("CIF","CreateParty",{**x,"institutionId":U}))
        self.assertTrue(valid("CIF","CreateParty",{**x,"riskTier":"UNKNOWN"}))
        self.assertTrue(valid("CIF","CreateParty",{**x,"consentEvidenceId":"fake"}))

    def test_cif_kyc_approval_has_case_evidence_and_reason(self):
        x={"partyId":U,"kycCaseId":U,"expectedVersion":3,"decision":"APPROVE",
          "evidenceBundleRef":U,"reason":"Synthetic KYC approval supporting evidence"}
        self.assertFalse(valid("CIF","ApproveKyc",x))
        self.assertTrue(valid("CIF","ApproveKyc",{**x,"approvedBy":U}))
        self.assertTrue(valid("CIF","ApproveKyc",{**x,"reason":"short"}))

    def test_prd_currency_and_rate_bounds(self):
        x={"productCode":"CURR_XAF","productType":"CURRENT","currency":"XAF",
           "minOpeningAmountMinor":0,"effectiveFrom":"2026-11-04",
           "name":"Synthetic XAF current account","eligibilityPolicyId":U}
        self.assertFalse(valid("PRD","CreateProduct",x))
        self.assertTrue(valid("PRD","CreateProduct",{**x,"currency":"CFAF"}))
        self.assertTrue(valid("PRD","CreateProduct",{**x,"interestRateBasisPoints":-1}))
        self.assertTrue(valid("PRD","CreateProduct",{**x,"initialBalance":100}))

    def test_act_open_account_has_no_client_controlled_balance(self):
        x={"partyId":U,"productRevisionId":U,"currency":"XAF",
          "kycApprovalEvidenceId":U,"accountPurpose":"PERSONAL"}
        self.assertFalse(valid("ACT","OpenAccount",x))
        self.assertTrue(valid("ACT","OpenAccount",{**x,"balanceMinor":1000}))
        self.assertTrue(valid("ACT","OpenAccount",{**x,"accountPurpose":"UNKNOWN"}))

    def test_act_closing_requires_reconciliation_and_zero_balance_evidence(self):
        x={"accountId":U,"expectedVersion":1,"zeroBalanceEvidenceId":U,
          "reconciliationEvidenceId":U,"closureReason":"CUSTOMER_REQUEST"}
        self.assertFalse(valid("ACT","CloseAccount",x))
        self.assertTrue(valid("ACT","CloseAccount",{k:v for k,v in x.items() if k!="zeroBalanceEvidenceId"}))

    def test_led_exact_integer_minor_unit_journal_lines(self):
        line={"accountId":U,"side":"DEBIT","amountMinor":155,"currency":"XAF"}
        self.assertFalse(valid("LED","JournalLine",line))
        self.assertTrue(valid("LED","JournalLine",{**line,"amountMinor":1.5}))
        self.assertTrue(valid("LED","JournalLine",{**line,"amountMinor":0}))
        self.assertTrue(valid("LED","JournalLine",{**line,"side":"UNPOSTED"}))

    def test_led_validation_requires_two_lines(self):
        line={"accountId":U,"side":"DEBIT","amountMinor":155,"currency":"XAF"}
        x={"journalReference":"LAB-001","businessDate":"2026-11-04",
           "postingRuleRevisionId":U,"lines":[line,{**line,"side":"CREDIT"}]}
        self.assertFalse(valid("LED","ValidateJournal",x))
        self.assertTrue(valid("LED","ValidateJournal",{**x,"lines":[line]}))
        self.assertTrue(valid("LED","ValidateJournal",{**x,"lines":[]}))

    def test_led_posting_requires_checker_and_exact_version(self):
        x={"validatedJournalId":U,"expectedVersion":2,
           "postingPolicyRevisionId":U,"checkerDecisionId":U}
        self.assertFalse(valid("LED","PostJournal",x))
        self.assertTrue(valid("LED","PostJournal",{**x,"expectedVersion":-1}))
        self.assertTrue(valid("LED","PostJournal",{**x,"postedBalance":1}))

    def test_led_reversal_has_new_correction_authorization(self):
        x={"originalJournalId":U,"correctionReason":"Reverse duplicate synthetic journal",
           "authorizationEvidenceId":U,"expectedVersion":2}
        self.assertFalse(valid("LED","ReverseJournal",x))
        self.assertTrue(valid("LED","ReverseJournal",{**x,"correctedBalance":-100}))

if __name__=="__main__":
    unittest.main(verbosity=2)
