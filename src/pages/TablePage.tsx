import { useMemo, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Download, Edit2, Filter, Plus, RefreshCw, Search, X, Edit3, Trash2, ChevronDown, ChevronRight, FileText, Send, Eye, Save, XCircle, Settings } from "lucide-react";
import { RecordRow } from "@/data/logistics";
import { Label } from "@/components/ui/label";
import { ExpandableRowDetails } from "@/components/tables/ExpandableRowDetails";
import { useApp, TableColumnConfig } from "@/contexts/AppContext";
import { EditableWrapper } from "@/components/builder/EditableWrapper";
import { ComponentEditor } from "@/components/builder/ComponentEditor";

type TablePageProps = {
  title: string;
  subtitle?: string;
  rows: RecordRow[];
};

type SortField = keyof Pick<RecordRow, "name" | "status" | "priority" | "eta" | "progress" | "amount" | "location">;

export default function TablePage({ title, subtitle, rows }: TablePageProps) {
  const { globalSearch, editMode }: { globalSearch?: string; editMode?: boolean } = useOutletContext() as { globalSearch?: string; editMode?: boolean };
  const { t, componentConfigs, updateComponentConfig } = useApp();
  const [data, setData] = useState<RecordRow[]>(rows);
  const [localSearch, setLocalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("eta");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<RecordRow | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionRow, setActionRow] = useState<RecordRow | null>(null);
  const [multiEditOpen, setMultiEditOpen] = useState(false);
  const [multiEditFields, setMultiEditFields] = useState<Partial<RecordRow>>({});
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isComponentEditorOpen, setIsComponentEditorOpen] = useState(false);
  
  // Component ID for this table
  const componentId = `table-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  // Default column configuration
  const defaultColumns: TableColumnConfig[] = [
    { id: 'name', key: 'name', label: t('name'), visible: true, sortable: true, filterable: true, editable: true },
    { id: 'status', key: 'status', label: t('status'), visible: true, sortable: true, filterable: true, editable: true },
    { id: 'priority', key: 'priority', label: t('priority'), visible: true, sortable: true, filterable: false, editable: true },
    { id: 'eta', key: 'eta', label: 'ETA', visible: true, sortable: true, filterable: false, editable: true },
    { id: 'progress', key: 'progress', label: t('progress'), visible: true, sortable: true, filterable: false, editable: true },
    { id: 'amount', key: 'amount', label: t('amount'), visible: true, sortable: true, filterable: false, editable: true },
    { id: 'location', key: 'location', label: t('location'), visible: true, sortable: true, filterable: true, editable: true },
  ];
  
  // Get saved column config or use defaults
  const columnConfig = componentConfigs[componentId]?.columns || defaultColumns;
  
  // Initialize component config if not exists
  useEffect(() => {
    if (!componentConfigs[componentId]) {
      updateComponentConfig(componentId, {
        id: componentId,
        type: 'table',
        name: title,
        props: {},
        columns: defaultColumns,
      });
    }
  }, [componentId]);

  const searchTerm = (localSearch || globalSearch || "").toLowerCase();

  const filtered = useMemo(() => {
    return data
      .filter((row) => {
        if (statusFilter !== "all" && row.status !== statusFilter) return false;
        if (!searchTerm) return true;
        return Object.values(row).some((v) => String(v).toLowerCase().includes(searchTerm));
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, statusFilter, sortField, sortDir, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(pageData.map((r) => r.id)));
    } else {
      setSelected(new Set());
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const exportCsv = (asExcel = false) => {
    const headers = Object.keys(pageData[0] || {});
    const csv = [headers.join(",")].concat(
      pageData.map((row) => headers.map((h) => JSON.stringify((row as any)[h] ?? "")).join(","))
    );
    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}${asExcel ? ".xls" : ".csv"}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${pageData.length} rows to ${asExcel ? "Excel" : "CSV"}`);
  };

  const reloadData = () => {
    setData([...rows]);
    setSelected(new Set());
    toast.message("Data refreshed");
  };

  const updateRow = (updated: RecordRow) => {
    setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditing(null);
    setIsEditDialogOpen(false);
    toast.success("Row updated successfully!");
  };

  const addRow = () => {
    const newRow: RecordRow = {
      id: `new-${Date.now()}`,
      name: "New record",
      status: "on-time",
      category: "Ad-hoc",
      priority: "medium",
      eta: new Date().toISOString(),
      progress: 20,
      amount: 500,
      location: "NYC",
      updated: new Date().toISOString(),
    };
    setData((prev) => [newRow, ...prev]);
    toast.success("New row added");
  };

  const deleteSelected = () => {
    if (selected.size === 0) return;
    setData((prev) => prev.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
    toast.success(`Deleted ${selected.size} row(s)`);
  };

  const applyMultiEdit = () => {
    if (selected.size === 0 || Object.keys(multiEditFields).length === 0) return;
    setData((prev) =>
      prev.map((r) =>
        selected.has(r.id)
          ? { ...r, ...multiEditFields, updated: new Date().toISOString() }
          : r
      )
    );
    setSelected(new Set());
    setMultiEditFields({});
    setMultiEditOpen(false);
    toast.success(`Updated ${selected.size} row(s)`);
  };

  const toggleRowExpansion = (rowId: string) => {
    const next = new Set(expandedRows);
    if (next.has(rowId)) {
      next.delete(rowId);
    } else {
      next.add(rowId);
    }
    setExpandedRows(next);
  };

  const handleOpenEdit = (row: RecordRow) => {
    setEditing({ ...row });
    setIsEditDialogOpen(true);
  };

  const handleOpenAction = (row: RecordRow) => {
    setActionRow(row);
    setIsActionDialogOpen(true);
  };

  const handleSendLetter = () => {
    if (actionRow) {
      toast.success(`Letter action sent for: ${actionRow.name}`);
      setIsActionDialogOpen(false);
      setActionRow(null);
    }
  };

  const handleSaveColumnConfig = (columns: TableColumnConfig[]) => {
    updateComponentConfig(componentId, { columns });
  };

  return (
    <div className="space-y-4">
      <EditableWrapper
        componentId={componentId}
        componentName={title}
        componentType="table"
        onEdit={() => setIsComponentEditorOpen(true)}
      >
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3">
            <div className="flex items-center gap-3">
              <div>
                <CardTitle>{title}</CardTitle>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              {/* Edit Mode Settings Button */}
              {editMode && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1 border-amber-300 text-amber-600 hover:bg-amber-50"
                  onClick={() => setIsComponentEditorOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                  Edit Table
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" className="gap-2" onClick={addRow}>
                <Plus className="h-4 w-4" />
                {t('add')}
              </Button>
            {selected.size > 0 && (
              <>
                <Dialog open={multiEditOpen} onOpenChange={setMultiEditOpen}>
                  <Button size="sm" variant="default" className="gap-2" onClick={() => setMultiEditOpen(true)}>
                    <Edit3 className="h-4 w-4" />
                    Multi-Edit ({selected.size})
                  </Button>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Bulk Edit {selected.size} Selected Row(s)</DialogTitle>
                      <DialogDescription>Apply changes to all selected rows at once</DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="font-bold">{t('status')}</Label>
                        <Select
                          value={multiEditFields.status || ""}
                          onValueChange={(v) => setMultiEditFields({ ...multiEditFields, status: v as RecordRow["status"] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No change</SelectItem>
                            <SelectItem value="on-time">On-time</SelectItem>
                            <SelectItem value="delayed">Delayed</SelectItem>
                            <SelectItem value="at-risk">At risk</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">{t('priority')}</Label>
                        <Select
                          value={multiEditFields.priority || ""}
                          onValueChange={(v) => setMultiEditFields({ ...multiEditFields, priority: v as RecordRow["priority"] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No change</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">{t('location')}</Label>
                        <Input
                          value={multiEditFields.location || ""}
                          onChange={(e) => setMultiEditFields({ ...multiEditFields, location: e.target.value })}
                          placeholder="Leave empty for no change"
                        />
                      </div>
                    </div>
                    <Separator />
                    <DialogFooter className="gap-2 pt-4">
                      <Button variant="outline" onClick={() => { setMultiEditOpen(false); setMultiEditFields({}); }} className="gap-2">
                        <XCircle className="h-4 w-4" />
                        {t('cancel')}
                      </Button>
                      <Button onClick={applyMultiEdit} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Save className="h-4 w-4" />
                        {t('save')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="destructive" className="gap-2" onClick={deleteSelected}>
                  <Trash2 className="h-4 w-4" />
                  {t('delete')} ({selected.size})
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" className="gap-2" onClick={() => exportCsv(false)}>
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => exportCsv(true)}>
              <Download className="h-4 w-4" />
              Excel
            </Button>
            <Button size="sm" variant="ghost" className="gap-2" onClick={reloadData}>
              <RefreshCw className="h-4 w-4" />
              {t('reload')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={t('searchTable')}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder={t('status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allStatus')}</SelectItem>
                  <SelectItem value="on-time">{t('onTime')}</SelectItem>
                  <SelectItem value="delayed">{t('delayed')}</SelectItem>
                  <SelectItem value="at-risk">{t('atRisk')}</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              {statusFilter !== "all" || localSearch ? (
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => { setStatusFilter("all"); setLocalSearch(""); }}>
                  <X className="h-4 w-4" />
                  {t('clear')}
                </Button>
              ) : null}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="gap-1">
                <Filter className="h-3 w-3" />
                Sort {sortDir === "asc" ? "↑" : "↓"} {sortField}
              </Badge>
              <div className="flex items-center gap-2">
                <span>Page size</span>
                <Input
                  type="number"
                  min={5}
                  max={50}
                  value={pageSize}
                  onChange={(e) => setPageSize(Math.max(5, Math.min(50, Number(e.target.value) || 10)))}
                  className="w-16 h-8"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 h-10">
                  <TableHead className="w-10 py-2">
                    <Checkbox
                      checked={pageData.length > 0 && pageData.every((r) => selected.has(r.id))}
                      onCheckedChange={(v) => toggleSelectAll(Boolean(v))}
                    />
                  </TableHead>
                  <TableHead className="w-10 py-2"></TableHead>
                  {header("name", t('name'), sortField, sortDir, toggleSort)}
                  {header("status", t('status'), sortField, sortDir, toggleSort)}
                  {header("priority", t('priority'), sortField, sortDir, toggleSort)}
                  {header("eta", "ETA", sortField, sortDir, toggleSort)}
                  {header("progress", t('progress'), sortField, sortDir, toggleSort, "text-right")}
                  {header("amount", t('amount'), sortField, sortDir, toggleSort, "text-right")}
                  {header("location", t('location'), sortField, sortDir, toggleSort)}
                  <TableHead className="text-center w-36 py-2 font-bold">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        {t('noResults')}
                      </TableCell>
                    </TableRow>
                ) : (
                  pageData.map((row) => {
                    const isExpanded = expandedRows.has(row.id);
                    return (
                      <>
                        <TableRow key={row.id} className={`h-10 ${isExpanded ? "bg-sky-50/50" : "hover:bg-muted/30"}`}>
                          <TableCell className="py-1.5">
                            <Checkbox
                              checked={selected.has(row.id)}
                              onCheckedChange={(v) => toggleSelect(row.id, Boolean(v))}
                            />
                          </TableCell>
                          <TableCell className="py-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleRowExpansion(row.id)}
                              className="h-6 w-6 p-0"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-sky-600" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="py-1.5 font-bold text-slate-800">{row.name}</TableCell>
                          <TableCell className="py-1.5">
                            <StatusPill value={row.status} />
                          </TableCell>
                          <TableCell className="py-1.5">
                            <Badge variant="outline" className="capitalize font-semibold">{row.priority}</Badge>
                          </TableCell>
                          <TableCell className="py-1.5 font-semibold">{new Date(row.eta).toLocaleDateString()}</TableCell>
                          <TableCell className="py-1.5 text-right font-bold">{row.progress}%</TableCell>
                          <TableCell className="py-1.5 text-right font-bold">${row.amount.toLocaleString()}</TableCell>
                          <TableCell className="py-1.5 font-semibold">{row.location}</TableCell>
                          <TableCell className="py-1.5">
                            <div className="flex items-center justify-center gap-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 px-2 gap-1 text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                                onClick={() => handleOpenAction(row)}
                              >
                                <Send className="h-3 w-3" />
                                Action
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 px-2 gap-1 text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                                onClick={() => handleOpenEdit(row)}
                              >
                                <Edit2 className="h-3 w-3" />
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow key={`${row.id}-details`}>
                            <TableCell colSpan={10} className="p-0">
                              <ExpandableRowDetails row={row} />
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Page</span>
              <Slider
                value={[currentPage]}
                min={1}
                max={totalPages}
                step={1}
                onValueChange={([v]) => setPage(v)}
                className="w-48"
              />
              <span className="font-medium text-foreground">
                {currentPage} / {totalPages}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>
                {t('showing')} {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)} {t('of')}{" "}
                {filtered.length}
              </span>
              {selected.size > 0 && <Badge variant="secondary">{selected.size} {t('selected')}</Badge>}
            </div>
          </div>
        </CardContent>
        </Card>
      </EditableWrapper>

      {/* Component Editor for Admin Edit Mode */}
      <ComponentEditor
        open={isComponentEditorOpen}
        onOpenChange={setIsComponentEditorOpen}
        componentId={componentId}
        componentName={title}
        componentType="table"
        initialColumns={columnConfig}
        onSave={handleSaveColumnConfig}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-emerald-600" />
              {t('editDetails')}
            </DialogTitle>
            <DialogDescription>Update the details for this record</DialogDescription>
          </DialogHeader>
          <Separator />
          {editing && (
            <EditForm
              row={editing}
              onSave={updateRow}
              onCancel={() => { setEditing(null); setIsEditDialogOpen(false); }}
              t={t}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Letter Action
            </DialogTitle>
            <DialogDescription>Send a letter or perform an action for this record</DialogDescription>
          </DialogHeader>
          <Separator />
          {actionRow && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('name')}</Label>
                    <p className="font-bold text-slate-800">{actionRow.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('status')}</Label>
                    <p className="font-bold"><StatusPill value={actionRow.status} /></p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('location')}</Label>
                    <p className="font-bold text-slate-800">{actionRow.location}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('amount')}</Label>
                    <p className="font-bold text-slate-800">${actionRow.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Action Type</Label>
                <Select defaultValue="reminder">
                  <SelectTrigger>
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reminder">Send Reminder</SelectItem>
                    <SelectItem value="notification">Send Notification</SelectItem>
                    <SelectItem value="invoice">Generate Invoice</SelectItem>
                    <SelectItem value="report">Generate Report</SelectItem>
                    <SelectItem value="escalate">Escalate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Notes (Optional)</Label>
                <Input placeholder="Add any additional notes..." />
              </div>
            </div>
          )}
          <Separator />
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => { setIsActionDialogOpen(false); setActionRow(null); }} className="gap-2">
              <XCircle className="h-4 w-4" />
              {t('cancel')}
            </Button>
            <Button onClick={handleSendLetter} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
              Send Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function header(
  field: SortField,
  label: string,
  current: SortField,
  dir: "asc" | "desc",
  onSort: (f: SortField) => void,
  className?: string
) {
  const active = current === field;
  return (
    <TableHead
      onClick={() => onSort(field)}
      className={`cursor-pointer select-none py-2 font-bold ${className ?? ""}`}
    >
      <span className="flex items-center gap-1">
        {label}
        <span className="text-xs text-muted-foreground">{active ? (dir === "asc" ? "↑" : "↓") : "↕"}</span>
      </span>
    </TableHead>
  );
}

function StatusPill({ value }: { value: RecordRow["status"] }) {
  const tone =
    value === "on-time" ? "bg-emerald-100 text-emerald-800" :
    value === "completed" ? "bg-blue-100 text-blue-800" :
    value === "delayed" ? "bg-amber-100 text-amber-800" :
    "bg-red-100 text-red-800";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tone}`}>{value}</span>;
}

function EditForm({ 
  row, 
  onSave, 
  onCancel,
  t 
}: { 
  row: RecordRow; 
  onSave: (r: RecordRow) => void; 
  onCancel: () => void;
  t: (key: string) => string;
}) {
  const [draft, setDraft] = useState<RecordRow>(row);
  
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs text-muted-foreground">Record ID</Label>
              <p className="font-bold text-slate-800">{draft.id}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Last Updated</Label>
              <p className="font-bold text-slate-800">{new Date(draft.updated).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-bold">{t('name')}</Label>
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Name"
            className="font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-bold">{t('status')}</Label>
            <Select
              value={draft.status}
              onValueChange={(v) => setDraft({ ...draft, status: v as RecordRow["status"] })}
            >
              <SelectTrigger className="font-semibold"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="on-time">On-time</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="at-risk">At risk</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-bold">{t('priority')}</Label>
            <Select
              value={draft.priority}
              onValueChange={(v) => setDraft({ ...draft, priority: v as RecordRow["priority"] })}
            >
              <SelectTrigger className="font-semibold"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-bold">ETA</Label>
            <Input
              type="date"
              value={draft.eta.slice(0, 10)}
              onChange={(e) => setDraft({ ...draft, eta: new Date(e.target.value).toISOString() })}
              className="font-semibold"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">{t('progress')} (%)</Label>
            <Input
              type="number"
              value={draft.progress}
              onChange={(e) => setDraft({ ...draft, progress: Number(e.target.value) })}
              min={0}
              max={100}
              className="font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-bold">{t('amount')}</Label>
            <Input
              type="number"
              value={draft.amount}
              onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
              className="font-semibold"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">{t('location')}</Label>
            <Input
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              className="font-semibold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Category</Label>
          <Input
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            className="font-semibold"
          />
        </div>
      </div>
      <Separator />
      <DialogFooter className="gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} className="gap-2">
          <XCircle className="h-4 w-4" />
          {t('cancel')}
        </Button>
        <Button onClick={() => onSave({ ...draft, updated: new Date().toISOString() })} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Save className="h-4 w-4" />
          {t('save')}
        </Button>
      </DialogFooter>
    </>
  );
}
