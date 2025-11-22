import { useState } from 'react';
import { PatientData, FamilyMember, EvaluationResult, PayerResults, BRCAData } from '../types/brca';
import { evaluateCriteria, evaluatePayers } from '../utils/brcaEvaluation';
import { PatientInputForm } from '../components/PatientInputForm';
import { FamilyHistoryTable } from '../components/FamilyHistoryTable';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { BRCAHeader } from '../components/BRCAHeader';
import { BRCAFooter } from '../components/BRCAFooter';
import { ScrollToTop } from '../components/ScrollToTop';

const initialPatient: PatientData = {
  name: '',
  age: null,
  sex: 'F',
  ash: 'N',
  famvar: 'N',
  gc: 'Y',
  breast: 'N',
  breastAge: null,
  tnbc: 'N',
  multiple: 'N',
  ovarian: 'N',
  pancreas: 'N',
  prostate: 'N',
  gleason: null,
  prometa: 'N'
};

const initialFamily: FamilyMember[] = [
  {
    name: 'Mother',
    degree: 1,
    side: 'Maternal',
    cancer: 'Breast',
    age: 48,
    affected: true
  },
  {
    name: 'Paternal aunt',
    degree: 2,
    side: 'Paternal',
    cancer: 'Ovarian',
    age: 60,
    affected: true
  }
];

export function BRCAChecker() {
  const [patient, setPatient] = useState<PatientData>(initialPatient);
  const [family, setFamily] = useState<FamilyMember[]>(initialFamily);
  const [results, setResults] = useState<EvaluationResult | null>(null);
  const [payers, setPayers] = useState<PayerResults | null>(null);

  const MAX_RELATIVES = 40;

  const handleAddRelative = () => {
    if (family.length >= MAX_RELATIVES) return;

    setFamily([
      ...family,
      {
        name: '',
        degree: 1,
        side: 'Maternal',
        cancer: 'Breast',
        age: null,
        affected: false
      }
    ]);
  };

  const handleClearRelatives = () => {
    setFamily([]);
  };

  const handleEvaluate = () => {
    const data: BRCAData = { patient, family };
    const evalResults = evaluateCriteria(data);
    const payerResults = evaluatePayers(data, evalResults);

    setResults(evalResults);
    setPayers(payerResults);
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />

      {/* Main Content */}
      <main className="pb-32 md:pb-40" style={{ paddingTop: '3rem' }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Page Header with Logo */}
          <div className="mb-12">
            {/* Centered Logo and Tagline */}
            <div className="text-center mb-8 pb-6 border-b border-border/30">
              <div className="flex justify-center mb-3">
                <img
                  src="/images/MedMinds.png"
                  alt="MedMinds Healthcare Solutions"
                  className="w-auto object-contain"
                  style={{ height: '70px' }}
                />
              </div>
              <p className="text-xs text-muted-foreground tracking-wide">
                Empowering Healthcare Decisions Through Precision Medicine
              </p>
            </div>
            
            {/* Title Section */}
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                BRCA Criteria Checker
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-4">
                Genetic Testing Authorization Tool for BRCA1/BRCA2 evaluation
              </p>
              <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto">
                Browser-based tool ensuring complete privacy — No patient data is transmitted or stored
              </p>
            </div>
            
            {/* Security Badge - Compact */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-md border border-primary/15">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs font-medium text-foreground">HIPAA Compliant</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-xs text-muted-foreground">100% Private & Secure</span>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - 50% width */}
            <div className="space-y-6">
              <PatientInputForm
                patient={patient}
                onPatientChange={setPatient}
                onAddRelative={handleAddRelative}
                onClearRelatives={handleClearRelatives}
                onEvaluate={handleEvaluate}
              />

              <FamilyHistoryTable family={family} onFamilyChange={setFamily} />
            </div>

            {/* Right Column - 50% width */}
            <div className="space-y-6">
              <ResultsDisplay results={results} payers={payers} patient={patient} />
            </div>
          </div>
        </div>
      </main>

      <BRCAFooter />
    </div>
  );
}
