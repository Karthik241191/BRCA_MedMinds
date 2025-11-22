import { FamilyMember } from '../types/brca';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FamilyHistoryTableProps {
  family: FamilyMember[];
  onFamilyChange: (family: FamilyMember[]) => void;
}

export function FamilyHistoryTable({ family, onFamilyChange }: FamilyHistoryTableProps) {
  const updateMember = (index: number, updates: Partial<FamilyMember>) => {
    const newFamily = [...family];
    newFamily[index] = { ...newFamily[index], ...updates };
    onFamilyChange(newFamily);
  };

  const deleteMember = (index: number) => {
    onFamilyChange(family.filter((_, i) => i !== index));
  };

  return (
    <Card className="shadow-card-base">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          Family History
        </CardTitle>
        <CardDescription>
          Enter up to 40 relatives. Use exact cancer names for accurate matching.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Relative</th>
                <th className="text-left p-2 font-medium">Degree</th>
                <th className="text-left p-2 font-medium">Side</th>
                <th className="text-left p-2 font-medium">Cancer</th>
                <th className="text-left p-2 font-medium">Age dx</th>
                <th className="text-left p-2 font-medium">Affected</th>
                <th className="text-left p-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {family.map((member, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    <Input
                      type="text"
                      placeholder="Mother"
                      value={member.name}
                      onChange={(e) => updateMember(index, { name: e.target.value })}
                      className="min-w-[120px]"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={member.degree}
                      onChange={(e) => updateMember(index, { degree: Number(e.target.value) as 1 | 2 | 3 })}
                      className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      value={member.side}
                      onChange={(e) => updateMember(index, { side: e.target.value as 'Maternal' | 'Paternal' })}
                      className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Maternal">Maternal</option>
                      <option value="Paternal">Paternal</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      value={member.cancer}
                      onChange={(e) => updateMember(index, { cancer: e.target.value as FamilyMember['cancer'] })}
                      className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Breast">Breast</option>
                      <option value="Ovarian">Ovarian</option>
                      <option value="Pancreatic">Pancreatic</option>
                      <option value="Prostate">Prostate</option>
                      <option value="Male breast">Male breast</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min="0"
                      value={member.age || ''}
                      onChange={(e) => updateMember(index, { age: e.target.value ? Number(e.target.value) : null })}
                      className="w-20"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={member.affected ? 'Y' : 'N'}
                      onChange={(e) => updateMember(index, { affected: e.target.value === 'Y' })}
                      className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Y">Y</option>
                      <option value="N">N</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMember(index)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
