import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  Settings,
  Timer,
  Smartphone,
  Globe
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  const { addSystemLog, addAuditEntry } = useApp();
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    ipWhitelist: false,
    loginNotifications: true,
    failedLoginLockout: true,
    auditLogging: true,
    encryptedStorage: true,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = (setting: keyof typeof securitySettings) => {
    const newValue = !securitySettings[setting];
    setSecuritySettings(prev => ({ ...prev, [setting]: newValue }));
    addSystemLog('info', 'Security Setting Changed', `${setting} set to ${newValue}`);
    addAuditEntry('UPDATE', 'Security Settings', `Changed ${setting} to ${newValue}`);
    toast.success(`Security setting updated`);
  };

  const handleSaveAll = () => {
    addSystemLog('success', 'Security Settings Saved', 'All security settings saved successfully');
    addAuditEntry('UPDATE', 'Security Settings', 'Saved all security configurations');
    toast.success('All security settings saved!');
  };

  const handleResetDefaults = () => {
    setSecuritySettings({
      twoFactorAuth: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
      ipWhitelist: false,
      loginNotifications: true,
      failedLoginLockout: true,
      auditLogging: true,
      encryptedStorage: true,
    });
    addSystemLog('info', 'Security Settings Reset', 'Security settings reset to defaults');
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md">Security Settings</h1>
            <p className="text-red-200 mt-1">Configure system security and access controls</p>
          </div>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-md border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold text-green-600">85%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Failed Logins (24h)</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Last Security Scan</p>
                <p className="text-lg font-bold">Today</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Authentication Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Authentication
            </CardTitle>
            <CardDescription>Configure login and authentication options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Two-Factor Authentication
                </Label>
                <p className="text-xs text-muted-foreground">Require 2FA for all logins</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={() => handleToggle('twoFactorAuth')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Failed Login Lockout
                </Label>
                <p className="text-xs text-muted-foreground">Lock account after 5 failed attempts</p>
              </div>
              <Switch
                checked={securitySettings.failedLoginLockout}
                onCheckedChange={() => handleToggle('failedLoginLockout')}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Session Timeout (minutes)
              </Label>
              <Select
                value={securitySettings.sessionTimeout}
                onValueChange={(v) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Password Expiry (days)
              </Label>
              <Select
                value={securitySettings.passwordExpiry}
                onValueChange={(v) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Access Control Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Access Control
            </CardTitle>
            <CardDescription>Manage network and access restrictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  IP Whitelist
                </Label>
                <p className="text-xs text-muted-foreground">Restrict access to specific IPs</p>
              </div>
              <Switch
                checked={securitySettings.ipWhitelist}
                onCheckedChange={() => handleToggle('ipWhitelist')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Login Notifications
                </Label>
                <p className="text-xs text-muted-foreground">Alert on new device logins</p>
              </div>
              <Switch
                checked={securitySettings.loginNotifications}
                onCheckedChange={() => handleToggle('loginNotifications')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Audit Logging
                </Label>
                <p className="text-xs text-muted-foreground">Log all user actions</p>
              </div>
              <Switch
                checked={securitySettings.auditLogging}
                onCheckedChange={() => handleToggle('auditLogging')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Encrypted Storage
                </Label>
                <p className="text-xs text-muted-foreground">Encrypt sensitive data at rest</p>
              </div>
              <Switch
                checked={securitySettings.encryptedStorage}
                onCheckedChange={() => handleToggle('encryptedStorage')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Requirements */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-purple-600" />
              Password Policy
            </CardTitle>
            <CardDescription>Password strength requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">Minimum 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">At least one uppercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">At least one lowercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">At least one number</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">At least one special character</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">No common passwords</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Actions
            </CardTitle>
            <CardDescription>Save or reset security configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={handleSaveAll}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save All Settings
            </Button>
            <Button variant="outline" className="w-full" onClick={handleResetDefaults}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Separator />
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Security Recommendation</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Enable Two-Factor Authentication to improve your account security.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
