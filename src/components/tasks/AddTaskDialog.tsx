import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddTaskDialogProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const defaultTask: Omit<Task, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: new Date().toISOString().split('T')[0],
  completed: false,
};

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState(defaultTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    
    onAddTask(task);
    setTask(defaultTask);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Enter task title..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                placeholder="Enter task description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={task.status}
                  onValueChange={(value: TaskStatus) => setTask({ ...task, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={task.priority}
                  onValueChange={(value: TaskPriority) => setTask({ ...task, priority: value })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
