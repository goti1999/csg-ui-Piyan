import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext.jsx";
import { AppProvider } from "@/contexts/AppContext.jsx";
import Auth from "./pages/Auth.jsx";
import NotFound from "./pages/NotFound.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import TablePage from "./pages/TablePage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import BuilderPage from "./pages/BuilderPage.jsx";
import ViewsPage from "./pages/ViewsPage.jsx";
import DocsPage from "./pages/DocsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AlertsPage from "./pages/AlertsPage.jsx";
import SystemLogsPage from "./pages/SystemLogsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import SecuritySettingsPage from "./pages/SecuritySettingsPage.jsx";
import AuditTrailPage from "./pages/AuditTrailPage.jsx";
import ContainersTablePage from "./pages/ContainersTablePage.jsx";
import DefaultDashboard from "./pages/dashboard/DefaultDashboard.jsx";
import AnalyticsDashboard from "./pages/dashboard/AnalyticsDashboard.jsx";
import CRMDashboard from "./pages/dashboard/CRMDashboard.jsx";
import EcommerceDashboard from "./pages/dashboard/EcommerceDashboard.jsx";
import LMSDashboard from "./pages/dashboard/LMSDashboard.jsx";
import ManagementDashboard from "./pages/dashboard/ManagementDashboard.jsx";
import SaaSDashboard from "./pages/dashboard/SaaSDashboard.jsx";
import SupportDeskDashboard from "./pages/dashboard/SupportDeskDashboard.jsx";
import { datasets, containers } from "@/data/index.js";

// Check if builder mode is enabled (dev only)
const isBuilderEnabled = import.meta.env.VITE_BUILDER_MODE === 'true' && import.meta.env.DEV;

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

const dashboardPages = [
  { path: "/", title: "Default Dashboard", subtitle: "Main logistics overview", component: DefaultDashboard },
  { path: "/analytics", title: "Analytics Dashboard", subtitle: "Data analytics and insights", component: AnalyticsDashboard },
  { path: "/crm", title: "CRM Dashboard", subtitle: "Customer relationship management", component: CRMDashboard },
  { path: "/ecommerce", title: "E-commerce Dashboard", subtitle: "Sales and products", component: EcommerceDashboard },
  { path: "/lms", title: "LMS Dashboard", subtitle: "Learning management system", component: LMSDashboard },
  { path: "/management", title: "Management Dashboard", subtitle: "Operations management", component: ManagementDashboard },
  { path: "/saas", title: "SaaS Dashboard", subtitle: "Software-as-a-service metrics", component: SaaSDashboard },
  { path: "/support-desk", title: "Support Desk Dashboard", subtitle: "Customer support tickets", component: SupportDeskDashboard },
  { path: "/operations", title: "Operations Command", subtitle: "Monitor lanes, loads, and SLAs", dataset: datasets.operations },
  { path: "/fleet", title: "Control", subtitle: "Vehicles, drivers, compliance, and uptime", dataset: datasets.fleet },
  { path: "/warehouses", title: "Warehousing", subtitle: "Inventory, receiving, put-away, and pick/pack", dataset: datasets.warehouses },
  { path: "/containers", title: "Containers", subtitle: "Container & shipment tracking (from @/data)", dataset: containers },
  { path: "/reports", title: "Executive Reports", subtitle: "Exports, summaries, and scheduled briefs", dataset: datasets.reports },
];

const builderPages = isBuilderEnabled ? [
  { path: "/builder", title: "Visual Page Builder" },
] : [];

const AppRoutes = () => (
  <Routes>
    <Route
      path="/auth"
      element={
        <AuthRoute>
          <Auth />
        </AuthRoute>
      }
    />

    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      {dashboardPages.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={
            page.path === "/reports" ? (
              <ReportsPage />
            ) : page.path === "/containers" ? (
              <ContainersTablePage />
            ) : page.component ? (
              <page.component />
            ) : page.dataset ? (
              <TablePage title={page.title} subtitle={page.subtitle} rows={page.dataset} />
            ) : (
              <DashboardPage title={page.title} subtitle={page.subtitle} />
            )
          }
        />
      ))}
      
      {/* Utility Pages */}
      <Route path="/views" element={<ViewsPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      
      {/* System Tools Pages */}
      <Route path="/system-logs" element={<SystemLogsPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/security" element={<SecuritySettingsPage />} />
      <Route path="/audit" element={<AuditTrailPage />} />
      
      {/* Builder Page - Dev Only */}
      {isBuilderEnabled && (
        <Route path="/builder" element={<BuilderPage />} />
      )}
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider> 
  </QueryClientProvider>
);

export default App;
