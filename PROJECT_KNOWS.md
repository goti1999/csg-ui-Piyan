# CSG UI – Project Knowledge (PROJECT_KNOWS)

This file describes the project structure and what each part does. **Update this file whenever you add or edit features** so future developers can understand the project quickly.

---

## 1. Project Stack

- **Framework:** React 18 + Vite
- **Routing:** react-router-dom v6
- **UI:** Tailwind CSS, Radix UI (shadcn-style components in `src/components/ui/`)
- **Charts:** Recharts
- **State:** React Context (AppContext, AuthContext)
- **Auth:** Single admin user only (Admin / Admin@1881!) – frontend-only; backend auth is separate
- **Data:** Local mock data in `src/data/`; Supabase client present for future backend use

---

## 2. Project Structure (What Lives Where)

```
csg-ui/
├── public/                 # Static assets
├── src/
│   ├── main.jsx            # App entry; mounts App with providers
│   ├── App.jsx             # Routes, ProtectedRoute, AuthRoute, dashboard & page config
│   ├── App.css             # Global app styles (if any)
│   ├── index.css           # Tailwind + CSS variables (theme, colors)
│   │
│   ├── contexts/           # Global state & auth
│   │   ├── AppContext.jsx   # App state: settings, i18n, users, logs, audit, edit mode, component configs
│   │   ├── AuthContext.jsx  # Auth: user, session, signIn/signOut (validates Admin / Admin@1881!)
│   │   ├── useApp.js       # Hook to consume AppContext
│   │   └── appContext.js   # AppContext symbol export (used by AppContext.jsx)
│   │
│   ├── pages/              # Route-level pages
│   │   ├── Auth.jsx        # Login page – only Admin / Admin@1881! works
│   │   ├── NotFound.jsx   # 404
│   │   ├── Index.jsx       # (Optional) Task-focused index; main app uses DefaultDashboard at /
│   │   ├── DashboardPage.jsx         # Main dashboard: KPIs, charts, widgets (used by DefaultDashboard)
│   │   ├── dashboard/                 # Dashboard variants (all use DashboardPage or own layout)
│   │   │   ├── DefaultDashboard.jsx  # Default route "/" – Logistics Daily Dashboard
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── CRMDashboard.jsx
│   │   │   ├── EcommerceDashboard.jsx
│   │   │   ├── LMSDashboard.jsx
│   │   │   ├── ManagementDashboard.jsx
│   │   │   ├── SaaSDashboard.jsx
│   │   │   └── SupportDeskDashboard.jsx
│   │   ├── TablePage.jsx             # Generic data table for operations/fleet/warehouses
│   │   ├── ContainersTablePage.jsx   # Containers table (from @/data)
│   │   ├── ReportsPage.jsx           # Reports
│   │   ├── ViewsPage.jsx
│   │   ├── DocsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── AlertsPage.jsx
│   │   ├── ProfilePage.jsx           # User profile (backend-only in nav; not shown in frontend menu)
│   │   ├── SystemLogsPage.jsx        # Backend-only – not in frontend nav
│   │   ├── UsersPage.jsx             # Backend-only – not in frontend nav
│   │   ├── SecuritySettingsPage.jsx  # Backend-only – not in frontend nav
│   │   ├── AuditTrailPage.jsx        # Backend-only – not in frontend nav
│   │   └── BuilderPage.jsx           # Visual builder (dev-only when VITE_BUILDER_MODE=true)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx         # Main layout: header (nav, search, edit mode, AdvancedMenu), outlet
│   │   │   ├── AdvancedMenu.jsx      # Sheet menu: user env, quick actions, settings, quick access, sign out (no backend links in frontend)
│   │   │   └── PageRibbon.jsx        # Dashboard/reports ribbon: export, refresh, print, fullscreen
│   │   ├── dashboard/                 # Dashboard widgets (KPI, charts, todo, calendar, etc.)
│   │   │   ├── KpiCardWidget.jsx
│   │   │   ├── LineChartWidget.jsx
│   │   │   ├── BarChartWidget.jsx
│   │   │   ├── PieChartWidget.jsx
│   │   │   ├── AreaChartWidget.jsx
│   │   │   ├── PriorityBreakdownChart.jsx
│   │   │   ├── TodoListWidget.jsx
│   │   │   ├── CalendarWidget.jsx
│   │   │   ├── ActivityTimeline.jsx
│   │   │   ├── RecentActivityWidget.jsx
│   │   │   └── QuickStatsWidget.jsx
│   │   ├── builder/                  # Edit-mode wrappers and component editor
│   │   │   ├── EditableWrapper.jsx
│   │   │   └── ComponentEditor.jsx
│   │   ├── tables/
│   │   │   ├── ExpandableRowDetails.jsx
│   │   │   ├── ExpandableRowDetailsContainers.jsx
│   │   │   └── RowEditFormModal.jsx
│   │   ├── tasks/                    # Task table (used by Index.jsx if routed)
│   │   │   ├── TaskTable.jsx
│   │   │   ├── TaskRow.jsx
│   │   │   ├── TaskToolbar.jsx
│   │   │   ├── AddTaskDialog.jsx
│   │   │   └── ...
│   │   ├── ui/                       # Reusable UI primitives (buttons, cards, inputs, etc.)
│   │   └── NavLink.jsx
│   │
│   ├── builder/                      # Visual page builder (dev-only)
│   │   ├── BuilderContext.jsx
│   │   ├── componentRegistry.js
│   │   ├── types.js
│   │   └── components/
│   │       ├── BuilderCanvas.jsx
│   │       ├── ComponentPalette.jsx
│   │       ├── ComponentRenderer.jsx
│   │       └── PropertiesPanel.jsx
│   │
│   ├── data/                        # Mock data & data sources
│   │   ├── index.js                 # Exports datasets, containers
│   │   ├── logistics.js             # datasets (dashboard, operations, fleet, warehouses, reports)
│   │   ├── containers.js
│   │   ├── containersData.js
│   │   └── dataSource.js
│   │
│   ├── lib/                         # Utilities
│   │   ├── utils.js
│   │   └── triggers.js
│   ├── hooks/                       # useTasks, useToast, use-mobile, etc.
│   ├── integrations/supabase/      # Supabase client & types (for future backend)
│   ├── utils/                       # authHelper etc.
│   └── types/                       # Shared types (e.g. task)
```

---

## 3. What Works Where

### Frontend (what users see)

- **Login:** `Auth.jsx` – only **Admin** / **Admin@1881!** (no other users, no profile pic; single admin only).
- **Main layout:** `AppLayout.jsx` – header with nav tabs, search, edit mode (admin), export/refresh, AdvancedMenu (no Profile/System Logs/Users/Security/Audit in menu).
- **Dashboards:** Default at `/`, plus Analytics, CRM, E-commerce, LMS, Management, SaaS, Support, Operations, Fleet, Warehouses, Containers, Reports.
- **Utility pages (in menu):** Views, Docs, Settings, Alerts.
- **Builder:** Only when `VITE_BUILDER_MODE=true` and `DEV` – route `/builder`.

### Backend-only (not in frontend menu; direct URL or backend use)

- System Logs: `/system-logs`
- Users: `/users`
- Security: `/security`
- Audit Trail: `/audit`
- Profile: `/profile`

These routes still exist in `App.jsx` but are **not** linked from the main frontend menu (AdvancedMenu) so the frontend stays focused on dashboards and operations.

---

## 4. Authentication

- **Single user:** Username **Admin**, password **Admin@1881!**
- **Where:** `AppContext.jsx` – `generateInitialUsers()` and `validateUser()` enforce this; `AuthContext.jsx` calls `validateUser` on sign-in.
- **Session:** Stored in `localStorage` under key `csg_admin_session`. No profile picture; profile/backend pages are not shown in the main nav.

---

## 5. Key Files Quick Reference

| Purpose | File |
|--------|------|
| Routes & protected/auth routes | `src/App.jsx` |
| App state (i18n, users, logs, audit, edit mode) | `src/contexts/AppContext.jsx` |
| Auth (login/logout, session) | `src/contexts/AuthContext.jsx` |
| Main layout & nav | `src/components/layout/AppLayout.jsx` |
| Hamburger menu (no backend links in frontend) | `src/components/layout/AdvancedMenu.jsx` |
| Login page | `src/pages/Auth.jsx` |
| Default dashboard (/) | `src/pages/dashboard/DefaultDashboard.jsx` → `DashboardPage.jsx` |
| Mock data | `src/data/index.js`, `src/data/logistics.js` |

---

## 6. Changelog (when you edit the project, add a line here)

- **2025-02-02:** Initial PROJECT_KNOWS; single admin Admin/Admin@1881!; backend-only nav (System Logs, Users, Security, Audit, Profile) removed from AdvancedMenu; Auth page split layout and branding panel; Dashboard hero section on default dashboard; PROJECT_KNOWS created and linked to structure.
