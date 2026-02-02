import { useState } from "react";
import { PageRibbon } from "@/components/layout/PageRibbon.jsx";
import { KpiCardWidget } from "@/components/dashboard/KpiCardWidget.jsx";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget.jsx";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget.jsx";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget.jsx";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget.jsx";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { Users, DollarSign, TrendingUp, Phone, Mail, MessageSquare } from "lucide-react";

/**
 * CRM Dashboard - Customer relationship management
 */
export default function CRMDashboard() {
  const { editMode } = useOutletContext();

  const handleDelete = (id) => toast.info(`Component ${id} would be deleted`);
  const handleDuplicate = (id) => toast.info(`Component ${id} would be duplicated`);

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold">Falcon CRM</h1>
        <p className="text-muted-foreground">Customer relationship management dashboard</p>
      </div>

      <PageRibbon title="CRM Dashboard" onRefresh={() => toast.success("Refreshed")} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCardWidget
          componentId="crm-new-contacts"
          icon={<Users className="h-5 w-5" />}
          label="New Contacts"
          dataSource="operations"
          valueField="total"
          change="15%"
          changeType="positive"
          bgColor="from-blue-600 to-indigo-700"
          onDelete={() => handleDelete("crm-new-contacts")}
          onDuplicate={() => handleDuplicate("crm-new-contacts")}
        />
        <KpiCardWidget
          componentId="crm-new-users"
          icon={<Users className="h-5 w-5" />}
          label="New Users"
          dataSource="operations"
          valueField="onTime"
          showPercentage={true}
          change="13%"
          changeType="positive"
          bgColor="from-emerald-600 to-green-700"
          onDelete={() => handleDelete("crm-new-users")}
          onDuplicate={() => handleDuplicate("crm-new-users")}
        />
        <KpiCardWidget
          componentId="crm-new-leads"
          icon={<TrendingUp className="h-5 w-5" />}
          label="New Leads"
          dataSource="operations"
          valueField="delayed"
          showPercentage={true}
          change="16%"
          changeType="positive"
          bgColor="from-purple-600 to-violet-700"
          onDelete={() => handleDelete("crm-new-leads")}
          onDuplicate={() => handleDuplicate("crm-new-leads")}
        />
        <KpiCardWidget
          componentId="crm-revenue"
          icon={<DollarSign className="h-5 w-5" />}
          label="Revenue"
          dataSource="operations"
          valueField="totalAmount"
          currency="USD"
          change="+9.54%"
          changeType="positive"
          bgColor="from-cyan-600 to-teal-700"
          onDelete={() => handleDelete("crm-revenue")}
          onDuplicate={() => handleDuplicate("crm-revenue")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChartWidget
            componentId="crm-revenue-trend"
            title="Revenue Trend"
            dataSource="operations"
            lines={[
              { key: "shipments", label: "Revenue", color: "#6366f1" },
              { key: "onTime", label: "Users", color: "#22c55e" },
              { key: "delayed", label: "Deals", color: "#f59e0b" },
            ]}
            onDelete={() => handleDelete("crm-revenue-trend")}
            onDuplicate={() => handleDuplicate("crm-revenue-trend")}
          />
        </div>
        <PieChartWidget
          componentId="crm-lead-sources"
          title="Lead Sources"
          dataSource="operations"
          groupBy="status"
          onDelete={() => handleDelete("crm-lead-sources")}
          onDuplicate={() => handleDuplicate("crm-lead-sources")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartWidget
          componentId="crm-deal-forecast"
          title="Deal Forecast by Owner"
          dataSource="operations"
          groupBy="location"
          orientation="vertical"
          onDelete={() => handleDelete("crm-deal-forecast")}
          onDuplicate={() => handleDuplicate("crm-deal-forecast")}
        />
        <RecentActivityWidget
          componentId="crm-recent-leads"
          title="Recent Leads"
          dataSource="operations"
          limit={6}
          showRefresh={true}
          onDelete={() => handleDelete("crm-recent-leads")}
          onDuplicate={() => handleDuplicate("crm-recent-leads")}
        />
      </div>
    </div>
  );
}
