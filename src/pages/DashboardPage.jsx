import { useState } from "react";
import { PageRibbon } from "@/components/layout/PageRibbon.jsx";
import { KpiCardWidget } from "@/components/dashboard/KpiCardWidget.jsx";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget.jsx";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget.jsx";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget.jsx";
import { AreaChartWidget } from "@/components/dashboard/AreaChartWidget.jsx";
import { TodoListWidget } from "@/components/dashboard/TodoListWidget.jsx";
import { PriorityBreakdownChart } from "@/components/dashboard/PriorityBreakdownChart.jsx";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline.jsx";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget.jsx";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget.jsx";
import { QuickStatsWidget } from "@/components/dashboard/QuickStatsWidget.jsx";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import {
  Activity,
  TrendingUp,
  Clock3,
  AlertTriangle,
  Target,
  DollarSign,
} from "lucide-react";
import { useApp } from "@/contexts/useApp.js";
import { datasets } from "@/data/index.js";

const DashboardPage = ({ title, subtitle }) => {
  const { globalSearch, editMode } = useOutletContext();
  const { componentConfigs, updateComponentConfig } = useApp();

  const handleRefresh = () => {
    toast.success("Dashboard refreshed");
  };

  const handleExport = (format) => {
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print prepared");
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleDeleteComponent = (componentId) => {
    // In a real app, you'd remove from layout/state
    toast.info(`Component ${componentId} would be deleted`);
  };

  const handleDuplicateComponent = (componentId) => {
    // In a real app, you'd duplicate the component
    toast.info(`Component ${componentId} would be duplicated`);
  };

  const isDefaultDashboard = !title || title === 'Logistics Daily Dashboard';

  return (
    <div className="space-y-6 pb-6">
      {/* Hero / Welcome (default dashboard only) */}
      {isDefaultDashboard && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8 text-white shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {title || 'Logistics Daily Dashboard'}
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base max-w-2xl">
            {subtitle || 'Real-time overview of your operations'}
          </p>
        </div>
      )}

      {/* Ribbon */}
      <PageRibbon
        title="Dashboard"
        onExportCsv={() => handleExport("csv")}
        onExportExcel={() => handleExport("xls")}
        onRefresh={handleRefresh}
        onPrint={handlePrint}
        onFullscreen={handleFullscreen}
      />

      {/* KPI Cards Grid - Each card is independently editable */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCardWidget
          componentId="kpi-active-lanes"
          icon={<Activity className="h-5 w-5" />}
          label="Active Lanes"
          dataSource="dashboard"
          valueField="total"
          change="+12%"
          changeType="positive"
          bgColor="from-blue-600 to-indigo-700"
          onDelete={() => handleDeleteComponent("kpi-active-lanes")}
          onDuplicate={() => handleDuplicateComponent("kpi-active-lanes")}
        />
        <KpiCardWidget
          componentId="kpi-on-time"
          icon={<TrendingUp className="h-5 w-5" />}
          label="On-Time"
          dataSource="dashboard"
          valueField="onTime"
          showPercentage={true}
          change="+5%"
          changeType="positive"
          bgColor="from-emerald-600 to-green-700"
          onDelete={() => handleDeleteComponent("kpi-on-time")}
          onDuplicate={() => handleDuplicateComponent("kpi-on-time")}
        />
        <KpiCardWidget
          componentId="kpi-delayed"
          icon={<Clock3 className="h-5 w-5" />}
          label="Delayed"
          dataSource="dashboard"
          valueField="delayed"
          showPercentage={true}
          change="-3"
          changeType="negative"
          bgColor="from-amber-500 to-orange-600"
          onDelete={() => handleDeleteComponent("kpi-delayed")}
          onDuplicate={() => handleDuplicateComponent("kpi-delayed")}
        />
        <KpiCardWidget
          componentId="kpi-at-risk"
          icon={<AlertTriangle className="h-5 w-5" />}
          label="At Risk"
          dataSource="dashboard"
          valueField="atRisk"
          showPercentage={true}
          change="Monitor"
          changeType="neutral"
          bgColor="from-red-500 to-rose-600"
          onDelete={() => handleDeleteComponent("kpi-at-risk")}
          onDuplicate={() => handleDuplicateComponent("kpi-at-risk")}
        />
        <KpiCardWidget
          componentId="kpi-avg-completion"
          icon={<Target className="h-5 w-5" />}
          label="Avg Completion"
          dataSource="dashboard"
          valueField="avgProgress"
          showProgress={true}
          bgColor="from-purple-600 to-violet-700"
          onDelete={() => handleDeleteComponent("kpi-avg-completion")}
          onDuplicate={() => handleDuplicateComponent("kpi-avg-completion")}
        />
        <KpiCardWidget
          componentId="kpi-total-volume"
          icon={<DollarSign className="h-5 w-5" />}
          label="Total Volume"
          dataSource="dashboard"
          valueField="totalAmount"
          currency="USD"
          change="+18%"
          changeType="positive"
          bgColor="from-cyan-600 to-teal-700"
          onDelete={() => handleDeleteComponent("kpi-total-volume")}
          onDuplicate={() => handleDuplicateComponent("kpi-total-volume")}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <LineChartWidget
          componentId="chart-performance-trend"
          title="Shipment Performance Trend"
          dataSource="dashboard"
          lines={[
            { key: "shipments", label: "Shipments", color: "#6366f1" },
            { key: "onTime", label: "On-Time %", color: "#22c55e" },
            { key: "delayed", label: "Delayed", color: "#f59e0b" },
          ]}
          onDelete={() => handleDeleteComponent("chart-performance-trend")}
          onDuplicate={() => handleDuplicateComponent("chart-performance-trend")}
        />
        <PieChartWidget
          componentId="chart-status-distribution"
          title="Status Distribution"
          dataSource="dashboard"
          groupBy="status"
          onDelete={() => handleDeleteComponent("chart-status-distribution")}
          onDuplicate={() => handleDuplicateComponent("chart-status-distribution")}
        />
      </div>

      {/* Secondary Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartWidget
          componentId="chart-top-locations"
          title="Top Locations"
          dataSource="dashboard"
          groupBy="location"
          orientation="vertical"
          onDelete={() => handleDeleteComponent("chart-top-locations")}
          onDuplicate={() => handleDuplicateComponent("chart-top-locations")}
        />
        <AreaChartWidget
          componentId="chart-performance-target"
          title="Weekly Performance vs Target"
          dataSource="dashboard"
          targetValue={85}
          showTarget={true}
          onDelete={() => handleDeleteComponent("chart-performance-target")}
          onDuplicate={() => handleDuplicateComponent("chart-performance-target")}
        />
      </div>

      {/* Priority Breakdown & Additional Widgets */}
      <div className="grid gap-4 lg:grid-cols-3">
        <PriorityBreakdownChart
          componentId="chart-priority-breakdown"
          dataSource="dashboard"
          title="Unresolved by Priority"
          onDelete={() => handleDeleteComponent("chart-priority-breakdown")}
          onDuplicate={() => handleDuplicateComponent("chart-priority-breakdown")}
        />
        <TodoListWidget
          componentId="widget-todo-list"
          title="To-do List"
          onDelete={() => handleDeleteComponent("widget-todo-list")}
          onDuplicate={() => handleDuplicateComponent("widget-todo-list")}
        />
        <CalendarWidget
          componentId="widget-calendar"
          title="Calendar"
          mode="single"
          onDelete={() => handleDeleteComponent("widget-calendar")}
          onDuplicate={() => handleDuplicateComponent("widget-calendar")}
        />
      </div>

      {/* Activity Timeline & Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityTimeline
          componentId="widget-activity-timeline"
          title="Activity Timeline"
          dataSource="dashboard"
          limit={5}
          onDelete={() => handleDeleteComponent("widget-activity-timeline")}
          onDuplicate={() => handleDuplicateComponent("widget-activity-timeline")}
        />
        <RecentActivityWidget
          componentId="widget-recent-activity"
          title="Recent Activity"
          dataSource="dashboard"
          limit={6}
          showRefresh={true}
          onDelete={() => handleDeleteComponent("widget-recent-activity")}
          onDuplicate={() => handleDuplicateComponent("widget-recent-activity")}
        />
      </div>

      {/* Quick Stats Card */}
      <QuickStatsWidget
        componentId="widget-quick-stats"
        title="Quick Stats"
        dataSource="dashboard"
        stats={["onTimeRate", "avgProgress", "completed", "total"]}
        bgGradient="from-indigo-600 via-purple-600 to-pink-600"
        onDelete={() => handleDeleteComponent("widget-quick-stats")}
        onDuplicate={() => handleDuplicateComponent("widget-quick-stats")}
      />
    </div>
  );
};

export default DashboardPage;
