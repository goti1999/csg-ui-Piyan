import { useState, useMemo } from 'react';
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

  const allSelected = useMemo(
    () => tasks.length > 0 && tasks.every((task) => selectedIds.has(task.id)),
    [tasks, selectedIds]
  );

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
              {tasks.length === 0 ? (
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
                tasks.map((task) => (
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

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
        {selectedIds.size > 0 && (
          <span>{selectedIds.size} selected</span>
        )}
      </div>
    </div>
  );
}
