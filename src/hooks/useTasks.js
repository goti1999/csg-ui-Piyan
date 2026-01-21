import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks from database
  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedTasks = (data || []).map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date || '',
        completed: task.completed,
        createdAt: task.created_at.split('T')[0],
      }));

      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (task) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: task.title,
          description: task.description || null,
          status: task.status,
          priority: task.priority,
          due_date: task.dueDate || null,
          completed: task.completed,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        status: data.status,
        priority: data.priority,
        dueDate: data.due_date || '',
        completed: data.completed,
        createdAt: data.created_at.split('T')[0],
      };

      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  }, [user]);

  const updateTask = useCallback(async (id, updates) => {
    if (!user) return;

    try {
      const dbUpdates = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate || null;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  }, [user]);

  const deleteTask = useCallback(async (id) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  }, [user]);

  const deleteSelectedTasks = useCallback(async (ids) => {
    if (!user || ids.length === 0) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks((prev) => prev.filter((task) => !ids.includes(task.id)));
      toast.success(`${ids.length} task(s) deleted`);
    } catch (error) {
      console.error('Error deleting tasks:', error);
      toast.error('Failed to delete tasks');
    }
  }, [user]);

  const toggleComplete = useCallback(async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || !user) return;

    const newCompleted = !task.completed;
    const newStatus = newCompleted ? 'completed' : 'todo';

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: newCompleted, status: newStatus })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, completed: newCompleted, status: newStatus }
            : t
        )
      );
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  }, [tasks, user]);

  const handleSort = useCallback((field) => {
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
    loading,
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
    refetch: fetchTasks,
  };
}
