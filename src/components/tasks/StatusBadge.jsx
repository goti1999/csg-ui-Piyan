import { cn } from '@/lib/utils.js';

const statusConfig = {
  'todo': {
    label: 'To Do',
    className: 'bg-muted text-muted-foreground',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-warning/10 text-warning',
  },
  'completed': {
    label: 'Completed',
    className: 'bg-success/10 text-success',
  },
};

export function StatusBadge({ status }) {
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
