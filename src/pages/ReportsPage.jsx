import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { PageRibbon } from "@/components/layout/PageRibbon.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Calendar } from "@/components/ui/calendar.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart.jsx";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Printer,
  RefreshCw,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import { datasets } from "@/data/index.js";
import { formatDateDisplay } from "@/lib/utils.js";
import { cn } from "@/lib/utils.js";

export default function ReportsPage() {
  const context = useOutletContext();
  const globalSearch = context?.globalSearch;
  const allData = [...datasets.operations, ...datasets.fleet, ...datasets.warehouses];
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [viewMode, setViewMode] = useState("table");

  const filtered = useMemo(() => {
    let result = allData;
    if (statusFilter !== "all") result = result.filter((r) => r.status === statusFilter);
    if (priorityFilter !== "all") result = result.filter((r) => r.priority === priorityFilter);
    if (dateRange.from || dateRange.to) {
      result = result.filter((r) => {
        const eta = new Date(r.eta);
        if (dateRange.from && eta < dateRange.from) return false;
        if (dateRange.to && eta > dateRange.to) return false;
        return true;
      });
    }
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      result = result.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
    }
    return result;
  }, [allData, statusFilter, priorityFilter, dateRange, globalSearch]);

  const summaryStats = useMemo(() => {
    const total = filtered.length;
    const byStatus = filtered.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    const byPriority = filtered.reduce((acc, r) => {
      acc[r.priority] = (acc[r.priority] || 0) + 1;
      return acc;
    }, {});
    const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);
    const avgProgress = Math.round(filtered.reduce((sum, r) => sum + r.progress, 0) / Math.max(total, 1));
    return { total, byStatus, byPriority, totalAmount, avgProgress };
  }, [filtered]);

  const chartData = useMemo(() => {
    return Object.entries(summaryStats.byStatus).map(([status, count]) => ({
      status: status.replace("-", " "),
      count,
      fill: status === "on-time" ? "#22c55e" : status === "delayed" ? "#f59e0b" : status === "completed" ? "#6366f1" : "#ef4444",
    }));
  }, [summaryStats]);

  const priorityChartData = useMemo(() => {
    return Object.entries(summaryStats.byPriority).map(([priority, count]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      count,
      fill: priority === "critical" ? "#ef4444" : priority === "high" ? "#f59e0b" : priority === "medium" ? "#3b82f6" : "#22c55e",
    }));
  }, [summaryStats]);

  const monthlyData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthData = filtered.filter((r) => {
        const date = new Date(r.eta);
        return date.getMonth() === i;
      });
      return {
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        value: monthData.reduce((sum, r) => sum + r.amount, 0),
        count: monthData.length,
      };
    });
  }, [filtered]);

  const exportReport = (format) => {
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
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const handleRefresh = () => {
    toast.success("Reports refreshed");
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print prepared");
  };

  return (
    <div className="space-y-6 pb-6">
      <PageRibbon
        title="Reports"
        onExportCsv={() => exportReport("csv")}
        onExportExcel={() => exportReport("xls")}
        onPrint={handlePrint}
        onRefresh={handleRefresh}
        showDateRange={true}
        dateRange={dateRange.from && dateRange.to ? `${formatDateDisplay(dateRange.from)} - ${formatDateDisplay(dateRange.to)}` : null}
        onDateRangeChange={() => toast.info("Date range picker")}
        showFilter={true}
        onFilter={() => toast.info("Advanced filters")}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Comprehensive analytics and business intelligence from @/data</p>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-all border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summaryStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Across operations, fleet, warehouses</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">+12% vs last month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-all border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${summaryStats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Combined amount</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">+18% growth</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-all border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Progress</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summaryStats.avgProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
            <div className="mt-2">
              <Progress value={summaryStats.avgProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-all border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Rate</CardTitle>
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {summaryStats.total > 0 ? Math.round(((summaryStats.byStatus["on-time"] || 0) / summaryStats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Performance metric</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">Target: 90%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Report Filters</CardTitle>
              <CardDescription>Customize your report data</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}>
                <Eye className="h-4 w-4" />
                {viewMode === "table" ? "Card View" : "Table View"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
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
            <div className="space-y-2">
              <Label className="text-xs font-medium">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? formatDateDisplay(dateRange.from) : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ from: range?.from || null, to: range?.to || null })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Actions</Label>
              <div className="flex gap-2">
                {(statusFilter !== "all" || priorityFilter !== "all" || dateRange.from) && (
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); setDateRange({ from: null, to: null }); }}>
                    Clear
                  </Button>
                )}
                <Button size="sm" className="flex-1" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Status Distribution</CardTitle>
                    <CardDescription>Breakdown by status</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ count: { label: "Count" } }} className="h-64">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="status" fontSize={11} stroke="#9ca3af" />
                    <YAxis fontSize={11} stroke="#9ca3af" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <div className="space-y-2 mt-4">
                  {Object.entries(summaryStats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <Badge variant={status === "on-time" ? "default" : status === "completed" ? "secondary" : "outline"}>
                        {status.replace("-", " ")}
                      </Badge>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{count} records</span>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${status === "on-time" ? "bg-emerald-500" : status === "delayed" ? "bg-amber-500" : status === "completed" ? "bg-blue-500" : "bg-red-500"}`}
                            style={{ width: `${(count / summaryStats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{Math.round((count / summaryStats.total) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Priority Breakdown</CardTitle>
                    <CardDescription>By priority level</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ count: { label: "Count" } }} className="h-64">
                  <PieChart>
                    <Pie data={priorityChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="count">
                      {priorityChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-2 mt-4">
                  {Object.entries(summaryStats.byPriority).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between text-sm">
                      <span className="capitalize font-medium">{priority}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>Revenue and volume over time</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ value: { label: "Revenue", color: "#6366f1" }, count: { label: "Count", color: "#22c55e" } }} className="h-80">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" fontSize={11} stroke="#9ca3af" />
                  <YAxis yAxisId="left" fontSize={11} stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" fontSize={11} stroke="#9ca3af" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Pie chart view</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ value: { label: "Count" } }} className="h-64">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={5} dataKey="count">
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>By shipment volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ count: { label: "Shipments", color: "#22c55e" } }} className="h-64">
                  <BarChart
                    data={Object.entries(
                      filtered.reduce((acc, r) => {
                        acc[r.location] = (acc[r.location] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([location, count]) => ({ location, count }))}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" fontSize={11} stroke="#9ca3af" />
                    <YAxis dataKey="location" type="category" fontSize={11} stroke="#9ca3af" width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#22c55e" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Detailed Records ({filtered.length})</CardTitle>
                  <CardDescription>First 50 rows shown</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => exportReport("csv")}>
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Priority</th>
                      <th className="text-right p-3 font-medium">Progress</th>
                      <th className="text-right p-3 font-medium">Amount</th>
                      <th className="text-left p-3 font-medium">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 50).map((row) => (
                      <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium">{row.name}</td>
                        <td className="p-3">
                          <Badge variant="outline">{row.status}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={row.priority === "critical" ? "destructive" : row.priority === "high" ? "secondary" : "outline"} className="capitalize">
                            {row.priority}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span>{row.progress}%</span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${row.progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right font-medium">${row.amount.toLocaleString()}</td>
                        <td className="p-3 text-muted-foreground">{row.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
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
                    <div className="text-muted-foreground">Avg Progress</div>
                    <div className="text-2xl font-bold">{summaryStats.avgProgress}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Completed</div>
                    <div className="text-2xl font-bold">
                      {Math.round(((summaryStats.byStatus["completed"] || 0) / summaryStats.total) * 100)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                    <span className="text-sm font-medium">On-Time Rate</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {summaryStats.total > 0 ? Math.round(((summaryStats.byStatus["on-time"] || 0) / summaryStats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <span className="text-sm font-medium">Avg Progress</span>
                    <span className="text-lg font-bold text-blue-600">{summaryStats.avgProgress}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <span className="text-sm font-medium">Delayed Items</span>
                    <span className="text-lg font-bold text-amber-600">{summaryStats.byStatus["delayed"] || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Download or print your reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3" onClick={() => exportReport("csv")}>
                <FileSpreadsheet className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">CSV</div>
                  <div className="text-sm text-muted-foreground">Comma-separated values</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3" onClick={() => exportReport("xls")}>
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Excel</div>
                  <div className="text-sm text-muted-foreground">.xls format</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3" onClick={handlePrint}>
                <Printer className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Print</div>
                  <div className="text-sm text-muted-foreground">Print or save as PDF</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
