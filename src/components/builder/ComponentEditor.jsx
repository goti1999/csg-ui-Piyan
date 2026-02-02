import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { useApp } from '@/contexts/useApp.js';
import { getTriggersForComponent, ACTION_TYPES } from '@/lib/triggers.js';
import { ActionConfigPanel } from '@/components/builder/ActionConfigPanel.jsx';
import { DATA_SOURCE_KEYS } from '@/data/index.js';
import { 
  Settings, 
  Save, 
  XCircle, 
  Plus, 
  Trash2, 
  GripVertical,
  Eye,
  EyeOff,
  ArrowUpDown,
  Filter,
  Edit,
  Zap,
  Palette,
  Database,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

function emptyTriggersObj() {
  return { onInit: [], onSubmit: [], onClick: [], onRowClick: [], onChange: [] };
}

export function ComponentEditor({
  open,
  onOpenChange,
  componentId,
  componentName,
  componentType = 'table',
  initialColumns = [],
  initialTriggers,
  initialDataSource = {},
  onSave,
}) {
  const { t, updateComponentConfig } = useApp();
  const [columns, setColumns] = useState(initialColumns);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [newActionLabel, setNewActionLabel] = useState('');
  const [newActionType, setNewActionType] = useState('navigate');
  const [triggers, setTriggers] = useState(() => emptyTriggersObj());
  const [dataSourceKey, setDataSourceKey] = useState(initialDataSource.dataSourceKey || 'local');
  const [apiEndpoint, setApiEndpoint] = useState(initialDataSource.apiEndpoint || '');
  const [autoRefresh, setAutoRefresh] = useState(initialDataSource.autoRefresh ?? false);
  const [refreshInterval, setRefreshInterval] = useState(initialDataSource.refreshInterval ?? 30);
  const [triggerActionType, setTriggerActionType] = useState('loadData');
  const [triggerActionDataSource, setTriggerActionDataSource] = useState('containers');
  const [addingTriggerId, setAddingTriggerId] = useState(null);
  const [configuringTriggerId, setConfiguringTriggerId] = useState(null);
  const [editingAction, setEditingAction] = useState(null);

  const availableTriggers = getTriggersForComponent(componentType);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  useEffect(() => {
    const base = emptyTriggersObj();
    const incoming = initialTriggers || {};
    setTriggers({ ...base, ...incoming });
  }, [initialTriggers, open]);

  useEffect(() => {
    setDataSourceKey(initialDataSource.dataSourceKey || 'local');
    setApiEndpoint(initialDataSource.apiEndpoint || '');
    setAutoRefresh(initialDataSource.autoRefresh ?? false);
    setRefreshInterval(initialDataSource.refreshInterval ?? 30);
  }, [initialDataSource, open]);

  const selectedColumn = columns.find(c => c.id === selectedColumnId);

  const handleColumnUpdate = (columnId, updates) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const handleAddAction = () => {
    if (!selectedColumnId || !newActionLabel.trim()) return;
    
    const newAction = {
      id: `action-${Date.now()}`,
      label: newActionLabel,
      type: 'button',
      actionType: newActionType,
      config: {},
    };

    setColumns(prev => prev.map(col =>
      col.id === selectedColumnId
        ? { ...col, actions: [...(col.actions || []), newAction] }
        : col
    ));
    
    setNewActionLabel('');
    toast.success(`Action "${newActionLabel}" added`);
  };

  const handleRemoveAction = (columnId, actionId) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId
        ? { ...col, actions: (col.actions || []).filter(a => a.id !== actionId) }
        : col
    ));
    toast.success('Action removed');
  };

  const addTriggerAction = (triggerId) => {
    const action = {
      id: `ta-${Date.now()}`,
      actionType: triggerActionType,
      label: triggerActionType === 'loadData' ? `Load ${triggerActionDataSource}` : triggerActionType,
      config: triggerActionType === 'loadData' ? { dataSourceKey: triggerActionDataSource } : {},
    };
    setTriggers((prev) => ({
      ...prev,
      [triggerId]: [...(prev[triggerId] || []), action],
    }));
    setAddingTriggerId(null);
    toast.success(`Action added to ${triggerId}`);
  };

  const saveActionConfig = (triggerId, payload) => {
    const { name, steps } = payload;
    const id = editingAction?.id || `ta-${Date.now()}`;
    const action = { id, name, steps };
    setTriggers((prev) => {
      const list = prev[triggerId] || [];
      if (editingAction) {
        return { ...prev, [triggerId]: list.map((a) => (a.id === editingAction.id ? action : a)) };
      }
      return { ...prev, [triggerId]: [...list, action] };
    });
    setConfiguringTriggerId(null);
    setEditingAction(null);
    toast.success(editingAction ? 'Action updated' : 'Action added');
  };

  const removeTriggerAction = (triggerId, actionId) => {
    setTriggers((prev) => ({
      ...prev,
      [triggerId]: (prev[triggerId] || []).filter((a) => a.id !== actionId),
    }));
    if (editingAction?.id === actionId) {
      setEditingAction(null);
      setConfiguringTriggerId(null);
    }
    toast.success('Trigger action removed');
  };

  const handleSave = () => {
    onSave?.(columns);
    updateComponentConfig(componentId, {
      columns,
      triggers,
      dataSource: {
        dataSourceKey: dataSourceKey === 'local' ? undefined : dataSourceKey,
        apiEndpoint: apiEndpoint || undefined,
        autoRefresh,
        refreshInterval,
      },
    });
    toast.success('Component configuration saved!');
    onOpenChange(false);
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: `col-${Date.now()}`,
      key: `new_column_${columns.length + 1}`,
      label: `New Column ${columns.length + 1}`,
      visible: true,
      sortable: true,
      filterable: false,
      editable: false,
    };
    setColumns(prev => [...prev, newColumn]);
  };

  const handleRemoveColumn = (columnId) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
    if (selectedColumnId === columnId) {
      setSelectedColumnId(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Edit: {componentName}
          </SheetTitle>
          <SheetDescription>
            Configure properties, columns, triggers & actions (UI Bakery–style). Add JavaScript, SQL, Load data, Navigate, etc.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <Tabs defaultValue="properties" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-6 rounded-none border-b bg-muted/30">
            <TabsTrigger value="properties" className="gap-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <Settings className="h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="triggers" className="gap-1 rounded-none">
              <Zap className="h-4 w-4" />
              Triggers
            </TabsTrigger>
            <TabsTrigger value="columns" className="gap-1 rounded-none">
              <Database className="h-4 w-4" />
              Columns
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-1 rounded-none">
              <Zap className="h-4 w-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="styles" className="gap-1 rounded-none">
              <Palette className="h-4 w-4" />
              Styles
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-1 rounded-none">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab - Widget-specific settings (currency, data source, colors, etc.) */}
          <TabsContent value="properties" className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Component Title</Label>
                <Input
                  value={componentName}
                  onChange={(e) => {
                    // Title is managed by parent, but we can update config
                    updateComponentConfig(componentId, { ...componentConfigs[componentId], title: e.target.value });
                  }}
                  className="font-semibold"
                  placeholder="Component name"
                />
              </div>

              {/* KPI Card Properties */}
              {(componentType === 'card' || componentName?.includes('KPI')) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm">KPI Card Settings</h3>
                    <div className="space-y-2">
                      <Label className="font-semibold">Data Source</Label>
                      <Select
                        value={componentConfigs[componentId]?.dataSource || 'dashboard'}
                        onValueChange={(v) => updateComponentConfig(componentId, { ...componentConfigs[componentId], dataSource: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="fleet">Fleet</SelectItem>
                          <SelectItem value="warehouses">Warehouses</SelectItem>
                          <SelectItem value="containers">Containers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Value Field</Label>
                      <Select
                        value={componentConfigs[componentId]?.valueField || 'total'}
                        onValueChange={(v) => updateComponentConfig(componentId, { ...componentConfigs[componentId], valueField: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="total">Total</SelectItem>
                          <SelectItem value="onTime">On-Time</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                          <SelectItem value="atRisk">At Risk</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="avgProgress">Avg Progress</SelectItem>
                          <SelectItem value="totalAmount">Total Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Currency</Label>
                      <Select
                        value={componentConfigs[componentId]?.currency || 'USD'}
                        onValueChange={(v) => updateComponentConfig(componentId, { ...componentConfigs[componentId], currency: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Show Percentage</Label>
                      <Switch
                        checked={componentConfigs[componentId]?.showPercentage !== false}
                        onCheckedChange={(v) => updateComponentConfig(componentId, { ...componentConfigs[componentId], showPercentage: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Show Progress Bar</Label>
                      <Switch
                        checked={componentConfigs[componentId]?.showProgress || false}
                        onCheckedChange={(v) => updateComponentConfig(componentId, { ...componentConfigs[componentId], showProgress: v })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Background Gradient</Label>
                      <Input
                        value={componentConfigs[componentId]?.bgColor || 'from-blue-600 to-indigo-700'}
                        onChange={(e) => updateComponentConfig(componentId, { ...componentConfigs[componentId], bgColor: e.target.value })}
                        placeholder="from-blue-600 to-indigo-700"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Chart Properties */}
              {(componentType === 'chart') && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm">Chart Settings</h3>
                    <div className="space-y-2">
                      <Label className="font-semibold">Data Source</Label>
                      <Select
                        value={componentConfigs[componentId]?.dataSource || 'dashboard'}
                        onValueChange={(v) => updateComponentConfig(componentId, { ...componentConfigs[componentId], dataSource: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="fleet">Fleet</SelectItem>
                          <SelectItem value="warehouses">Warehouses</SelectItem>
                          <SelectItem value="containers">Containers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {componentName?.includes('Pie') && (
                      <div className="space-y-2">
                        <Label className="font-semibold">Group By Field</Label>
                        <Input
                          value={componentConfigs[componentId]?.groupBy || 'status'}
                          onChange={(e) => updateComponentConfig(componentId, { ...componentConfigs[componentId], groupBy: e.target.value })}
                          placeholder="status"
                          className="font-mono text-sm"
                        />
                      </div>
                    )}
                    {componentName?.includes('Bar') && (
                      <>
                        <div className="space-y-2">
                          <Label className="font-semibold">Group By Field</Label>
                          <Input
                            value={componentConfigs[componentId]?.groupBy || 'location'}
                            onChange={(e) => updateComponentConfig(componentId, { ...componentConfigs[componentId], groupBy: e.target.value })}
                            placeholder="location"
                            className="font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold">Orientation</Label>
                          <Select
                            value={componentConfigs[componentId]?.orientation || 'vertical'}
                            onValueChange={(v) => updateComponentConfig(componentId, { ...componentConfigs[componentId], orientation: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vertical">Vertical</SelectItem>
                              <SelectItem value="horizontal">Horizontal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    {componentName?.includes('Area') && (
                      <div className="space-y-2">
                        <Label className="font-semibold">Target Value</Label>
                        <Input
                          type="number"
                          value={componentConfigs[componentId]?.targetValue || 85}
                          onChange={(e) => updateComponentConfig(componentId, { ...componentConfigs[componentId], targetValue: Number(e.target.value) || 85 })}
                          className="font-semibold"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              <Separator />
              <p className="text-xs text-muted-foreground">
                Changes are saved automatically. Use other tabs for triggers, actions, and styling.
              </p>
            </div>
          </TabsContent>

          {/* Columns Tab */}
          <TabsContent value="columns" className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Column List */}
              <div className="border rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-50 px-4 py-2 border-b flex items-center justify-between">
                  <h3 className="font-bold text-sm">Columns ({columns.length})</h3>
                  <Button size="sm" variant="outline" className="h-7 gap-1" onClick={handleAddColumn}>
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {columns.map((column) => (
                      <div
                        key={column.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedColumnId === column.id
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                        onClick={() => setSelectedColumnId(column.id)}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{column.label}</p>
                            <p className="text-xs text-slate-500 truncate">{column.key}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {column.visible ? (
                              <Eye className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-slate-400" />
                            )}
                            {column.sortable && <ArrowUpDown className="h-3 w-3 text-blue-500" />}
                            {column.filterable && <Filter className="h-3 w-3 text-amber-500" />}
                            {(column.actions?.length || 0) > 0 && (
                              <Badge className="text-xs h-4 px-1 bg-purple-500">
                                {column.actions?.length}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Column Editor */}
              <div className="border rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-50 px-4 py-2 border-b">
                  <h3 className="font-bold text-sm">
                    {selectedColumn ? `Edit: ${selectedColumn.label}` : 'Select a column'}
                  </h3>
                </div>
                {selectedColumn ? (
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Column Label</Label>
                        <Input
                          value={selectedColumn.label}
                          onChange={(e) => handleColumnUpdate(selectedColumn.id, { label: e.target.value })}
                          className="font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Data Key</Label>
                        <Input
                          value={selectedColumn.key}
                          onChange={(e) => handleColumnUpdate(selectedColumn.id, { key: e.target.value })}
                          className="font-semibold font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Width (px)</Label>
                        <Input
                          type="number"
                          value={selectedColumn.width || ''}
                          onChange={(e) => handleColumnUpdate(selectedColumn.id, { width: Number(e.target.value) || undefined })}
                          placeholder="Auto"
                          className="font-semibold"
                        />
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-bold text-sm">Column Options</h4>
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold">Visible</Label>
                          <Switch
                            checked={selectedColumn.visible}
                            onCheckedChange={(checked) => handleColumnUpdate(selectedColumn.id, { visible: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold">Sortable</Label>
                          <Switch
                            checked={selectedColumn.sortable}
                            onCheckedChange={(checked) => handleColumnUpdate(selectedColumn.id, { sortable: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold">Filterable</Label>
                          <Switch
                            checked={selectedColumn.filterable}
                            onCheckedChange={(checked) => handleColumnUpdate(selectedColumn.id, { filterable: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold">Editable</Label>
                          <Switch
                            checked={selectedColumn.editable}
                            onCheckedChange={(checked) => handleColumnUpdate(selectedColumn.id, { editable: checked })}
                          />
                        </div>
                      </div>
                      <Separator />
                      <div className="pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => handleRemoveColumn(selectedColumn.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Column
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <p>Select a column to edit</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Column Selection */}
              <div className="border rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-50 px-4 py-2 border-b">
                  <h3 className="font-bold text-sm">Select Column for Actions</h3>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {columns.map((column) => (
                      <div
                        key={column.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedColumnId === column.id
                            ? 'bg-purple-50 border-purple-300'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                        onClick={() => setSelectedColumnId(column.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{column.label}</span>
                          <Badge variant="secondary" className="text-xs">
                            {column.actions?.length || 0} actions
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Action Editor */}
              <div className="border rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-50 px-4 py-2 border-b">
                  <h3 className="font-bold text-sm">
                    {selectedColumn ? `Actions: ${selectedColumn.label}` : 'Select a column'}
                  </h3>
                </div>
                {selectedColumn ? (
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {/* Existing Actions */}
                      <div className="space-y-2">
                        <Label className="font-bold">Current Actions</Label>
                        {(selectedColumn.actions?.length || 0) === 0 ? (
                          <p className="text-sm text-slate-500">No actions configured</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedColumn.actions?.map((action) => (
                              <div
                                key={action.id}
                                className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-bold text-sm">{action.label}</p>
                                  <p className="text-xs text-slate-500">{action.actionType}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemoveAction(selectedColumn.id, action.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Add New Action */}
                      <div className="space-y-3">
                        <Label className="font-bold">Add New Action</Label>
                        <div className="space-y-2">
                          <Input
                            value={newActionLabel}
                            onChange={(e) => setNewActionLabel(e.target.value)}
                            placeholder="Action label (e.g., View Details)"
                            className="font-semibold"
                          />
                          <Select value={newActionType} onValueChange={(v) => setNewActionType(v)}>
                            <SelectTrigger className="font-semibold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="navigate">Navigate to Page</SelectItem>
                              <SelectItem value="api">Call API</SelectItem>
                              <SelectItem value="modal">Open Modal</SelectItem>
                              <SelectItem value="custom">Custom JavaScript</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            className="w-full gap-2"
                            onClick={handleAddAction}
                            disabled={!newActionLabel.trim()}
                          >
                            <Plus className="h-4 w-4" />
                            Add Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <p>Select a column to manage actions</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Triggers Tab - UI Bakery style: triggers + actions with steps (JS, SQL, Load data, etc.) */}
          <TabsContent value="triggers" className="flex-1 overflow-hidden flex flex-col p-0">
            {configuringTriggerId ? (
              <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
                <ActionConfigPanel
                  triggerLabel={availableTriggers.find((t) => t.id === configuringTriggerId)?.label || configuringTriggerId}
                  initialName={editingAction?.name}
                  initialSteps={editingAction?.steps || []}
                  onSave={(payload) => saveActionConfig(configuringTriggerId, payload)}
                  onCancel={() => { setConfiguringTriggerId(null); setEditingAction(null); }}
                />
              </div>
            ) : (
            <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              <p className="text-sm text-muted-foreground">
                Add actions to triggers. Use Add action for steps: JavaScript, SQL, Load data, Navigate, Open modal.
              </p>
              {availableTriggers.map((tr) => {
                const list = triggers[tr.id] || [];
                return (
                  <div key={tr.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 border-b flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm">{tr.label}</h3>
                        <p className="text-xs text-muted-foreground">{tr.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => setAddingTriggerId(addingTriggerId === tr.id ? null : tr.id)}>
                          <Plus className="h-3 w-3" />
                          Quick add
                        </Button>
                        <Button size="sm" className="gap-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => { setConfiguringTriggerId(tr.id); setEditingAction(null); }}>
                          <Plus className="h-3 w-3" />
                          Add action
                        </Button>
                      </div>
                    </div>
                    {addingTriggerId === tr.id && (
                      <div className="px-4 py-2 border-b bg-slate-50/50 flex flex-wrap items-center gap-2">
                        <Select value={triggerActionType} onValueChange={setTriggerActionType}>
                          <SelectTrigger className="w-36 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTION_TYPES.map((a) => (
                              <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {triggerActionType === 'loadData' && (
                          <Select value={triggerActionDataSource} onValueChange={setTriggerActionDataSource}>
                            <SelectTrigger className="w-36 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DATA_SOURCE_KEYS.map((s) => (
                                <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <Button size="sm" className="gap-1" onClick={() => addTriggerAction(tr.id)}>Add</Button>
                        <Button size="sm" variant="ghost" onClick={() => setAddingTriggerId(null)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="p-2 space-y-1">
                      {list.length === 0 ? (
                        <p className="text-sm text-slate-500 py-2 px-2">No actions. Add one or use full config for JS/SQL.</p>
                      ) : (
                        list.map((a) => (
                          <div key={a.id} className="flex items-center justify-between p-2 rounded bg-white border group">
                            <div className="flex items-center gap-2 flex-wrap">
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                              <span className="font-medium text-sm">{a.name || a.label || a.actionType}</span>
                              {a.steps?.length ? (
                                <Badge variant="secondary" className="text-xs">{a.steps.length} steps</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">{a.actionType}</Badge>
                              )}
                              {a.config?.dataSourceKey && (
                                <Badge variant="outline" className="text-xs">{a.config.dataSourceKey}</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {a.steps?.length ? (
                                <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => { setEditingAction(a); setConfiguringTriggerId(tr.id); }}>
                                  <Edit className="h-3 w-3" />
                                  Edit
                                </Button>
                              ) : null}
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:bg-red-50" onClick={() => removeTriggerAction(tr.id, a.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            </ScrollArea>
            )}
          </TabsContent>

          {/* Styles Tab */}
          <TabsContent value="styles" className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Row Height</Label>
                <Select defaultValue="compact">
                  <SelectTrigger className="font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Header Style</Label>
                <Select defaultValue="bold">
                  <SelectTrigger className="font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="uppercase">Uppercase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Striped Rows</Label>
                <Switch defaultChecked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Hover Highlight</Label>
                <Switch defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Show Borders</Label>
                <Switch defaultChecked={true} />
              </div>
            </div>
          </TabsContent>

          {/* Data Tab - use @/data sources; later connect DB with credentials */}
          <TabsContent value="data" className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Data Source</Label>
                <Select value={dataSourceKey} onValueChange={setDataSourceKey}>
                  <SelectTrigger className="font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local / Page data</SelectItem>
                    {DATA_SOURCE_KEYS.filter((s) => s.key !== 'database').map((s) => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="database">Database (connect credentials later)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Use Triggers → On init → Load data to fetch from source. Or set default here.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">API Endpoint (optional)</Label>
                <Input
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://api.example.com/data"
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Auto Refresh</Label>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Refresh Interval (seconds)</Label>
                <Input
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value) || 30)}
                  className="font-semibold"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        <SheetFooter className="gap-2 px-6 pb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2">
            <XCircle className="h-4 w-4" />
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            {t('save')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
