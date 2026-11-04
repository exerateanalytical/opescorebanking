\set ON_ERROR_STOP on
-- Prerequisite: foundation tenant SQL has seeded bank A and B, and actors.
INSERT INTO opes_domains.cif_party(
 institution_id,party_id,party_type,legal_name,residence_country,created_by_actor)
VALUES
('11111111-1111-4111-8111-111111111111',
 '30000000-0000-4000-8000-000000000001','INDIVIDUAL','Synthetic A','CM',
 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
('22222222-2222-4222-8222-222222222222',
 '30000000-0000-4000-8000-000000000002','INDIVIDUAL','Synthetic B','GA',
 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
INSERT INTO opes_domains.cif_kyc_case(
 institution_id,kyc_case_id,party_id,screening_reference,
 document_evidence_reference,case_state,requested_by_actor,reviewed_by_actor)
VALUES(
'11111111-1111-4111-8111-111111111111',
'40000000-0000-4000-8000-000000000001',
'30000000-0000-4000-8000-000000000001',
'41000000-0000-4000-8000-000000000001',
'42000000-0000-4000-8000-000000000001',
'APPROVED','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
'aaaabbbb-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
INSERT INTO opes_domains.prd_product(
 institution_id,product_id,product_code,product_type,currency,title,created_by_actor)
VALUES(
'11111111-1111-4111-8111-111111111111',
'50000000-0000-4000-8000-000000000001','CURRENT_XAF','CURRENT','XAF',
'Synthetic current account','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
INSERT INTO opes_domains.prd_product_revision(
 institution_id,product_id,revision_no,min_opening_minor,
 eligibility_policy_id,effective_from,revision_state,maker_actor,checker_actor)
VALUES(
'11111111-1111-4111-8111-111111111111',
'50000000-0000-4000-8000-000000000001',1,0,
'51000000-0000-4000-8000-000000000001',
'2026-11-04','APPROVED',
'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
'aaaabbbb-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
INSERT INTO opes_domains.act_account_request(
 institution_id,account_request_id,party_id,product_id,product_revision_no,
 kyc_case_id,account_purpose,created_by_actor)
VALUES(
'11111111-1111-4111-8111-111111111111',
'60000000-0000-4000-8000-000000000001',
'30000000-0000-4000-8000-000000000001',
'50000000-0000-4000-8000-000000000001',1,
'40000000-0000-4000-8000-000000000001','PERSONAL',
'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
INSERT INTO opes_domains.led_journal_proposal(
 institution_id,journal_id,source_reference,posting_rule_revision_id,proposed_by_actor)
VALUES(
'11111111-1111-4111-8111-111111111111',
'70000000-0000-4000-8000-000000000001','SYNTH-001',
'71000000-0000-4000-8000-000000000001',
'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
