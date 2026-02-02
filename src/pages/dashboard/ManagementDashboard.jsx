import { PageRibbon } from "@/components/layout/PageRibbon.jsx";
import { KpiCardWidget } from "@/components/dashboard/KpiCardWidget.jsx";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget.jsx";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget.jsx";
import { AreaChartWidget } from "@/components/dashboard/AreaChartWidget.jsx";
import { PriorityBreakdownChart } from "@/components/dashboard/PriorityBreakdownChart.jsx";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline.jsx";
import { toast } from "sonner";
import { Briefcase, Users, Target, TrendingUp } from "lucide-react";

export default function ManagementDashboard() {
  const handleDelete = (id) => toast.info(`Component ${id} would be deleted`);
  const handleDuplicate = (id) => toast.info(`Component ${id} would be duplicated`);

  return (
    <div className="space-y-6 pb-6">
      <PageRibbon title="Management Dashboard" onRefresh={() => toast.success("Refreshed")} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCardWidget
          componentId="mgmt-projects"
          icon={<Briefcase className="h-5 w-5" />}
          label="Active Projects"
          dataSource="operations"
          valueField="total"
          change="+10%"
          changeType="positive"
          bgColor="from-blue-600 to-indigo-700"
          onDelete={() => handleDelete("mgmt-projects")}
          onDuplicate={() => handleDuplicate("mgmt-projects")}
        />
        <KpiCardWidget
          componentId="mgmt-team"
          icon={<Users className="h-5 w-5" />}
          label="Team Members"
          dataSource="operations"
          valueField="onTime"
          showPercentage={true}
          change="+5%"
          changeType="positive"
          bgColor="from-emerald-600 to-green-700"
          onDelete={() => handleDelete("mgmt-team")}
          onDuplicate={() => handleDuplicate("mgmt-team")}
        />
        <KpiCardWidget
          componentId="mgmt-goals"
          icon={<Target className="h-5 w-5" />}
          label="Goals Achieved"
          dataSource="operations"
          valueField="avgProgress"
          showProgress={true}
          bgColor="from-purple-600 to-violet-700"
          onDelete={() => handleDelete("mgmt-goals")}
          onDuplicate={() => handleDuplicate("mgmt-goals")}
        />
        <KpiCardWidget
          componentId="mgmt-performance"
          icon={<TrendingUp className="h-5 w-5" />}
          label="Performance"
          dataSource="operations"
          valueField="completed"
          showPercentage={true}
          change="+12%"
          changeType="positive"
          bgColor="from-cyan-600 to-teal-700"
          onDelete={() => handleDelete("mgmt-performance")}
          onDuplicate={() => handleDuplicate("mgmt-performance")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartWidget
          componentId="mgmt-performance-trend"
          title="Performance Trend"
          dataSource="operations"
          lines={[
            { key: "shipments", label: "Projects", color: "#6366f1" },
            { key: "onTime", label: "On-Time", color: "#22c55e" },
          ]}
          onDelete={() => handleDelete("mgmt-performance-trend")}
          onDuplicate={() => handleDuplicate("mgmt-performance-trend")}
        />
        <AreaChartWidget
          componentId="mgmt-vs-target"
          title="Performance vs Target"
          dataSource="operations"
          targetValue={85}
          showTarget={true}
          onDelete={() => handleDelete("mgmt-vs-target")}
          onDuplicate={() => handleDuplicate("mgmt-vs-target")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PriorityBreakdownChart
          componentId="mgmt-priority"
          dataSource="operations"
          title="Projects by Priority"
          onDelete={() => handleDelete("mgmt-priority")}
          onDuplicate={() => handleDuplicate("mgmt-priority")}
        />
        <ActivityTimeline
          componentId="mgmt-activity"
          title="Recent Activity"
          dataSource="operations"
          limit={5}
          onDelete={() => handleDelete("mgmt-activity")}
          onDuplicate={() => handleDuplicate("mgmt-activity")}
        />
      </div>
    </div>
  );
}
