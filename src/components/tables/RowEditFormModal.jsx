import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { Save, XCircle, StickyNote, AlertCircle, Send, Copy } from 'lucide-react';
import { formatDateDisplay } from '@/lib/utils.js';
import { toast } from 'sonner';

/**
 * Form modal to edit a table row. Loads row data, editable fields from detailFields,
 * Submit/Cancel, plus daily-use actions (notes, mark urgent, request update).
 */
export function RowEditFormModal({
  open,
  onOpenChange,
  row,
  detailFields = [],
  onSave,
  title = 'Edit Row',
}) {
  const [form, setForm] = useState({});
  const [note, setNote] = useState('');
  const [markUrgent, setMarkUrgent] = useState(false);

  useEffect(() => {
    if (row) {
      setForm({ ...row });
      setNote(row._note ?? '');
      setMarkUrgent(row._urgent ?? false);
    }
  }, [row, open]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const out = { ...form };
    if (note) out._note = note;
    out._urgent = markUrgent;
    onSave?.(out);
    onOpenChange(false);
    toast.success('Changes saved');
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleCopyRow = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(form, null, 2));
      toast.success('Row data copied to clipboard');
    } catch {
      toast.error('Could not copy');
    }
  };

  const renderField = (f) => {
    const val = form[f.key];
    if (f.type === 'label') {
      const colors = f.labelColors || {};
      const bg = colors[val] || 'bg-muted';
      return (
        <div key={f.key} className="flex justify-between items-center gap-3">
          <Label className="text-xs text-muted-foreground font-medium min-w-[140px]">{f.label}</Label>
          <Badge className={bg} style={colors[val] ? { backgroundColor: colors[val], color: '#fff' } : {}}>{String(val ?? '—')}</Badge>
        </div>
      );
    }
    if (f.type === 'date') {
      const raw = val ? new Date(val) : null;
      const iso = raw && !Number.isNaN(raw.getTime()) ? raw.toISOString().slice(0, 16) : '';
      return (
        <div key={f.key} className="space-y-1.5">
          <Label className="text-xs font-medium">{f.label}</Label>
          <Input
            type="datetime-local"
            value={iso}
            onChange={(e) => handleChange(f.key, e.target.value ? new Date(e.target.value).toISOString() : null)}
            className="font-mono text-sm"
          />
        </div>
      );
    }
    if (typeof val === 'boolean') {
      return (
        <div key={f.key} className="flex items-center justify-between gap-3">
          <Label className="text-xs font-medium">{f.label}</Label>
          <Switch checked={!!val} onCheckedChange={(v) => handleChange(f.key, v)} />
        </div>
      );
    }
    return (
      <div key={f.key} className="space-y-1.5">
        <Label className="text-xs font-medium">{f.label}</Label>
        <Input
          value={val ?? ''}
          onChange={(e) => handleChange(f.key, e.target.value)}
          placeholder={f.label}
          className="font-mono text-sm"
        />
      </div>
    );
  };

  if (!row) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title} — {row.Container_No || row.containerNumber || row.name || row.id}
          </DialogTitle>
          <DialogDescription>Edit fields and use daily actions. Submit to save.</DialogDescription>
        </DialogHeader>
        <Separator />
        <form id="row-edit-form" onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 py-2">
              {detailFields.map((group) => (
                <div key={group.group} className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-700">{group.group}</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.fields.filter((f) => f.type !== 'label').map(renderField)}
                    {group.fields.filter((f) => f.type === 'label').map(renderField)}
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700">Daily actions</h4>
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-amber-500" />
                <Label className="text-xs font-medium">Note</Label>
              </div>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (saved with row)..."
                className="min-h-[80px] font-mono text-sm"
              />
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <Label className="text-sm font-medium">Mark as urgent</Label>
                </div>
                <Switch checked={markUrgent} onCheckedChange={setMarkUrgent} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleCopyRow}>
                  <Copy className="h-4 w-4" />
                  Copy row data
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => toast.info('Request update sent (placeholder)')}>
                  <Send className="h-4 w-4" />
                  Request update
                </Button>
              </div>
            </div>
          </ScrollArea>
          <Separator className="my-4" />
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} className="gap-2">
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" form="row-edit-form" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Save className="h-4 w-4" />
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
