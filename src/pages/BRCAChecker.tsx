import { useState } from 'react';
import { PatientData, FamilyMember, EvaluationResult, PayerResults, BRCAData } from '../types/brca';
import { evaluateCriteria, evaluatePayers } from '../utils/brcaEvaluation';
import { PatientInputForm } from '../components/PatientInputForm';
import { FamilyHistoryTable } from '../components/FamilyHistoryTable';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { ExportPanel } from '../components/ExportPanel';
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
  const [exportData, setExportData] = useState<string>('');

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

  const handleExportJSON = () => {
    const data: BRCAData = { patient, family };
    setExportData(JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />

      {/* Main Content */}
      <main className="pt-12 pb-32 md:pb-40">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Page Header with Logo */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src="/images/MedMinds.png"
                  alt="MedMinds Healthcare Solutions"
                  className="h-14 w-auto object-contain"
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-sm text-muted-foreground">
                  HIPAA Compliant • No Data Transmitted
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-semibold mb-3">BRCA Criteria Checker</h1>
              <p className="text-lg text-muted-foreground">
                Genetic Testing Authorization Tool • Runs in your browser. No data is sent to any server.
              </p>
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
                onExportJSON={handleExportJSON}
              />

              <FamilyHistoryTable family={family} onFamilyChange={setFamily} />
            </div>

            {/* Right Column - 50% width */}
            <div className="space-y-6">
              <ResultsDisplay results={results} payers={payers} patient={patient} />
              <ExportPanel jsonData={exportData} />
            </div>
          </div>
        </div>
      </main>

      <BRCAFooter />
    </div>
  );
}
