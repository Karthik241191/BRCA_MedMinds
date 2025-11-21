import { BRCAData, EvaluationResult, PayerResults, PayerVerdict } from '../types/brca';

export function evaluateCriteria(data: BRCAData): EvaluationResult {
  const p = data.patient;
  const fam = data.family;
  const reasons: string[] = [];

  // Known familial variant
  if (p.famvar === 'Y') {
    reasons.push('Known familial pathogenic variant identified');
  }

  // Personal criteria
  if (p.breast === 'Y' && p.breastAge && p.breastAge <= 50) {
    reasons.push('Personal breast cancer diagnosed at age <=50');
  }
  if (p.tnbc === 'Y') {
    reasons.push('Personal triple-negative breast cancer');
  }
  if (p.multiple === 'Y') {
    reasons.push('Personal multiple primary breast cancers');
  }
  if (p.sex === 'M' && p.breast === 'Y') {
    reasons.push('Personal male breast cancer');
  }
  if (p.ovarian === 'Y') {
    reasons.push('Personal ovarian/fallopian/peritoneal cancer');
  }
  if (p.pancreas === 'Y') {
    reasons.push('Personal pancreatic cancer');
  }
  if (p.prostate === 'Y' && p.gleason && p.gleason >= 7 && p.prometa === 'Y') {
    reasons.push('Personal metastatic prostate cancer with Gleason >=7');
  }

  // Family criteria
  // 1) First-degree breast <=50
  const firstBreast50 = fam.some(
    r => r.affected && r.cancer === 'Breast' && r.degree === 1 && r.age && r.age <= 50
  );
  if (firstBreast50) {
    reasons.push('First-degree relative with breast cancer diagnosed <=50');
  }

  // 2) 1st/2nd-degree ovarian
  const ovarianRel = fam.some(
    r => r.affected && r.cancer === 'Ovarian' && (r.degree === 1 || r.degree === 2)
  );
  if (ovarianRel) {
    reasons.push('First/second-degree relative with ovarian cancer');
  }

  // 3) 1st-degree pancreatic
  const panRel = fam.some(
    r => r.affected && r.cancer === 'Pancreatic' && r.degree === 1
  );
  if (panRel) {
    reasons.push('First-degree relative with pancreatic cancer');
  }

  // 4) Male relative with breast (1/2)
  const maleBreastRel = fam.some(
    r => r.affected && r.cancer === 'Male breast' && (r.degree === 1 || r.degree === 2)
  );
  if (maleBreastRel) {
    reasons.push('Male relative with breast cancer (1st/2nd degree)');
  }

  // 5) >=3 breast/prostate on same side
  const sideCounts: { [side: string]: number } = {};
  fam.forEach(r => {
    if (r.affected && (r.cancer === 'Breast' || r.cancer === 'Prostate')) {
      sideCounts[r.side] = (sideCounts[r.side] || 0) + 1;
    }
  });
  for (const s in sideCounts) {
    if (sideCounts[s] >= 3) {
      reasons.push(`Three or more breast/prostate diagnoses on the same side of family (${s})`);
    }
  }

  // 6) Ashkenazi + close relative with BRCA-related cancer
  if (
    p.ash === 'Y' &&
    fam.some(r => r.affected && ['Breast', 'Ovarian', 'Pancreatic'].includes(r.cancer))
  ) {
    reasons.push('Ashkenazi ancestry plus family history of BRCA-related cancer');
  }

  const meets = reasons.length > 0;
  return { meets, reasons };
}

export function evaluatePayers(data: BRCAData, results: EvaluationResult): PayerResults {
  const meetsAny = results.meets;
  const payers: PayerResults = {};

  // UHC
  payers['UHC'] = {
    verdict: meetsAny ? 'Y' : 'N',
    reason: meetsAny ? results.reasons.join(', ') : 'Does not meet UHC-approx criteria.'
  };

  // Evicore - requires genetic counseling documented OR familial variant
  payers['Evicore'] = {
    verdict: (data.patient.famvar === 'Y' || (data.patient.gc === 'Y' && meetsAny)) ? 'Y' : 'N',
    reason: (data.patient.famvar === 'Y' || (data.patient.gc === 'Y' && meetsAny))
      ? results.reasons.join(', ')
      : 'Does not meet Evicore-approx criteria (requires genetic counseling).'
  };

  // BCBS
  payers['BCBS'] = {
    verdict: meetsAny ? 'Y' : 'N',
    reason: meetsAny ? results.reasons.join(', ') : 'Does not meet BCBS-approx criteria.'
  };

  // Aetna
  payers['Aetna'] = {
    verdict: meetsAny ? 'Y' : 'N',
    reason: meetsAny ? results.reasons.join(', ') : 'Does not meet Aetna-approx criteria.'
  };

  // Regence
  payers['Regence'] = {
    verdict: meetsAny ? 'Y' : 'N',
    reason: meetsAny ? results.reasons.join(', ') : 'Does not meet Regence-approx criteria.'
  };

  // Carelon
  payers['Carelon'] = {
    verdict: meetsAny ? 'Y' : 'N',
    reason: meetsAny ? results.reasons.join(', ') : 'Does not meet Carelon-approx criteria.'
  };

  return payers;
}
