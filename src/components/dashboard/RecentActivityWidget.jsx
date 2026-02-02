import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { useState } from 'react';
import { datasets, containers } from '@/data/index.js';
import { Activity, RefreshCw, CheckCircle2, Clock3, AlertTriangle, Truck } from 'lucide-react';
import { formatDateDisplay } from '@/lib/utils.js';

/**
 * Recent Activity Widget - UI Bakery style
 * Configurable: title, data source, limit, show refresh
 */
export function RecentActivityWidget({
  componentId,
  title = 'Recent Activity',
  dataSource = 'dashboard',
  limit = 6,
  showRefresh = true,
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const { editMode, componentConfigs, updateComponentConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const config = componentConfigs[componentId] || {};

  const finalTitle = config.title || title;
  const finalDataSource = config.dataSource || dataSource;
  const finalLimit = config.limit || limit;
  const finalShowRefresh = config.showRefresh !== undefined ? config.showRefresh : showRefresh;

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
      return source.slice(0, finalLimit);
    } catch {
      return [];
    }
  }, [finalDataSource, finalLimit]);

  const handleRefresh = () => {
    // Trigger refresh - in real app, this would reload data
    window.location.reload();
  };

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
          <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-pink-500" />
                {finalTitle}
              </CardTitle>
              <p className="text-sm text-slate-500">Latest updates</p>
            </div>
            {finalShowRefresh && (
              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={handleRefresh}>
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {data.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                data.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div
                      className={`p-2 rounded-lg ${item.status === 'on-time' ? 'bg-emerald-100 text-emerald-600' : item.status === 'delayed' ? 'bg-amber-100 text-amber-600' : item.status === 'at-risk' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}
                    >
                      {item.status === 'on-time' ? <CheckCircle2 className="h-4 w-4" /> : item.status === 'delayed' ? <Clock3 className="h-4 w-4" /> : item.status === 'at-risk' ? <AlertTriangle className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.location} • {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`text-xs ${item.status === 'on-time' ? 'border-emerald-500 text-emerald-600' : item.status === 'delayed' ? 'border-amber-500 text-amber-600' : item.status === 'at-risk' ? 'border-red-500 text-red-600' : 'border-indigo-500 text-indigo-600'}`}>
                        {item.status}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">{item.progress}% complete</p>
                    </div>
                  </div>
                ))
              )}
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
              limit: config.limit,
              showRefresh: config.showRefresh,
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
