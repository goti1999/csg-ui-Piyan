import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useApp } from '@/contexts/useApp.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, Shield, LayoutDashboard } from 'lucide-react';
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
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t('adminLogin')}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t('logisticsHQ')}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {t('signInDescription')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                {t('username')}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={t('enterUsername')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
                required
                className="h-11 rounded-lg border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {t('password')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('enterPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11 rounded-lg border-border bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('signingIn')}
                </>
              ) : (
                t('signIn')
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right: Branding panel */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12">
        <div className="max-w-md text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t('dailyDashboard')}
          </h2>
          <p className="mt-3 text-white/90 text-sm leading-relaxed">
            Real-time overview of operations, analytics, and logistics at a glance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
