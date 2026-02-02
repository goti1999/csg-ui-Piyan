import { useState } from "react";
import { PageRibbon } from "@/components/layout/PageRibbon.jsx";
import { KpiCardWidget } from "@/components/dashboard/KpiCardWidget.jsx";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget.jsx";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget.jsx";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget.jsx";
import { AreaChartWidget } from "@/components/dashboard/AreaChartWidget.jsx";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { TrendingUp, Users, DollarSign, Target, BarChart3, Activity } from "lucide-react";

/**
 * Analytics Dashboard - Data analytics and insights
 */
export default function AnalyticsDashboard() {
  const { editMode } = useOutletContext();

  const handleDelete = (id) => toast.info(`Component ${id} would be deleted`);
  const handleDuplicate = (id) => toast.info(`Component ${id} would be duplicated`);

  return (
    <div className="space-y-6 pb-6">
      <PageRibbon title="Analytics Dashboard" onRefresh={() => toast.success("Refreshed")} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCardWidget
          componentId="analytics-total-users"
          icon={<Users className="h-5 w-5" />}
          label="Total Users"
          dataSource="analytics"
          valueField="total"
          change="+12%"
          changeType="positive"
          bgColor="from-blue-600 to-indigo-700"
          onDelete={() => handleDelete("analytics-total-users")}
          onDuplicate={() => handleDuplicate("analytics-total-users")}
        />
        <KpiCardWidget
          componentId="analytics-revenue"
          icon={<DollarSign className="h-5 w-5" />}
          label="Revenue"
          dataSource="analytics"
          valueField="totalAmount"
          currency="USD"
          change="+18%"
          changeType="positive"
          bgColor="from-emerald-600 to-green-700"
          onDelete={() => handleDelete("analytics-revenue")}
          onDuplicate={() => handleDuplicate("analytics-revenue")}
        />
        <KpiCardWidget
          componentId="analytics-conversion"
          icon={<Target className="h-5 w-5" />}
          label="Conversion Rate"
          dataSource="analytics"
          valueField="avgProgress"
          showProgress={true}
          bgColor="from-purple-600 to-violet-700"
          onDelete={() => handleDelete("analytics-conversion")}
          onDuplicate={() => handleDuplicate("analytics-conversion")}
        />
        <KpiCardWidget
          componentId="analytics-growth"
          icon={<TrendingUp className="h-5 w-5" />}
          label="Growth"
          dataSource="analytics"
          valueField="onTime"
          showPercentage={true}
          change="+25%"
          changeType="positive"
          bgColor="from-cyan-600 to-teal-700"
          onDelete={() => handleDelete("analytics-growth")}
          onDuplicate={() => handleDuplicate("analytics-growth")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartWidget
          componentId="analytics-trend"
          title="Analytics Trend"
          dataSource="analytics"
          lines={[
            { key: "shipments", label: "Users", color: "#6366f1" },
            { key: "onTime", label: "Active", color: "#22c55e" },
          ]}
          onDelete={() => handleDelete("analytics-trend")}
          onDuplicate={() => handleDuplicate("analytics-trend")}
        />
        <PieChartWidget
          componentId="analytics-distribution"
          title="Data Distribution"
          dataSource="analytics"
          groupBy="status"
          onDelete={() => handleDelete("analytics-distribution")}
          onDuplicate={() => handleDuplicate("analytics-distribution")}
        />
      </div>
    </div>
  );
}
