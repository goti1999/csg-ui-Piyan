import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { 
  Eye, 
  Search, 
  Download, 
  RefreshCw, 
  Calendar,
  User,
  Activity,
  FileText,
  Shield,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Database,
  Send,
  XCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import { useApp } from "@/contexts/useApp.js";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function AuditTrailPage() {
  const { auditTrail, addAuditEntry, addSystemLog, t } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionEntry, setActionEntry] = useState(null);

  const filteredAudit = useMemo(() => {
    return auditTrail.filter(entry => {
      const matchesSearch = 
        entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.details.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = actionFilter === "all" || entry.action === actionFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const entryDate = new Date(entry.timestamp);
        const now = new Date();
        if (dateFilter === "today") {
          matchesDate = entryDate.toDateString() === now.toDateString();
        } else if (dateFilter === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = entryDate >= weekAgo;
        } else if (dateFilter === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = entryDate >= monthAgo;
        }
      }
      
      return matchesSearch && matchesAction && matchesDate;
    });
  }, [auditTrail, searchTerm, actionFilter, dateFilter]);

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN': return <LogIn className="h-4 w-4 text-green-500" />;
      case 'LOGOUT': return <LogOut className="h-4 w-4 text-gray-500" />;
      case 'CREATE': return <Plus className="h-4 w-4 text-blue-500" />;
      case 'UPDATE': return <Edit className="h-4 w-4 text-amber-500" />;
      case 'DELETE': return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'VIEW': return <Eye className="h-4 w-4 text-purple-500" />;
      case 'EXPORT': return <Download className="h-4 w-4 text-cyan-500" />;
      case 'IMPORT': return <Database className="h-4 w-4 text-indigo-500" />;
      case 'SYNC': return <RefreshCw className="h-4 w-4 text-teal-500" />;
      case 'BACKUP': return <Shield className="h-4 w-4 text-emerald-500" />;
      case 'CLEAR': return <Trash2 className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionBadge = (action) => {
    const colors = {
      'LOGIN': 'bg-green-500 hover:bg-green-600',
      'LOGOUT': 'bg-gray-500 hover:bg-gray-600',
      'CREATE': 'bg-blue-500 hover:bg-blue-600',
      'UPDATE': 'bg-amber-500 hover:bg-amber-600',
      'DELETE': 'bg-red-500 hover:bg-red-600',
      'VIEW': 'bg-purple-500 hover:bg-purple-600',
      'EXPORT': 'bg-cyan-500 hover:bg-cyan-600',
      'IMPORT': 'bg-indigo-500 hover:bg-indigo-600',
      'SYNC': 'bg-teal-500 hover:bg-teal-600',
      'BACKUP': 'bg-emerald-500 hover:bg-emerald-600',
      'CLEAR': 'bg-orange-500 hover:bg-orange-600',
    };
    return <Badge className={`font-bold ${colors[action] || 'bg-gray-500'}`}>{action}</Badge>;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const uniqueActions = useMemo(() => {
    return [...new Set(auditTrail.map(entry => entry.action))];
  }, [auditTrail]);

  const handleExportAudit = () => {
    const blob = new Blob([JSON.stringify(filteredAudit, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-trail-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addSystemLog('info', 'Audit Exported', `Exported ${filteredAudit.length} audit entries`);
    addAuditEntry('EXPORT', 'Audit Trail', `Exported ${filteredAudit.length} entries`);
    toast.success(`Exported ${filteredAudit.length} entries`);
  };

  const handleRefresh = () => {
    addAuditEntry('VIEW', 'Audit Trail', 'Refreshed audit trail view');
    toast.success('Audit trail refreshed');
  };

  const handleOpenView = (entry) => {
    setSelectedEntry(entry);
    setIsViewDialogOpen(true);
  };

  const handleOpenAction = (entry) => {
    setActionEntry(entry);
    setIsActionDialogOpen(true);
  };

  const handleSendAction = () => {
    if (actionEntry) {
      toast.success(`Action sent for entry: ${actionEntry.id}`);
      setIsActionDialogOpen(false);
      setActionEntry(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Statistics
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: auditTrail.length,
      today: auditTrail.filter(e => new Date(e.timestamp) >= today).length,
      logins: auditTrail.filter(e => e.action === 'LOGIN').length,
      changes: auditTrail.filter(e => ['CREATE', 'UPDATE', 'DELETE'].includes(e.action)).length,
    };
  }, [auditTrail]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-600 to-teal-700 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Eye className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md">{t('auditTrail')}</h1>
            <p className="text-cyan-200 mt-1">Track all system activities and changes</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <FileText className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Entries</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.today}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LogIn className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.logins}</p>
              <p className="text-xs text-muted-foreground">Logins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Edit className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.changes}</p>
              <p className="text-xs text-muted-foreground">Changes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Table */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Log ({filteredAudit.length})
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit trail..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1">
                <RefreshCw className="h-4 w-4" />
                {t('refresh')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportAudit} className="gap-1">
                <Download className="h-4 w-4" />
                {t('export')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 h-10">
                    <TableHead className="w-10 py-2"></TableHead>
                    <TableHead className="py-2 font-bold">Timestamp</TableHead>
                    <TableHead className="py-2 font-bold">{t('user')}</TableHead>
                    <TableHead className="py-2 font-bold">Action</TableHead>
                    <TableHead className="py-2 font-bold">Resource</TableHead>
                    <TableHead className="py-2 font-bold">Details</TableHead>
                    <TableHead className="py-2 font-bold">IP Address</TableHead>
                    <TableHead className="py-2 text-center font-bold w-36">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAudit.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No audit entries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAudit.map((entry) => (
                      <TableRow key={entry.id} className="h-10 hover:bg-muted/30">
                        <TableCell className="py-1.5">{getActionIcon(entry.action)}</TableCell>
                        <TableCell className="py-1.5 text-sm font-semibold">{formatTimestamp(entry.timestamp)}</TableCell>
                        <TableCell className="py-1.5">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-bold text-slate-800">{entry.user}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-1.5">{getActionBadge(entry.action)}</TableCell>
                        <TableCell className="py-1.5 font-bold text-slate-800">{entry.resource}</TableCell>
                        <TableCell className="py-1.5 max-w-xs truncate text-sm font-semibold text-muted-foreground">
                          {entry.details}
                        </TableCell>
                        <TableCell className="py-1.5 font-mono text-xs font-bold">{entry.ipAddress}</TableCell>
                        <TableCell className="py-1.5">
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 px-2 gap-1 text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleOpenAction(entry)}
                            >
                              <Send className="h-3 w-3" />
                              Action
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 px-2 gap-1 text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                              onClick={() => handleOpenView(entry)}
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-600" />
              Audit Entry Details
            </DialogTitle>
            <DialogDescription>Full details of this audit log entry</DialogDescription>
          </DialogHeader>
          <Separator />
          {selectedEntry && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Entry ID</Label>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800">{selectedEntry.id}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(selectedEntry.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Timestamp</Label>
                    <p className="font-bold text-slate-800">{formatTimestamp(selectedEntry.timestamp)}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('user')}</Label>
                    <p className="font-bold text-slate-800">{selectedEntry.user}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Action</Label>
                    <p className="font-bold">{getActionBadge(selectedEntry.action)}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-xs text-muted-foreground">Resource</Label>
                  <p className="font-bold text-slate-800">{selectedEntry.resource}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Details</Label>
                  <p className="font-bold text-slate-800">{selectedEntry.details}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">IP Address</Label>
                  <p className="font-mono font-bold text-slate-800">{selectedEntry.ipAddress}</p>
                </div>
              </div>
            </div>
          )}
          <Separator />
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="gap-2">
              <XCircle className="h-4 w-4" />
              {t('close')}
            </Button>
            <Button 
              onClick={() => selectedEntry && copyToClipboard(JSON.stringify(selectedEntry, null, 2))} 
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Copy className="h-4 w-4" />
              Copy JSON
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Audit Action
            </DialogTitle>
            <DialogDescription>Perform an action on this audit entry</DialogDescription>
          </DialogHeader>
          <Separator />
          {actionEntry && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('user')}</Label>
                    <p className="font-bold text-slate-800">{actionEntry.user}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Action</Label>
                    <p className="font-bold">{getActionBadge(actionEntry.action)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Resource</Label>
                    <p className="font-bold text-slate-800">{actionEntry.resource}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">IP</Label>
                    <p className="font-mono font-bold text-slate-800 text-sm">{actionEntry.ipAddress}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Action Type</Label>
                <Select defaultValue="report">
                  <SelectTrigger className="font-semibold">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="report">
                      <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Generate Report</span>
                    </SelectItem>
                    <SelectItem value="investigate">
                      <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Investigate</span>
                    </SelectItem>
                    <SelectItem value="notify">
                      <span className="flex items-center gap-2"><Send className="h-4 w-4" /> Send Notification</span>
                    </SelectItem>
                    <SelectItem value="link">
                      <span className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Create Link</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Notes (Optional)</Label>
                <Input placeholder="Add any additional notes..." className="font-semibold" />
              </div>
            </div>
          )}
          <Separator />
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => { setIsActionDialogOpen(false); setActionEntry(null); }} className="gap-2">
              <XCircle className="h-4 w-4" />
              {t('cancel')}
            </Button>
            <Button onClick={handleSendAction} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
              Execute Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
