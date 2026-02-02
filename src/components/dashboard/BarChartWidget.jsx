import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.jsx';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { useState } from 'react';
import { datasets, containers } from '@/data/index.js';
import { MapPin } from 'lucide-react';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

/**
 * Bar Chart Widget - UI Bakery style
 * Configurable: title, data source, group by field, orientation, colors
 */
export function BarChartWidget({
  componentId,
  title = 'Top Locations',
  dataSource = 'dashboard',
  groupBy = 'location',
  orientation = 'vertical',
  colors = COLORS,
  limit = 8,
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const { editMode, componentConfigs, updateComponentConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const config = componentConfigs[componentId] || {};

  const finalTitle = config.title || title;
  const finalDataSource = config.dataSource || dataSource;
  const finalGroupBy = config.groupBy || groupBy;
  const finalOrientation = config.orientation || orientation;
  const finalColors = config.colors || colors;
  const finalLimit = config.limit || limit;

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

      const grouped = source.reduce((acc, item) => {
        const key = item[finalGroupBy] || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(grouped)
        .map(([key, count]) => ({ [finalGroupBy]: key, count, fill: finalColors[Math.floor(Math.random() * finalColors.length)] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, finalLimit);
    } catch {
      return [];
    }
  }, [finalDataSource, finalGroupBy, finalColors, finalLimit]);

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
              <MapPin className="h-5 w-5 text-emerald-500" />
              {finalTitle}
            </CardTitle>
            <p className="text-sm text-slate-500">Volume by {finalGroupBy}</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={{ count: { label: 'Count', color: '#22c55e' } }} className="h-64">
              <BarChart data={data} layout={finalOrientation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                {finalOrientation === 'vertical' ? (
                  <>
                    <XAxis type="number" fontSize={11} stroke="#9ca3af" />
                    <YAxis dataKey={finalGroupBy} type="category" fontSize={11} stroke="#9ca3af" width={50} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey={finalGroupBy} fontSize={11} stroke="#9ca3af" />
                    <YAxis type="number" fontSize={11} stroke="#9ca3af" />
                  </>
                )}
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.fill || finalColors[i % finalColors.length]} />
                  ))}
                </Bar>
              </BarChart>
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
              groupBy: config.groupBy,
              orientation: config.orientation,
              colors: config.colors,
              limit: config.limit,
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
