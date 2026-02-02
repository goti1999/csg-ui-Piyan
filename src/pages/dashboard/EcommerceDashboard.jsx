import { PageRibbon } from "@/components/layout/PageRibbon.jsx";
import { KpiCardWidget } from "@/components/dashboard/KpiCardWidget.jsx";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget.jsx";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget.jsx";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget.jsx";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget.jsx";
import { toast } from "sonner";
import { ShoppingCart, DollarSign, Package, TrendingUp, Users } from "lucide-react";

export default function EcommerceDashboard() {
  const handleDelete = (id) => toast.info(`Component ${id} would be deleted`);
  const handleDuplicate = (id) => toast.info(`Component ${id} would be duplicated`);

  return (
    <div className="space-y-6 pb-6">
      <PageRibbon title="E-commerce Dashboard" onRefresh={() => toast.success("Refreshed")} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCardWidget
          componentId="ecom-orders"
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Orders"
          dataSource="operations"
          valueField="total"
          change="+12%"
          changeType="positive"
          bgColor="from-blue-600 to-indigo-700"
          onDelete={() => handleDelete("ecom-orders")}
          onDuplicate={() => handleDuplicate("ecom-orders")}
        />
        <KpiCardWidget
          componentId="ecom-revenue"
          icon={<DollarSign className="h-5 w-5" />}
          label="Revenue"
          dataSource="operations"
          valueField="totalAmount"
          currency="USD"
          change="+18%"
          changeType="positive"
          bgColor="from-emerald-600 to-green-700"
          onDelete={() => handleDelete("ecom-revenue")}
          onDuplicate={() => handleDuplicate("ecom-revenue")}
        />
        <KpiCardWidget
          componentId="ecom-products"
          icon={<Package className="h-5 w-5" />}
          label="Products"
          dataSource="operations"
          valueField="onTime"
          showPercentage={true}
          change="+5%"
          changeType="positive"
          bgColor="from-purple-600 to-violet-700"
          onDelete={() => handleDelete("ecom-products")}
          onDuplicate={() => handleDuplicate("ecom-products")}
        />
        <KpiCardWidget
          componentId="ecom-customers"
          icon={<Users className="h-5 w-5" />}
          label="Customers"
          dataSource="operations"
          valueField="delayed"
          showPercentage={true}
          change="+8%"
          changeType="positive"
          bgColor="from-cyan-600 to-teal-700"
          onDelete={() => handleDelete("ecom-customers")}
          onDuplicate={() => handleDuplicate("ecom-customers")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartWidget
          componentId="ecom-sales-trend"
          title="Sales Trend"
          dataSource="operations"
          lines={[
            { key: "shipments", label: "Sales", color: "#6366f1" },
            { key: "onTime", label: "Orders", color: "#22c55e" },
          ]}
          onDelete={() => handleDelete("ecom-sales-trend")}
          onDuplicate={() => handleDuplicate("ecom-sales-trend")}
        />
        <PieChartWidget
          componentId="ecom-categories"
          title="Product Categories"
          dataSource="operations"
          groupBy="category"
          onDelete={() => handleDelete("ecom-categories")}
          onDuplicate={() => handleDuplicate("ecom-categories")}
        />
      </div>

      <RecentActivityWidget
        componentId="ecom-recent-orders"
        title="Recent Orders"
        dataSource="operations"
        limit={6}
        showRefresh={true}
        onDelete={() => handleDelete("ecom-recent-orders")}
        onDuplicate={() => handleDuplicate("ecom-recent-orders")}
      />
    </div>
  );
}
