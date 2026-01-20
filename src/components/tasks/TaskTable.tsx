import { useState, useMemo, useEffect } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { useTasks } from '@/hooks/useTasks';
import { TaskTableHeader } from './TaskTableHeader';
import { TaskRow } from './TaskRow';
import { TaskToolbar } from './TaskToolbar';
import { ListChecks } from 'lucide-react';

export function TaskTable() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    deleteSelectedTasks,
    toggleComplete,
    sortField,
    sortDirection,
    handleSort,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    searchQuery,
    setSearchQuery,
    exportToCSV,
  } = useTasks();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // reset selection and pagination when data changes
    setSelectedIds(new Set());
    setPage(1);
  }, [tasks]);

  const allSelected = useMemo(
    () => tasks.length > 0 && tasks.every((task) => selectedIds.has(task.id)),
    [tasks, selectedIds]
  );

  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize));
  const pagedTasks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return tasks.slice(start, start + pageSize);
  }, [tasks, page]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(tasks.map((t) => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = () => {
    deleteSelectedTasks(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleClearFilters = () => {
    setFilterStatus('all');
    setFilterPriority('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <TaskToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onFilterPriorityChange={setFilterPriority}
        selectedCount={selectedIds.size}
        onDeleteSelected={handleDeleteSelected}
        onExport={exportToCSV}
        onAddTask={addTask}
        onClearFilters={handleClearFilters}
      />

      <Card className="overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <Table>
            <TaskTableHeader
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              allSelected={allSelected}
              onSelectAll={handleSelectAll}
              hasItems={tasks.length > 0}
            />
            <TableBody>
              {pagedTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ListChecks className="h-10 w-10 mb-2 opacity-50" />
                      <p>No tasks found</p>
                      <p className="text-sm">Add a new task or adjust your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    selected={selectedIds.has(task.id)}
                    onSelect={(checked) => handleSelect(task.id, checked)}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onToggleComplete={toggleComplete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        <div>
          Showing {(page - 1) * pageSize + (pagedTasks.length ? 1 : 0)}-
          {(page - 1) * pageSize + pagedTasks.length} of {tasks.length} task
          {tasks.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <span>{selectedIds.size} selected</span>
          )}
          <div className="flex items-center gap-1">
            <button
              className="px-2 py-1 rounded border border-input bg-background hover:bg-muted disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              className="px-2 py-1 rounded border border-input bg-background hover:bg-muted disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
