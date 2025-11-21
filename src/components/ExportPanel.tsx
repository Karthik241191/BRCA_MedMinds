import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

interface ExportPanelProps {
  jsonData: string;
}

export function ExportPanel({ jsonData }: ExportPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export / Share</CardTitle>
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
