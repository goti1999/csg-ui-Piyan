import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Loader2, Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { validateUser, updateUserLastLogin, t, addSystemLog, addAuditEntry } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error(t('invalidCredentials'));
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(username.trim(), password, validateUser, updateUserLastLogin);
      if (error) {
        addSystemLog('warning', 'Login Failed', `Failed login attempt for user: ${username}`);
        toast.error(error.message || t('invalidCredentials'));
      } else {
        addSystemLog('success', 'User Login', `User ${username} logged in successfully`);
        addAuditEntry('LOGIN', 'Authentication', `User ${username} logged in`);
        toast.success(`${t('welcomeBack')}, ${username}!`);
        navigate('/');
      }
    } catch (err) {
      addSystemLog('error', 'Login Error', 'Unexpected error during login');
      toast.error(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('adminLogin')}</CardTitle>
          <CardDescription>{t('signInDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('enterUsername')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('enterPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('signingIn') || 'Signing in...'}
                </>
              ) : (
                t('signIn')
              )}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Truck className="h-4 w-4" />
              {t('logisticsHQ')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
