import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import { Clock, CheckCircle2, AlertTriangle, Truck, Ship } from 'lucide-react';
import { formatDateDisplay } from '@/lib/utils.js';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { useState } from 'react';
import { datasets, containers } from '@/data/index.js';

/**
 * Activity timeline widget (Falcon-style). Shows recent activities with avatars and timestamps.
 * Configurable: title, data source, limit
 */
export function ActivityTimeline({
  componentId = 'widget-activity-timeline',
  title = 'Activity Timeline',
  dataSource = 'dashboard',
  limit = 5,
  activities: propActivities = [],
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

  const activities = useMemo(() => {
    if (propActivities.length) return propActivities;
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

      return source.slice(0, finalLimit).map((item, i) => ({
        id: `act-${i}`,
        title: `${item.name} - ${item.status}`,
        description: `${item.location} • ${item.category}`,
        user: 'System',
        timestamp: item.updated || new Date().toISOString(),
        type: item.status === 'completed' ? 'completed' : item.status === 'at-risk' ? 'alert' : 'shipment',
        badge: item.status,
        badgeVariant: item.status === 'on-time' ? 'default' : item.status === 'delayed' ? 'secondary' : 'destructive',
      }));
    } catch {
      return [];
    }
  }, [propActivities, finalDataSource, finalLimit]);
  const getIcon = (type) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'shipment':
        return <Ship className="h-4 w-4 text-blue-500" />;
      default:
        return <Truck className="h-4 w-4 text-indigo-500" />;
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              {finalTitle}
            </CardTitle>
        <p className="text-sm text-slate-500 mt-1">Recent updates and events</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <div key={activity.id || idx} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                  {getInitials(activity.user || 'System')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{activity.title || activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description || activity.details}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getIcon(activity.type)}
                    {activity.badge && (
                      <Badge variant={activity.badgeVariant || 'secondary'} className="text-xs">
                        {activity.badge}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{activity.user || 'System'}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp ? formatDateDisplay(activity.timestamp, 'DD.MM.YYYY HH:mm') : 'Just now'}
                  </span>
                </div>
              </div>
            </div>
          ))}
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
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
