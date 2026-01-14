import { useState, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialTasks: Task[] = [
  {
    id: generateId(),
    title: 'Complete project proposal',
    description: 'Write and submit the Q1 project proposal',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-01-15',
    completed: false,
    createdAt: '2026-01-10',
  },
  {
    id: generateId(),
    title: 'Review team feedback',
    description: 'Go through all feedback from the team meeting',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-01-16',
    completed: false,
    createdAt: '2026-01-11',
  },
  {
    id: generateId(),
    title: 'Update documentation',
    description: 'Update the API documentation with new endpoints',
    status: 'done',
    priority: 'low',
    dueDate: '2026-01-12',
    completed: true,
    createdAt: '2026-01-08',
  },
  {
    id: generateId(),
    title: 'Schedule client meeting',
    description: 'Set up a meeting with the client for next week',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-01-17',
    completed: false,
    createdAt: '2026-01-12',
  },
  {
    id: generateId(),
    title: 'Code review',
    description: 'Review pull requests from the development team',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-01-14',
    completed: false,
    createdAt: '2026-01-13',
  },
];

export type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const deleteSelectedTasks = useCallback((ids: string[]) => {
    setTasks((prev) => prev.filter((task) => !ids.includes(task.id)));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? 'done' : 'todo',
            }
          : task
      )
    );
  }, []);

  const handleSort = useCallback((field: SortField) => {
    setSortField(field);
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });

  const exportToCSV = useCallback(() => {
    const headers = ['Title', 'Description', 'Status', 'Priority', 'Due Date', 'Completed', 'Created At'];
    const rows = tasks.map((task) => [
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate,
      task.completed ? 'Yes' : 'No',
      task.createdAt,
    ]);
    
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks]);

  return {
    tasks: filteredAndSortedTasks,
    allTasks: tasks,
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
  };
}
