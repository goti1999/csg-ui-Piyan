import { PageRibbon } from "@/components/layout/PageRibbon.jsx";
import { KpiCardWidget } from "@/components/dashboard/KpiCardWidget.jsx";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget.jsx";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget.jsx";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget.jsx";
import { QuickStatsWidget } from "@/components/dashboard/QuickStatsWidget.jsx";
import { toast } from "sonner";
import { Cloud, Users, DollarSign, Zap } from "lucide-react";

export default function SaaSDashboard() {
  const handleDelete = (id) => toast.info(`Component ${id} would be deleted`);
  const handleDuplicate = (id) => toast.info(`Component ${id} would be duplicated`);

  return (
    <div className="space-y-6 pb-6">
      <PageRibbon title="SaaS Dashboard" onRefresh={() => toast.success("Refreshed")} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCardWidget
          componentId="saas-mrr"
          icon={<DollarSign className="h-5 w-5" />}
          label="MRR"
          dataSource="analytics"
          valueField="totalAmount"
          currency="USD"
          change="+18%"
          changeType="positive"
          bgColor="from-blue-600 to-indigo-700"
          onDelete={() => handleDelete("saas-mrr")}
          onDuplicate={() => handleDuplicate("saas-mrr")}
        />
        <KpiCardWidget
          componentId="saas-users"
          icon={<Users className="h-5 w-5" />}
          label="Active Users"
          dataSource="analytics"
          valueField="total"
          change="+25%"
          changeType="positive"
          bgColor="from-emerald-600 to-green-700"
          onDelete={() => handleDelete("saas-users")}
          onDuplicate={() => handleDuplicate("saas-users")}
        />
        <KpiCardWidget
          componentId="saas-churn"
          icon={<Cloud className="h-5 w-5" />}
          label="Churn Rate"
          dataSource="analytics"
          valueField="delayed"
          showPercentage={true}
          change="-3%"
          changeType="negative"
          bgColor="from-amber-500 to-orange-600"
          onDelete={() => handleDelete("saas-churn")}
          onDuplicate={() => handleDuplicate("saas-churn")}
        />
        <KpiCardWidget
          componentId="saas-growth"
          icon={<Zap className="h-5 w-5" />}
          label="Growth"
          dataSource="analytics"
          valueField="onTime"
          showPercentage={true}
          change="+32%"
          changeType="positive"
          bgColor="from-purple-600 to-violet-700"
          onDelete={() => handleDelete("saas-growth")}
          onDuplicate={() => handleDuplicate("saas-growth")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartWidget
          componentId="saas-revenue-trend"
          title="Revenue Trend"
          dataSource="analytics"
          lines={[
            { key: "shipments", label: "MRR", color: "#6366f1" },
            { key: "onTime", label: "ARR", color: "#22c55e" },
          ]}
          onDelete={() => handleDelete("saas-revenue-trend")}
          onDuplicate={() => handleDuplicate("saas-revenue-trend")}
        />
        <PieChartWidget
          componentId="saas-plans"
          title="Subscription Plans"
          dataSource="analytics"
          groupBy="status"
          onDelete={() => handleDelete("saas-plans")}
          onDuplicate={() => handleDuplicate("saas-plans")}
        />
      </div>

      <QuickStatsWidget
        componentId="saas-quick-stats"
        title="Quick Stats"
        dataSource="analytics"
        stats={["onTimeRate", "avgProgress", "completed", "total"]}
        bgGradient="from-indigo-600 via-purple-600 to-pink-600"
        onDelete={() => handleDelete("saas-quick-stats")}
        onDuplicate={() => handleDuplicate("saas-quick-stats")}
      />
    </div>
  );
}
