import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.jsx';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import { AlertTriangle, Eye, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { useState } from 'react';
import { datasets, containers } from '@/data/index.js';

const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#22c55e',
};

/**
 * Priority breakdown chart (Falcon-style). Shows counts by priority with colors.
 * Configurable: title, data source
 */
export function PriorityBreakdownChart({
  componentId = 'chart-priority-breakdown',
  dataSource = 'dashboard',
  title = 'Unresolved by Priority',
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const { editMode, componentConfigs, updateComponentConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const config = componentConfigs[componentId] || {};

  const finalTitle = config.title || title;
  const finalDataSource = config.dataSource || dataSource;

  const data = useMemo(() => {
    try {
      let source = [];
      if (finalDataSource === 'dashboard') source = datasets.dashboard;
      else if (finalDataSource === 'operations') source = datasets.operations;
      else if (finalDataSource === 'fleet') source = datasets.fleet;
      else if (finalDataSource === 'warehouses') source = datasets.warehouses;
      else if (finalDataSource === 'containers') {
        // containers imported at top
        source = containers || [];
      }
      return source;
    } catch {
      return [];
    }
  }, [finalDataSource]);

  const priorityData = useMemo(() => [
    { priority: 'Urgent', count: data.filter((d) => d.priority === 'critical' || d.priority === 'urgent').length, color: PRIORITY_COLORS.urgent },
    { priority: 'High', count: data.filter((d) => d.priority === 'high').length, color: PRIORITY_COLORS.high },
    { priority: 'Medium', count: data.filter((d) => d.priority === 'medium').length, color: PRIORITY_COLORS.medium },
    { priority: 'Low', count: data.filter((d) => d.priority === 'low').length, color: PRIORITY_COLORS.low },
  ], [data]);

  const total = priorityData.reduce((sum, p) => sum + p.count, 0);

  return (
    <>
      <EditableWrapper
        componentId={componentId}
        componentName={finalTitle}
        componentType="chart"
        onEdit={() => setEditing(true)}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      >
        <Card className="shadow-xl border-0 bg-white dark:bg-slate-900">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {title}
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">Breakdown by priority level</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info('View all')}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info('Export')}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info('Remove')}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {priorityData.map((p) => (
              <div key={p.priority} className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="text-2xl font-bold" style={{ color: p.color }}>
                  {p.count}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{p.priority}</div>
              </div>
            ))}
          </div>
          <ChartContainer config={{ count: { label: 'Count' } }} className="h-48">
            <BarChart data={priorityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" fontSize={11} stroke="#9ca3af" />
              <YAxis dataKey="priority" type="category" fontSize={11} stroke="#9ca3af" width={60} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
      </EditableWrapper>

      {editMode && editing && (
        <ComponentEditor
          open={editing}
          onOpenChange={setEditing}
          componentId={componentId}
          componentName={finalTitle}
          componentType="chart"
          initialColumns={[]}
          initialTriggers={config.triggers}
          initialDataSource={config.dataSource ? { dataSourceKey: config.dataSource } : {}}
          onSave={(cols) => {
            updateComponentConfig(componentId, {
              ...config,
              columns: cols,
              title: config.title,
              dataSource: config.dataSource,
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
