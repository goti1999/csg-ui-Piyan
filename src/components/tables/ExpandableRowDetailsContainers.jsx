import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { formatDateDisplay } from '@/lib/utils.js';
import { Package, Calendar, Activity } from 'lucide-react';

const GROUP_ICONS = { Status: Activity, Allgemein: Package, Termine: Calendar };

function formatValue(row, field) {
  const v = row[field.key];
  if (v == null) return '—';
  if (field.type === 'date') return formatDateDisplay(v, field.dateFormat || 'DD.MM.YYYY');
  if (typeof v === 'boolean') return v ? 'Ja' : 'Nein';
  return String(v);
}

function DetailField({ label, value, type, labelColors }) {
  if (type === 'label') {
    const colors = labelColors || {};
    const bg = colors[value] ? '' : 'bg-muted';
    const style = colors[value] ? { backgroundColor: colors[value], color: '#fff' } : {};
    return (
      <div className="flex justify-between items-center gap-3">
        <span className="text-xs text-muted-foreground font-medium min-w-[140px]">{label}:</span>
        <Badge className={bg} style={style}>{value ?? '—'}</Badge>
      </div>
    );
  }
  return (
    <div className="flex justify-between items-start gap-3">
      <span className="text-xs text-muted-foreground font-medium min-w-[140px]">{label}:</span>
      <span className="text-sm text-right">{value}</span>
    </div>
  );
}

export function ExpandableRowDetailsContainers({ row, detailFields = [] }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 border-t-2 border-sky-200">
      <div className="grid gap-4 md:grid-cols-3">
        {detailFields.map((group) => {
          const Icon = GROUP_ICONS[group.group] || Package;
          return (
            <Card key={group.group} className="shadow-md border-0 bg-white">
              <CardHeader className="pb-3 bg-gradient-to-r from-sky-50 to-blue-50 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Icon className="h-4 w-4 text-sky-600" />
                  {group.group}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {group.fields.map((f) => (
                  <DetailField
                    key={f.key}
                    label={f.label}
                    value={f.type === 'label' ? row[f.key] : formatValue(row, f)}
                    type={f.type}
                    labelColors={f.labelColors}
                  />
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
