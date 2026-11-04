# OPES Core Banking — Banking Education Edition: product requirements
**Product:** licensed software for universities, banking schools and accredited higher-education institutions. This is a **software licence**, never a statutory licence to accept deposits, offer banking services or participate in a payment network.
## Objectives
Students graduate with operational proficiency in end-to-end core banking: CIF/KYC, customer onboarding, deposits, teller/vault, journals, credit, treasury, AML/CFT, payments, settlement, reconciliation, reporting, security and audits. Support English/French courses and CEMAC-specific and international comparative cases.
## Tenant model
Education tenants have separate identity realm, database, encryption keys, event topics, backups and DNS from commercial banking; no credentials, payment rails, customer PII, production accounts or real-money movement. Demo integrations use offline simulators with visibly simulated receipts. All records labeled SIMULATED and exports watermarked TRAINING / NOT A BANK RECORD.
## Licensing and governance
Per-institution software subscription or campus/site licence with enrolled student and instructor seats, concurrent lab limits, course term, sandbox reset rights and data retention. Licensing entitlement does not confer government accreditation or banking authority. Institutions must approve academic integrity, privacy, student consent and instructor conduct policies.
## Personas
Platform vendor administrator (software maintenance only); university tenant administrator; programme director; instructor; examiner; student; external moderator; lab auditor. A student cannot mark their own assessments or obtain instructor privileges.
## Capabilities
- Classroom bank builder: instructors instantiate fictional Bank A/Bank B, branches, products, currencies, chart of accounts, users and policies from templates.
- Scenario engine: seed synthetic CIFs, transactions, loans, payment queues, vault counts, sanctions false positives, liquidity shocks, fraud alerts and reconciliations.
- Student role rotation: teller, branch manager, credit officer, compliance analyst, treasury dealer, payments officer, accountant, auditor and supervisor.
- Simulated payment rail: deterministic ISO 20022-inspired message workflows and configurable clearing delays/returns, explicitly not real scheme membership.
- Accounting lab: balanced posting, controlled reversal, trial balance, EOD, reconciliation and discrepancy investigations.
- Instructor tools: publish cases, freeze clocks, inject faults, assign teams, monitor progress, replay timelines, reset labs and review evidence.
- Assessment: rubrics, practical exams, competence map, immutable attempt log, plagiarism flags for review (not automated guilt), moderation, certificate of training completion.
- Reporting: student skills passport, task completion, error rates, policy violations, ledger balance and audit trail; privacy-aware retention.
## Safety invariants
No real bank credentials, no live settlement, no real sanctions filing, no real KYC service without lawful separate agreement, no production datasets, no externally spendable balances. Even simulated journal must be double-entry balanced and replay-safe.
## Acceptance
Student completes multi-day mock bank operations; instructor can verify transaction-by-transaction decisions and journal effects; simulated rail rejects replay; student cannot cross institution or class; resets are audited; exports display SIMULATED; no internet access required for offline classroom simulator when deployed locally.
## Non-goals
Government licensing, real deposits, real loans, real-money transfer, legally binding credit decisions, regulatory certification or professional accreditation unless separately obtained.
