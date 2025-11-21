import { PatientData } from '../types/brca';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface PatientInputFormProps {
  patient: PatientData;
  onPatientChange: (patient: PatientData) => void;
  onAddRelative: () => void;
  onClearRelatives: () => void;
  onEvaluate: () => void;
  onExportJSON: () => void;
}

export function PatientInputForm({
  patient,
  onPatientChange,
  onAddRelative,
  onClearRelatives,
  onEvaluate,
  onExportJSON
}: PatientInputFormProps) {
  const updateField = <K extends keyof PatientData>(field: K, value: PatientData[K]) => {
    onPatientChange({ ...patient, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Inputs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pt_name">Patient name</Label>
            <Input
              id="pt_name"
              type="text"
              placeholder="Jane Doe"
              value={patient.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_age">Age (years)</Label>
            <Input
              id="pt_age"
              type="number"
              min="0"
              placeholder="45"
              value={patient.age || ''}
              onChange={(e) => updateField('age', e.target.value ? Number(e.target.value) : null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_sex">Sex assigned at birth</Label>
            <select
              id="pt_sex"
              value={patient.sex}
              onChange={(e) => updateField('sex', e.target.value as 'F' | 'M')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="F">F</option>
              <option value="M">M</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_ash">Ashkenazi Jewish ancestry</Label>
            <select
              id="pt_ash"
              value={patient.ash}
              onChange={(e) => updateField('ash', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_famvar">Known familial pathogenic variant</Label>
            <select
              id="pt_famvar"
              value={patient.famvar}
              onChange={(e) => updateField('famvar', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_gc">Genetic counseling documented</Label>
            <select
              id="pt_gc"
              value={patient.gc}
              onChange={(e) => updateField('gc', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>

          <div className="col-span-full mt-4">
            <h4 className="font-medium text-lg">Personal cancer history</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_breast">Personal breast cancer</Label>
            <select
              id="pt_breast"
              value={patient.breast}
              onChange={(e) => updateField('breast', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_breast_age">Age at breast dx</Label>
            <Input
              id="pt_breast_age"
              type="number"
              min="0"
              value={patient.breastAge || ''}
              onChange={(e) => updateField('breastAge', e.target.value ? Number(e.target.value) : null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_tnbc">Triple-negative breast</Label>
            <select
              id="pt_tnbc"
              value={patient.tnbc}
              onChange={(e) => updateField('tnbc', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_mulprim">Multiple primary breast cancers</Label>
            <select
              id="pt_mulprim"
              value={patient.multiple}
              onChange={(e) => updateField('multiple', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_ovarian">Ovarian / fallopian / peritoneal cancer</Label>
            <select
              id="pt_ovarian"
              value={patient.ovarian}
              onChange={(e) => updateField('ovarian', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_pancreas">Pancreatic cancer</Label>
            <select
              id="pt_pancreas"
              value={patient.pancreas}
              onChange={(e) => updateField('pancreas', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_prostate">Prostate cancer</Label>
            <select
              id="pt_prostate"
              value={patient.prostate}
              onChange={(e) => updateField('prostate', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_gleason">Prostate Gleason score</Label>
            <Input
              id="pt_gleason"
              type="number"
              min="0"
              placeholder="7"
              value={patient.gleason || ''}
              onChange={(e) => updateField('gleason', e.target.value ? Number(e.target.value) : null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pt_pro_meta">Prostate metastatic</Label>
            <select
              id="pt_pro_meta"
              value={patient.prometa}
              onChange={(e) => updateField('prometa', e.target.value as 'Y' | 'N')}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center mt-6 pt-6 border-t">
          <Button onClick={onAddRelative}>
            Add relative
          </Button>
          <Button variant="outline" onClick={onClearRelatives}>
            Clear relatives
          </Button>
          <div className="flex-1"></div>
          <Button onClick={onEvaluate}>
            Evaluate
          </Button>
          <Button variant="secondary" onClick={onExportJSON}>
            Export JSON
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
