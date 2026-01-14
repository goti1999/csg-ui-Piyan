import { TaskTable } from '@/components/tasks/TaskTable';
import { CalendarDays } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <CalendarDays className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Daily Tasks</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your daily tasks with an Excel-like interface. Sort, filter, and organize your work efficiently.
          </p>
        </div>

        {/* Task Table */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <TaskTable />
        </div>
      </div>
    </div>
  );
};

export default Index;
