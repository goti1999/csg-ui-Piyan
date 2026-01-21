import { TaskTable } from '@/components/tasks/TaskTable.jsx';
import { CalendarDays, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

const Index = () => {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <CalendarDays className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Daily Tasks</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.username}
              </span>
              <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
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
