\set ON_ERROR_STOP on
INSERT INTO opes_rpt_review_lab.review_record(institution_id,report_id,maker_actor_id,content_digest)
VALUES ('BANK-A','RPT-LED-003','A-MAKER','sha256-SYNTHETIC-A-003'),
('BANK-A','RPT-LED-004','A-MAKER','sha256-SYNTHETIC-A-004');
SELECT 'PG16_CONCURRENCY_FIXTURES_PREPARED';
