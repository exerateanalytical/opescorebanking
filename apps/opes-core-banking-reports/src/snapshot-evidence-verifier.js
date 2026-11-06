/**
 * Cryptographic verification of a bank source snapshot *manifest*.
 * The implementation accepts only trusted server-managed public keys and
 * independently checked payload digests and ledger/event lineage.
 *
 * No private keys, signed test fixtures, real balances or live bank connectors
 * are shipped. Positive verification NEVER enables production reporting.
 */
import {createPublicKey, verify as verifySignature} from "node:crypto";

const PENDING = Object.freeze({
  signatureValid:false, digestMatches:false, sourceApproved:false,
  mappingApproved:false, lineageComplete:false
});
const isObject = v => v !== null && typeof v === "object" && !Array.isArray(v);
const str = v => typeof v === "string" && v.length >= 3 && v.length <= 160;
const sha256 = v => typeof v === "string" && /^[a-f0-9]{64}$/.test(v);
const sig = v => typeof v === "string" && /^[A-Za-z0-9_-]{80,256}$/.test(v);
const branchList = v => Array.isArray(v) && v.length > 0 && v.length <= 200 &&
  v.every(str) && new Set(v).size === v.length;
const period = v => typeof v === "string" && /^[0-9]{4}-(0[1-9]|1[0-2])$/.test(v);

/** Deterministic UTF-8 signing envelope: never stringify arbitrary source rows. */
export function canonicalSnapshotManifest(snapshot) {
  if (!isObject(snapshot) || !branchList(snapshot.branchIds) ||
      !["snapshotId","reportId","reportVersion","institutionId","sourceSystem",
        "sourceRevision","mappingVersion","reconciliationRef"].every(k => str(snapshot[k])) ||
      !period(snapshot.period) || !/^[A-Z]{3}$/.test(snapshot.currency || "") ||
      !sha256(snapshot.digest) ||
      snapshot.immutable !== true || snapshot.reconciled !== true)
    throw Error("INVALID_SNAPSHOT_MANIFEST");
  return Buffer.from(JSON.stringify({
    schema:"opes.reporting.snapshot-manifest.v1",
    snapshotId:snapshot.snapshotId,
    reportId:snapshot.reportId,
    reportVersion:snapshot.reportVersion,
    institutionId:snapshot.institutionId,
    branchIds:[...snapshot.branchIds].sort(),
    period:snapshot.period,
    currency:snapshot.currency,
    sourceSystem:snapshot.sourceSystem,
    sourceRevision:snapshot.sourceRevision,
    mappingVersion:snapshot.mappingVersion,
    reconciliationRef:snapshot.reconciliationRef,
    digest:snapshot.digest,
    immutable:true,
    reconciled:true
  }),"utf8");
}

/**
 * trustedKeys: Map<keyId,{publicKey, institutionId, sourceSystem, enabled}>
 * approvedMappings: Map<mappingVersion,{institutionId,reportId,reportVersion,sourceSystem,approved}>
 * verifyDigest: independently recomputes source payload digest from immutable
 * source content (not a boolean read from the same snapshot manifest).
 * verifyLineage: independently verifies source revision and reconciliation proof.
 */
export function createSnapshotEvidenceVerifier({
  trustedKeys, approvedMappings, verifyDigest, verifyLineage
} = {}) {
  if (!(trustedKeys instanceof Map) || !(approvedMappings instanceof Map) ||
      typeof verifyDigest !== "function" || typeof verifyLineage !== "function")
    throw Error("UNTRUSTED_EVIDENCE_CONFIGURATION");
  return async function verifyProvenance({snapshot,criteria,report} = {}) {
    if (!isObject(snapshot) || !isObject(criteria) || !isObject(report) ||
        !str(snapshot.keyId) || !sig(snapshot.signature))
      return {...PENDING};
    const key = trustedKeys.get(snapshot.keyId);
    if (!isObject(key) || key.enabled !== true ||
        key.institutionId !== criteria.institutionId ||
        key.sourceSystem !== snapshot.sourceSystem)
      return {...PENDING};
    let verified = false;
    try {
      const publicKey = createPublicKey(key.publicKey);
      if (publicKey.asymmetricKeyType !== "ed25519") return {...PENDING};
      verified = verifySignature(null,canonicalSnapshotManifest(snapshot),
        publicKey, Buffer.from(snapshot.signature,"base64url"));
    } catch { return {...PENDING}; }
    if (!verified) return {...PENDING};
    const mapped = approvedMappings.get(snapshot.mappingVersion);
    const mappingApproved = isObject(mapped) && mapped.approved === true &&
      mapped.institutionId === criteria.institutionId &&
      mapped.reportId === report.id &&
      mapped.reportVersion === report.version &&
      mapped.sourceSystem === snapshot.sourceSystem;
    if (snapshot.reportId !== criteria.reportId ||
        snapshot.reportVersion !== criteria.reportVersion ||
        snapshot.institutionId !== criteria.institutionId ||
        snapshot.period !== criteria.period || snapshot.currency !== criteria.currency ||
        !branchList(criteria.branchIds) ||
        snapshot.branchIds.length !== criteria.branchIds.length ||
        !snapshot.branchIds.every(b => criteria.branchIds.includes(b)))
      return {...PENDING};
    const sourceApproved = key.enabled === true;
    if (!mappingApproved) {
      return {signatureValid:true, digestMatches:false, sourceApproved,
        mappingApproved:false, lineageComplete:false};
    }
    // Fail closed when independent digest or ledger-lineage verifier is absent,
    // throws, or returns anything except literal true.
    let digestMatches=false, lineageComplete=false;
    try {
      digestMatches = (await verifyDigest({snapshot,criteria,report})) === true;
      if (digestMatches)
        lineageComplete = (await verifyLineage({snapshot,criteria,report})) === true;
    } catch { /* inconclusive source evidence is NOT an accepted result */ }
    return {signatureValid:true,digestMatches,sourceApproved,
      mappingApproved:true,lineageComplete};
  };
}
