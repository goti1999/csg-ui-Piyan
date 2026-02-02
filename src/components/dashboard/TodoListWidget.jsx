import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/useApp.js';
import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
import { ComponentEditor } from '@/components/builder/ComponentEditor.jsx';

/**
 * To-do list widget (Falcon-style). Users can add, check, and remove items.
 * Configurable: title
 */
export function TodoListWidget({
  componentId = 'widget-todo-list',
  title = 'To-do List',
  initialTodos = [],
  onUpdate,
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const { editMode, componentConfigs, updateComponentConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const config = componentConfigs[componentId] || {};

  const finalTitle = config.title || title;
  const [todos, setTodos] = useState(() => {
    if (initialTodos.length) return initialTodos;
    return [
      { id: '1', text: 'Review pending shipments', done: false, priority: 'high' },
      { id: '2', text: 'Update container statuses', done: false, priority: 'medium' },
      { id: '3', text: 'Schedule weekly review', done: true, priority: 'low' },
    ];
  });
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo = { id: `todo-${Date.now()}`, text: newTodo.trim(), done: false, priority: 'medium' };
    setTodos((prev) => {
      const updated = [...prev, todo];
      onUpdate?.(updated);
      return updated;
    });
    setNewTodo('');
    toast.success('Task added');
  };

  const toggleTodo = (id) => {
    setTodos((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      onUpdate?.(updated);
      return updated;
    });
  };

  const removeTodo = (id) => {
    setTodos((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      onUpdate?.(updated);
      return updated;
    });
    toast.success('Task removed');
  };

  return (
    <>
      <EditableWrapper
        componentId={componentId}
        componentName={finalTitle}
        componentType="card"
        onEdit={() => setEditing(true)}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      >
        <Card className="shadow-xl border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                {finalTitle}
              </CardTitle>
          <Badge variant="secondary" className="text-xs">{todos.filter((t) => !t.done).length} pending</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add new task..."
            className="text-sm"
          />
          <Button size="sm" className="gap-1" onClick={addTodo}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {todos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks. Add one above.</p>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <Checkbox checked={todo.done} onCheckedChange={() => toggleTodo(todo.id)} className="flex-shrink-0" />
                <span className={`flex-1 text-sm ${todo.done ? 'line-through text-muted-foreground' : 'text-slate-800 dark:text-white'}`}>
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50"
                  onClick={() => removeTodo(todo.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
      </EditableWrapper>

      {editMode && editing && (
        <ComponentEditor
          open={editing}
          onOpenChange={setEditing}
          componentId={componentId}
          componentName={finalTitle}
          componentType="card"
          initialColumns={[]}
          initialTriggers={config.triggers}
          initialDataSource={{}}
          onSave={(cols) => {
            updateComponentConfig(componentId, {
              ...config,
              columns: cols,
              title: config.title,
            });
            setEditing(false);
          }}
        />
      )}
    </>
  );
}
