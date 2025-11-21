// BRCA Data Types

export interface PatientData {
  name: string;
  age: number | null;
  sex: 'F' | 'M';
  ash: 'Y' | 'N';
  famvar: 'Y' | 'N';
  gc: 'Y' | 'N';
  breast: 'Y' | 'N';
  breastAge: number | null;
  tnbc: 'Y' | 'N';
  multiple: 'Y' | 'N';
  ovarian: 'Y' | 'N';
  pancreas: 'Y' | 'N';
  prostate: 'Y' | 'N';
  gleason: number | null;
  prometa: 'Y' | 'N';
}

export interface FamilyMember {
  name: string;
  degree: 1 | 2 | 3;
  side: 'Maternal' | 'Paternal';
  cancer: 'Breast' | 'Ovarian' | 'Pancreatic' | 'Prostate' | 'Male breast' | 'Other';
  age: number | null;
  affected: boolean;
}

export interface EvaluationResult {
  meets: boolean;
  reasons: string[];
}

export interface PayerVerdict {
  verdict: 'Y' | 'N';
  reason: string;
}

export interface PayerResults {
  [payerName: string]: PayerVerdict;
}

export interface BRCAData {
  patient: PatientData;
  family: FamilyMember[];
}
