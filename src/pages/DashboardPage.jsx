import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext.jsx";
import {
  BarChart3,
  Filter,
  Download,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Package,
  Truck,
  Ship,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  X,
  RefreshCw,
  FileText,
  Target,
  Zap,
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts";
import { datasets } from "@/data/logistics.js";
import { useOutletContext } from "react-router-dom";

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const DashboardPage = ({ title, subtitle }) => {
  const { globalSearch } = useOutletContext();
  const { t } = useApp();
  
  // Filter states
  const [customerNo, setCustomerNo] = useState("");
  const [containerNo, setContainerNo] = useState("");
  const [mblNo, setMblNo] = useState("");
  const [hblNo, setHblNo] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  
  const data = datasets.dashboard;

  const filtered = useMemo(() => {
    let result = data;
    
    // Apply global search
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      result = result.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
    }
    
    // Apply customer number filter
    if (customerNo.trim()) {
      result = result.filter((row) => row.id.toLowerCase().includes(customerNo.trim().toLowerCase()));
    }
    
    // Apply container number filter
    if (containerNo.trim()) {
      result = result.filter((row) => row.name.toLowerCase().includes(containerNo.trim().toLowerCase()));
    }
    
    // Apply MBL number filter
    if (mblNo.trim()) {
      result = result.filter((row) => row.id.toLowerCase().includes(mblNo.trim().toLowerCase()) || 
        row.category.toLowerCase().includes(mblNo.trim().toLowerCase()));
    }
    
    // Apply HBL number filter
    if (hblNo.trim()) {
      result = result.filter((row) => row.name.toLowerCase().includes(hblNo.trim().toLowerCase()) ||
        row.location.toLowerCase().includes(hblNo.trim().toLowerCase()));
    }
    
    return result;
  }, [data, globalSearch, customerNo, containerNo, mblNo, hblNo]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const onTime = filtered.filter((r) => r.status === "on-time").length;
    const delayed = filtered.filter((r) => r.status === "delayed").length;
    const atRisk = filtered.filter((r) => r.status === "at-risk").length;
    const completed = filtered.filter((r) => r.status === "completed").length;
    const avgProgress = Math.round(filtered.reduce((acc, r) => acc + r.progress, 0) / Math.max(total, 1));
    const totalAmount = filtered.reduce((acc, r) => acc + r.amount, 0);
    const onTimePercent = total > 0 ? Math.round((onTime / total) * 100) : 0;
    
    return { total, onTime, delayed, atRisk, completed, avgProgress, totalAmount, onTimePercent };
  }, [filtered]);

  // Chart data
  const trendData = useMemo(() => {
    return filtered.slice(0, 12).map((r, i) => ({
      name: `Day ${i + 1}`,
      shipments: Math.floor(r.amount / 100),
      onTime: r.status === 'on-time' ? r.progress : r.progress * 0.8,
      delayed: r.status === 'delayed' ? r.progress * 0.3 : 0,
    }));
  }, [filtered]);

  const statusData = useMemo(() => [
    { name: t('onTime'), value: kpis.onTime, color: '#22c55e' },
    { name: t('delayed'), value: kpis.delayed, color: '#f59e0b' },
    { name: t('atRisk'), value: kpis.atRisk, color: '#ef4444' },
    { name: 'Completed', value: kpis.completed, color: '#6366f1' },
  ], [kpis, t]);

  const locationData = useMemo(() => {
    return Object.entries(
      filtered.reduce((acc, r) => {
        acc[r.location] = (acc[r.location] || 0) + 1;
        return acc;
      }, {})
    )
      .map(([location, count]) => ({ location, count, fill: COLORS[Math.floor(Math.random() * COLORS.length)] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filtered]);

  const performanceData = useMemo(() => {
    return filtered.slice(0, 7).map((r, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      performance: r.progress,
      target: 85,
    }));
  }, [filtered]);

  const handleApplyFilter = () => {
    toast.success(`${t('filtersApplied')} - ${filtered.length} results`);
  };

  const handleClearFilters = () => {
    setCustomerNo('');
    setContainerNo('');
    setMblNo('');
    setHblNo('');
    toast.success('All filters cleared');
  };

  const hasFilters = customerNo || containerNo || mblNo || hblNo;

  return (
    <div className="space-y-4">
      {/* Advanced Filter Section */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Filter className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">Search & Filters</CardTitle>
              <p className="text-xs text-slate-400">Filter shipments by multiple criteria</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </CardHeader>
        {showFilters && (
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400 flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {t('customerNumber')}
                </Label>
                <div className="relative">
                  <Input
                    value={customerNo}
                    onChange={(e) => setCustomerNo(e.target.value)}
                    placeholder="e.g. CUST-12345"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 pl-8"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-400 flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {t('containerNumber')}
                </Label>
                <div className="relative">
                  <Input
                    value={containerNo}
                    onChange={(e) => setContainerNo(e.target.value)}
                    placeholder="e.g. MSKU1234567"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 pl-8"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-400 flex items-center gap-1">
                  <Ship className="h-3 w-3" />
                  MBL No (Master Bill)
                </Label>
                <div className="relative">
                  <Input
                    value={mblNo}
                    onChange={(e) => setMblNo(e.target.value)}
                    placeholder="e.g. MBL-789456"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 pl-8"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-400 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  HBL No (House Bill)
                </Label>
                <div className="relative">
                  <Input
                    value={hblNo}
                    onChange={(e) => setHblNo(e.target.value)}
                    placeholder="e.g. HBL-123789"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 pl-8"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-700">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                onClick={handleApplyFilter}
              >
                <Search className="h-4 w-4" />
                {t('applyFilter')}
              </Button>
              {hasFilters && (
                <Button 
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white gap-2"
                  onClick={handleClearFilters}
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
              <div className="flex-1" />
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                {filtered.length} results found
              </Badge>
            </div>
          </CardContent>
        )}
      </Card>

      {/* KPI Cards - PowerBI Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard 
          icon={<Activity className="h-5 w-5" />} 
          label={t('activeLanes')} 
          value={kpis.total} 
          change="+12%"
          changeType="positive"
          bgColor="from-blue-600 to-indigo-700"
        />
        <KpiCard 
          icon={<TrendingUp className="h-5 w-5" />} 
          label={t('onTime')} 
          value={kpis.onTime}
          subValue={`${kpis.onTimePercent}%`}
          change="+5%"
          changeType="positive"
          bgColor="from-emerald-600 to-green-700"
        />
        <KpiCard 
          icon={<Clock3 className="h-5 w-5" />} 
          label={t('delayed')} 
          value={kpis.delayed}
          change="-3"
          changeType="negative"
          bgColor="from-amber-500 to-orange-600"
        />
        <KpiCard 
          icon={<AlertTriangle className="h-5 w-5" />} 
          label={t('atRisk')} 
          value={kpis.atRisk}
          change="Monitor"
          changeType="neutral"
          bgColor="from-red-500 to-rose-600"
        />
        <KpiCard 
          icon={<Target className="h-5 w-5" />} 
          label={t('avgCompletion')} 
          value={`${kpis.avgProgress}%`}
          progress={kpis.avgProgress}
          bgColor="from-purple-600 to-violet-700"
        />
        <KpiCard 
          icon={<DollarSign className="h-5 w-5" />} 
          label={t('totalVolume')} 
          value={`$${(kpis.totalAmount / 1000).toFixed(1)}K`}
          change="+18%"
          changeType="positive"
          bgColor="from-cyan-600 to-teal-700"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Shipment Trend - Large Chart */}
        <Card className="lg:col-span-2 shadow-xl border-0 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-500" />
                Shipment Performance Trend
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Daily shipment and on-time delivery metrics</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Live Data</Badge>
              <Button size="sm" variant="outline" className="gap-1 text-xs">
                <Download className="h-3 w-3" />
                {t('export')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                shipments: { label: "Shipments", color: "#6366f1" },
                onTime: { label: "On-Time %", color: "#22c55e" },
                delayed: { label: "Delayed", color: "#f59e0b" },
              }}
              className="h-72"
            >
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={11} stroke="#9ca3af" />
                <YAxis fontSize={11} stroke="#9ca3af" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="shipments" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="onTime" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="delayed" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card className="shadow-xl border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Status Distribution
            </CardTitle>
            <p className="text-sm text-slate-500">Shipment status breakdown</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                value: { label: "Count" },
              }}
              className="h-56"
            >
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ChartContainer>
            {/* Legend below chart */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  <span className="font-bold text-slate-800 dark:text-white ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Location Performance */}
        <Card className="shadow-xl border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-500" />
              {t('topLocations')}
            </CardTitle>
            <p className="text-sm text-slate-500">Shipment volume by location</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                count: { label: "Shipments", color: "#22c55e" },
              }}
              className="h-64"
            >
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" fontSize={11} stroke="#9ca3af" />
                <YAxis dataKey="location" type="category" fontSize={11} stroke="#9ca3af" width={50} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Performance vs Target */}
        <Card className="shadow-xl border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-violet-500" />
              Weekly Performance vs Target
            </CardTitle>
            <p className="text-sm text-slate-500">Actual performance against 85% target</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                performance: { label: "Performance", color: "#8b5cf6" },
                target: { label: "Target", color: "#dc2626" },
              }}
              className="h-64"
            >
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" fontSize={11} stroke="#9ca3af" />
                <YAxis fontSize={11} stroke="#9ca3af" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="performance" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-xl border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-pink-500" />
                  {t('recentActivity')}
                </CardTitle>
                <p className="text-sm text-slate-500">Latest shipment updates</p>
              </div>
              <Button size="sm" variant="outline" className="gap-1 text-xs">
                <RefreshCw className="h-3 w-3" />
                {t('refresh')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {filtered.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    item.status === 'on-time' ? 'bg-emerald-100 text-emerald-600' :
                    item.status === 'delayed' ? 'bg-amber-100 text-amber-600' :
                    item.status === 'at-risk' ? 'bg-red-100 text-red-600' :
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {item.status === 'on-time' ? <CheckCircle2 className="h-4 w-4" /> :
                     item.status === 'delayed' ? <Clock3 className="h-4 w-4" /> :
                     item.status === 'at-risk' ? <AlertTriangle className="h-4 w-4" /> :
                     <Truck className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.location} • {item.category}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.status === 'on-time' ? 'border-emerald-500 text-emerald-600' :
                        item.status === 'delayed' ? 'border-amber-500 text-amber-600' :
                        item.status === 'at-risk' ? 'border-red-500 text-red-600' :
                        'border-indigo-500 text-indigo-600'
                      }`}
                    >
                      {item.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{item.progress}% complete</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">On-Time Rate</span>
                  <span className="text-lg font-bold">{kpis.onTimePercent}%</span>
                </div>
                <Progress value={kpis.onTimePercent} className="h-2 bg-white/20" />
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">Avg. Progress</span>
                  <span className="text-lg font-bold">{kpis.avgProgress}%</span>
                </div>
                <Progress value={kpis.avgProgress} className="h-2 bg-white/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{kpis.completed}</p>
                  <p className="text-xs text-white/70">Completed</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{kpis.total}</p>
                  <p className="text-xs text-white/70">Total Active</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Last Updated</span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced KPI Card Component
function KpiCard({
  icon,
  label,
  value,
  subValue,
  change,
  changeType = 'neutral',
  progress,
  bgColor,
}) {
  return (
    <Card className={`shadow-xl border-0 bg-gradient-to-br ${bgColor} text-white overflow-hidden relative`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8" />
      <CardContent className="p-4 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
          {change && (
            <Badge 
              className={`text-xs ${
                changeType === 'positive' ? 'bg-emerald-500/30 text-emerald-100' :
                changeType === 'negative' ? 'bg-red-500/30 text-red-100' :
                'bg-white/20 text-white'
              }`}
            >
              {changeType === 'positive' && <TrendingUp className="h-3 w-3 mr-1" />}
              {changeType === 'negative' && <TrendingDown className="h-3 w-3 mr-1" />}
              {change}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs text-white/70 font-medium">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {subValue && <p className="text-sm text-white/70">{subValue}</p>}
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-1.5 bg-white/20" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardPage;
