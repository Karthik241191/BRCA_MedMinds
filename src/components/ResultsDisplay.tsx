import { EvaluationResult, PayerResults, PatientData } from '../types/brca';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ResultsDisplayProps {
  results: EvaluationResult | null;
  payers: PayerResults | null;
  patient: PatientData;
}

export function ResultsDisplay({ results, payers, patient }: ResultsDisplayProps) {
  if (!results || !payers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Click "Evaluate" to see results
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Verdict */}
        <Alert className={results.meets ? 'bg-green-50 border-green-500 text-green-900' : 'bg-red-50 border-red-500 text-red-900'}>
          <div className="flex items-center gap-2">
            {results.meets ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <AlertDescription className="font-semibold text-base">
              {results.meets ? 'MEETS CRITERIA' : 'DOES NOT MEET CRITERIA'}
            </AlertDescription>
          </div>
        </Alert>

        {/* Reasons List */}
        <div className="space-y-2">
          {results.meets ? (
            results.reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">•</span>
                <span>{reason}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No qualifying personal or family criteria met. Consider verifying family/personal details or
              known familial variant. (Patient age: {patient.age || 'n/a'})
            </p>
          )}
        </div>

        {/* Payer Verdicts */}
        <div className="space-y-4">
          <div>
            <Badge variant="secondary" className="text-sm">Payer Verdicts</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(payers).map(([name, verdict]) => (
              <div key={name} className="border rounded-lg p-4 bg-muted/50">
                <div className="font-semibold text-base mb-2">{name}</div>
                <div className="text-sm mb-2">
                  Verdict:{' '}
                  <Badge variant={verdict.verdict === 'Y' ? 'default' : 'destructive'}>
                    {verdict.verdict}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{verdict.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="text-xs text-muted-foreground border-t pt-4">
          <strong>Notes:</strong> This tool uses conservative aggregated criteria (personal history, family
          history, known familial variant). Evicore column enforces documented genetic counseling as an
          additional requirement by default. Ask me to exact-map each payer's policy bullets.
        </div>
      </CardContent>
    </Card>
  );
}
