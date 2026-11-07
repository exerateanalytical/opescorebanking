-- CI fixture ONLY: not executed in a real bank deployment.
\set ON_ERROR_STOP on
INSERT INTO opes_core.actor_membership(bank_id,issuer,subject_id,active,can_post,can_recover,expires_at)
 VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','https://auth.opes.example/realm/ci','ops-checker-002',true,false,false,clock_timestamp()+interval '2 hours');
INSERT INTO opes_core.review_grant(bank_id,issuer,subject_id,domain_id,operation,active,expires_at)
 SELECT 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','https://auth.opes.example/realm/ci','ops-poster-001',domain_id,operation,true,clock_timestamp()+interval '2 hours'
 FROM opes_core.review_definition CROSS JOIN (VALUES('CREATE'),('SUBMIT'),('READ')) actions(operation);
INSERT INTO opes_core.review_grant(bank_id,issuer,subject_id,domain_id,operation,active,expires_at)
 SELECT 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','https://auth.opes.example/realm/ci','ops-checker-002',domain_id,operation,true,clock_timestamp()+interval '2 hours'
 FROM opes_core.review_definition CROSS JOIN (VALUES('REVIEW'),('READ')) actions(operation);
GRANT EXECUTE ON FUNCTION opes_core.apply_review(text,integer,uuid,bigint,text,jsonb,uuid,text,text,text,uuid)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_core.read_review(text,uuid,text,text,uuid)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
