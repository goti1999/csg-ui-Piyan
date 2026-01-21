import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { History, Search, Download, Trash2, RefreshCw, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useApp } from "@/contexts/AppContext.jsx";
import { useState, useMemo } from "react";

export default function SystemLogsPage() {
  const { systemLogs, addSystemLog } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const filteredLogs = useMemo(() => {
    return systemLogs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === "all" || log.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [systemLogs, searchTerm, levelFilter]);

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'warning': return <Badge className="bg-amber-500 hover:bg-amber-600">Warning</Badge>;
      case 'success': return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>;
      default: return <Badge variant="secondary">Info</Badge>;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addSystemLog('info', 'Logs Exported', `Exported ${filteredLogs.length} log entries`);
  };

  const handleRefreshLogs = () => {
    addSystemLog('info', 'Logs Refreshed', 'System logs view refreshed');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <History className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md">System Logs</h1>
            <p className="text-slate-300 mt-1">Monitor system events and activities</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{systemLogs.filter(l => l.level === 'info').length}</p>
              <p className="text-xs text-muted-foreground">Info</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{systemLogs.filter(l => l.level === 'success').length}</p>
              <p className="text-xs text-muted-foreground">Success</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{systemLogs.filter(l => l.level === 'warning').length}</p>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{systemLogs.filter(l => l.level === 'error').length}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Log Entries ({filteredLogs.length})
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleRefreshLogs}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportLogs}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No log entries found
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    {getLevelIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{log.action}</span>
                        {getLevelBadge(log.level)}
                        <Badge variant="outline" className="text-xs">{log.user}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(log.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
