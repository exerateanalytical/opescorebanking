# Proposed posting-rule catalogue — NOT APPROVED ACCOUNT NUMBERS
All examples are conceptual debit/credit directions; institution-specific account mapping, PCEC classification, fee/tax treatment, valuation and effective dating require CFO and authoritative legal approval. **WP-ACC-005 P0 blocked**.
- Cash deposit: DR branch cash custody asset; CR customer deposit liability; amount/currency matched, branch cash reconciliation required.
- Cash withdrawal: DR customer deposit liability; CR branch cash custody asset; preauthorization and funds availability.
- Internal transfer between customer deposits: DR originating customer deposit liability; CR beneficiary deposit liability; no interbank finality claim.
- Loan disbursement: DR loan receivable asset; CR customer deposit liability or authorized settlement account; credit approval and limit.
- Loan principal repayment: DR customer deposit liability or cash; CR loan receivable asset; interest/fees separated by versioned schedule.
- Interest accrual on deposit: DR interest expense; CR accrued interest payable, subject to policy and accounting standard.
- Loan interest accrual: DR interest receivable; CR interest income, subject to impairment and recognition policies.
- Service fee: DR customer deposit liability/receivable; CR fee income; separately account applicable tax liabilities.
- Interbank outbound payment: hold/reserve then clearing and settlement entries as defined by authorized rail; never assume customer debit equals final settlement.
- Reversal: new balanced compensating journal linked to original; no deletion or edit.
- FX: independently balanced currency legs, approved rate and valuation entries; reconciliation to external positions.
Each rule requires event type, source aggregate, institution, product version, currencies, debit/credit roles, tax, rounding, posting date, effective date, idempotency key, exception and reconciliation owner. Never activate unverified PCEC 312/322 mappings.
