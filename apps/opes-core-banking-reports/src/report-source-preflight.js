/**
 * Server-side read-only source preflight for the Reporting Studio.
 * This is NOT an executable bank report API. Even verified source metadata
 * remains blocked until independent legal, source and production acceptance.
 *
 * Trust providers MUST be implemented in an authenticated backend. Request
 * headers, query parameters, client-supplied role flags and preview fixtures
 * never establish a bank identity or source-of-truth.
 */
export class SourceReadinessError extends Error {
  constructor(code) {
    super(code);
    this.name = "SourceReadinessError";
    this.code = code;
  }
}
const fail = code => { throw new SourceReadinessError(code); };
const own = v => v !== null && typeof v === "object" &&
  !Array.isArray(v) && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
const id = v => typeof v === "string" && /^[A-Za-z0-9][A-Za-z0-9_.:-]{2,119}$/.test(v);
const periodValid = p => typeof p === "string" && /^[0-9]{4}-(0[1-9]|1[0-2])$/.test(p);
const currencyValid = c => typeof c === "string" && /^[A-Z]{3}$/.test(c);
const uniqueIds = list => Array.isArray(list) && list.length > 0 && list.length <= 200 &&
  list.every(id) && new Set(list).size === list.length;
const sameSet = (a, b) => Array.isArray(a) && a.length === b.length &&
  a.every(x => b.includes(x)) && new Set(a).size === a.length;
const requireProvider = (value, name) => {
  if (typeof value !== "function") fail("CONFIGURATION_INCOMPLETE");
  return value;
};

/**
 * Reports: Map of REPORT_BY_ID. authenticate/authorize are server-trusted,
 * and readSnapshot/verifyProvenance must use independently controlled sources.
 * recordAudit must durably persist a scoped security event or throw.
 *
 * The result is deliberately ALWAYS production-disabled. The preflight may
 * verify source metadata but cannot issue a live report or regulator filing.
 */
export function createReportSourcePreflight({
  reports, authenticate, authorize, readSnapshot, verifyProvenance, recordAudit
} = {}) {
  if (!(reports instanceof Map)) fail("CONFIGURATION_INCOMPLETE");
  [authenticate, authorize, readSnapshot, verifyProvenance, recordAudit].forEach(
    f => requireProvider(f)
  );
  return async function inspect({reportId, period, currency, branchId = null, requestContext} = {}) {
    let subjectId = null, institutionId = null, outcome = "REJECTED", reason = "INVALID_REQUEST";
    const auditOnce = async () => {
      try {
        await recordAudit({
          event: "REPORT_SOURCE_PREFLIGHT", reportId: id(reportId) ? reportId : null,
          subjectId, institutionId, outcome, reason
        });
      } catch {
        fail("AUDIT_UNAVAILABLE");
      }
    };
    try {
      if (typeof reportId !== "string" || !/^RPT-[A-Z]+-[0-9]{3}$/.test(reportId) ||
          !periodValid(period) || !currencyValid(currency) ||
          (branchId !== null && !id(branchId))) fail("INVALID_REQUEST");
      const report = reports.get(reportId);
      if (!report || report.id !== reportId) fail("UNKNOWN_REPORT");
      if (report.approvedForProduction !== false || report.status !== "DRAFT_NOT_ACCEPTED" ||
          !id(report.version)) fail("INVALID_REPORT_CONTRACT");
      // Principal is obtained ONLY from the injected trusted authenticator.
      // The handler does not accept an institution, role, or subject in the query.
      const principal = await authenticate(requestContext);
      if (!own(principal) || !id(principal.subjectId) || principal.verified !== true)
        fail("AUTHENTICATION_REQUIRED");
      subjectId = principal.subjectId;
      const access = await authorize({principal, report});
      if (!own(access) || access.allowPreflight !== true ||
          access.subjectId !== subjectId || !id(access.institutionId) ||
          !uniqueIds(access.branchIds) ||
          (branchId !== null && !access.branchIds.includes(branchId)))
        fail("NOT_AUTHORIZED");
      institutionId = access.institutionId;
      const branchScope = branchId === null ? [...access.branchIds] : [branchId];
      const criteria = Object.freeze({
        reportId, reportVersion: report.version, institutionId,
        branchIds: Object.freeze(branchScope), period, currency
      });
      const snapshot = await readSnapshot(criteria);
      if (!own(snapshot) || !id(snapshot.snapshotId) ||
          snapshot.reportId !== reportId || snapshot.reportVersion !== report.version ||
          snapshot.institutionId !== institutionId ||
          snapshot.period !== period || snapshot.currency !== currency ||
          !sameSet(snapshot.branchIds, branchScope) ||
          !id(snapshot.sourceSystem) || !id(snapshot.mappingVersion) ||
          !id(snapshot.digest) || snapshot.immutable !== true ||
          snapshot.reconciled !== true)
        fail("SOURCE_NOT_VERIFIED");
      // Only a trusted verifier may establish signature, mapping, and lineage;
      // booleans supplied in snapshot metadata are not themselves evidence.
      const proof = await verifyProvenance({snapshot, criteria, principal, report});
      if (!own(proof) || proof.signatureValid !== true ||
          proof.digestMatches !== true || proof.sourceApproved !== true ||
          proof.mappingApproved !== true || proof.lineageComplete !== true)
        fail("SOURCE_NOT_VERIFIED");
      outcome = "BLOCKED";
      reason = "PRODUCTION_ACCEPTANCE_PENDING";
      await auditOnce();
      // No bank rows, balances, customer data or source-auth tokens are returned.
      return Object.freeze({
        reportId, status: "BLOCKED", sourceMetadataVerified: true,
        productionEnabled: false, officialExportEnabled: false, regulatorSubmissionEnabled: false,
        blockers: ["PRODUCTION_ACCEPTANCE_PENDING", "INDEPENDENT_REPORT_CERTIFICATION_REQUIRED"],
        note: "Source preflight only. No financial or regulatory report was generated."
      });
    } catch (error) {
      if (error instanceof SourceReadinessError && error.code === "AUDIT_UNAVAILABLE")
        throw error;
      reason = error instanceof SourceReadinessError ? error.code : "SOURCE_UNAVAILABLE";
      await auditOnce();
      if (error instanceof SourceReadinessError) throw error;
      fail("SOURCE_UNAVAILABLE");
    }
  };
}
const HTTP_CODES = Object.freeze({
  INVALID_REQUEST: 400, AUTHENTICATION_REQUIRED: 401, NOT_AUTHORIZED: 403,
  UNKNOWN_REPORT: 404, INVALID_REPORT_CONTRACT: 503,
  SOURCE_NOT_VERIFIED: 424, SOURCE_UNAVAILABLE: 503,
  CONFIGURATION_INCOMPLETE: 503, AUDIT_UNAVAILABLE: 503
});
/** Can be registered with node:http; never accepts identity from a query. */
export function createSourceReadinessHttpHandler(inspect) {
  requireProvider(inspect);
  return async function handle(request, response) {
    response.setHeader("Cache-Control", "no-store, private");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    const send = (status, body) => {
      response.statusCode = status;
      response.end(JSON.stringify(body) + "\n");
    };
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      return send(405, {error: "METHOD_NOT_ALLOWED"});
    }
    let pathname, params;
    try {
      const url = new URL(request.url, "http://localhost");
      pathname = url.pathname;
      params = url.searchParams;
    } catch { return send(400, {error: "INVALID_REQUEST"}); }
    const match = /^\/api\/v1\/reports\/(RPT-[A-Z]+-[0-9]{3})\/source-readiness$/.exec(pathname);
    if (!match) return send(404, {error: "NOT_FOUND"});
    const allowed = new Set(["period", "currency", "branchId"]);
    if ([...params.keys()].some(k => !allowed.has(k)) ||
        ["period", "currency", "branchId"].some(k => params.getAll(k).length > 1))
      return send(400, {error: "INVALID_REQUEST"});
    try {
      const result = await inspect({
        reportId: match[1], period: params.get("period"), currency: params.get("currency"),
        branchId: params.get("branchId"), requestContext: request
      });
      // Only a blocked preflight is acceptable at this stage.
      if (result?.status !== "BLOCKED" || result.productionEnabled !== false)
        return send(503, {error: "PRODUCTION_REPORTING_DISABLED"});
      return send(503, result);
    } catch (error) {
      const code = error instanceof SourceReadinessError ? error.code : "SOURCE_UNAVAILABLE";
      return send(HTTP_CODES[code] || 503, {error: code});
    }
  };
}
