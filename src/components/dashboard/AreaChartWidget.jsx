import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.jsx';
import { Area, AreaChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { useState } from 'react';
import { datasets, containers } from '@/data/index.js';
import { Target } from 'lucide-react';

/**
 * Area Chart Widget - UI Bakery style
 * Configurable: title, data source, target value, show target line
 */
export function AreaChartWidget({
  componentId,
  title = 'Performance vs Target',
  dataSource = 'dashboard',
  targetValue = 85,
  showTarget = true,
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const { editMode, componentConfigs, updateComponentConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const config = componentConfigs[componentId] || {};

  const finalTitle = config.title || title;
  const finalDataSource = config.dataSource || dataSource;
  const finalTargetValue = config.targetValue !== undefined ? config.targetValue : targetValue;
  const finalShowTarget = config.showTarget !== undefined ? config.showTarget : showTarget;

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

      return Array.from({ length: 7 }, (_, i) => {
        const item = source[i % source.length] || source[0] || {};
        return {
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          performance: item.progress || 0,
          target: finalTargetValue,
        };
      });
    } catch {
      return [];
    }
  }, [finalDataSource, finalTargetValue]);

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
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-violet-500" />
              {finalTitle}
            </CardTitle>
            <p className="text-sm text-slate-500">Actual vs {finalTargetValue}% target</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={{ performance: { label: 'Performance', color: '#8b5cf6' }, target: { label: 'Target', color: '#dc2626' } }} className="h-64">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" fontSize={11} stroke="#9ca3af" />
                <YAxis fontSize={11} stroke="#9ca3af" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="performance" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                {finalShowTarget && <Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" dot={false} />}
              </AreaChart>
            </ChartContainer>
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
              targetValue: config.targetValue,
              showTarget: config.showTarget,
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
