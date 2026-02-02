import { useMemo, useState, Fragment } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Search, Download, ChevronDown, ChevronRight, Edit2, Settings, RefreshCw } from 'lucide-react';
import { formatDateDisplay } from '@/lib/utils.js';
import { toast } from 'sonner';
import { containersConfig } from '@/data/index.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';
import { RowEditFormModal } from '@/components/tables/RowEditFormModal.jsx';
import { ExpandableRowDetailsContainers } from '@/components/tables/ExpandableRowDetailsContainers.jsx';
import { useApp } from '@/contexts/useApp.js';

const { containers, headerFields, detailFields, filterFields } = containersConfig;

export default function ContainersTablePage() {
  const { editMode } = useOutletContext();
  const { t, componentConfigs, updateComponentConfig } = useApp();
  const [data, setData] = useState(containers);
  const [headerFilters, setHeaderFilters] = useState({});
  const [sortKey, setSortKey] = useState('ETA_PortOfDischarge');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expanded, setExpanded] = useState(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [formRow, setFormRow] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const componentId = 'table-containers';

  const filtered = useMemo(() => {
    let list = [...data];
    headerFields.forEach((h) => {
      const q = (headerFilters[h.key] ?? '').trim().toLowerCase();
      if (!q) return;
      list = list.filter((r) => {
        const v = r[h.key];
        return v != null && String(v).toLowerCase().includes(q);
      });
    });
    list.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortDir === 'asc' ? 1 : -1;
      if (bVal == null) return sortDir === 'asc' ? -1 : 1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [data, headerFilters, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleExpand = (id) => {
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const openEdit = (row) => {
    setFormRow(row);
    setFormOpen(true);
  };

  const handleSaveRow = (updated) => {
    const id = updated.ContainerID ?? updated.id;
    setData((prev) => prev.map((r) => (r.ContainerID === id || r.id === id ? updated : r)));
    setFormOpen(false);
    setFormRow(null);
  };

  const exportCsv = () => {
    const keys = headerFields.map((h) => h.key);
    const headers = headerFields.map((h) => h.key);
    const rows = filtered.map((r) => keys.map((k) => JSON.stringify(r[k] ?? '')).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `containers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success('Exported CSV');
  };

  const reload = () => {
    setData([...containers]);
    toast.success('Data refreshed');
  };

  const renderCell = (row, h) => {
    const v = row[h.key];
    if (h.type === 'date') return formatDateDisplay(v, h.dateFormat || 'DD.MM.YYYY');
    if (h.type === 'label') {
      const colors = h.labelColors || {};
      const bg = colors[v] ? '' : 'bg-muted';
      const style = colors[v] ? { backgroundColor: colors[v], color: '#fff' } : {};
      return <Badge className={bg} style={style}>{String(v ?? '—')}</Badge>;
    }
    return <span>{v != null ? String(v) : '—'}</span>;
  };

  const rowId = (row) => row.ContainerID ?? row.id ?? row.Container_No;

  return (
    <div className="space-y-4">
      <EditableWrapper
        componentId={componentId}
        componentName="Containers"
        componentType="table"
        onEdit={() => setEditorOpen(true)}
      >
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3">
            <div>
              <CardTitle>Containers</CardTitle>
              <p className="text-sm text-muted-foreground">Container & shipment tracking · Data from @/data</p>
            </div>
            <div className="flex items-center gap-2">
              {editMode && (
                <Button size="sm" variant="outline" className="gap-1 border-amber-300 text-amber-600" onClick={() => setEditorOpen(true)}>
                  <Settings className="h-4 w-4" />
                  Edit Table
                </Button>
              )}
              <Button size="sm" variant="outline" className="gap-2" onClick={exportCsv}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={reload}>
                <RefreshCw className="h-4 w-4" />
                {t('refresh')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">Sort {sortDir === 'asc' ? '↑' : '↓'} {sortKey}</Badge>
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

            <div className="overflow-x-auto rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-10 py-2" />
                    {headerFields.map((h) => (
                      <TableHead
                        key={h.key}
                        className={`py-2 cursor-pointer select-none hover:bg-muted/80 ${h.className ?? ''}`}
                        style={{ width: h.width }}
                        onClick={() => toggleSort(h.key)}
                      >
                        {h.key.replace(/_/g, ' ')}
                      </TableHead>
                    ))}
                    <TableHead className="text-center w-32 py-2 font-bold">{t('actions')}</TableHead>
                  </TableRow>
                  {/* Excel-like header search row */}
                  <TableRow className="bg-slate-50/80">
                    <TableCell className="w-10 py-1" />
                    {headerFields.map((h) => (
                      <TableCell key={h.key} className="py-1" style={{ width: h.width }}>
                        <Input
                          placeholder={`Search ${h.key}...`}
                          value={headerFilters[h.key] ?? ''}
                          onChange={(e) => setHeaderFilters((prev) => ({ ...prev, [h.key]: e.target.value }))}
                          className="h-8 text-xs font-mono"
                        />
                      </TableCell>
                    ))}
                    <TableCell className="py-1 w-32" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={headerFields.length + 2} className="text-center py-8 text-muted-foreground">
                        No rows
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageData.map((row) => {
                      const id = rowId(row);
                      const isExp = expanded.has(id);
                      return (
                        <Fragment key={id}>
                          <TableRow className={isExp ? 'bg-sky-50/50' : 'hover:bg-muted/30'}>
                            <TableCell className="py-1.5">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toggleExpand(id)}>
                                {isExp ? <ChevronDown className="h-4 w-4 text-sky-600" /> : <ChevronRight className="h-4 w-4" />}
                              </Button>
                            </TableCell>
                            {headerFields.map((h) => (
                              <TableCell key={h.key} className="py-1.5">
                                {h.link?.target === 'editContainer' ? (
                                  <button
                                    type="button"
                                    className="text-left font-medium text-blue-600 hover:underline"
                                    onClick={() => openEdit(row)}
                                  >
                                    {renderCell(row, h)}
                                  </button>
                                ) : (
                                  renderCell(row, h)
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="py-1.5">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 gap-1 text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                                  onClick={() => openEdit(row)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                  Edit
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {isExp && (
                            <TableRow>
                              <TableCell colSpan={headerFields.length + 2} className="p-0">
                                <ExpandableRowDetailsContainers row={row} detailFields={detailFields} />
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
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
                  value={[page]}
                  min={1}
                  max={totalPages}
                  step={1}
                  onValueChange={([v]) => setPage(v)}
                  className="w-48"
                />
                <span className="font-medium text-foreground">{page} / {totalPages}</span>
              </div>
              <span>{t('showing')} {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} {t('of')} {filtered.length}</span>
            </div>
          </CardContent>
        </Card>
      </EditableWrapper>

      <RowEditFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        row={formRow}
        detailFields={detailFields}
        onSave={handleSaveRow}
        title="Edit Container"
      />

      <ComponentEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        componentId={componentId}
        componentName="Containers"
        componentType="table"
        initialColumns={containersConfig.columns.map((c, i) => ({ id: c.key, key: c.key, label: c.label, visible: true, sortable: true, filterable: true, editable: true }))}
        initialTriggers={componentConfigs[componentId]?.triggers}
        initialDataSource={componentConfigs[componentId]?.dataSource}
        onSave={(cols) => updateComponentConfig(componentId, { columns: cols })}
      />
    </div>
  );
}
