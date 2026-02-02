import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { useState } from 'react';
import { datasets, containers } from '@/data/index.js';

// Helper function - defined outside component to avoid hoisting issues
function formatCurrency(amount, curr) {
  const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
  const symbol = symbols[curr] || '$';
  if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(1)}K`;
  return `${symbol}${amount.toLocaleString()}`;
}

/**
 * Individual KPI Card Widget - UI Bakery style
 * Configurable: icon, label, data source, currency, colors, show percentage, show progress
 */
export function KpiCardWidget({
  componentId,
  icon,
  label = 'KPI',
  dataSource = 'dashboard',
  valueField = 'total',
  currency = 'USD',
  showPercentage = true,
  showProgress = false,
  change = null,
  changeType = 'neutral',
  bgColor = 'from-blue-600 to-indigo-700',
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const { editMode, componentConfigs, updateComponentConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const config = componentConfigs[componentId] || {};
  
  // Use config overrides if present
  const finalLabel = config.label || label;
  const finalDataSource = config.dataSource || dataSource;
  const finalValueField = config.valueField || valueField;
  const finalCurrency = config.currency || currency;
  const finalShowPercentage = config.showPercentage !== undefined ? config.showPercentage : showPercentage;
  const finalShowProgress = config.showProgress !== undefined ? config.showProgress : showProgress;
  const finalChange = config.change !== undefined ? config.change : change;
  const finalChangeType = config.changeType || changeType;
  const finalBgColor = config.bgColor || bgColor;

  const data = useMemo(() => {
    try {
      if (finalDataSource === 'dashboard') return datasets.dashboard || [];
      if (finalDataSource === 'operations') return datasets.operations || [];
      if (finalDataSource === 'fleet') return datasets.fleet || [];
      if (finalDataSource === 'warehouses') return datasets.warehouses || [];
      if (finalDataSource === 'containers') {
        return containers || [];
      }
      return [];
    } catch (err) {
      console.error('[KpiCardWidget] Data error:', err);
      return [];
    }
  }, [finalDataSource]);

  const kpiValue = useMemo(() => {
    if (finalValueField === 'total') return data.length;
    if (finalValueField === 'onTime') return data.filter((r) => r.status === 'on-time').length;
    if (finalValueField === 'delayed') return data.filter((r) => r.status === 'delayed').length;
    if (finalValueField === 'atRisk') return data.filter((r) => r.status === 'at-risk').length;
    if (finalValueField === 'completed') return data.filter((r) => r.status === 'completed').length;
    if (finalValueField === 'avgProgress') {
      return Math.round(data.reduce((acc, r) => acc + (r.progress || 0), 0) / Math.max(data.length, 1));
    }
    if (finalValueField === 'totalAmount') {
      const total = data.reduce((acc, r) => acc + (r.amount || 0), 0);
      return formatCurrency(total, finalCurrency);
    }
    return 0;
  }, [data, finalValueField, finalCurrency]);

  const percentage = useMemo(() => {
    if (!finalShowPercentage || finalValueField === 'total' || finalValueField === 'totalAmount' || finalValueField === 'avgProgress') {
      return null;
    }
    const total = data.length;
    if (total === 0) return 0;
    const value = typeof kpiValue === 'string' ? parseFloat(kpiValue.replace(/[^0-9.]/g, '')) : kpiValue;
    return Math.round((value / total) * 100);
  }, [data, kpiValue, finalShowPercentage, finalValueField]);

  const progressValue = useMemo(() => {
    if (!finalShowProgress) return null;
    if (finalValueField === 'avgProgress') {
      return typeof kpiValue === 'number' ? kpiValue : parseFloat(String(kpiValue).replace(/[^0-9.]/g, '')) || 0;
    }
    return percentage;
  }, [finalShowProgress, finalValueField, kpiValue, percentage]);

  const displayValue = typeof kpiValue === 'string' ? kpiValue : kpiValue.toLocaleString();

  return (
    <>
      <EditableWrapper
        componentId={componentId}
        componentName={finalLabel}
        componentType="card"
        onEdit={() => setEditing(true)}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      >
        <Card className={`shadow-xl border-0 bg-gradient-to-br ${finalBgColor} text-white overflow-hidden relative transition-all hover:scale-105 hover:shadow-2xl`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
              {finalChange && (
                <Badge className={`text-xs ${finalChangeType === 'positive' ? 'bg-emerald-500/30 text-emerald-100' : finalChangeType === 'negative' ? 'bg-red-500/30 text-red-100' : 'bg-white/20 text-white'}`}>
                  {finalChangeType === 'positive' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {finalChangeType === 'negative' && <TrendingDown className="h-3 w-3 mr-1" />}
                  {finalChange}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/70 font-medium">{finalLabel}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{displayValue}</p>
                {percentage !== null && <p className="text-sm text-white/70">{percentage}%</p>}
              </div>
            </div>
            {progressValue !== null && (
              <div className="mt-3">
                <Progress value={progressValue} className="h-1.5 bg-white/20" />
              </div>
            )}
          </CardContent>
        </Card>
      </EditableWrapper>

      {editMode && editing && (
        <ComponentEditor
          open={editing}
          onOpenChange={setEditing}
          componentId={componentId}
          componentName={finalLabel}
          componentType="card"
          initialColumns={[]}
          initialTriggers={config.triggers}
          initialDataSource={config.dataSource ? { dataSourceKey: config.dataSource } : {}}
          onSave={(cols) => {
            updateComponentConfig(componentId, {
              ...config,
              columns: cols,
              label: config.label,
              dataSource: config.dataSource,
              currency: config.currency,
              valueField: config.valueField,
              showPercentage: config.showPercentage,
              showProgress: config.showProgress,
              change: config.change,
              changeType: config.changeType,
              bgColor: config.bgColor,
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
