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
import { useApp } from '@/contexts/AppContext';
import { useRef, useState } from 'react';

interface AdvancedMenuProps {
  username: string;
  onSignOut: () => void;
}

export function AdvancedMenu({ username, onSignOut }: AdvancedMenuProps) {
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
    clearCache,
    isSyncing,
    t,
  } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const env = import.meta.env.VITE_APP_ENV || 'development';
  const builderEnabled = import.meta.env.VITE_BUILDER_MODE === 'true';

  const handleExportAll = () => {
    exportAllData();
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importData(file);
      } catch (error) {
        // Error is already handled in importData
      }
      e.target.value = '';
    }
  };

  const handleBackup = () => {
    createBackup();
  };

  const handleSync = async () => {
    await syncDatabase();
  };

  const handleClearCache = () => {
    clearCache();
  };

  const handleViewLogs = () => {
    setIsOpen(false);
    navigate('/system-logs');
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0 text-white hover:bg-white/20"
          title={t('advancedMenu')}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <SheetContent className="w-[400px] sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('advancedMenu')}
          </SheetTitle>
          <SheetDescription>
            {t('systemConfiguration')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* User & Environment Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('userEnvironment')}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('loggedInAs')}</span>
              <Badge variant="default">{username}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('environment')}</span>
              <Badge 
                variant={env === 'production' ? 'destructive' : env === 'test' ? 'secondary' : 'default'}
              >
                {env.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('visualBuilder')}</span>
              <Badge variant={builderEnabled ? 'default' : 'outline'}>
                {builderEnabled ? t('enabled') : t('disabled')}
              </Badge>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full gap-2"
              onClick={onSignOut}
            >
              <Lock className="h-4 w-4" />
              {t('signOut')}
            </Button>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t('quickActions')}
            </h3>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={handleExportAll}>
                <Download className="h-4 w-4" />
                {t('exportAllData')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={handleImport}>
                <Upload className="h-4 w-4" />
                {t('importData')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={handleBackup}>
                <Database className="h-4 w-4" />
                {t('createBackup')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2" 
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isSyncing ? t('syncing') : t('syncDatabase')}
              </Button>
            </div>
          </div>

          <Separator />

          {/* System Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t('systemSettings')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-sm flex items-center gap-2">
                  {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {t('darkMode')}
                </Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  {t('notifications')}
                </Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={toggleNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-refresh" className="text-sm flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {t('autoRefresh')}
                </Label>
                <Switch
                  id="auto-refresh"
                  checked={settings.autoRefresh}
                  onCheckedChange={toggleAutoRefresh}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Language Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('language')}
            </h3>
            <Select value={settings.language} onValueChange={(v: 'en' | 'de') => setLanguage(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Quick Access Pages */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t('quickAccess')}
            </h3>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={() => handleNavigate('/views')}>
                <LayoutGrid className="h-4 w-4" />
                {t('views')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={() => handleNavigate('/docs')}>
                <BookOpen className="h-4 w-4" />
                {t('documentation')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={() => handleNavigate('/profile')}>
                <User className="h-4 w-4" />
                {t('profile')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={() => handleNavigate('/settings')}>
                <Settings className="h-4 w-4" />
                {t('settings')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={() => handleNavigate('/alerts')}>
                <Bell className="h-4 w-4" />
                {t('alerts')}
              </Button>
            </div>
          </div>

          <Separator />

          {/* System Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('systemTools')}
            </h3>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={handleViewLogs}>
                <History className="h-4 w-4" />
                {t('viewSystemLogs')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={handleClearCache}>
                <RefreshCw className="h-4 w-4" />
                {t('clearCache')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={() => handleNavigate('/users')}>
                <Users className="h-4 w-4" />
                {t('manageUsers')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={() => handleNavigate('/security')}>
                <Lock className="h-4 w-4" />
                {t('securitySettings')}
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2" onClick={() => handleNavigate('/audit')}>
                <Eye className="h-4 w-4" />
                {t('auditTrail')}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
