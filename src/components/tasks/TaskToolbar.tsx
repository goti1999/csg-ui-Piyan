import { Search, Filter, Download, Trash2, RefreshCw } from 'lucide-react';
import { TaskStatus, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddTaskDialog } from './AddTaskDialog';
import { Task } from '@/types/task';

interface TaskToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: TaskStatus | 'all';
  onFilterStatusChange: (status: TaskStatus | 'all') => void;
  filterPriority: TaskPriority | 'all';
  onFilterPriorityChange: (priority: TaskPriority | 'all') => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onExport: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onClearFilters: () => void;
}

export function TaskToolbar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  selectedCount,
  onDeleteSelected,
  onExport,
  onAddTask,
  onClearFilters,
}: TaskToolbarProps) {
  const hasFilters = filterStatus !== 'all' || filterPriority !== 'all' || searchQuery !== '';

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  !
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-popover">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={filterStatus} onValueChange={onFilterStatusChange}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Priority</label>
                <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2"
                  onClick={onClearFilters}
                >
                  <RefreshCw className="h-3 w-3" />
                  Clear Filters
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={onDeleteSelected}
          >
            <Trash2 className="h-4 w-4" />
            Delete ({selectedCount})
          </Button>
        )}
        
        <Button variant="outline" onClick={onExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        
        <AddTaskDialog onAddTask={onAddTask} />
      </div>
    </div>
  );
}
