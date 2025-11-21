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
    <Card>
      <CardHeader>
        <CardTitle>Family History</CardTitle>
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
