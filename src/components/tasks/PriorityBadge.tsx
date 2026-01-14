import { TaskPriority } from '@/types/task';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  'low': {
    label: 'Low',
    className: 'bg-success/10 text-success',
  },
  'medium': {
    label: 'Medium',
    className: 'bg-warning/10 text-warning',
  },
  'high': {
    label: 'High',
    className: 'bg-destructive/10 text-destructive',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
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
