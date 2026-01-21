import { Outlet, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LogOut, RefreshCw, Download, Search, Edit, X, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useApp } from "@/contexts/AppContext.jsx";
import clsx from "clsx";
import { useState } from "react";
import { AdvancedMenu } from './AdvancedMenu';
import { toast } from 'sonner';

const isBuilderEnabled = import.meta.env.VITE_BUILDER_MODE === 'true' && import.meta.env.DEV;

const Logo = () => {
  const { t } = useApp();
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-white shadow-md flex items-center justify-center text-indigo-600 font-bold text-lg border border-white/50">
        LG
      </div>
      <div className="hidden sm:block">
        <p className="text-xs text-white/80 font-medium">{t('logisticsHQ')}</p>
        <p className="text-sm font-bold text-white drop-shadow-sm">{t('dailyDashboard')}</p>
      </div>
    </div>
  );
};

const Header = ({ search, onSearch, onSignOut, username, isAdmin }) => {
  const location = useLocation();
  const { t, editMode, toggleEditMode } = useApp();

  // Navigation items with translation keys
  const navItems = [
    { path: "/", labelKey: "dashboard" },
    { path: "/operations", labelKey: "operations" },
    { path: "/fleet", labelKey: "fleet" },
    { path: "/warehouses", labelKey: "warehouses" },
    { path: "/analytics", labelKey: "analytics" },
    { path: "/reports", labelKey: "reports" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
      <div className="px-4 lg:px-6">
        {/* Single compact header row */}
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Left: Logo */}
          <Logo />
          
          {/* Center: Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg p-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    active 
                      ? "bg-white text-indigo-700 shadow-md" 
                      : "text-white/90 hover:bg-white/20"
                  )}
                >
                  {t(item.labelKey)}
                </NavLink>
              );
            })}
            {isBuilderEnabled && (
              <NavLink
                to="/builder"
                className={clsx(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  location.pathname === "/builder"
                    ? "bg-white text-indigo-700 shadow-md" 
                    : "text-white/90 hover:bg-white/20"
                )}
              >
                🛠️
              </NavLink>
            )}
          </nav>
          
          {/* Right: Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={t('smartSearch')}
                className="h-9 pl-9 bg-white/95 border-0 text-sm focus:ring-2 focus:ring-white/50"
              />
            </div>
            
            {/* Edit Mode Toggle - Admin Only */}
            {isAdmin && (
              <Button 
                size="sm" 
                variant={editMode ? "default" : "ghost"}
                className={clsx(
                  "h-9 gap-2 transition-all",
                  editMode 
                    ? "bg-amber-500 hover:bg-amber-600 text-white" 
                    : "text-white hover:bg-white/20"
                )}
                onClick={toggleEditMode}
                title={editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
              >
                {editMode ? (
                  <>
                    <X className="h-4 w-4" />
                    <span className="hidden lg:inline">Exit Edit</span>
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    <span className="hidden lg:inline">Edit Mode</span>
                  </>
                )}
              </Button>
            )}

            {/* Action buttons - icons only */}
            <Button 
              size="sm" 
              variant="ghost"
              className="h-9 w-9 p-0 text-white hover:bg-white/20"
              onClick={() => {
                toast.success(t('exportStarted'));
              }}
              title={t('export')}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="h-9 w-9 p-0 text-white hover:bg-white/20"
              onClick={() => {
                toast.success(t('dataRefreshed'));
                window.location.reload();
              }}
              title={t('refresh')}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            {/* Advanced Menu - icon only */}
            <AdvancedMenu username={username} onSignOut={onSignOut} />
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 overflow-x-auto">
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 w-fit">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                    active 
                      ? "bg-white text-indigo-700 shadow" 
                      : "text-white/90 hover:bg-white/20"
                  )}
                >
                  {t(item.labelKey)}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

const EditModeBanner = () => {
  const { editMode, toggleEditMode, t } = useApp();
  
  if (!editMode) return null;
  
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <Badge className="bg-white/20 text-white font-bold animate-pulse">
          EDIT MODE
        </Badge>
        <p className="text-sm font-medium">
          Click on any component to edit. Changes are saved automatically.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="secondary" 
          className="h-7 gap-1 bg-white/20 hover:bg-white/30 text-white border-0"
        >
          <Settings className="h-3 w-3" />
          Settings
        </Button>
        <Button 
          size="sm" 
          variant="secondary" 
          className="h-7 gap-1 bg-white text-amber-600 hover:bg-amber-50"
          onClick={toggleEditMode}
        >
          <X className="h-3 w-3" />
          Exit
        </Button>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const { user, signOut } = useAuth();
  const { editMode } = useApp();
  const [search, setSearch] = useState("");
  
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-foreground">
      <Header 
        search={search} 
        onSearch={setSearch}
        onSignOut={signOut}
        username={user?.username ?? "User"}
        isAdmin={isAdmin}
      />
      
      {/* Edit Mode Banner */}
      <EditModeBanner />

      {/* Full-width main content */}
      <main className={clsx(
        "min-h-[calc(100vh-64px)]",
        editMode && "pt-2"
      )}>
        <div className="px-4 lg:px-6 py-6">
          <Outlet context={{ globalSearch: search, editMode }} />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
