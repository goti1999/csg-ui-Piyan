import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { Plus, Trash2, Save, XCircle, Code, Database, Compass, Square } from 'lucide-react';
import { STEP_TYPES } from '@/lib/triggers.js';
import { DATA_SOURCE_KEYS } from '@/data/index.js';

const STEP_ICONS = { customCode: Code, sql: Database, loadData: Database, navigate: Compass, openModal: Square };

/**
 * UI Bakery–style action config: add action with multiple steps (JavaScript, SQL, Load data, Navigate, Open modal).
 * Used inside Edit panel when adding/editing an action for a trigger.
 */
export function ActionConfigPanel({
  triggerLabel,
  initialSteps = [],
  initialName = '',
  onSave,
  onCancel,
}) {
  const [name, setName] = useState(initialName || '');
  const [steps, setSteps] = useState(() => {
    const s = initialSteps || [];
    if (s.length) return s.map((x) => ({ ...x, id: x.id || `st-${Date.now()}-${Math.random().toString(36).slice(2)}` }));
    return [{ id: `st-${Date.now()}`, type: 'customCode', config: { code: '// JavaScript\nreturn row;' } }];
  });

  const addStep = () => {
    setSteps((prev) => [...prev, { id: `st-${Date.now()}`, type: 'customCode', config: { code: '// Add your code' } }]);
  };

  const removeStep = (id) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStep = (id, patch) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const handleSave = () => {
    onSave?.({ name: name.trim() || undefined, steps });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-2 border-b">
        <h3 className="font-bold text-sm">Action config — {triggerLabel}</h3>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={onCancel} className="gap-1">
            <XCircle className="h-4 w-4" />
            Cancel
          </Button>
          <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
      <div className="pt-3 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Action name (optional)</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Load and transform" className="text-sm" />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Steps</Label>
          <Button size="sm" variant="outline" className="gap-1 h-7" onClick={addStep}>
            <Plus className="h-3 w-3" />
            Add step
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 mt-2 pr-2">
        <div className="space-y-4 pb-4">
          {steps.map((step, idx) => {
            const Icon = STEP_ICONS[step.type] || Code;
            return (
              <div key={step.id} className="rounded-lg border bg-slate-50/50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    Step {idx + 1}
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:bg-red-50" onClick={() => removeStep(step.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Select
                  value={step.type}
                  onValueChange={(v) => updateStep(step.id, { type: v, config: v === 'customCode' || v === 'sql' ? { code: step.config?.code || '' } : v === 'loadData' ? { dataSourceKey: 'containers' } : {} })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STEP_TYPES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(step.type === 'customCode' || step.type === 'sql') && (
                  <div className="space-y-1">
                    <Label className="text-xs">{step.type === 'sql' ? 'SQL' : 'JavaScript'}</Label>
                    <Textarea
                      value={step.config?.code ?? ''}
                      onChange={(e) => updateStep(step.id, { config: { ...step.config, code: e.target.value } })}
                      placeholder={step.type === 'sql' ? 'SELECT * FROM ...' : '// return row;'}
                      className="font-mono text-xs min-h-[100px]"
                    />
                  </div>
                )}
                {step.type === 'loadData' && (
                  <div className="space-y-1">
                    <Label className="text-xs">Data source</Label>
                    <Select
                      value={step.config?.dataSourceKey || 'containers'}
                      onValueChange={(v) => updateStep(step.id, { config: { ...step.config, dataSourceKey: v } })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DATA_SOURCE_KEYS.map((s) => (
                          <SelectItem key={s.key} value={s.key}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {step.type === 'navigate' && (
                  <div className="space-y-1">
                    <Label className="text-xs">Path</Label>
                    <Input
                      value={step.config?.path ?? ''}
                      onChange={(e) => updateStep(step.id, { config: { ...step.config, path: e.target.value } })}
                      placeholder="/containers"
                      className="text-xs"
                    />
                  </div>
                )}
                {step.type === 'openModal' && (
                  <div className="space-y-1">
                    <Label className="text-xs">Modal ID</Label>
                    <Input
                      value={step.config?.modalId ?? ''}
                      onChange={(e) => updateStep(step.id, { config: { ...step.config, modalId: e.target.value } })}
                      placeholder="modal-id"
                      className="text-xs"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
