import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Calendar as CalendarComponent } from '@/components/ui/calendar.jsx';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

/**
 * Calendar Widget - UI Bakery style
 * Configurable: mode (single/range), events
 */
export function CalendarWidget({
  componentId,
  title = 'Calendar',
  mode = 'single',
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const { editMode, componentConfigs, updateComponentConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const config = componentConfigs[componentId] || {};

  const finalTitle = config.title || title;
  const finalMode = config.mode || mode;

  return (
    <>
      <EditableWrapper
        componentId={componentId}
        componentName={finalTitle}
        componentType="card"
        onEdit={() => setEditing(true)}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      >
        <Card className="shadow-xl border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              {finalTitle}
            </CardTitle>
            <p className="text-sm text-slate-500">Upcoming events</p>
          </CardHeader>
          <CardContent className="pt-4">
            <CalendarComponent mode={finalMode} className="rounded-md border-0" />
          </CardContent>
        </Card>
      </EditableWrapper>

      {editMode && editing && (
        <ComponentEditor
          open={editing}
          onOpenChange={setEditing}
          componentId={componentId}
          componentName={finalTitle}
          componentType="card"
          initialColumns={[]}
          initialTriggers={config.triggers}
          initialDataSource={{}}
          onSave={(cols) => {
            updateComponentConfig(componentId, {
              ...config,
              columns: cols,
              title: config.title,
              mode: config.mode,
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
