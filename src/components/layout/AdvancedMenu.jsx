import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Menu,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Moon,
  Sun,
  Database,
  Zap,
  FileText,
  History,
  Users,
  Lock,
  Eye,
  Globe,
  LayoutGrid,
  BookOpen,
  User,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext.jsx';
import { useRef, useState } from 'react';

export function AdvancedMenu({ username, onSignOut }) {
  const navigate = useNavigate();
  const { 
    settings, 
    setLanguage, 
    toggleDarkMode, 
    toggleNotifications, 
    toggleAutoRefresh,
    exportAllData,
    importData,
    createBackup,
    syncDatabase,
    isSyncing,
    clearCache,
    t,
  } = useApp();

  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importData(file);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          size="sm" 
          variant="ghost"
          className="h-9 w-9 p-0 text-white hover:bg-white/20"
          title={t('advancedMenu')}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('advancedMenu')}</SheetTitle>
          <SheetDescription>{t('systemConfiguration')}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* User & Environment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">{t('userEnvironment')}</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div className="text-sm text-muted-foreground">
                {t('loggedInAs')}: <span className="font-medium text-foreground">{username}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {t('environment')}: <Badge variant="outline" className="ml-2">Production</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">{t('quickActions')}</h3>
            </div>
            <div className="space-y-2 pl-6">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={exportAllData}
              >
                <Download className="h-4 w-4" />
                {t('exportAllData')}
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={handleImportClick}
                disabled={isImporting}
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {t('importData')}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={createBackup}
              >
                <FileText className="h-4 w-4" />
                {t('createBackup')}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={syncDatabase}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                {t('syncDatabase')}
              </Button>
            </div>
          </div>

          <Separator />

          {/* System Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">{t('systemSettings')}</h3>
            </div>
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">{t('darkMode')}</Label>
                  <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">{t('notifications')}</Label>
                  <p className="text-xs text-muted-foreground">Enable system notifications</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={toggleNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">{t('autoRefresh')}</Label>
                  <p className="text-xs text-muted-foreground">Auto-refresh data periodically</p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={settings.autoRefresh}
                  onCheckedChange={toggleAutoRefresh}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">{t('language')}</Label>
                <Select value={settings.language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Access */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">{t('quickAccess')}</h3>
            </div>
            <div className="space-y-2 pl-6">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => navigate('/views')}
              >
                <Eye className="h-4 w-4" />
                {t('views')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => navigate('/docs')}
              >
                <BookOpen className="h-4 w-4" />
                {t('documentation')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4" />
                {t('profile')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-4 w-4" />
                {t('settings')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => navigate('/alerts')}
              >
                <Bell className="h-4 w-4" />
                {t('alerts')}
              </Button>
            </div>
          </div>

          <Separator />

          {/* System Tools */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">{t('systemTools')}</h3>
            </div>
            <div className="space-y-2 pl-6">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => navigate('/system-logs')}
              >
                <FileText className="h-4 w-4" />
                {t('viewSystemLogs')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={clearCache}
              >
                <Zap className="h-4 w-4" />
                {t('clearCache')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => navigate('/users')}
              >
                <Users className="h-4 w-4" />
                {t('manageUsers')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => navigate('/security')}
              >
                <Lock className="h-4 w-4" />
                {t('securitySettings')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => navigate('/audit')}
              >
                <History className="h-4 w-4" />
                {t('auditTrail')}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Sign Out */}
          <div className="space-y-2">
            <Button 
              variant="destructive" 
              className="w-full gap-2"
              onClick={onSignOut}
            >
              <User className="h-4 w-4" />
              {t('signOut')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
