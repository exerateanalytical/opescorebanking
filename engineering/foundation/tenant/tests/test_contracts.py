"""Contract invariants for OPES tenant-control-plane OpenAPI.
Tests validate authored schema only; not a deployed API server.
"""
import pathlib
import unittest
import yaml
from jsonschema import Draft202012Validator

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCHEMA = yaml.safe_load((ROOT/"openapi.yaml").read_text(encoding="utf8"))
COMPONENTS = SCHEMA["components"]["schemas"]

def validated(schema_name, data):
    schema = dict(COMPONENTS[schema_name])
    schema["$schema"] = "https://json-schema.org/draft/2020-12/schema"
    Draft202012Validator.check_schema(schema)
    return list(Draft202012Validator(schema).iter_errors(data))

class ContractSecurityTests(unittest.TestCase):
    def test_version(self):
        self.assertEqual(SCHEMA["openapi"], "3.1.0")

    def test_every_operation_has_auth_and_scope(self):
        for path, methods in SCHEMA["paths"].items():
            for method, operation in methods.items():
                if method not in ("get","post","put","delete","patch"): continue
                with self.subTest(path=path,method=method):
                    self.assertIn("security",operation)
                    self.assertTrue(operation["security"])
                    self.assertIn("x-required-permission",operation)
                    self.assertIn("401",operation["responses"])
                    self.assertIn("403",operation["responses"])
                    self.assertTrue(operation["operationId"])

    def test_mutation_requires_idempotency(self):
        for path, methods in SCHEMA["paths"].items():
            for method, operation in methods.items():
                if method not in ("post","put","patch","delete"):continue
                params=operation.get("parameters",[])
                refs=[p.get("$ref") for p in params]
                with self.subTest(path=path):
                    self.assertIn("#/components/parameters/IdempotencyKey",refs)
                    self.assertIn("requestBody",operation)

    def test_all_request_models_are_field_typed_and_closed(self):
        for path, methods in SCHEMA["paths"].items():
            for method, operation in methods.items():
                if "requestBody" not in operation:continue
                ref=operation["requestBody"]["content"]["application/json"]["schema"]["$ref"]
                name=ref.split("/")[-1]
                payload=COMPONENTS[name]
                with self.subTest(path=path,model=name):
                    self.assertEqual(payload["type"],"object")
                    self.assertFalse(payload["additionalProperties"])
                    self.assertTrue(payload["required"])
                    self.assertGreater(len(payload["properties"]),2)
                    self.assertNotIn("payload",payload["properties"])
                    Draft202012Validator.check_schema(payload)

    def test_models_do_not_trust_client_supplied_tenant_or_actor(self):
        model=COMPONENTS["CreateProvisioningRequest"]
        self.assertNotIn("institutionId",model["properties"])
        self.assertNotIn("createdBy",model["properties"])
        self.assertNotIn("approvedBy",COMPONENTS["AuthorizeProvisioningRequest"]["properties"])

    def test_provisioning_contract_rejects_education_in_banking_plane(self):
        valid={"institutionCode":"BANK_A","legalName":"Synthetic Bank A",
               "countryCode":"CM","deploymentModel":"DEDICATED_BANK_NONPRODUCTION"}
        self.assertEqual(validated("CreateProvisioningRequest",valid),[])
        self.assertTrue(validated("CreateProvisioningRequest",
            {**valid,"deploymentModel":"EDUCATION_SIMULATION"}))
        self.assertTrue(validated("CreateProvisioningRequest",
            {**valid,"institutionId":"untrusted-from-client"}))
        self.assertTrue(validated("CreateProvisioningRequest",
            {**valid,"countryCode":"ZZZ"}))

    def test_mapping_draft_has_explicit_semantics(self):
        example={"semanticKey":"CREDIT_SENSITIVE_SHORT_TERM",
                 "regulatorCode":"COBAC","externalAccountCode":"312",
                 "interpretationStatus":"UNRESOLVED",
                 "sourceRef":"COBAC_I_2015_01_ARTICLE_8D"}
        self.assertEqual(validated("ProposeRegulatoryMapping",example),[])
        self.assertTrue(validated("ProposeRegulatoryMapping",
            {**example,"interpretationStatus":"ACTIVE"}))
        self.assertTrue(validated("ProposeRegulatoryMapping",
            {**example,"sourceSha256":"invalid-hash"}))

    def test_activation_contract_is_explicit(self):
        example={"expectedVersion":1,"effectiveFrom":"2026-11-04T12:00:00Z",
                 "sourceSha256":"a"*64,"rationale":"Reconciled source interpretation"}
        self.assertEqual(validated("ActivateRegulatoryMapping",example),[])
        self.assertTrue(validated("ActivateRegulatoryMapping",
            {**example,"externalAccountCode":"312"}))
        self.assertTrue(validated("ActivateRegulatoryMapping",
            {**example,"sourceSha256":"short"}))

if __name__=="__main__":
    unittest.main()
