import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { useState } from 'react';
import { datasets, containers } from '@/data/index.js';
import { Zap } from 'lucide-react';

/**
 * Quick Stats Widget - UI Bakery style
 * Configurable: title, data source, stats to show, colors
 */
export function QuickStatsWidget({
  componentId,
  title = 'Quick Stats',
  dataSource = 'dashboard',
  stats = ['onTimeRate', 'avgProgress', 'completed', 'total'],
  bgGradient = 'from-indigo-600 via-purple-600 to-pink-600',
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const { editMode, componentConfigs, updateComponentConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const config = componentConfigs[componentId] || {};

  const finalTitle = config.title || title;
  const finalDataSource = config.dataSource || dataSource;
  const finalStats = config.stats || stats;
  const finalBgGradient = config.bgGradient || bgGradient;

  const kpis = useMemo(() => {
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

      const total = source.length;
      const onTime = source.filter((r) => r.status === 'on-time').length;
      const completed = source.filter((r) => r.status === 'completed').length;
      const avgProgress = Math.round(source.reduce((acc, r) => acc + (r.progress || 0), 0) / Math.max(total, 1));
      const onTimePercent = total > 0 ? Math.round((onTime / total) * 100) : 0;

      return { total, onTime, completed, avgProgress, onTimePercent };
    } catch {
      return { total: 0, onTime: 0, completed: 0, avgProgress: 0, onTimePercent: 0 };
    }
  }, [finalDataSource]);

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
        <Card className={`shadow-xl border-0 bg-gradient-to-br ${finalBgGradient} text-white`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {finalTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {finalStats.includes('onTimeRate') && (
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">On-Time Rate</span>
                    <span className="text-lg font-bold">{kpis.onTimePercent}%</span>
                  </div>
                  <Progress value={kpis.onTimePercent} className="h-2 bg-white/20" />
                </div>
              )}
              {finalStats.includes('avgProgress') && (
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Avg. Progress</span>
                    <span className="text-lg font-bold">{kpis.avgProgress}%</span>
                  </div>
                  <Progress value={kpis.avgProgress} className="h-2 bg-white/20" />
                </div>
              )}
              {finalStats.includes('completed') && (
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{kpis.completed}</p>
                  <p className="text-xs text-white/70">Completed</p>
                </div>
              )}
              {finalStats.includes('total') && (
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{kpis.total}</p>
                  <p className="text-xs text-white/70">Total Active</p>
                </div>
              )}
            </div>
            <div className="pt-4 mt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Last Updated</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
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
          componentType="card"
          initialColumns={[]}
          initialTriggers={config.triggers}
          initialDataSource={config.dataSource ? { dataSourceKey: config.dataSource } : {}}
          onSave={(cols) => {
            updateComponentConfig(componentId, {
              ...config,
              columns: cols,
              title: config.title,
              dataSource: config.dataSource,
              stats: config.stats,
              bgGradient: config.bgGradient,
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
