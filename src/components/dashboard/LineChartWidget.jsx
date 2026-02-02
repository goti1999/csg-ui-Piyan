import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.jsx';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { useState } from 'react';
import { datasets, containers } from '@/data/index.js';
import { BarChart3, Eye, Download, X } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Line Chart Widget - UI Bakery style
 * Configurable: title, data source, lines (multiple metrics), colors, time period
 */
export function LineChartWidget({
  componentId,
  title = 'Performance Trend',
  dataSource = 'dashboard',
  lines = [{ key: 'shipments', label: 'Shipments', color: '#6366f1' }],
  timePeriod = 'days',
  showLegend = true,
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const { editMode, componentConfigs, updateComponentConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const config = componentConfigs[componentId] || {};

  const finalTitle = config.title || title;
  const finalDataSource = config.dataSource || dataSource;
  const finalLines = config.lines || lines;
  const finalTimePeriod = config.timePeriod || timePeriod;

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

      return Array.from({ length: finalTimePeriod === 'days' ? 12 : finalTimePeriod === 'weeks' ? 7 : 12 }, (_, i) => {
        const item = source[i % source.length] || source[0] || {};
        const result = {
          name: finalTimePeriod === 'days' ? `Day ${i + 1}` : finalTimePeriod === 'weeks' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : `Month ${i + 1}`,
        };
        finalLines.forEach((line) => {
          if (line.key === 'shipments') result[line.key] = Math.floor((item.amount || 0) / 100);
          else if (line.key === 'onTime') result[line.key] = item.status === 'on-time' ? item.progress || 0 : (item.progress || 0) * 0.8;
          else if (line.key === 'delayed') result[line.key] = item.status === 'delayed' ? (item.progress || 0) * 0.3 : 0;
          else if (line.key === 'progress') result[line.key] = item.progress || 0;
          else result[line.key] = item[line.key] || 0;
        });
        return result;
      });
    } catch {
      return [];
    }
  }, [finalDataSource, finalLines, finalTimePeriod]);

  const chartConfig = useMemo(() => {
    const cfg = {};
    finalLines.forEach((line) => {
      cfg[line.key] = { label: line.label, color: line.color };
    });
    return cfg;
  }, [finalLines]);

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
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                {finalTitle}
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Performance metrics over time</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Live</Badge>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info('View all')}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info('Export')}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="h-72">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={11} stroke="#9ca3af" />
                <YAxis fontSize={11} stroke="#9ca3af" />
                <ChartTooltip content={<ChartTooltipContent />} />
                {showLegend && <Legend />}
                {finalLines.map((line) => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    stroke={line.color}
                    strokeWidth={line.key === 'shipments' ? 3 : 2}
                    dot={{ r: line.key === 'shipments' ? 4 : 3 }}
                    activeDot={{ r: line.key === 'shipments' ? 6 : 4 }}
                  />
                ))}
              </LineChart>
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
              lines: config.lines,
              timePeriod: config.timePeriod,
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
