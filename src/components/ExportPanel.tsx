import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

interface ExportPanelProps {
  jsonData: string;
}

export function ExportPanel({ jsonData }: ExportPanelProps) {
  return (
    <Card className="shadow-card-base">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          Export / Share
        </CardTitle>
        <CardDescription>
          You can export the current patient and family data as JSON.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          value={jsonData}
          readOnly
          className="w-full h-[120px] p-3 rounded-md border border-input bg-input-background text-xs font-mono resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Click 'Export JSON' to generate data"
        />
      </CardContent>
    </Card>
  );
}
