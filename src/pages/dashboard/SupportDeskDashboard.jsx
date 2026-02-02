import { PageRibbon } from "@/components/layout/PageRibbon.jsx";
import { KpiCardWidget } from "@/components/dashboard/KpiCardWidget.jsx";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget.jsx";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget.jsx";
import { PriorityBreakdownChart } from "@/components/dashboard/PriorityBreakdownChart.jsx";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget.jsx";
import { TodoListWidget } from "@/components/dashboard/TodoListWidget.jsx";
import { toast } from "sonner";
import { MessageSquare, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SupportDeskDashboard() {
  const handleDelete = (id) => toast.info(`Component ${id} would be deleted`);
  const handleDuplicate = (id) => toast.info(`Component ${id} would be duplicated`);

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold">Falcon Support Desk</h1>
        <p className="text-muted-foreground">Customer support ticket management</p>
      </div>

      <PageRibbon title="Support Desk" onRefresh={() => toast.success("Refreshed")} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCardWidget
          componentId="support-on-hold"
          icon={<Clock className="h-5 w-5" />}
          label="On Hold Tickets"
          dataSource="operations"
          valueField="total"
          change="255.3%"
          changeType="positive"
          bgColor="from-blue-600 to-indigo-700"
          onDelete={() => handleDelete("support-on-hold")}
          onDuplicate={() => handleDuplicate("support-on-hold")}
        />
        <KpiCardWidget
          componentId="support-open"
          icon={<MessageSquare className="h-5 w-5" />}
          label="Open Tickets"
          dataSource="operations"
          valueField="onTime"
          showPercentage={true}
          change="53.20%"
          changeType="positive"
          bgColor="from-emerald-600 to-green-700"
          onDelete={() => handleDelete("support-open")}
          onDuplicate={() => handleDuplicate("support-open")}
        />
        <KpiCardWidget
          componentId="support-due"
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Due Today"
          dataSource="operations"
          valueField="delayed"
          showPercentage={true}
          change="22.3%"
          changeType="neutral"
          bgColor="from-amber-500 to-orange-600"
          onDelete={() => handleDelete("support-due")}
          onDuplicate={() => handleDuplicate("support-due")}
        />
        <KpiCardWidget
          componentId="support-unassigned"
          icon={<MessageSquare className="h-5 w-5" />}
          label="Unassigned"
          dataSource="operations"
          valueField="atRisk"
          showPercentage={true}
          change="33.12%"
          changeType="neutral"
          bgColor="from-red-500 to-rose-600"
          onDelete={() => handleDelete("support-unassigned")}
          onDuplicate={() => handleDuplicate("support-unassigned")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PriorityBreakdownChart
          componentId="support-priority"
          dataSource="operations"
          title="Unresolved Tickets by Priority"
          onDelete={() => handleDelete("support-priority")}
          onDuplicate={() => handleDuplicate("support-priority")}
        />
        <LineChartWidget
          componentId="support-trend"
          title="Number of Tickets"
          dataSource="operations"
          lines={[
            { key: "shipments", label: "On Hold", color: "#6366f1" },
            { key: "onTime", label: "Open", color: "#22c55e" },
            { key: "delayed", label: "Due", color: "#f59e0b" },
          ]}
          onDelete={() => handleDelete("support-trend")}
          onDuplicate={() => handleDuplicate("support-trend")}
        />
        <PieChartWidget
          componentId="support-satisfaction"
          title="Customer Satisfaction"
          dataSource="operations"
          groupBy="status"
          onDelete={() => handleDelete("support-satisfaction")}
          onDuplicate={() => handleDuplicate("support-satisfaction")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivityWidget
          componentId="support-recent"
          title="Recent Tickets"
          dataSource="operations"
          limit={6}
          showRefresh={true}
          onDelete={() => handleDelete("support-recent")}
          onDuplicate={() => handleDuplicate("support-recent")}
        />
        <TodoListWidget
          componentId="support-tasks"
          title="To-do List"
          onDelete={() => handleDelete("support-tasks")}
          onDuplicate={() => handleDuplicate("support-tasks")}
        />
      </div>
    </div>
  );
}
