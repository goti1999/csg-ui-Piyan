import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp, TableColumnConfig, ComponentAction } from '@/contexts/AppContext';
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
  Database
} from 'lucide-react';
import { toast } from 'sonner';

interface ComponentEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentId: string;
  componentName: string;
  componentType: 'table' | 'card' | 'chart' | 'form' | 'custom';
  initialColumns?: TableColumnConfig[];
  onSave?: (columns: TableColumnConfig[]) => void;
}

export function ComponentEditor({
  open,
  onOpenChange,
  componentId,
  componentName,
  componentType,
  initialColumns = [],
  onSave,
}: ComponentEditorProps) {
  const { t, updateComponentConfig, addColumnAction, removeColumnAction } = useApp();
  const [columns, setColumns] = useState<TableColumnConfig[]>(initialColumns);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [newActionLabel, setNewActionLabel] = useState('');
  const [newActionType, setNewActionType] = useState<ComponentAction['actionType']>('navigate');

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const selectedColumn = columns.find(c => c.id === selectedColumnId);

  const handleColumnUpdate = (columnId: string, updates: Partial<TableColumnConfig>) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const handleAddAction = () => {
    if (!selectedColumnId || !newActionLabel.trim()) return;
    
    const newAction: ComponentAction = {
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

  const handleRemoveAction = (columnId: string, actionId: string) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId
        ? { ...col, actions: (col.actions || []).filter(a => a.id !== actionId) }
        : col
    ));
    toast.success('Action removed');
  };

  const handleSave = () => {
    onSave?.(columns);
    updateComponentConfig(componentId, { columns });
    toast.success('Component configuration saved!');
    onOpenChange(false);
  };

  const handleAddColumn = () => {
    const newColumn: TableColumnConfig = {
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

  const handleRemoveColumn = (columnId: string) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
    if (selectedColumnId === columnId) {
      setSelectedColumnId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Edit Component: {componentName}
          </DialogTitle>
          <DialogDescription>
            Configure component properties, columns, and actions
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <Tabs defaultValue="columns" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="columns" className="gap-1">
              <Database className="h-4 w-4" />
              Columns
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-1">
              <Zap className="h-4 w-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="styles" className="gap-1">
              <Palette className="h-4 w-4" />
              Styles
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-1">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>

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
                          <Select value={newActionType} onValueChange={(v: ComponentAction['actionType']) => setNewActionType(v)}>
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

          {/* Data Tab */}
          <TabsContent value="data" className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Data Source</Label>
                <Select defaultValue="local">
                  <SelectTrigger className="font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Data</SelectItem>
                    <SelectItem value="api">API Endpoint</SelectItem>
                    <SelectItem value="database">Database Query</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">API Endpoint (if applicable)</Label>
                <Input placeholder="https://api.example.com/data" className="font-mono text-sm" />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Auto Refresh</Label>
                <Switch defaultChecked={false} />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Refresh Interval (seconds)</Label>
                <Input type="number" defaultValue="30" className="font-semibold" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-2">
            <XCircle className="h-4 w-4" />
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
