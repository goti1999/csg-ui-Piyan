import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { SortField, SortDirection } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';

interface TaskTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  hasItems: boolean;
}

interface SortableHeaderProps {
  field: SortField;
  label: string;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
}

function SortableHeader({ field, label, currentField, direction, onSort, className }: SortableHeaderProps) {
  const isActive = currentField === field;
  
  return (
    <TableHead
      className={cn('cursor-pointer select-none hover:bg-muted/50 transition-colors', className)}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </TableHead>
  );
}

export function TaskTableHeader({
  sortField,
  sortDirection,
  onSort,
  allSelected,
  onSelectAll,
  hasItems,
}: TaskTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="bg-muted/30 hover:bg-muted/30">
        <TableHead className="w-12">
          <Checkbox
            checked={allSelected && hasItems}
            onCheckedChange={onSelectAll}
            disabled={!hasItems}
          />
        </TableHead>
        <SortableHeader
          field="title"
          label="Task"
          currentField={sortField}
          direction={sortDirection}
          onSort={onSort}
          className="min-w-[200px]"
        />
        <SortableHeader
          field="status"
          label="Status"
          currentField={sortField}
          direction={sortDirection}
          onSort={onSort}
        />
        <SortableHeader
          field="priority"
          label="Priority"
          currentField={sortField}
          direction={sortDirection}
          onSort={onSort}
        />
        <SortableHeader
          field="dueDate"
          label="Due Date"
          currentField={sortField}
          direction={sortDirection}
          onSort={onSort}
        />
        <TableHead className="w-24 text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
