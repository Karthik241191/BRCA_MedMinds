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
      <BRCAHeader />

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-medium mb-2">BRCA Criteria Checker</h1>
            <p className="text-muted-foreground">
              Runs in your browser. No data is sent to any server.
            </p>
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
