"""Signed synthetic RSA tokens; no network key discovery and no live credentials."""
import json
import time
import unittest
from uuid import uuid4
import jwt
from jwt.algorithms import RSAAlgorithm
from cryptography.hazmat.primitives.asymmetric import rsa

from router import AccessDenied, PinnedBankRouter, PinnedIssuer, Membership

BANK_A="11111111-1111-4111-8111-111111111111"
BANK_B="22222222-2222-4222-8222-222222222222"
ISS="https://synthetic-idp.example.invalid"
AUD="opes-banking-api-synthetic"
SUB="test-subject"
PERM="cif.party.read"

class TokenRoutingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.private=rsa.generate_private_key(public_exponent=65537,key_size=2048)
        jwk=json.loads(RSAAlgorithm.to_jwk(cls.private.public_key()))
        jwk.update({"alg":"RS256","kid":"trusted-test-key","use":"sig"})
        cls.issuer=PinnedIssuer(ISS,AUD,{"trusted-test-key":jwk})
        cls.member=Membership(BANK_A,ISS,SUB,True,frozenset({PERM}),3)

    def setUp(self):
        self.router=PinnedBankRouter(self.issuer,{(BANK_A,ISS,SUB):self.member},
                                      {BANK_A:"opes_bank_a_test",BANK_B:"opes_bank_b_test"})
        now=int(time.time())
        self.claims={"iss":ISS,"aud":AUD,"sub":SUB,"iat":now-10,"nbf":now-10,
                     "exp":now+90,"jti":str(uuid4()),"scope":PERM,"institution_id":BANK_A}

    def signed(self,claims=None,headers=None,private=None):
        hdr={"kid":"trusted-test-key","typ":"at+jwt"}
        hdr.update(headers or {})
        return jwt.encode(self.claims if claims is None else claims,
                          self.private if private is None else private,
                          algorithm="RS256",headers=hdr)

    def auth(self,token=None,bank=BANK_A,permission=PERM,headers=None):
        return self.router.authorize(self.signed() if token is None else token,
                                     bank,permission,headers)

    def test_valid_signed_token_and_server_principal(self):
        route=self.auth()
        self.assertEqual(route.institution_id,BANK_A)
        self.assertEqual(route.database_principal,"opes_bank_a_test")
        self.assertEqual(route.membership_revision,3)

    def test_same_subject_separate_bank_memberships_are_scoped(self):
        other=Membership(BANK_B,ISS,SUB,True,frozenset({PERM}),7)
        router=PinnedBankRouter(self.issuer,{
            (BANK_A,ISS,SUB):self.member,
            (BANK_B,ISS,SUB):other,
        },{BANK_A:"opes_bank_a_test",BANK_B:"opes_bank_b_test"})
        a=router.authorize(self.signed(),BANK_A,PERM)
        self.assertEqual(a.database_principal,"opes_bank_a_test")
        with self.assertRaises(AccessDenied):
            router.authorize(self.signed(),BANK_B,PERM)
        bank_b_claims={**self.claims,"institution_id":BANK_B}
        b=router.authorize(self.signed(bank_b_claims),BANK_B,PERM)
        self.assertEqual(b.database_principal,"opes_bank_b_test")
        self.assertEqual(b.membership_revision,7)

    def test_bank_b_path_idor_denied(self):
        with self.assertRaises(AccessDenied):self.auth(bank=BANK_B)

    def test_spoofed_tenant_header_denied(self):
        for key in ("X-Institution-ID","x-bank-id","X-Tenant-ID","X-DB-Principal"):
            with self.subTest(key=key):
                with self.assertRaises(AccessDenied):self.auth(headers={key:BANK_B})

    def test_mismatched_token_claim_denied(self):
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed({**self.claims,"institution_id":BANK_B}))

    def test_missing_server_side_membership_denied(self):
        missing=PinnedBankRouter(self.issuer,{}, {BANK_A:"opes_bank_a_test"})
        with self.assertRaises(AccessDenied):
            missing.authorize(self.signed(),BANK_A,PERM)

    def test_revoked_membership_denied(self):
        router=PinnedBankRouter(self.issuer,{(BANK_A,ISS,SUB):Membership(BANK_A,ISS,SUB,False,frozenset({PERM}),4)},
                                {BANK_A:"opes_bank_a_test"})
        with self.assertRaises(AccessDenied):
            router.authorize(self.signed(),BANK_A,PERM)

    def test_missing_membership_permission_denied(self):
        router=PinnedBankRouter(self.issuer,{(BANK_A,ISS,SUB):Membership(BANK_A,ISS,SUB,True,frozenset(),4)},
                                {BANK_A:"opes_bank_a_test"})
        with self.assertRaises(AccessDenied):
            router.authorize(self.signed(),BANK_A,PERM)

    def test_missing_token_scope_denied(self):
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed({**self.claims,"scope":"accounts.read"}))

    def test_wrong_audience_denied(self):
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed({**self.claims,"aud":"another-service"}))

    def test_wrong_issuer_denied(self):
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed({**self.claims,"iss":"https://attacker.example.invalid"}))

    def test_expired_token_denied(self):
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed({**self.claims,"exp":int(time.time())-3}))

    def test_future_nbf_denied(self):
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed({**self.claims,"nbf":int(time.time())+90}))

    def test_max_lifetime_denied(self):
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed({**self.claims,"exp":int(time.time())+1000}))

    def test_unknown_jwks_kid_denied(self):
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed(headers={"kid":"attacker-key"}))

    def test_attacker_controlled_remote_key_header_denied(self):
        for hdr in ({"jku":"https://attacker.invalid/jwks"}, {"x5u":"https://attacker.invalid/key"},
                    {"jwk":{"kty":"oct","k":"attacker"}},{"crit":["some-extension"]}):
            with self.subTest(hdr=hdr):
                with self.assertRaises(AccessDenied):
                    self.auth(token=self.signed(headers=hdr))

    def test_wrong_jwt_type_denied(self):
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed(headers={"typ":"JWT"}))

    def test_alg_none_denied(self):
        token=jwt.encode(self.claims,key="",algorithm="none",headers={"typ":"at+jwt","kid":"trusted-test-key"})
        with self.assertRaises(AccessDenied):self.auth(token=token)

    def test_signature_from_untrusted_rsa_key_denied(self):
        attacker=rsa.generate_private_key(public_exponent=65537,key_size=2048)
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed(private=attacker))

    def test_missing_jti_denied(self):
        missing={k:v for k,v in self.claims.items() if k!="jti"}
        with self.assertRaises(AccessDenied):
            self.auth(token=self.signed(missing))

    def test_invalid_database_principal_registry_denied(self):
        with self.assertRaises(ValueError):
            PinnedBankRouter(self.issuer,{(BANK_A,ISS,SUB):self.member},
                             {BANK_A:"same_login",BANK_B:"same_login"})

if __name__=="__main__":unittest.main(verbosity=2)
