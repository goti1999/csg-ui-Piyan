import { TaskStatus } from '@/types/task';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  'todo': {
    label: 'To Do',
    className: 'bg-muted text-muted-foreground',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-warning/10 text-warning',
  },
  'done': {
    label: 'Done',
    className: 'bg-success/10 text-success',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
