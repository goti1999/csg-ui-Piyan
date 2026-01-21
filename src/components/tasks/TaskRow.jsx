import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx';
import { StatusBadge } from './StatusBadge.jsx';
import { PriorityBadge } from './PriorityBadge.jsx';
import { cn } from '@/lib/utils.js';

export function TaskRow({
  task,
  selected,
  onSelect,
  onUpdate,
  onDelete,
  onToggleComplete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TableRow className="animate-fade-in bg-primary/5">
        <TableCell>
          <Checkbox checked={selected} onCheckedChange={onSelect} />
        </TableCell>
        <TableCell>
          <Input
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Select
            value={editedTask.status}
            onValueChange={(value) =>
              setEditedTask({ ...editedTask, status: value })
            }
          >
            <SelectTrigger className="h-8 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select
            value={editedTask.priority}
            onValueChange={(value) =>
              setEditedTask({ ...editedTask, priority: value })
            }
          >
            <SelectTrigger className="h-8 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
            className="h-8 w-36"
          />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
              <Check className="h-4 w-4 text-success" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0">
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow
      className={cn(
        'group transition-colors animate-fade-in',
        task.completed && 'bg-muted/30',
        selected && 'bg-primary/5'
      )}
    >
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className={cn('font-medium', task.completed && 'line-through text-muted-foreground')}>
              {task.title}
            </span>
            <span className="text-xs text-muted-foreground">{task.description}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={task.status} />
      </TableCell>
      <TableCell>
        <PriorityBadge priority={task.priority} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(task.dueDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
