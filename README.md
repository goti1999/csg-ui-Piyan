# CSG UI - Complete Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Key Features](#key-features)
5. [File Structure Explained](#file-structure-explained)
6. [Component System](#component-system)
7. [Data Layer](#data-layer)
8. [UI Bakery-Style Editing](#ui-bakery-style-editing)
9. [Dashboard Types](#dashboard-types)
10. [How to Make Changes](#how-to-make-changes)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**CSG UI** is a modern React-based logistics management dashboard built with:
- **React 18** + **Vite** (fast build tool)
- **TypeScript converted to JavaScript** (plain JS for easier learning)
- **Tailwind CSS** (utility-first styling)
- **shadcn/ui** components (beautiful, accessible UI)
- **Recharts** (data visualization)
- **UI Bakery-style editing** (edit components without code)

### What This Project Does

This is a **low-code dashboard builder** where you can:
- View logistics data (containers, shipments, operations, fleet, warehouses)
- Edit components directly in the browser (like UI Bakery)
- Change data sources, currencies, colors, and more without coding
- Create multiple dashboard types (Default, Analytics, CRM, E-commerce, etc.)
- Connect to your own database later

---

## 📁 Project Structure

```
csg-ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui components (buttons, cards, etc.)
│   │   ├── dashboard/       # Dashboard widgets (KPI cards, charts, etc.)
│   │   ├── tables/          # Table components
│   │   ├── builder/         # Edit mode components (EditableWrapper, ComponentEditor)
│   │   └── layout/          # Layout components (AppLayout, PageRibbon)
│   ├── pages/               # Page components
│   │   ├── dashboard/       # Different dashboard types
│   │   ├── DashboardPage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── TablePage.jsx
│   ├── contexts/            # React Context (state management)
│   │   ├── AppContext.jsx  # Main app state
│   │   └── AuthContext.jsx # Authentication state
│   ├── data/                # Data layer
│   │   ├── containersData.js # Container data + config
│   │   ├── logistics.js     # Dummy logistics data
│   │   ├── dataSource.js    # Data fetching (connect DB here)
│   │   └── index.js         # Data exports
│   ├── lib/                 # Utility functions
│   │   └── utils.js         # Helper functions
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External integrations (Supabase)
│   └── main.jsx             # App entry point
├── public/                  # Static files
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager (comes with Node.js)

### Installation

1. **Open terminal** in project folder (`C:\React\csg-ui`)

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This installs all required packages (React, Vite, Tailwind, etc.)

3. **Start development server:**
   ```bash
   npm run dev
   ```
   You should see:
   ```
   VITE v5.4.19  ready in 721 ms
   ➜  Local:   http://localhost:5173/
   ```

4. **Open browser:**
   - Go to `http://localhost:5173` (or the port shown in terminal)
   - **Login credentials**: 
     - Username: `Admin`
     - Password: `Admin@1881!`

5. **You should see:**
   - Default Dashboard with KPI cards, charts, widgets
   - Sidebar navigation with all dashboard types
   - All components are editable (enable edit mode)

6. **Build for production:**
   ```bash
   npm run build
   ```
   Creates optimized files in `dist/` folder

### Quick Test

After starting dev server, if you see a **blank white page**:

1. **Open browser console** (Press F12 → Console tab)
2. **Look for red errors**
3. **Common fixes**:
   - Refresh page (Ctrl+Shift+R)
   - Check if `datasets.dashboard` exists (should show array in console)
   - Verify all imports are correct
   - Restart dev server

---

## ✨ Key Features

### 1. **UI Bakery-Style Component Editing**

Every component on the dashboard can be edited directly:

- **Enable Edit Mode**: Toggle edit mode in your app
- **Hover over component**: See edit controls appear
- **Click Settings icon**: Open editor panel
- **Edit Properties**: Change currency, data source, colors, etc.
- **Add Triggers & Actions**: Add JavaScript, SQL, Load data, Navigate, etc.

### 2. **Multiple Dashboard Types**

- **Default Dashboard**: Main logistics overview
- **Analytics Dashboard**: Data analytics and insights
- **CRM Dashboard**: Customer relationship management
- **E-commerce Dashboard**: Sales and products
- **LMS Dashboard**: Learning management
- **Management Dashboard**: Operations management
- **SaaS Dashboard**: Software-as-a-service metrics
- **Support Desk Dashboard**: Customer support tickets

### 3. **Individual Editable Components**

Each widget is a separate component you can:
- Edit independently
- Change data source
- Modify colors and styles
- Add/remove from dashboard
- Duplicate or delete

---

## 📂 File Structure Explained

### `/src/components/dashboard/` - Dashboard Widgets

These are the **individual components** you see on dashboards:

#### **KpiCardWidget.jsx**
- **What it does**: Shows a single KPI card (e.g., "Total Users: 1,234")
- **Editable properties**:
  - `label`: Card title
  - `dataSource`: Where to get data (dashboard, operations, fleet, etc.)
  - `valueField`: What to show (total, onTime, delayed, totalAmount, etc.)
  - `currency`: USD, EUR, GBP, JPY
  - `showPercentage`: Show percentage badge
  - `showProgress`: Show progress bar
  - `bgColor`: Background gradient (e.g., "from-blue-600 to-indigo-700")
- **Example usage**:
  ```jsx
  <KpiCardWidget
    componentId="kpi-users"
    icon={<Users />}
    label="Total Users"
    dataSource="dashboard"
    valueField="total"
    currency="USD"
  />
  ```

#### **LineChartWidget.jsx**
- **What it does**: Shows a line chart with multiple lines
- **Editable properties**:
  - `title`: Chart title
  - `dataSource`: Data source
  - `lines`: Array of lines to show `[{ key: "shipments", label: "Shipments", color: "#6366f1" }]`
  - `timePeriod`: "days", "weeks", or "months"
- **Example usage**:
  ```jsx
  <LineChartWidget
    componentId="chart-trend"
    title="Performance Trend"
    dataSource="dashboard"
    lines={[
      { key: "shipments", label: "Shipments", color: "#6366f1" },
      { key: "onTime", label: "On-Time", color: "#22c55e" }
    ]}
  />
  ```

#### **PieChartWidget.jsx**
- **What it does**: Shows a pie/donut chart
- **Editable properties**:
  - `title`: Chart title
  - `dataSource`: Data source
  - `groupBy`: Field to group by (e.g., "status", "priority")
  - `colors`: Array of colors `["#22c55e", "#f59e0b", "#ef4444"]`
- **Example usage**:
  ```jsx
  <PieChartWidget
    componentId="chart-status"
    title="Status Distribution"
    dataSource="dashboard"
    groupBy="status"
  />
  ```

#### **BarChartWidget.jsx**
- **What it does**: Shows a bar chart (vertical or horizontal)
- **Editable properties**:
  - `title`: Chart title
  - `dataSource`: Data source
  - `groupBy`: Field to group by
  - `orientation`: "vertical" or "horizontal"
  - `limit`: Number of bars to show
- **Example usage**:
  ```jsx
  <BarChartWidget
    componentId="chart-locations"
    title="Top Locations"
    dataSource="dashboard"
    groupBy="location"
    orientation="vertical"
  />
  ```

#### **AreaChartWidget.jsx**
- **What it does**: Shows an area chart with optional target line
- **Editable properties**:
  - `title`: Chart title
  - `dataSource`: Data source
  - `targetValue`: Target value (e.g., 85)
  - `showTarget`: Show target line
- **Example usage**:
  ```jsx
  <AreaChartWidget
    componentId="chart-performance"
    title="Performance vs Target"
    dataSource="dashboard"
    targetValue={85}
    showTarget={true}
  />
  ```

#### **Other Widgets**:
- `TodoListWidget.jsx`: To-do list with add/check/remove
- `CalendarWidget.jsx`: Calendar component
- `RecentActivityWidget.jsx`: Recent activity feed
- `QuickStatsWidget.jsx`: Quick stats grid
- `PriorityBreakdownChart.jsx`: Priority breakdown chart
- `ActivityTimeline.jsx`: Activity timeline with avatars

### `/src/pages/` - Page Components

#### **DashboardPage.jsx**
- **What it does**: Main dashboard page that uses all the widgets
- **How it works**: Imports widgets and arranges them in a grid
- **To add a widget**: Add a new widget component to the JSX

#### **TablePage.jsx**
- **What it does**: Generic table page for operations, fleet, warehouses
- **Features**: Excel-like header search, row editing, pagination

#### **ReportsPage.jsx**
- **What it does**: Reports and analytics page
- **Features**: Charts, filters, export options

### `/src/data/` - Data Layer

#### **containersData.js**
- **What it does**: Contains container/shipment data
- **Exports**:
  - `containers`: Array of container objects
  - `columns`: Table column definitions
  - `headerFields`: Header field config
  - `detailFields`: Detail field config (for row editing)
  - `filterFields`: Filter field config

#### **logistics.js**
- **What it does**: Generates dummy logistics data
- **Exports**:
  - `datasets.dashboard`: Dashboard sample data
  - `datasets.operations`: Operations data
  - `datasets.fleet`: Fleet data
  - `datasets.warehouses`: Warehouse data
  - `datasets.analytics`: Analytics data
  - `datasets.reports`: Reports data

#### **dataSource.js**
- **What it does**: Central data fetching function
- **Function**: `getData(sourceKey)` - Returns data for a source
- **To connect database**: Modify `getData()` function to call your API/DB

#### **index.js**
- **What it does**: Re-exports everything from data layer
- **Usage**: `import { datasets, containers, getData } from '@/data'`

### `/src/components/builder/` - Edit Mode Components

#### **EditableWrapper.jsx**
- **What it does**: Wraps components to make them editable
- **Features**:
  - Shows edit controls on hover
  - Highlights selected component
  - Provides edit/delete/duplicate buttons
- **Usage**: Wrap any component with `<EditableWrapper>`

#### **ComponentEditor.jsx**
- **What it does**: Side panel for editing component properties
- **Tabs**:
  - **Properties**: Widget-specific settings (currency, data source, colors)
  - **Triggers**: Add triggers (On init, On click, etc.)
  - **Columns**: Edit table columns
  - **Actions**: Add actions to columns
  - **Styles**: Customize styles
  - **Data**: Configure data source

#### **ActionConfigPanel.jsx**
- **What it does**: Panel for configuring multi-step actions
- **Step types**:
  - **JavaScript**: Run custom JS code
  - **SQL**: Execute SQL query
  - **Load data**: Fetch from data source
  - **Navigate**: Go to page
  - **Open modal**: Show dialog

### `/src/contexts/` - State Management

#### **AppContext.jsx**
- **What it does**: Main app state
- **Provides**:
  - `editMode`: Is edit mode enabled?
  - `componentConfigs`: Component configurations
  - `updateComponentConfig()`: Update component config
  - `selectedComponentId`: Currently selected component

#### **AuthContext.jsx**
- **What it does**: Authentication state
- **Provides**:
  - `user`: Current user
  - `login()`: Login function
  - `logout()`: Logout function

---

## 🎨 Component System

### How Components Work

1. **Component receives props** (data source, colors, etc.)
2. **Component reads from `componentConfigs`** (saved edits)
3. **Component merges props + config** (config overrides props)
4. **Component renders** with final values

### Example: KPI Card Flow

```jsx
// 1. Component receives props
<KpiCardWidget
  componentId="kpi-users"
  label="Users"
  currency="USD"
/>

// 2. Component reads saved config
const config = componentConfigs["kpi-users"] || {};
// config = { currency: "EUR" } (user changed it to EUR)

// 3. Component merges
const finalCurrency = config.currency || currency; // "EUR"

// 4. Component renders with EUR
```

---

## 💾 Data Layer

### Current Data Sources

- **dashboard**: `datasets.dashboard` (24 records)
- **operations**: `datasets.operations` (36 records)
- **fleet**: `datasets.fleet` (32 records)
- **warehouses**: `datasets.warehouses` (28 records)
- **analytics**: `datasets.analytics` (30 records)
- **reports**: `datasets.reports` (22 records)
- **containers**: `containers` (3 sample containers)

### Data Structure

Each record has:
```javascript
{
  id: "unique-id",
  name: "Shipment Name",
  status: "on-time" | "delayed" | "at-risk" | "completed",
  priority: "low" | "medium" | "high" | "critical",
  location: "Location Name",
  progress: 0-100,
  amount: 1234.56,
  category: "Category",
  eta: "2025-01-01T00:00:00Z"
}
```

### Connecting Your Database

1. **Add credentials** to `src/data/dataSource.js`:
   ```javascript
   const DB_URL = import.meta.env.VITE_DB_URL;
   const DB_KEY = import.meta.env.VITE_DB_KEY;
   ```

2. **Modify `getData()` function**:
   ```javascript
   export async function getData(sourceKey, options = {}) {
     if (sourceKey === 'database') {
       // Call your API/DB
       const response = await fetch(`${DB_URL}/api/data`, {
         headers: { 'Authorization': `Bearer ${DB_KEY}` }
       });
       return await response.json();
     }
     // ... rest of function
   }
   ```

3. **Add env variables** to `.env`:
   ```
   VITE_DB_URL=https://your-api.com
   VITE_DB_KEY=your-api-key
   ```

---

## 🛠️ UI Bakery-Style Editing

### How to Edit Components

1. **Enable Edit Mode** (toggle in your app)
2. **Hover over component** → See edit controls
3. **Click Settings icon** → Opens editor panel
4. **Edit in Properties tab**:
   - Change currency (USD → EUR)
   - Change data source (dashboard → operations)
   - Change colors
   - Modify labels
5. **Save** → Changes saved to `componentConfigs`

### Adding Triggers & Actions

1. **Open ComponentEditor** → Click "Triggers" tab
2. **Click "Add action"** next to a trigger (e.g., "On init")
3. **Configure action**:
   - **Name**: "Load Container Data"
   - **Steps**:
     - Step 1: Load data → Select "containers"
     - Step 2: JavaScript → `console.log('Data loaded')`
4. **Save** → Action runs when trigger fires

---

## 📊 Dashboard Types

The project includes **8 different dashboard types** inspired by Falcon dashboard templates:

### 1. Default Dashboard (`/`)
- **Path**: `/`
- **File**: `src/pages/dashboard/DefaultDashboard.jsx` → Uses `src/pages/DashboardPage.jsx`
- **Features**: Main logistics overview with KPI cards, charts, activity feed, calendar, to-do list
- **Use case**: General operations overview

### 2. Analytics Dashboard (`/analytics`)
- **Path**: `/analytics`
- **File**: `src/pages/dashboard/AnalyticsDashboard.jsx`
- **Features**: Data analytics, user metrics, revenue trends, conversion rates
- **Use case**: Business intelligence and data analysis

### 3. CRM Dashboard (`/crm`)
- **Path**: `/crm`
- **File**: `src/pages/dashboard/CRMDashboard.jsx`
- **Features**: Customer management, leads, deals, revenue tracking
- **Use case**: Customer relationship management

### 4. E-commerce Dashboard (`/ecommerce`)
- **Path**: `/ecommerce`
- **File**: `src/pages/dashboard/EcommerceDashboard.jsx`
- **Features**: Orders, revenue, products, customers, sales trends
- **Use case**: Online store management

### 5. LMS Dashboard (`/lms`)
- **Path**: `/lms`
- **File**: `src/pages/dashboard/LMSDashboard.jsx`
- **Features**: Students, courses, completions, enrollment trends, calendar
- **Use case**: Learning management system

### 6. Management Dashboard (`/management`)
- **Path**: `/management`
- **File**: `src/pages/dashboard/ManagementDashboard.jsx`
- **Features**: Projects, team, goals, performance tracking, priority breakdown
- **Use case**: Project and team management

### 7. SaaS Dashboard (`/saas`)
- **Path**: `/saas`
- **File**: `src/pages/dashboard/SaaSDashboard.jsx`
- **Features**: MRR, ARR, active users, churn rate, subscription plans
- **Use case**: Software-as-a-service metrics

### 8. Support Desk Dashboard (`/support-desk`)
- **Path**: `/support-desk`
- **File**: `src/pages/dashboard/SupportDeskDashboard.jsx`
- **Features**: Tickets, priority breakdown, customer satisfaction, to-do list
- **Use case**: Customer support management

### How to Access Dashboards

1. **Login** to the app
2. **Navigate** using the sidebar menu or directly via URL:
   - `http://localhost:5173/` - Default
   - `http://localhost:5173/analytics` - Analytics
   - `http://localhost:5173/crm` - CRM
   - `http://localhost:5173/ecommerce` - E-commerce
   - `http://localhost:5173/lms` - LMS
   - `http://localhost:5173/management` - Management
   - `http://localhost:5173/saas` - SaaS
   - `http://localhost:5173/support-desk` - Support Desk

### All Dashboards Are Editable

Every dashboard uses the same **editable widget system**:
- Enable edit mode
- Hover over any component
- Click Settings icon
- Edit properties (currency, data source, colors, etc.)
- Changes save automatically

---

## 🔧 How to Make Changes

### Adding a New Widget

1. **Create widget file** in `src/components/dashboard/`:
   ```jsx
   // MyNewWidget.jsx
   import { EditableWrapper } from '@/components/builder/EditableWrapper.jsx';
   
   export function MyNewWidget({ componentId, title, onEdit, onDelete, onDuplicate }) {
     return (
       <EditableWrapper
         componentId={componentId}
         componentName={title}
         componentType="card"
         onEdit={onEdit}
         onDelete={onDelete}
         onDuplicate={onDuplicate}
       >
         <Card>
           <CardHeader>
             <CardTitle>{title}</CardTitle>
           </CardHeader>
           <CardContent>
             {/* Your widget content */}
           </CardContent>
         </Card>
       </EditableWrapper>
     );
   }
   ```

2. **Use in dashboard**:
   ```jsx
   import { MyNewWidget } from '@/components/dashboard/MyNewWidget.jsx';
   
   <MyNewWidget
     componentId="my-widget"
     title="My Widget"
     onDelete={() => handleDelete("my-widget")}
   />
   ```

### Changing Component Colors

1. **Edit in browser**: Enable edit mode → Click component → Properties tab → Change `bgColor`
2. **Edit in code**: Change `bgColor` prop in dashboard file

### Changing Data Source

1. **Edit in browser**: Enable edit mode → Click component → Properties tab → Change `dataSource`
2. **Edit in code**: Change `dataSource` prop in dashboard file

### Adding a New Dashboard Type

1. **Create file** `src/pages/dashboard/MyDashboard.jsx`
2. **Import widgets** and arrange them
3. **Add route** in `src/App.jsx`:
   ```jsx
   <Route path="/my-dashboard" element={<MyDashboard />} />
   ```

---

## 🐛 Troubleshooting

### Blank White Page

**Problem**: Dashboard shows blank white page

**Common Causes & Solutions**:

1. **Missing Data Import**
   - **Check**: Open browser console (F12) for errors
   - **Fix**: Make sure `datasets` is imported in DashboardPage.jsx:
     ```jsx
     import { datasets } from '@/data/index.js';
     ```

2. **Component Import Errors**
   - **Check**: Look for "Cannot find module" errors in console
   - **Fix**: Verify all widget components exist in `src/components/dashboard/`
   - **Fix**: Check import paths use `@/` alias correctly

3. **React Context Not Available**
   - **Check**: Verify `AppProvider` wraps the app in `App.jsx`
   - **Fix**: Make sure `useApp()` hook is called inside `AppProvider`

4. **Data Source Empty**
   - **Check**: Verify `datasets.dashboard` has data in `src/data/logistics.js`
   - **Fix**: Check `generateRecords()` function is working

5. **Build/Dev Server Issues**
   - **Fix**: Stop dev server (Ctrl+C) and restart: `npm run dev`
   - **Fix**: Clear cache: Delete `node_modules/.vite` folder
   - **Fix**: Reinstall: `rm -rf node_modules && npm install`

6. **Browser Cache**
   - **Fix**: Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - **Fix**: Clear browser cache and reload

**Quick Debug Steps**:
```bash
# 1. Check for errors
npm run build

# 2. Check console
# Open browser → F12 → Console tab → Look for red errors

# 3. Verify data
# In browser console, type:
import { datasets } from '@/data/index.js';
console.log(datasets.dashboard);
```

### Fixed: formatCurrency Error

**Problem**: `Cannot access 'formatCurrency' before initialization`

**Solution**: ✅ **FIXED** - `formatCurrency` function moved outside component to avoid hoisting issues.

**If you see this error again**:
- Check `src/components/dashboard/KpiCardWidget.jsx`
- Make sure `formatCurrency` is defined **before** the `useMemo` hooks
- Or move it outside the component (current solution)

### Login Issues

**Problem**: Cannot login with `Admin` / `Admin@1881!`

**Solutions**:

1. **Check Password Exactly**:
   - Username: `Admin` (case-sensitive for display, but login is case-insensitive)
   - Password: `Admin@1881!` (must include the exclamation mark `!`)
   - Make sure no extra spaces before/after

2. **Clear Browser localStorage**:
   ```javascript
   // Open browser console (F12) and run:
   localStorage.removeItem('csg_users');
   localStorage.removeItem('csg_admin_session');
   // Then refresh page and try login again
   ```

3. **Reset Admin User** (from browser console):
   ```javascript
   // Open browser console (F12) and run:
   const defaultAdmin = {
     id: '1',
     username: 'Admin',
     password: 'Admin@1881!',
     email: 'admin@csg-logistics.com',
     role: 'admin',
     status: 'active',
     lastLogin: new Date().toISOString(),
     createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
   };
   localStorage.setItem('csg_users', JSON.stringify([defaultAdmin]));
   console.log('✅ Admin user reset!');
   // Then refresh and try login
   ```

4. **Check Browser Console**:
   - Press F12 → Console tab
   - Look for validation messages when you try to login
   - You should see: `✅ User validated successfully: Admin`
   - If you see `❌ Validation failed`, check the error details

5. **Different Browser Issue**:
   - Each browser has its own localStorage
   - If login works in one browser but not another, clear localStorage in the failing browser
   - Or use the reset script above in that browser

6. **Verify User Status**:
   - The user must have `status: 'active'`
   - Check in browser console:
     ```javascript
     const users = JSON.parse(localStorage.getItem('csg_users') || '[]');
     console.log(users.find(u => u.username === 'Admin'));
     ```

**The code now automatically ensures Admin user exists with correct credentials on every validation attempt.**

### Component Not Editable

**Problem**: Can't edit components

**Solutions**:
1. Make sure `editMode` is enabled in `AppContext`
2. Check `EditableWrapper` is wrapping component
3. Verify `componentId` is unique

### Data Not Showing

**Problem**: Widgets show 0 or no data

**Solutions**:
1. Check data source exists in `src/data/index.js`
2. Verify `dataSource` prop matches available source
3. Check browser console for errors

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:
1. Check for syntax errors in console
2. Verify all imports are correct
3. Make sure no `require()` calls (use `import` instead)

---

## 📚 Learning Resources

### React Basics
- **Components**: Reusable UI pieces
- **Props**: Data passed to components
- **State**: Component's internal data
- **Hooks**: `useState`, `useEffect`, `useMemo`

### This Project's Patterns
- **Context API**: Global state (`AppContext`, `AuthContext`)
- **Custom Hooks**: Reusable logic (`useApp`, `useTasks`)
- **Component Composition**: Building complex UIs from simple components

---

## 🎯 Next Steps

1. **Explore the code**: Start with `src/pages/DashboardPage.jsx`
2. **Try editing**: Enable edit mode and edit a component
3. **Add a widget**: Create your own widget component
4. **Connect database**: Modify `src/data/dataSource.js`
5. **Customize**: Change colors, add new dashboards

---

## 📝 Notes

- **All components are editable** - No need to edit code for simple changes
- **Data is dummy** - Connect your database in `src/data/dataSource.js`
- **TypeScript removed** - Project uses plain JavaScript for easier learning
- **UI Bakery-style** - Edit components directly in browser

---

**Happy Coding! 🚀**
