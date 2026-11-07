// Generated from the existing 114 GitHub draft IDs plus proposed expansion to 726.
// WARNING: route availability is NOT workflow implementation or regulatory approval.
export const DOMAIN_LABELS = {
  "GOV": "Governance",
  "ARC": "Architecture",
  "CIF": "Customers and KYC",
  "PRD": "Product factory",
  "ACT": "Accounts and deposits",
  "LED": "General ledger",
  "BRN": "Branch and cash",
  "PAY": "Payments and settlement",
  "CRD": "Loans and credit",
  "TRE": "Treasury and FX",
  "AML": "AML and compliance",
  "REP": "Regulatory reporting",
  "CHN": "Digital banking",
  "CARD": "Cards and ATMs",
  "CRM": "Customer service",
  "FEE": "Fees and taxation",
  "REC": "Reconciliation",
  "SEC": "Security and audit",
  "DAT": "Data and migration",
  "API": "Integrations",
  "INF": "Infrastructure",
  "DR": "Continuity and recovery",
  "ADM": "Administration and HR",
  "TST": "Testing and assurance",
  "REL": "Release management",
  "EDU": "Banking education edition"
};
export const DOMAIN_FIELDS = {
  "GOV": [
    [
      "institutionName",
      "Institution legal name",
      "text",
      true
    ],
    [
      "licenceType",
      "Regulatory category",
      "select",
      true,
      [
        "Bank",
        "Microfinance",
        "Payment institution",
        "Training institution"
      ]
    ],
    [
      "authorityReference",
      "Authority reference",
      "text",
      true
    ],
    [
      "effectiveDate",
      "Effective date",
      "date",
      true
    ]
  ],
  "ARC": [
    [
      "service",
      "Service or bounded context",
      "text",
      true
    ],
    [
      "owner",
      "Technical owner",
      "text",
      true
    ],
    [
      "contractVersion",
      "Contract version",
      "text",
      true
    ],
    [
      "changeReason",
      "Change rationale",
      "textarea",
      true
    ]
  ],
  "CIF": [
    [
      "customerType",
      "Customer type",
      "select",
      true,
      [
        "Individual",
        "Corporate",
        "Joint",
        "Minor"
      ]
    ],
    [
      "legalName",
      "Legal / full name",
      "text",
      true
    ],
    [
      "dateOfBirth",
      "Date of birth / incorporation",
      "date",
      true
    ],
    [
      "identityType",
      "Identity document type",
      "select",
      true,
      [
        "National ID",
        "Passport",
        "Registration certificate",
        "Other"
      ]
    ],
    [
      "identityReference",
      "Identity document reference",
      "text",
      true
    ],
    [
      "contact",
      "Verified contact",
      "text",
      false
    ],
    [
      "residency",
      "Tax residency",
      "text",
      true
    ],
    [
      "consent",
      "Consent reference",
      "text",
      true
    ]
  ],
  "PRD": [
    [
      "productCode",
      "Product code",
      "text",
      true
    ],
    [
      "productName",
      "Product name",
      "text",
      true
    ],
    [
      "currency",
      "Currency",
      "select",
      true,
      [
        "XAF",
        "EUR",
        "USD"
      ]
    ],
    [
      "effectiveDate",
      "Effective date",
      "date",
      true
    ],
    [
      "approvalReference",
      "Approval reference",
      "text",
      true
    ]
  ],
  "ACT": [
    [
      "accountReference",
      "Account reference",
      "text",
      true
    ],
    [
      "customerReference",
      "Customer reference",
      "text",
      true
    ],
    [
      "productCode",
      "Product code",
      "text",
      true
    ],
    [
      "currency",
      "Currency",
      "select",
      true,
      [
        "XAF",
        "EUR",
        "USD"
      ]
    ],
    [
      "branch",
      "Branch identifier",
      "text",
      true
    ],
    [
      "mandateReference",
      "Mandate reference",
      "text",
      false
    ]
  ],
  "LED": [
    [
      "journalReference",
      "Journal reference",
      "text",
      true
    ],
    [
      "postingDate",
      "Posting date",
      "date",
      true
    ],
    [
      "debitAccount",
      "Debit GL account",
      "text",
      true
    ],
    [
      "creditAccount",
      "Credit GL account",
      "text",
      true
    ],
    [
      "amountMinor",
      "Amount (minor units)",
      "number",
      true
    ],
    [
      "currency",
      "Currency",
      "select",
      true,
      [
        "XAF",
        "EUR",
        "USD"
      ]
    ],
    [
      "reason",
      "Business reason",
      "textarea",
      true
    ]
  ],
  "BRN": [
    [
      "branchCode",
      "Branch code",
      "text",
      true
    ],
    [
      "tellerId",
      "Teller identifier",
      "text",
      true
    ],
    [
      "transactionType",
      "Transaction type",
      "select",
      true,
      [
        "Deposit",
        "Withdrawal",
        "Transfer",
        "Count"
      ]
    ],
    [
      "cashAmount",
      "Cash amount (minor units)",
      "number",
      true
    ],
    [
      "cashControlReference",
      "Cash control reference",
      "text",
      true
    ]
  ],
  "PAY": [
    [
      "paymentReference",
      "Payment reference",
      "text",
      true
    ],
    [
      "senderAccount",
      "Sender account reference",
      "text",
      true
    ],
    [
      "beneficiaryAccount",
      "Beneficiary account reference",
      "text",
      true
    ],
    [
      "amountMinor",
      "Amount (minor units)",
      "number",
      true
    ],
    [
      "currency",
      "Currency",
      "select",
      true,
      [
        "XAF",
        "EUR",
        "USD"
      ]
    ],
    [
      "rail",
      "Payment rail",
      "select",
      true,
      [
        "Internal",
        "SYSTAC",
        "SYGMA",
        "GIMACPAY"
      ]
    ],
    [
      "purpose",
      "Payment purpose",
      "textarea",
      true
    ]
  ],
  "CRD": [
    [
      "borrowerReference",
      "Borrower reference",
      "text",
      true
    ],
    [
      "creditProduct",
      "Credit product",
      "text",
      true
    ],
    [
      "principalMinor",
      "Principal (minor units)",
      "number",
      true
    ],
    [
      "currency",
      "Currency",
      "select",
      true,
      [
        "XAF",
        "EUR",
        "USD"
      ]
    ],
    [
      "termMonths",
      "Term (months)",
      "number",
      true
    ],
    [
      "repaymentSource",
      "Repayment source",
      "textarea",
      true
    ],
    [
      "collateralReference",
      "Collateral reference",
      "text",
      false
    ]
  ],
  "TRE": [
    [
      "dealReference",
      "Deal reference",
      "text",
      true
    ],
    [
      "counterparty",
      "Counterparty reference",
      "text",
      true
    ],
    [
      "currency",
      "Currency",
      "select",
      true,
      [
        "XAF",
        "EUR",
        "USD"
      ]
    ],
    [
      "notionalMinor",
      "Notional (minor units)",
      "number",
      true
    ],
    [
      "valueDate",
      "Value date",
      "date",
      true
    ]
  ],
  "AML": [
    [
      "caseReference",
      "Case reference",
      "text",
      true
    ],
    [
      "subjectReference",
      "Subject reference",
      "text",
      true
    ],
    [
      "alertType",
      "Alert type",
      "select",
      true,
      [
        "Sanctions",
        "PEP",
        "Transaction monitoring",
        "Unusual behavior"
      ]
    ],
    [
      "riskRating",
      "Risk rating",
      "select",
      true,
      [
        "Low",
        "Medium",
        "High",
        "Critical"
      ]
    ],
    [
      "evidenceReference",
      "Evidence reference",
      "text",
      true
    ],
    [
      "rationale",
      "Investigation rationale",
      "textarea",
      true
    ]
  ],
  "REP": [
    [
      "returnCode",
      "Return code",
      "text",
      true
    ],
    [
      "reportingPeriod",
      "Reporting period",
      "text",
      true
    ],
    [
      "authority",
      "Reporting authority",
      "text",
      true
    ],
    [
      "basis",
      "Reporting basis",
      "text",
      true
    ],
    [
      "dataSetVersion",
      "Dataset version",
      "text",
      true
    ]
  ],
  "CHN": [
    [
      "channelId",
      "Channel identifier",
      "text",
      true
    ],
    [
      "customerReference",
      "Customer reference",
      "text",
      true
    ],
    [
      "deviceReference",
      "Device reference",
      "text",
      false
    ],
    [
      "requestPurpose",
      "Request purpose",
      "textarea",
      true
    ]
  ],
  "CARD": [
    [
      "cardReference",
      "Tokenized card reference",
      "text",
      true
    ],
    [
      "customerReference",
      "Customer reference",
      "text",
      true
    ],
    [
      "cardProduct",
      "Card product",
      "text",
      true
    ],
    [
      "eventReason",
      "Event reason",
      "textarea",
      true
    ]
  ],
  "CRM": [
    [
      "caseReference",
      "Service case reference",
      "text",
      true
    ],
    [
      "customerReference",
      "Customer reference",
      "text",
      true
    ],
    [
      "category",
      "Case category",
      "text",
      true
    ],
    [
      "description",
      "Description",
      "textarea",
      true
    ],
    [
      "priority",
      "Priority",
      "select",
      true,
      [
        "Low",
        "Normal",
        "High",
        "Critical"
      ]
    ]
  ],
  "FEE": [
    [
      "feeCode",
      "Fee code",
      "text",
      true
    ],
    [
      "currency",
      "Currency",
      "select",
      true,
      [
        "XAF",
        "EUR",
        "USD"
      ]
    ],
    [
      "amountMinor",
      "Amount (minor units)",
      "number",
      true
    ],
    [
      "effectiveDate",
      "Effective date",
      "date",
      true
    ],
    [
      "waiverReason",
      "Waiver reason",
      "textarea",
      false
    ]
  ],
  "REC": [
    [
      "reconciliationReference",
      "Reconciliation reference",
      "text",
      true
    ],
    [
      "sourceLedger",
      "Source ledger",
      "text",
      true
    ],
    [
      "statementReference",
      "Statement reference",
      "text",
      true
    ],
    [
      "period",
      "Accounting period",
      "text",
      true
    ],
    [
      "differenceReason",
      "Exception reason",
      "textarea",
      false
    ]
  ],
  "SEC": [
    [
      "principalReference",
      "Principal reference",
      "text",
      true
    ],
    [
      "role",
      "Role or permission",
      "text",
      true
    ],
    [
      "accessScope",
      "Institution scope",
      "text",
      true
    ],
    [
      "reason",
      "Access justification",
      "textarea",
      true
    ],
    [
      "expiry",
      "Requested expiry",
      "date",
      false
    ]
  ],
  "DAT": [
    [
      "sourceSystem",
      "Source system",
      "text",
      true
    ],
    [
      "dataset",
      "Dataset identifier",
      "text",
      true
    ],
    [
      "schemaVersion",
      "Schema version",
      "text",
      true
    ],
    [
      "classification",
      "Classification",
      "select",
      true,
      [
        "Public",
        "Internal",
        "Confidential",
        "Restricted"
      ]
    ],
    [
      "purpose",
      "Processing purpose",
      "textarea",
      true
    ]
  ],
  "API": [
    [
      "integrationId",
      "Integration identifier",
      "text",
      true
    ],
    [
      "partnerId",
      "Partner reference",
      "text",
      true
    ],
    [
      "contractVersion",
      "Contract version",
      "text",
      true
    ],
    [
      "endpoint",
      "Approved endpoint",
      "text",
      true
    ],
    [
      "purpose",
      "Business purpose",
      "textarea",
      true
    ]
  ],
  "INF": [
    [
      "serviceId",
      "Service identifier",
      "text",
      true
    ],
    [
      "environment",
      "Environment",
      "select",
      true,
      [
        "Development",
        "Staging",
        "Production"
      ]
    ],
    [
      "region",
      "Region",
      "text",
      true
    ],
    [
      "changeReference",
      "Change reference",
      "text",
      true
    ]
  ],
  "DR": [
    [
      "scenarioReference",
      "Recovery scenario",
      "text",
      true
    ],
    [
      "system",
      "Affected service",
      "text",
      true
    ],
    [
      "targetRto",
      "RTO (minutes)",
      "number",
      true
    ],
    [
      "targetRpo",
      "RPO (minutes)",
      "number",
      true
    ],
    [
      "evidenceReference",
      "Evidence reference",
      "text",
      true
    ]
  ],
  "ADM": [
    [
      "institutionCode",
      "Institution code",
      "text",
      true
    ],
    [
      "employeeReference",
      "Employee / config reference",
      "text",
      true
    ],
    [
      "effectiveDate",
      "Effective date",
      "date",
      true
    ],
    [
      "reason",
      "Change reason",
      "textarea",
      true
    ]
  ],
  "TST": [
    [
      "testCase",
      "Test case identifier",
      "text",
      true
    ],
    [
      "scope",
      "Test scope",
      "text",
      true
    ],
    [
      "expectedResult",
      "Expected result",
      "textarea",
      true
    ],
    [
      "evidenceReference",
      "Evidence reference",
      "text",
      false
    ]
  ],
  "REL": [
    [
      "releaseId",
      "Release identifier",
      "text",
      true
    ],
    [
      "changeReference",
      "Change reference",
      "text",
      true
    ],
    [
      "environment",
      "Target environment",
      "select",
      true,
      [
        "Development",
        "Staging",
        "Production"
      ]
    ],
    [
      "rollbackPlan",
      "Rollback plan",
      "textarea",
      true
    ]
  ],
  "EDU": [
    [
      "schoolId",
      "Institution/school identifier",
      "text",
      true
    ],
    [
      "courseReference",
      "Course reference",
      "text",
      true
    ],
    [
      "scenarioId",
      "Simulation scenario",
      "text",
      true
    ],
    [
      "instructorReference",
      "Instructor reference",
      "text",
      true
    ],
    [
      "purpose",
      "Learning objective",
      "textarea",
      true
    ]
  ]
};
export const SCREENS = [
  {
    "id": "GOV-UI-001",
    "domain": "GOV",
    "name": "Institution Register",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "GOV-UI-002",
    "domain": "GOV",
    "name": "Policy Approval",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "GOV-UI-003",
    "domain": "GOV",
    "name": "Regulatory Evidence",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "GOV-UI-004",
    "domain": "GOV",
    "name": "Change Control",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ARC-UI-001",
    "domain": "ARC",
    "name": "Architecture Map",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ARC-UI-002",
    "domain": "ARC",
    "name": "Contract Catalog",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ARC-UI-003",
    "domain": "ARC",
    "name": "Dependency Graph",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CIF-UI-001",
    "domain": "CIF",
    "name": "Customer Search",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CIF-UI-002",
    "domain": "CIF",
    "name": "Party Profile",
    "kind": "detail",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CIF-UI-003",
    "domain": "CIF",
    "name": "Kyc Review",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CIF-UI-004",
    "domain": "CIF",
    "name": "Beneficial Owners",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "PRD-UI-001",
    "domain": "PRD",
    "name": "Product Catalog",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "PRD-UI-002",
    "domain": "PRD",
    "name": "Product Builder",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "PRD-UI-003",
    "domain": "PRD",
    "name": "Rate Schedule",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "PRD-UI-004",
    "domain": "PRD",
    "name": "Approval",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ACT-UI-001",
    "domain": "ACT",
    "name": "Accounts List",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ACT-UI-002",
    "domain": "ACT",
    "name": "Account Details",
    "kind": "detail",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ACT-UI-003",
    "domain": "ACT",
    "name": "Mandates",
    "kind": "detail",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ACT-UI-004",
    "domain": "ACT",
    "name": "Holds",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ACT-UI-005",
    "domain": "ACT",
    "name": "Statements",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "LED-UI-001",
    "domain": "LED",
    "name": "Chart Of Accounts",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "LED-UI-002",
    "domain": "LED",
    "name": "Journal Entry",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "LED-UI-003",
    "domain": "LED",
    "name": "Posting Review",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "LED-UI-004",
    "domain": "LED",
    "name": "Trial Balance",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "LED-UI-005",
    "domain": "LED",
    "name": "Period Close",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "BRN-UI-001",
    "domain": "BRN",
    "name": "Branch Overview",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "BRN-UI-002",
    "domain": "BRN",
    "name": "Cash Drawer",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "BRN-UI-003",
    "domain": "BRN",
    "name": "Vault Custody",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "BRN-UI-004",
    "domain": "BRN",
    "name": "Cash Count",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "BRN-UI-005",
    "domain": "BRN",
    "name": "Eod",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "PAY-UI-001",
    "domain": "PAY",
    "name": "Payment Workbench",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "PAY-UI-002",
    "domain": "PAY",
    "name": "Transfers",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "PAY-UI-003",
    "domain": "PAY",
    "name": "Rail Status",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "PAY-UI-004",
    "domain": "PAY",
    "name": "Returns",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "PAY-UI-005",
    "domain": "PAY",
    "name": "Settlement",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CRD-UI-001",
    "domain": "CRD",
    "name": "Credit Pipeline",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CRD-UI-002",
    "domain": "CRD",
    "name": "Underwriting",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CRD-UI-003",
    "domain": "CRD",
    "name": "Facility",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CRD-UI-004",
    "domain": "CRD",
    "name": "Collateral",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CRD-UI-005",
    "domain": "CRD",
    "name": "Collections",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "TRE-UI-001",
    "domain": "TRE",
    "name": "Treasury Dashboard",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "TRE-UI-002",
    "domain": "TRE",
    "name": "Fx Deals",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "TRE-UI-003",
    "domain": "TRE",
    "name": "Liquidity",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "TRE-UI-004",
    "domain": "TRE",
    "name": "Nostro",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "TRE-UI-005",
    "domain": "TRE",
    "name": "Limits",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "AML-UI-001",
    "domain": "AML",
    "name": "Alerts",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "AML-UI-002",
    "domain": "AML",
    "name": "Screening",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "AML-UI-003",
    "domain": "AML",
    "name": "Case Review",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "AML-UI-004",
    "domain": "AML",
    "name": "Risk Rules",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "AML-UI-005",
    "domain": "AML",
    "name": "Escalations",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REP-UI-001",
    "domain": "REP",
    "name": "Returns Catalog",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REP-UI-002",
    "domain": "REP",
    "name": "Report Run",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REP-UI-003",
    "domain": "REP",
    "name": "Reconciliation",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REP-UI-004",
    "domain": "REP",
    "name": "Submission",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REP-UI-005",
    "domain": "REP",
    "name": "Receipts",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CHN-UI-001",
    "domain": "CHN",
    "name": "Channel Admin",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CHN-UI-002",
    "domain": "CHN",
    "name": "Devices",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CHN-UI-003",
    "domain": "CHN",
    "name": "Beneficiaries",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CHN-UI-004",
    "domain": "CHN",
    "name": "Corporate Approvals",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CARD-UI-001",
    "domain": "CARD",
    "name": "Card Portfolio",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CARD-UI-002",
    "domain": "CARD",
    "name": "Authorization",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CARD-UI-003",
    "domain": "CARD",
    "name": "Disputes",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CARD-UI-004",
    "domain": "CARD",
    "name": "Scheme Files",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CRM-UI-001",
    "domain": "CRM",
    "name": "Service Inbox",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CRM-UI-002",
    "domain": "CRM",
    "name": "Complaints",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CRM-UI-003",
    "domain": "CRM",
    "name": "Case Details",
    "kind": "detail",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "CRM-UI-004",
    "domain": "CRM",
    "name": "Sla Monitor",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "FEE-UI-001",
    "domain": "FEE",
    "name": "Fee Catalog",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "FEE-UI-002",
    "domain": "FEE",
    "name": "Accrual Workbench",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "FEE-UI-003",
    "domain": "FEE",
    "name": "Tax Rules",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "FEE-UI-004",
    "domain": "FEE",
    "name": "Waivers",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REC-UI-001",
    "domain": "REC",
    "name": "Reconciliation Dashboard",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REC-UI-002",
    "domain": "REC",
    "name": "Statement Import",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REC-UI-003",
    "domain": "REC",
    "name": "Exceptions",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REC-UI-004",
    "domain": "REC",
    "name": "Suspense",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "SEC-UI-001",
    "domain": "SEC",
    "name": "Access Admin",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "SEC-UI-002",
    "domain": "SEC",
    "name": "Role Matrix",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "SEC-UI-003",
    "domain": "SEC",
    "name": "Privileged Approvals",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "SEC-UI-004",
    "domain": "SEC",
    "name": "Audit Log",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "DAT-UI-001",
    "domain": "DAT",
    "name": "Data Catalog",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "DAT-UI-002",
    "domain": "DAT",
    "name": "Mapping Studio",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "DAT-UI-003",
    "domain": "DAT",
    "name": "Migration Runs",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "DAT-UI-004",
    "domain": "DAT",
    "name": "Quality",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "API-UI-001",
    "domain": "API",
    "name": "Integration Catalog",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "API-UI-002",
    "domain": "API",
    "name": "Connection Health",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "API-UI-003",
    "domain": "API",
    "name": "Contracts",
    "kind": "detail",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "API-UI-004",
    "domain": "API",
    "name": "Webhooks",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "INF-UI-001",
    "domain": "INF",
    "name": "Environment Status",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "INF-UI-002",
    "domain": "INF",
    "name": "Release Pipeline",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "INF-UI-003",
    "domain": "INF",
    "name": "Vulnerabilities",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "INF-UI-004",
    "domain": "INF",
    "name": "Logs",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "DR-UI-001",
    "domain": "DR",
    "name": "Backup Health",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "DR-UI-002",
    "domain": "DR",
    "name": "Restore Test",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "DR-UI-003",
    "domain": "DR",
    "name": "Dr Drills",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "DR-UI-004",
    "domain": "DR",
    "name": "Failover",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ADM-UI-001",
    "domain": "ADM",
    "name": "Bank Settings",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ADM-UI-002",
    "domain": "ADM",
    "name": "Limits",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ADM-UI-003",
    "domain": "ADM",
    "name": "Feature Flags",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "ADM-UI-004",
    "domain": "ADM",
    "name": "Approval Queue",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "TST-UI-001",
    "domain": "TST",
    "name": "Test Catalog",
    "kind": "register",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "TST-UI-002",
    "domain": "TST",
    "name": "Test Runs",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "TST-UI-003",
    "domain": "TST",
    "name": "Findings",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "TST-UI-004",
    "domain": "TST",
    "name": "Coverage",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REL-UI-001",
    "domain": "REL",
    "name": "Release Dashboard",
    "kind": "review",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REL-UI-002",
    "domain": "REL",
    "name": "Readiness",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REL-UI-003",
    "domain": "REL",
    "name": "Pilot Monitor",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "REL-UI-004",
    "domain": "REL",
    "name": "Rollback",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "EDU-UI-001",
    "domain": "EDU",
    "name": "Instructor Dashboard",
    "kind": "monitor",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "EDU-UI-002",
    "domain": "EDU",
    "name": "Scenario Builder",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "EDU-UI-003",
    "domain": "EDU",
    "name": "Virtual Bank",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "EDU-UI-004",
    "domain": "EDU",
    "name": "Student Workbench",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "EDU-UI-005",
    "domain": "EDU",
    "name": "Lab Audit",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "EDU-UI-006",
    "domain": "EDU",
    "name": "Assessment",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "EDU-UI-007",
    "domain": "EDU",
    "name": "Competency Passport",
    "kind": "workbench",
    "source": "CANONICAL_DRAFT"
  },
  {
    "id": "GOV-EXP-001",
    "domain": "GOV",
    "name": "Institution charter — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-002",
    "domain": "GOV",
    "name": "Bank licence — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-003",
    "domain": "GOV",
    "name": "Regulatory obligations — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-004",
    "domain": "GOV",
    "name": "Policy library — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-005",
    "domain": "GOV",
    "name": "Board resolution — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-006",
    "domain": "GOV",
    "name": "Approval mandate — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-007",
    "domain": "GOV",
    "name": "Delegation of authority — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-008",
    "domain": "GOV",
    "name": "Change request — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-009",
    "domain": "GOV",
    "name": "Evidence register — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-010",
    "domain": "GOV",
    "name": "Control exception — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-011",
    "domain": "GOV",
    "name": "Audit committee — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-012",
    "domain": "GOV",
    "name": "Institution charter — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-013",
    "domain": "GOV",
    "name": "Bank licence — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "GOV-EXP-014",
    "domain": "GOV",
    "name": "Regulatory obligations — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-001",
    "domain": "ARC",
    "name": "Bounded context map — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-002",
    "domain": "ARC",
    "name": "Integration dependency — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-003",
    "domain": "ARC",
    "name": "Architecture decision — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-004",
    "domain": "ARC",
    "name": "Service ownership — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-005",
    "domain": "ARC",
    "name": "Event catalog — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-006",
    "domain": "ARC",
    "name": "Contract version — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-007",
    "domain": "ARC",
    "name": "System boundary — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-008",
    "domain": "ARC",
    "name": "Data flow — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-009",
    "domain": "ARC",
    "name": "Compatibility assessment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-010",
    "domain": "ARC",
    "name": "Infrastructure topology — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ARC-EXP-011",
    "domain": "ARC",
    "name": "Bounded context map — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-001",
    "domain": "CIF",
    "name": "Customer onboarding — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-002",
    "domain": "CIF",
    "name": "Individual identity — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-003",
    "domain": "CIF",
    "name": "Corporate identity — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-004",
    "domain": "CIF",
    "name": "Joint holders — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-005",
    "domain": "CIF",
    "name": "Beneficial ownership — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-006",
    "domain": "CIF",
    "name": "Tax residency — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-007",
    "domain": "CIF",
    "name": "PEP review — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-008",
    "domain": "CIF",
    "name": "Sanctions screening — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-009",
    "domain": "CIF",
    "name": "Identity document — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-010",
    "domain": "CIF",
    "name": "Customer consent — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-011",
    "domain": "CIF",
    "name": "Customer profile — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-012",
    "domain": "CIF",
    "name": "Address verification — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-013",
    "domain": "CIF",
    "name": "Customer segmentation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-014",
    "domain": "CIF",
    "name": "Duplicate resolution — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-015",
    "domain": "CIF",
    "name": "Customer merge — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-016",
    "domain": "CIF",
    "name": "Risk classification — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-017",
    "domain": "CIF",
    "name": "Employment evidence — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-018",
    "domain": "CIF",
    "name": "Source of funds — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-019",
    "domain": "CIF",
    "name": "Periodic KYC — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-020",
    "domain": "CIF",
    "name": "Customer offboarding — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-021",
    "domain": "CIF",
    "name": "Customer onboarding — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-022",
    "domain": "CIF",
    "name": "Individual identity — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-023",
    "domain": "CIF",
    "name": "Corporate identity — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-024",
    "domain": "CIF",
    "name": "Joint holders — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-025",
    "domain": "CIF",
    "name": "Beneficial ownership — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-026",
    "domain": "CIF",
    "name": "Tax residency — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-027",
    "domain": "CIF",
    "name": "PEP review — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-028",
    "domain": "CIF",
    "name": "Sanctions screening — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-029",
    "domain": "CIF",
    "name": "Identity document — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-030",
    "domain": "CIF",
    "name": "Customer consent — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-031",
    "domain": "CIF",
    "name": "Customer profile — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-032",
    "domain": "CIF",
    "name": "Address verification — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-033",
    "domain": "CIF",
    "name": "Customer segmentation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-034",
    "domain": "CIF",
    "name": "Duplicate resolution — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-035",
    "domain": "CIF",
    "name": "Customer merge — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CIF-EXP-036",
    "domain": "CIF",
    "name": "Risk classification — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-001",
    "domain": "PRD",
    "name": "Deposit product — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-002",
    "domain": "PRD",
    "name": "Savings plan — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-003",
    "domain": "PRD",
    "name": "Current account product — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-004",
    "domain": "PRD",
    "name": "Term deposit product — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-005",
    "domain": "PRD",
    "name": "Loan product — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-006",
    "domain": "PRD",
    "name": "Pricing calendar — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-007",
    "domain": "PRD",
    "name": "Interest rule — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-008",
    "domain": "PRD",
    "name": "Fee rule — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-009",
    "domain": "PRD",
    "name": "Eligibility rule — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-010",
    "domain": "PRD",
    "name": "Product version — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-011",
    "domain": "PRD",
    "name": "Product release — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-012",
    "domain": "PRD",
    "name": "Product retirement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-013",
    "domain": "PRD",
    "name": "Product simulation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-014",
    "domain": "PRD",
    "name": "Effective-date policy — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-015",
    "domain": "PRD",
    "name": "Product approval — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-016",
    "domain": "PRD",
    "name": "Deposit product — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-017",
    "domain": "PRD",
    "name": "Savings plan — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-018",
    "domain": "PRD",
    "name": "Current account product — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-019",
    "domain": "PRD",
    "name": "Term deposit product — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-020",
    "domain": "PRD",
    "name": "Loan product — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-021",
    "domain": "PRD",
    "name": "Pricing calendar — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-022",
    "domain": "PRD",
    "name": "Interest rule — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-023",
    "domain": "PRD",
    "name": "Fee rule — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PRD-EXP-024",
    "domain": "PRD",
    "name": "Eligibility rule — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-001",
    "domain": "ACT",
    "name": "Account opening — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-002",
    "domain": "ACT",
    "name": "Account ownership — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-003",
    "domain": "ACT",
    "name": "Account balance — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-004",
    "domain": "ACT",
    "name": "Account statement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-005",
    "domain": "ACT",
    "name": "Account mandate — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-006",
    "domain": "ACT",
    "name": "Account freeze — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-007",
    "domain": "ACT",
    "name": "Account lien — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-008",
    "domain": "ACT",
    "name": "Dormant account — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-009",
    "domain": "ACT",
    "name": "Account closure — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-010",
    "domain": "ACT",
    "name": "Savings contribution — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-011",
    "domain": "ACT",
    "name": "Interest accrual — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-012",
    "domain": "ACT",
    "name": "Term deposit booking — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-013",
    "domain": "ACT",
    "name": "Deposit maturity — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-014",
    "domain": "ACT",
    "name": "Account reactivation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-015",
    "domain": "ACT",
    "name": "Standing instruction — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-016",
    "domain": "ACT",
    "name": "Account beneficiary — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-017",
    "domain": "ACT",
    "name": "Account overdraft — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-018",
    "domain": "ACT",
    "name": "Account conversion — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-019",
    "domain": "ACT",
    "name": "Limit adjustment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-020",
    "domain": "ACT",
    "name": "Account reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-021",
    "domain": "ACT",
    "name": "Account opening — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-022",
    "domain": "ACT",
    "name": "Account ownership — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-023",
    "domain": "ACT",
    "name": "Account balance — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-024",
    "domain": "ACT",
    "name": "Account statement — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-025",
    "domain": "ACT",
    "name": "Account mandate — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-026",
    "domain": "ACT",
    "name": "Account freeze — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-027",
    "domain": "ACT",
    "name": "Account lien — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-028",
    "domain": "ACT",
    "name": "Dormant account — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-029",
    "domain": "ACT",
    "name": "Account closure — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-030",
    "domain": "ACT",
    "name": "Savings contribution — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-031",
    "domain": "ACT",
    "name": "Interest accrual — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-032",
    "domain": "ACT",
    "name": "Term deposit booking — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-033",
    "domain": "ACT",
    "name": "Deposit maturity — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-034",
    "domain": "ACT",
    "name": "Account reactivation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-035",
    "domain": "ACT",
    "name": "Standing instruction — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-036",
    "domain": "ACT",
    "name": "Account beneficiary — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-037",
    "domain": "ACT",
    "name": "Account overdraft — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-038",
    "domain": "ACT",
    "name": "Account conversion — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-039",
    "domain": "ACT",
    "name": "Limit adjustment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-040",
    "domain": "ACT",
    "name": "Account reconciliation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-041",
    "domain": "ACT",
    "name": "Account opening — Review",
    "kind": "review",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-042",
    "domain": "ACT",
    "name": "Account ownership — Review",
    "kind": "review",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-043",
    "domain": "ACT",
    "name": "Account balance — Review",
    "kind": "review",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-044",
    "domain": "ACT",
    "name": "Account statement — Review",
    "kind": "review",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ACT-EXP-045",
    "domain": "ACT",
    "name": "Account mandate — Review",
    "kind": "review",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-001",
    "domain": "LED",
    "name": "Chart of accounts — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-002",
    "domain": "LED",
    "name": "Journal capture — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-003",
    "domain": "LED",
    "name": "Journal posting — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-004",
    "domain": "LED",
    "name": "Journal reversal — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-005",
    "domain": "LED",
    "name": "Balance projection — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-006",
    "domain": "LED",
    "name": "Ledger inquiry — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-007",
    "domain": "LED",
    "name": "Trial balance — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-008",
    "domain": "LED",
    "name": "Period close — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-009",
    "domain": "LED",
    "name": "Accrual adjustment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-010",
    "domain": "LED",
    "name": "Suspense account — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-011",
    "domain": "LED",
    "name": "Accounting mapping — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-012",
    "domain": "LED",
    "name": "Posting rules — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-013",
    "domain": "LED",
    "name": "Journal exception — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-014",
    "domain": "LED",
    "name": "Multi-currency entry — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-015",
    "domain": "LED",
    "name": "Financial reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-016",
    "domain": "LED",
    "name": "PCEC mapping — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-017",
    "domain": "LED",
    "name": "Open-item clearing — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-018",
    "domain": "LED",
    "name": "Audit voucher — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-019",
    "domain": "LED",
    "name": "Fiscal calendar — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-020",
    "domain": "LED",
    "name": "Chart of accounts — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-021",
    "domain": "LED",
    "name": "Journal capture — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-022",
    "domain": "LED",
    "name": "Journal posting — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-023",
    "domain": "LED",
    "name": "Journal reversal — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-024",
    "domain": "LED",
    "name": "Balance projection — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-025",
    "domain": "LED",
    "name": "Ledger inquiry — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-026",
    "domain": "LED",
    "name": "Trial balance — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-027",
    "domain": "LED",
    "name": "Period close — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-028",
    "domain": "LED",
    "name": "Accrual adjustment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-029",
    "domain": "LED",
    "name": "Suspense account — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-030",
    "domain": "LED",
    "name": "Accounting mapping — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-031",
    "domain": "LED",
    "name": "Posting rules — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-032",
    "domain": "LED",
    "name": "Journal exception — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-033",
    "domain": "LED",
    "name": "Multi-currency entry — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-034",
    "domain": "LED",
    "name": "Financial reconciliation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "LED-EXP-035",
    "domain": "LED",
    "name": "PCEC mapping — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-001",
    "domain": "BRN",
    "name": "Teller session — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-002",
    "domain": "BRN",
    "name": "Cash deposit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-003",
    "domain": "BRN",
    "name": "Cash withdrawal — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-004",
    "domain": "BRN",
    "name": "Cash drawer — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-005",
    "domain": "BRN",
    "name": "Cash denomination — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-006",
    "domain": "BRN",
    "name": "Vault handover — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-007",
    "domain": "BRN",
    "name": "Cash shipment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-008",
    "domain": "BRN",
    "name": "Branch reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-009",
    "domain": "BRN",
    "name": "Teller exception — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-010",
    "domain": "BRN",
    "name": "Branch opening — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-011",
    "domain": "BRN",
    "name": "Branch closing — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-012",
    "domain": "BRN",
    "name": "EOD checklist — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-013",
    "domain": "BRN",
    "name": "Cash difference — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-014",
    "domain": "BRN",
    "name": "Branch limit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-015",
    "domain": "BRN",
    "name": "Cheque handling — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-016",
    "domain": "BRN",
    "name": "Agent cash — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-017",
    "domain": "BRN",
    "name": "Cash transfer — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-018",
    "domain": "BRN",
    "name": "Teller session — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-019",
    "domain": "BRN",
    "name": "Cash deposit — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-020",
    "domain": "BRN",
    "name": "Cash withdrawal — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-021",
    "domain": "BRN",
    "name": "Cash drawer — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-022",
    "domain": "BRN",
    "name": "Cash denomination — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-023",
    "domain": "BRN",
    "name": "Vault handover — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-024",
    "domain": "BRN",
    "name": "Cash shipment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-025",
    "domain": "BRN",
    "name": "Branch reconciliation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-026",
    "domain": "BRN",
    "name": "Teller exception — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-027",
    "domain": "BRN",
    "name": "Branch opening — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-028",
    "domain": "BRN",
    "name": "Branch closing — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-029",
    "domain": "BRN",
    "name": "EOD checklist — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "BRN-EXP-030",
    "domain": "BRN",
    "name": "Cash difference — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-001",
    "domain": "PAY",
    "name": "Transfer initiation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-002",
    "domain": "PAY",
    "name": "Beneficiary validation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-003",
    "domain": "PAY",
    "name": "Internal transfer — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-004",
    "domain": "PAY",
    "name": "Domestic clearing — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-005",
    "domain": "PAY",
    "name": "International transfer — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-006",
    "domain": "PAY",
    "name": "Payment batch — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-007",
    "domain": "PAY",
    "name": "Payment instruction — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-008",
    "domain": "PAY",
    "name": "Payment exception — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-009",
    "domain": "PAY",
    "name": "Rail configuration — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-010",
    "domain": "PAY",
    "name": "SYSTAC settlement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-011",
    "domain": "PAY",
    "name": "SYGMA settlement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-012",
    "domain": "PAY",
    "name": "GIMACPAY instruction — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-013",
    "domain": "PAY",
    "name": "Settlement account — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-014",
    "domain": "PAY",
    "name": "Payment recall — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-015",
    "domain": "PAY",
    "name": "Payment return — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-016",
    "domain": "PAY",
    "name": "Payment finality — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-017",
    "domain": "PAY",
    "name": "Unknown outcome — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-018",
    "domain": "PAY",
    "name": "Liquidity gate — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-019",
    "domain": "PAY",
    "name": "Standing transfer — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-020",
    "domain": "PAY",
    "name": "Direct debit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-021",
    "domain": "PAY",
    "name": "Payment dispute — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-022",
    "domain": "PAY",
    "name": "ISO 20022 mapping — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-023",
    "domain": "PAY",
    "name": "Transfer initiation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-024",
    "domain": "PAY",
    "name": "Beneficiary validation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-025",
    "domain": "PAY",
    "name": "Internal transfer — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-026",
    "domain": "PAY",
    "name": "Domestic clearing — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-027",
    "domain": "PAY",
    "name": "International transfer — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-028",
    "domain": "PAY",
    "name": "Payment batch — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-029",
    "domain": "PAY",
    "name": "Payment instruction — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-030",
    "domain": "PAY",
    "name": "Payment exception — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-031",
    "domain": "PAY",
    "name": "Rail configuration — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-032",
    "domain": "PAY",
    "name": "SYSTAC settlement — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-033",
    "domain": "PAY",
    "name": "SYGMA settlement — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-034",
    "domain": "PAY",
    "name": "GIMACPAY instruction — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-035",
    "domain": "PAY",
    "name": "Settlement account — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-036",
    "domain": "PAY",
    "name": "Payment recall — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-037",
    "domain": "PAY",
    "name": "Payment return — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-038",
    "domain": "PAY",
    "name": "Payment finality — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-039",
    "domain": "PAY",
    "name": "Unknown outcome — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-040",
    "domain": "PAY",
    "name": "Liquidity gate — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-041",
    "domain": "PAY",
    "name": "Standing transfer — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-042",
    "domain": "PAY",
    "name": "Direct debit — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-043",
    "domain": "PAY",
    "name": "Payment dispute — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-044",
    "domain": "PAY",
    "name": "ISO 20022 mapping — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "PAY-EXP-045",
    "domain": "PAY",
    "name": "Transfer initiation — Review",
    "kind": "review",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-001",
    "domain": "CRD",
    "name": "Credit application — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-002",
    "domain": "CRD",
    "name": "Borrower assessment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-003",
    "domain": "CRD",
    "name": "Credit scoring — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-004",
    "domain": "CRD",
    "name": "Affordability analysis — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-005",
    "domain": "CRD",
    "name": "Loan underwriting — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-006",
    "domain": "CRD",
    "name": "Credit committee — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-007",
    "domain": "CRD",
    "name": "Loan facility — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-008",
    "domain": "CRD",
    "name": "Loan disbursement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-009",
    "domain": "CRD",
    "name": "Repayment schedule — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-010",
    "domain": "CRD",
    "name": "Repayment posting — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-011",
    "domain": "CRD",
    "name": "Early repayment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-012",
    "domain": "CRD",
    "name": "Loan restructuring — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-013",
    "domain": "CRD",
    "name": "Credit limit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-014",
    "domain": "CRD",
    "name": "Arrears management — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-015",
    "domain": "CRD",
    "name": "Collection case — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-016",
    "domain": "CRD",
    "name": "Credit impairment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-017",
    "domain": "CRD",
    "name": "Guarantor assessment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-018",
    "domain": "CRD",
    "name": "Collateral appraisal — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-019",
    "domain": "CRD",
    "name": "Covenant compliance — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-020",
    "domain": "CRD",
    "name": "Loan write-off — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-021",
    "domain": "CRD",
    "name": "NPL recovery — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-022",
    "domain": "CRD",
    "name": "Credit renewal — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-023",
    "domain": "CRD",
    "name": "Credit application — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-024",
    "domain": "CRD",
    "name": "Borrower assessment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-025",
    "domain": "CRD",
    "name": "Credit scoring — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-026",
    "domain": "CRD",
    "name": "Affordability analysis — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-027",
    "domain": "CRD",
    "name": "Loan underwriting — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-028",
    "domain": "CRD",
    "name": "Credit committee — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-029",
    "domain": "CRD",
    "name": "Loan facility — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-030",
    "domain": "CRD",
    "name": "Loan disbursement — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-031",
    "domain": "CRD",
    "name": "Repayment schedule — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-032",
    "domain": "CRD",
    "name": "Repayment posting — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-033",
    "domain": "CRD",
    "name": "Early repayment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-034",
    "domain": "CRD",
    "name": "Loan restructuring — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-035",
    "domain": "CRD",
    "name": "Credit limit — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-036",
    "domain": "CRD",
    "name": "Arrears management — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-037",
    "domain": "CRD",
    "name": "Collection case — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-038",
    "domain": "CRD",
    "name": "Credit impairment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-039",
    "domain": "CRD",
    "name": "Guarantor assessment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-040",
    "domain": "CRD",
    "name": "Collateral appraisal — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-041",
    "domain": "CRD",
    "name": "Covenant compliance — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-042",
    "domain": "CRD",
    "name": "Loan write-off — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-043",
    "domain": "CRD",
    "name": "NPL recovery — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-044",
    "domain": "CRD",
    "name": "Credit renewal — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRD-EXP-045",
    "domain": "CRD",
    "name": "Credit application — Review",
    "kind": "review",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-001",
    "domain": "TRE",
    "name": "Liquidity position — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-002",
    "domain": "TRE",
    "name": "Intraday funding — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-003",
    "domain": "TRE",
    "name": "Treasury deal — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-004",
    "domain": "TRE",
    "name": "FX spot — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-005",
    "domain": "TRE",
    "name": "FX forward — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-006",
    "domain": "TRE",
    "name": "Nostro balance — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-007",
    "domain": "TRE",
    "name": "Interbank placement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-008",
    "domain": "TRE",
    "name": "Money market — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-009",
    "domain": "TRE",
    "name": "Securities holding — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-010",
    "domain": "TRE",
    "name": "Maturity ladder — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-011",
    "domain": "TRE",
    "name": "Interest rate risk — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-012",
    "domain": "TRE",
    "name": "Counterparty limit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-013",
    "domain": "TRE",
    "name": "Treasury settlement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-014",
    "domain": "TRE",
    "name": "Funding forecast — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-015",
    "domain": "TRE",
    "name": "Treasury reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-016",
    "domain": "TRE",
    "name": "Liquidity position — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-017",
    "domain": "TRE",
    "name": "Intraday funding — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-018",
    "domain": "TRE",
    "name": "Treasury deal — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-019",
    "domain": "TRE",
    "name": "FX spot — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-020",
    "domain": "TRE",
    "name": "FX forward — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-021",
    "domain": "TRE",
    "name": "Nostro balance — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-022",
    "domain": "TRE",
    "name": "Interbank placement — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-023",
    "domain": "TRE",
    "name": "Money market — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-024",
    "domain": "TRE",
    "name": "Securities holding — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TRE-EXP-025",
    "domain": "TRE",
    "name": "Maturity ladder — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-001",
    "domain": "AML",
    "name": "AML alert — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-002",
    "domain": "AML",
    "name": "Watchlist hit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-003",
    "domain": "AML",
    "name": "Sanctions case — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-004",
    "domain": "AML",
    "name": "Enhanced diligence — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-005",
    "domain": "AML",
    "name": "Transaction monitoring — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-006",
    "domain": "AML",
    "name": "Suspicious activity — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-007",
    "domain": "AML",
    "name": "Source of wealth — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-008",
    "domain": "AML",
    "name": "Case escalation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-009",
    "domain": "AML",
    "name": "Risk scoring — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-010",
    "domain": "AML",
    "name": "Rule calibration — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-011",
    "domain": "AML",
    "name": "Regulatory filing — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-012",
    "domain": "AML",
    "name": "Investigation evidence — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-013",
    "domain": "AML",
    "name": "Compliance attestation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-014",
    "domain": "AML",
    "name": "PEP monitoring — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-015",
    "domain": "AML",
    "name": "Alert suppression — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-016",
    "domain": "AML",
    "name": "Customer risk — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-017",
    "domain": "AML",
    "name": "Compliance exception — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-018",
    "domain": "AML",
    "name": "Case closure — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-019",
    "domain": "AML",
    "name": "AML alert — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-020",
    "domain": "AML",
    "name": "Watchlist hit — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-021",
    "domain": "AML",
    "name": "Sanctions case — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-022",
    "domain": "AML",
    "name": "Enhanced diligence — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-023",
    "domain": "AML",
    "name": "Transaction monitoring — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-024",
    "domain": "AML",
    "name": "Suspicious activity — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-025",
    "domain": "AML",
    "name": "Source of wealth — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-026",
    "domain": "AML",
    "name": "Case escalation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-027",
    "domain": "AML",
    "name": "Risk scoring — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-028",
    "domain": "AML",
    "name": "Rule calibration — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-029",
    "domain": "AML",
    "name": "Regulatory filing — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-030",
    "domain": "AML",
    "name": "Investigation evidence — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-031",
    "domain": "AML",
    "name": "Compliance attestation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-032",
    "domain": "AML",
    "name": "PEP monitoring — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "AML-EXP-033",
    "domain": "AML",
    "name": "Alert suppression — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-001",
    "domain": "REP",
    "name": "Regulatory return — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-002",
    "domain": "REP",
    "name": "Prudential ratio — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-003",
    "domain": "REP",
    "name": "Capital adequacy — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-004",
    "domain": "REP",
    "name": "Liquidity coverage — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-005",
    "domain": "REP",
    "name": "Large exposure — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-006",
    "domain": "REP",
    "name": "Asset classification — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-007",
    "domain": "REP",
    "name": "Loan loss provision — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-008",
    "domain": "REP",
    "name": "Reporting calendar — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-009",
    "domain": "REP",
    "name": "Reporting dataset — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-010",
    "domain": "REP",
    "name": "Return validation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-011",
    "domain": "REP",
    "name": "Regulatory mapping — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-012",
    "domain": "REP",
    "name": "Submission package — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-013",
    "domain": "REP",
    "name": "Regulator acknowledgment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-014",
    "domain": "REP",
    "name": "Supervisory exception — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-015",
    "domain": "REP",
    "name": "Management certification — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-016",
    "domain": "REP",
    "name": "Statutory disclosure — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-017",
    "domain": "REP",
    "name": "Report archive — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-018",
    "domain": "REP",
    "name": "Regulatory change — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-019",
    "domain": "REP",
    "name": "Regulatory return — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-020",
    "domain": "REP",
    "name": "Prudential ratio — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-021",
    "domain": "REP",
    "name": "Capital adequacy — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-022",
    "domain": "REP",
    "name": "Liquidity coverage — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-023",
    "domain": "REP",
    "name": "Large exposure — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-024",
    "domain": "REP",
    "name": "Asset classification — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-025",
    "domain": "REP",
    "name": "Loan loss provision — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-026",
    "domain": "REP",
    "name": "Reporting calendar — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-027",
    "domain": "REP",
    "name": "Reporting dataset — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-028",
    "domain": "REP",
    "name": "Return validation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-029",
    "domain": "REP",
    "name": "Regulatory mapping — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-030",
    "domain": "REP",
    "name": "Submission package — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-031",
    "domain": "REP",
    "name": "Regulator acknowledgment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-032",
    "domain": "REP",
    "name": "Supervisory exception — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REP-EXP-033",
    "domain": "REP",
    "name": "Management certification — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-001",
    "domain": "CHN",
    "name": "Mobile enrollment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-002",
    "domain": "CHN",
    "name": "Web enrollment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-003",
    "domain": "CHN",
    "name": "Device binding — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-004",
    "domain": "CHN",
    "name": "Beneficiary enrollment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-005",
    "domain": "CHN",
    "name": "Transfer request — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-006",
    "domain": "CHN",
    "name": "Bill payment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-007",
    "domain": "CHN",
    "name": "Wallet link — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-008",
    "domain": "CHN",
    "name": "Agent registration — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-009",
    "domain": "CHN",
    "name": "Agent transaction — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-010",
    "domain": "CHN",
    "name": "Customer notification — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-011",
    "domain": "CHN",
    "name": "Online statement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-012",
    "domain": "CHN",
    "name": "Customer limit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-013",
    "domain": "CHN",
    "name": "Transaction verification — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-014",
    "domain": "CHN",
    "name": "Corporate mandate — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-015",
    "domain": "CHN",
    "name": "Bulk payroll transfer — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-016",
    "domain": "CHN",
    "name": "Merchant channel — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-017",
    "domain": "CHN",
    "name": "Session management — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-018",
    "domain": "CHN",
    "name": "Channel dispute — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-019",
    "domain": "CHN",
    "name": "Mobile enrollment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-020",
    "domain": "CHN",
    "name": "Web enrollment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-021",
    "domain": "CHN",
    "name": "Device binding — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-022",
    "domain": "CHN",
    "name": "Beneficiary enrollment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-023",
    "domain": "CHN",
    "name": "Transfer request — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-024",
    "domain": "CHN",
    "name": "Bill payment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-025",
    "domain": "CHN",
    "name": "Wallet link — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-026",
    "domain": "CHN",
    "name": "Agent registration — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-027",
    "domain": "CHN",
    "name": "Agent transaction — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-028",
    "domain": "CHN",
    "name": "Customer notification — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-029",
    "domain": "CHN",
    "name": "Online statement — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-030",
    "domain": "CHN",
    "name": "Customer limit — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CHN-EXP-031",
    "domain": "CHN",
    "name": "Transaction verification — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-001",
    "domain": "CARD",
    "name": "Card issuance — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-002",
    "domain": "CARD",
    "name": "Card lifecycle — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-003",
    "domain": "CARD",
    "name": "Card activation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-004",
    "domain": "CARD",
    "name": "PIN management — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-005",
    "domain": "CARD",
    "name": "Card limit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-006",
    "domain": "CARD",
    "name": "ATM reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-007",
    "domain": "CARD",
    "name": "Authorization hold — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-008",
    "domain": "CARD",
    "name": "Card transaction — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-009",
    "domain": "CARD",
    "name": "Chargeback — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-010",
    "domain": "CARD",
    "name": "Card dispute — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-011",
    "domain": "CARD",
    "name": "Card replacement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-012",
    "domain": "CARD",
    "name": "Card fraud case — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-013",
    "domain": "CARD",
    "name": "Scheme settlement — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-014",
    "domain": "CARD",
    "name": "Card fee — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-015",
    "domain": "CARD",
    "name": "Terminal enrollment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-016",
    "domain": "CARD",
    "name": "Card issuance — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-017",
    "domain": "CARD",
    "name": "Card lifecycle — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-018",
    "domain": "CARD",
    "name": "Card activation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-019",
    "domain": "CARD",
    "name": "PIN management — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-020",
    "domain": "CARD",
    "name": "Card limit — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-021",
    "domain": "CARD",
    "name": "ATM reconciliation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-022",
    "domain": "CARD",
    "name": "Authorization hold — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-023",
    "domain": "CARD",
    "name": "Card transaction — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CARD-EXP-024",
    "domain": "CARD",
    "name": "Chargeback — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-001",
    "domain": "CRM",
    "name": "Customer request — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-002",
    "domain": "CRM",
    "name": "Complaints intake — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-003",
    "domain": "CRM",
    "name": "Service case — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-004",
    "domain": "CRM",
    "name": "Customer correspondence — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-005",
    "domain": "CRM",
    "name": "Contact preferences — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-006",
    "domain": "CRM",
    "name": "Service-level monitoring — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-007",
    "domain": "CRM",
    "name": "Call log — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-008",
    "domain": "CRM",
    "name": "Branch appointment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-009",
    "domain": "CRM",
    "name": "Dispute escalation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-010",
    "domain": "CRM",
    "name": "Case assignment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-011",
    "domain": "CRM",
    "name": "Complaint resolution — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-012",
    "domain": "CRM",
    "name": "Customer notification — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-013",
    "domain": "CRM",
    "name": "Customer request — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-014",
    "domain": "CRM",
    "name": "Complaints intake — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-015",
    "domain": "CRM",
    "name": "Service case — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-016",
    "domain": "CRM",
    "name": "Customer correspondence — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-017",
    "domain": "CRM",
    "name": "Contact preferences — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-018",
    "domain": "CRM",
    "name": "Service-level monitoring — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-019",
    "domain": "CRM",
    "name": "Call log — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "CRM-EXP-020",
    "domain": "CRM",
    "name": "Branch appointment — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-001",
    "domain": "FEE",
    "name": "Fee schedule — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-002",
    "domain": "FEE",
    "name": "Fee accrual — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-003",
    "domain": "FEE",
    "name": "Fee posting — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-004",
    "domain": "FEE",
    "name": "Fee waiver — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-005",
    "domain": "FEE",
    "name": "Tax rule — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-006",
    "domain": "FEE",
    "name": "Tax withholding — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-007",
    "domain": "FEE",
    "name": "Tax reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-008",
    "domain": "FEE",
    "name": "Rate exception — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-009",
    "domain": "FEE",
    "name": "Chargeback fee — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-010",
    "domain": "FEE",
    "name": "Fee simulation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-011",
    "domain": "FEE",
    "name": "Fee dispute — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-012",
    "domain": "FEE",
    "name": "Fee schedule — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-013",
    "domain": "FEE",
    "name": "Fee accrual — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-014",
    "domain": "FEE",
    "name": "Fee posting — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-015",
    "domain": "FEE",
    "name": "Fee waiver — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "FEE-EXP-016",
    "domain": "FEE",
    "name": "Tax rule — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-001",
    "domain": "REC",
    "name": "Bank statement import — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-002",
    "domain": "REC",
    "name": "Nostro reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-003",
    "domain": "REC",
    "name": "Ledger reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-004",
    "domain": "REC",
    "name": "Payment reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-005",
    "domain": "REC",
    "name": "Cash reconciliation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-006",
    "domain": "REC",
    "name": "Suspense clearance — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-007",
    "domain": "REC",
    "name": "Break investigation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-008",
    "domain": "REC",
    "name": "Exception aging — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-009",
    "domain": "REC",
    "name": "Reconciliation match — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-010",
    "domain": "REC",
    "name": "Manual matching — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-011",
    "domain": "REC",
    "name": "Reconciliation certification — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-012",
    "domain": "REC",
    "name": "Unmatched items — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-013",
    "domain": "REC",
    "name": "Settlement difference — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-014",
    "domain": "REC",
    "name": "Bank statement import — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-015",
    "domain": "REC",
    "name": "Nostro reconciliation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-016",
    "domain": "REC",
    "name": "Ledger reconciliation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-017",
    "domain": "REC",
    "name": "Payment reconciliation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-018",
    "domain": "REC",
    "name": "Cash reconciliation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-019",
    "domain": "REC",
    "name": "Suspense clearance — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-020",
    "domain": "REC",
    "name": "Break investigation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REC-EXP-021",
    "domain": "REC",
    "name": "Exception aging — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-001",
    "domain": "SEC",
    "name": "Access roles — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-002",
    "domain": "SEC",
    "name": "Permissions matrix — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-003",
    "domain": "SEC",
    "name": "User provisioning — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-004",
    "domain": "SEC",
    "name": "Privileged access — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-005",
    "domain": "SEC",
    "name": "Maker checker — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-006",
    "domain": "SEC",
    "name": "Session review — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-007",
    "domain": "SEC",
    "name": "Audit trail — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-008",
    "domain": "SEC",
    "name": "Security incident — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-009",
    "domain": "SEC",
    "name": "Authentication policy — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-010",
    "domain": "SEC",
    "name": "Cryptographic key — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-011",
    "domain": "SEC",
    "name": "Fraud rule — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-012",
    "domain": "SEC",
    "name": "Secret rotation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-013",
    "domain": "SEC",
    "name": "Bank scope permission — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-014",
    "domain": "SEC",
    "name": "Device trust — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-015",
    "domain": "SEC",
    "name": "Segregation of duties — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-016",
    "domain": "SEC",
    "name": "Access roles — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-017",
    "domain": "SEC",
    "name": "Permissions matrix — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-018",
    "domain": "SEC",
    "name": "User provisioning — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-019",
    "domain": "SEC",
    "name": "Privileged access — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-020",
    "domain": "SEC",
    "name": "Maker checker — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-021",
    "domain": "SEC",
    "name": "Session review — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "SEC-EXP-022",
    "domain": "SEC",
    "name": "Audit trail — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-001",
    "domain": "DAT",
    "name": "Source mapping — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-002",
    "domain": "DAT",
    "name": "Data dictionary — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-003",
    "domain": "DAT",
    "name": "Migration package — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-004",
    "domain": "DAT",
    "name": "Import preview — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-005",
    "domain": "DAT",
    "name": "Data validation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-006",
    "domain": "DAT",
    "name": "Data quality — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-007",
    "domain": "DAT",
    "name": "Data lineage — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-008",
    "domain": "DAT",
    "name": "Reconciliation run — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-009",
    "domain": "DAT",
    "name": "Data retention — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-010",
    "domain": "DAT",
    "name": "Data deletion — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-011",
    "domain": "DAT",
    "name": "Data export — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-012",
    "domain": "DAT",
    "name": "Source mapping — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-013",
    "domain": "DAT",
    "name": "Data dictionary — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-014",
    "domain": "DAT",
    "name": "Migration package — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-015",
    "domain": "DAT",
    "name": "Import preview — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DAT-EXP-016",
    "domain": "DAT",
    "name": "Data validation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-001",
    "domain": "API",
    "name": "API credential — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-002",
    "domain": "API",
    "name": "Integration endpoint — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-003",
    "domain": "API",
    "name": "Webhook delivery — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-004",
    "domain": "API",
    "name": "Contract testing — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-005",
    "domain": "API",
    "name": "Client registration — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-006",
    "domain": "API",
    "name": "Partner onboarding — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-007",
    "domain": "API",
    "name": "Event subscription — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-008",
    "domain": "API",
    "name": "Rate limit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-009",
    "domain": "API",
    "name": "API health — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-010",
    "domain": "API",
    "name": "Integration exception — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-011",
    "domain": "API",
    "name": "API credential — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-012",
    "domain": "API",
    "name": "Integration endpoint — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-013",
    "domain": "API",
    "name": "Webhook delivery — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "API-EXP-014",
    "domain": "API",
    "name": "Contract testing — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-001",
    "domain": "INF",
    "name": "Service health — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-002",
    "domain": "INF",
    "name": "Environment inventory — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-003",
    "domain": "INF",
    "name": "Release pipeline — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-004",
    "domain": "INF",
    "name": "Deployment approval — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-005",
    "domain": "INF",
    "name": "Capacity planning — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-006",
    "domain": "INF",
    "name": "Infrastructure incident — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-007",
    "domain": "INF",
    "name": "Certificate inventory — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-008",
    "domain": "INF",
    "name": "Monitoring alert — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-009",
    "domain": "INF",
    "name": "Node inventory — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-010",
    "domain": "INF",
    "name": "Vulnerability finding — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-011",
    "domain": "INF",
    "name": "Service health — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-012",
    "domain": "INF",
    "name": "Environment inventory — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-013",
    "domain": "INF",
    "name": "Release pipeline — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "INF-EXP-014",
    "domain": "INF",
    "name": "Deployment approval — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-001",
    "domain": "DR",
    "name": "Backup policy — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-002",
    "domain": "DR",
    "name": "Backup execution — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-003",
    "domain": "DR",
    "name": "Restore simulation — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-004",
    "domain": "DR",
    "name": "Failover exercise — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-005",
    "domain": "DR",
    "name": "Failback exercise — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-006",
    "domain": "DR",
    "name": "Disaster drill — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-007",
    "domain": "DR",
    "name": "Recovery point — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-008",
    "domain": "DR",
    "name": "Recovery time — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-009",
    "domain": "DR",
    "name": "Continuity incident — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-010",
    "domain": "DR",
    "name": "Recovery evidence — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-011",
    "domain": "DR",
    "name": "Backup policy — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-012",
    "domain": "DR",
    "name": "Backup execution — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-013",
    "domain": "DR",
    "name": "Restore simulation — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "DR-EXP-014",
    "domain": "DR",
    "name": "Failover exercise — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-001",
    "domain": "ADM",
    "name": "Institution settings — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-002",
    "domain": "ADM",
    "name": "Branch setup — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-003",
    "domain": "ADM",
    "name": "Business calendar — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-004",
    "domain": "ADM",
    "name": "Currency setup — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-005",
    "domain": "ADM",
    "name": "User settings — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-006",
    "domain": "ADM",
    "name": "Approval limits — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-007",
    "domain": "ADM",
    "name": "Feature release — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-008",
    "domain": "ADM",
    "name": "Employee registry — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-009",
    "domain": "ADM",
    "name": "Employee profile — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-010",
    "domain": "ADM",
    "name": "Payroll cycle — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-011",
    "domain": "ADM",
    "name": "Payroll approval — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-012",
    "domain": "ADM",
    "name": "Leave request — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-013",
    "domain": "ADM",
    "name": "Leave approval — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-014",
    "domain": "ADM",
    "name": "Pay grade — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-015",
    "domain": "ADM",
    "name": "Org chart — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-016",
    "domain": "ADM",
    "name": "Institution settings — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-017",
    "domain": "ADM",
    "name": "Branch setup — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-018",
    "domain": "ADM",
    "name": "Business calendar — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "ADM-EXP-019",
    "domain": "ADM",
    "name": "Currency setup — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TST-EXP-001",
    "domain": "TST",
    "name": "Acceptance catalog — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TST-EXP-002",
    "domain": "TST",
    "name": "Security test — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TST-EXP-003",
    "domain": "TST",
    "name": "Accessibility audit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TST-EXP-004",
    "domain": "TST",
    "name": "Regression test — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TST-EXP-005",
    "domain": "TST",
    "name": "Test execution — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TST-EXP-006",
    "domain": "TST",
    "name": "Failure evidence — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TST-EXP-007",
    "domain": "TST",
    "name": "Performance test — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TST-EXP-008",
    "domain": "TST",
    "name": "Coverage audit — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "TST-EXP-009",
    "domain": "TST",
    "name": "Acceptance catalog — Details",
    "kind": "detail",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REL-EXP-001",
    "domain": "REL",
    "name": "Release candidate — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REL-EXP-002",
    "domain": "REL",
    "name": "Readiness review — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REL-EXP-003",
    "domain": "REL",
    "name": "Deployment plan — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REL-EXP-004",
    "domain": "REL",
    "name": "Pilot gate — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REL-EXP-005",
    "domain": "REL",
    "name": "Rollback plan — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REL-EXP-006",
    "domain": "REL",
    "name": "Production evidence — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "REL-EXP-007",
    "domain": "REL",
    "name": "Release approval — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "EDU-EXP-001",
    "domain": "EDU",
    "name": "Course enrollment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "EDU-EXP-002",
    "domain": "EDU",
    "name": "Instructor dashboard — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "EDU-EXP-003",
    "domain": "EDU",
    "name": "Simulation scenario — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "EDU-EXP-004",
    "domain": "EDU",
    "name": "Synthetic customer — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "EDU-EXP-005",
    "domain": "EDU",
    "name": "Training account — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "EDU-EXP-006",
    "domain": "EDU",
    "name": "Virtual teller — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "EDU-EXP-007",
    "domain": "EDU",
    "name": "Student assessment — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "EDU-EXP-008",
    "domain": "EDU",
    "name": "Competency profile — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  },
  {
    "id": "EDU-EXP-009",
    "domain": "EDU",
    "name": "Exam session — Workbench",
    "kind": "workbench",
    "source": "EXPANSION_PROPOSED"
  }
];
export const SCREEN_BY_ID = new Map(SCREENS.map(item => [item.id, item]));
export const SCREEN_COUNTS = {
  "GOV": 18,
  "ARC": 14,
  "CIF": 40,
  "PRD": 28,
  "ACT": 50,
  "LED": 40,
  "BRN": 35,
  "PAY": 50,
  "CRD": 50,
  "TRE": 30,
  "AML": 38,
  "REP": 38,
  "CHN": 35,
  "CARD": 28,
  "CRM": 24,
  "FEE": 20,
  "REC": 25,
  "SEC": 26,
  "DAT": 20,
  "API": 18,
  "INF": 18,
  "DR": 18,
  "ADM": 23,
  "TST": 13,
  "REL": 11,
  "EDU": 16
};
export const SCREEN_BASELINE = Object.freeze({ canonicalDraft:114, proposedExpansion:612, total:726, state:"UI_ROUTE_SCAFFOLD_NOT_PRODUCTION" });
