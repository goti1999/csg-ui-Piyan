import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { datasets } from "@/data/logistics";

export default function ReportsPage() {
  const { globalSearch }: { globalSearch?: string } = useOutletContext() as { globalSearch?: string };
  const allData = [...datasets.operations, ...datasets.fleet, ...datasets.warehouses];
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = allData;
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      result = result.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
    }
    return result;
  }, [allData, statusFilter, globalSearch]);

  const summaryStats = useMemo(() => {
    const total = filtered.length;
    const byStatus = filtered.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);
    const avgProgress = Math.round(filtered.reduce((sum, r) => sum + r.progress, 0) / Math.max(total, 1));
    return { total, byStatus, totalAmount, avgProgress };
  }, [filtered]);

  const exportReport = (format: string) => {
    const headers = ["ID", "Name", "Status", "Priority", "Location", "Amount", "Progress", "ETA"];
    const rows = filtered.map((r) => [
      r.id,
      r.name,
      r.status,
      r.priority,
      r.location,
      r.amount,
      r.progress,
      new Date(r.eta).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => JSON.stringify(cell)).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logistics_report_${new Date().toISOString().split("T")[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Reports</h1>
          <p className="text-muted-foreground mt-1">Comprehensive analytics and business intelligence</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportReport("csv")}>
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportReport("xls")}>
            <FileText className="h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => { toast.info("Print functionality"); }}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all modules</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryStats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Combined amount</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.avgProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryStats.total > 0
                ? Math.round(((summaryStats.byStatus["on-time"] || 0) / summaryStats.total) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">Performance metric</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Filters</CardTitle>
          <CardDescription>Customize your report data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on-time">On-Time</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {statusFilter !== "all" && (
              <Button variant="outline" size="sm" onClick={() => setStatusFilter("all")}>
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Breakdown by current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(summaryStats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          status === "on-time"
                            ? "default"
                            : status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {status.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">{count} records</div>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            status === "on-time"
                              ? "bg-emerald-500"
                              : status === "delayed"
                              ? "bg-amber-500"
                              : status === "completed"
                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${(count / summaryStats.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium w-12 text-right">
                        {Math.round((count / summaryStats.total) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Priority Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["low", "medium", "high", "critical"].map((priority) => {
                    const count = filtered.filter((r) => r.priority === priority).length;
                    return (
                      <div key={priority} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{priority}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(
                    filtered.reduce((acc, r) => {
                      acc[r.location] = (acc[r.location] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([location, count]) => (
                      <div key={location} className="flex items-center justify-between text-sm">
                        <span>{location}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Records ({filtered.length})</CardTitle>
              <CardDescription>First 50 records shown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Priority</th>
                      <th className="text-right p-3 font-medium">Progress</th>
                      <th className="text-right p-3 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 50).map((row) => (
                      <tr key={row.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">{row.name}</td>
                        <td className="p-3">
                          <Badge variant="outline">{row.status}</Badge>
                        </td>
                        <td className="p-3 capitalize">{row.priority}</td>
                        <td className="p-3 text-right">{row.progress}%</td>
                        <td className="p-3 text-right">${row.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Records</div>
                  <div className="text-2xl font-bold">{summaryStats.total}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-bold">${summaryStats.totalAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Average Progress</div>
                  <div className="text-2xl font-bold">{summaryStats.avgProgress}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Completion Rate</div>
                  <div className="text-2xl font-bold">
                    {Math.round(((summaryStats.byStatus["completed"] || 0) / summaryStats.total) * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Download your reports in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Button variant="outline" className="justify-start gap-3" onClick={() => exportReport("csv")}>
                  <FileSpreadsheet className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Export as CSV</div>
                    <div className="text-sm text-muted-foreground">Comma-separated values format</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start gap-3" onClick={() => exportReport("xls")}>
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Export as Excel</div>
                    <div className="text-sm text-muted-foreground">Microsoft Excel format</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-3"
                  onClick={() => {
                    window.print();
                    toast.success("Print dialog opened");
                  }}
                >
                  <Printer className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Print Report</div>
                    <div className="text-sm text-muted-foreground">Print or save as PDF</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
