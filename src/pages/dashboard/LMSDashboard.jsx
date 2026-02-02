import { PageRibbon } from "@/components/layout/PageRibbon.jsx";
import { KpiCardWidget } from "@/components/dashboard/KpiCardWidget.jsx";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget.jsx";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget.jsx";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget.jsx";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget.jsx";
import { TodoListWidget } from "@/components/dashboard/TodoListWidget.jsx";
import { toast } from "sonner";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";

export default function LMSDashboard() {
  const handleDelete = (id) => toast.info(`Component ${id} would be deleted`);
  const handleDuplicate = (id) => toast.info(`Component ${id} would be duplicated`);

  return (
    <div className="space-y-6 pb-6">
      <PageRibbon title="LMS Dashboard" onRefresh={() => toast.success("Refreshed")} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCardWidget
          componentId="lms-students"
          icon={<Users className="h-5 w-5" />}
          label="Students"
          dataSource="analytics"
          valueField="total"
          change="+15%"
          changeType="positive"
          bgColor="from-blue-600 to-indigo-700"
          onDelete={() => handleDelete("lms-students")}
          onDuplicate={() => handleDuplicate("lms-students")}
        />
        <KpiCardWidget
          componentId="lms-courses"
          icon={<BookOpen className="h-5 w-5" />}
          label="Courses"
          dataSource="analytics"
          valueField="onTime"
          showPercentage={true}
          change="+8%"
          changeType="positive"
          bgColor="from-emerald-600 to-green-700"
          onDelete={() => handleDelete("lms-courses")}
          onDuplicate={() => handleDuplicate("lms-courses")}
        />
        <KpiCardWidget
          componentId="lms-completions"
          icon={<Award className="h-5 w-5" />}
          label="Completions"
          dataSource="analytics"
          valueField="completed"
          showPercentage={true}
          change="+12%"
          changeType="positive"
          bgColor="from-purple-600 to-violet-700"
          onDelete={() => handleDelete("lms-completions")}
          onDuplicate={() => handleDuplicate("lms-completions")}
        />
        <KpiCardWidget
          componentId="lms-progress"
          icon={<TrendingUp className="h-5 w-5" />}
          label="Avg Progress"
          dataSource="analytics"
          valueField="avgProgress"
          showProgress={true}
          bgColor="from-cyan-600 to-teal-700"
          onDelete={() => handleDelete("lms-progress")}
          onDuplicate={() => handleDuplicate("lms-progress")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <LineChartWidget
          componentId="lms-enrollment"
          title="Enrollment Trend"
          dataSource="analytics"
          lines={[
            { key: "shipments", label: "Enrollments", color: "#6366f1" },
            { key: "onTime", label: "Completions", color: "#22c55e" },
          ]}
          onDelete={() => handleDelete("lms-enrollment")}
          onDuplicate={() => handleDuplicate("lms-enrollment")}
        />
        <PieChartWidget
          componentId="lms-course-status"
          title="Course Status"
          dataSource="analytics"
          groupBy="status"
          onDelete={() => handleDelete("lms-course-status")}
          onDuplicate={() => handleDuplicate("lms-course-status")}
        />
        <CalendarWidget
          componentId="lms-calendar"
          title="Upcoming Events"
          mode="single"
          onDelete={() => handleDelete("lms-calendar")}
          onDuplicate={() => handleDuplicate("lms-calendar")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartWidget
          componentId="lms-top-courses"
          title="Top Courses"
          dataSource="analytics"
          groupBy="location"
          orientation="vertical"
          onDelete={() => handleDelete("lms-top-courses")}
          onDuplicate={() => handleDuplicate("lms-top-courses")}
        />
        <TodoListWidget
          componentId="lms-tasks"
          title="Learning Tasks"
          onDelete={() => handleDelete("lms-tasks")}
          onDuplicate={() => handleDuplicate("lms-tasks")}
        />
      </div>
    </div>
  );
}
