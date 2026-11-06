/**
 * Legal/accounting mapping evidence gate. Never assumes a PCEC/COBAC/BEAC
 * table, rule number, effective date or financial institution category.
 * An independently controlled approval reader must establish provenance.
 */
export class MappingRejected extends Error{
  constructor(code){super(code);this.name="MappingRejected";this.code=code;}
}
const fail=code=>{throw new MappingRejected(code);};
const id=x=>typeof x==="string"&&/^[A-Za-z0-9][A-Za-z0-9_.:/-]{2,239}$/.test(x);
const iso=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&
  !Number.isNaN(Date.parse(x+"T00:00:00Z"))&&
  new Date(x+"T00:00:00Z").toISOString().slice(0,10)===x;

export function createRegulatoryMappingGate({loadMapping,verifyIndependentApproval}={}){
  if(typeof loadMapping!=="function"||typeof verifyIndependentApproval!=="function")
    fail("MAPPING_AUTHORITY_MISSING");
  return async function validate({report,criteria,sourceSystem}={}){
    if(!report||!id(report.id)||!id(report.version)||!criteria||
      !id(criteria.institutionId)||!id(sourceSystem)||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(criteria.period||""))
      fail("INVALID_MAPPING_REQUEST");
    const m=await loadMapping({
      institutionId:criteria.institutionId,reportId:report.id,
      reportVersion:report.version,sourceSystem,period:criteria.period
    });
    if(!m||m.status!=="APPROVED"||
      m.institutionId!==criteria.institutionId||
      m.reportId!==report.id||m.reportVersion!==report.version||
      m.sourceSystem!==sourceSystem||!id(m.mappingVersion)||
      !id(m.financialFramework)||!id(m.legalReference)||
      !id(m.approvalEvidenceId)||!id(m.contentDigest)||
      !id(m.authorId)||!id(m.checkerId)||m.authorId===m.checkerId||
      !iso(m.effectiveFrom)||!iso(m.effectiveThrough)||m.effectiveFrom>m.effectiveThrough||
      criteria.period+"-01"<m.effectiveFrom||criteria.period+"-01">m.effectiveThrough)
      fail("MAPPING_NOT_APPROVED_FOR_PERIOD");
    const independent=await verifyIndependentApproval({mapping:m,criteria,report});
    if(independent!==true)fail("INDEPENDENT_MAPPING_APPROVAL_MISSING");
    return Object.freeze({status:"MAPPING_EVIDENCE_ONLY",reportId:report.id,
      mappingVersion:m.mappingVersion,framework:m.financialFramework,
      officialFilingEnabled:false,financialPublicationEnabled:false});
  };
}
