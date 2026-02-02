# 🚀 Quick Start Guide

## For Beginners (Don't Know React/JavaScript Well)

This guide helps you understand and use the project even if you're new to React/JavaScript.

---

## 📖 What is This Project?

This is a **dashboard application** (like a control panel) where you can:
- See data in charts and cards
- Edit everything without writing code
- Switch between different dashboard types
- Connect to your database later

Think of it like **Excel** but for web dashboards - you can edit things visually.

---

## 🎯 Main Concepts (Simple Explanation)

### 1. **Components** = Building Blocks

Like LEGO blocks, components are reusable pieces:
- **KPI Card**: Shows a number (e.g., "Total Users: 1,234")
- **Chart**: Shows data as a graph
- **Table**: Shows data in rows and columns

### 2. **Pages** = Collections of Components

A page is like a room with furniture (components):
- **Dashboard Page**: Has KPI cards, charts, widgets
- **Table Page**: Has a data table
- **Reports Page**: Has reports and analytics

### 3. **Edit Mode** = Visual Editor

When edit mode is ON:
- Hover over any component → See edit buttons
- Click Settings → Edit properties (colors, data, etc.)
- No coding needed!

---

## 📁 Important Files (What They Do)

### For Viewing Data:
- `src/data/logistics.js` - Dummy data (operations, fleet, etc.)
- `src/data/containersData.js` - Container/shipment data
- `src/data/dataSource.js` - Where to get data (connect DB here)

### For Dashboard Pages:
- `src/pages/DashboardPage.jsx` - Main dashboard
- `src/pages/dashboard/CRMDashboard.jsx` - CRM dashboard
- `src/pages/dashboard/AnalyticsDashboard.jsx` - Analytics dashboard
- (And 6 more dashboard types)

### For Components (Widgets):
- `src/components/dashboard/KpiCardWidget.jsx` - KPI card component
- `src/components/dashboard/LineChartWidget.jsx` - Line chart component
- `src/components/dashboard/PieChartWidget.jsx` - Pie chart component
- (And 8 more widget types)

### For Editing:
- `src/components/builder/EditableWrapper.jsx` - Makes components editable
- `src/components/builder/ComponentEditor.jsx` - Edit panel (side panel)

---

## 🎨 How to Change Things

### Change Currency (USD → EUR)

**Method 1: Edit in Browser (Easiest)**
1. Enable edit mode
2. Hover over KPI card
3. Click Settings icon
4. Go to "Properties" tab
5. Change "Currency" dropdown to EUR
6. Save

**Method 2: Edit in Code**
1. Open `src/pages/DashboardPage.jsx`
2. Find the KPI card you want to change
3. Change `currency="USD"` to `currency="EUR"`
4. Save file (auto-refreshes)

### Change Data Source

**In Browser:**
1. Edit mode → Click component → Properties tab
2. Change "Data Source" dropdown
3. Save

**In Code:**
```jsx
<KpiCardWidget
  dataSource="dashboard"  // Change this to "operations", "fleet", etc.
/>
```

### Change Colors

**In Browser:**
1. Edit mode → Click component → Properties tab
2. Change "Background Gradient" field
3. Examples: `from-blue-600 to-indigo-700`, `from-red-500 to-rose-600`

**In Code:**
```jsx
<KpiCardWidget
  bgColor="from-blue-600 to-indigo-700"  // Change this
/>
```

### Add a New Widget

1. **Copy an existing widget** (e.g., `KpiCardWidget.jsx`)
2. **Rename it** (e.g., `MyWidget.jsx`)
3. **Modify the content** inside
4. **Import and use** in dashboard:
   ```jsx
   import { MyWidget } from '@/components/dashboard/MyWidget.jsx';
   
   <MyWidget componentId="my-widget" title="My Widget" />
   ```

---

## 🔍 Understanding the Code Structure

### Example: KPI Card Component

```jsx
// 1. Import what you need
import { Card } from '@/components/ui/card.jsx';
import { useApp } from '@/contexts/useApp.js';

// 2. Create the component
export function KpiCardWidget({ componentId, label, value }) {
  // 3. Get saved config (if user edited it)
  const { componentConfigs } = useApp();
  const config = componentConfigs[componentId] || {};
  
  // 4. Use config or default value
  const finalLabel = config.label || label;
  
  // 5. Render the UI
  return (
    <Card>
      <CardHeader>
        <CardTitle>{finalLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{value}</p>
      </CardContent>
    </Card>
  );
}
```

**What this means:**
- Component receives `label` as a prop (default value)
- If user edited it, `config.label` overrides the prop
- Component renders with the final value

---

## 🗂️ File Organization

```
src/
├── components/          # Reusable pieces
│   ├── dashboard/        # Dashboard widgets (cards, charts)
│   ├── ui/              # Basic UI (buttons, inputs)
│   └── builder/         # Edit mode tools
├── pages/               # Full pages
│   ├── dashboard/        # Different dashboard types
│   └── DashboardPage.jsx
├── data/                # Data files
│   ├── logistics.js     # Dummy data
│   └── dataSource.js    # Connect DB here
└── contexts/            # Global state
    └── AppContext.jsx   # App-wide settings
```

---

## 🎓 Learning Path

### Step 1: Explore
1. Run `npm run dev`
2. Open dashboard
3. Enable edit mode
4. Edit a component
5. See what changes

### Step 2: Understand
1. Open `src/pages/DashboardPage.jsx`
2. See how widgets are used
3. Open a widget file (e.g., `KpiCardWidget.jsx`)
4. See how it's built

### Step 3: Modify
1. Change a color in code
2. Change a label
3. Add a new widget
4. See it appear

### Step 4: Create
1. Create your own widget
2. Add it to a dashboard
3. Make it editable
4. Connect to your data

---

## 💡 Common Tasks

### Task: Change Dashboard Title

**File**: `src/pages/DashboardPage.jsx`
**Find**: `<PageRibbon title="Dashboard" />`
**Change to**: `<PageRibbon title="My Dashboard" />`

### Task: Add a New KPI Card

**File**: `src/pages/DashboardPage.jsx`
**Add**:
```jsx
<KpiCardWidget
  componentId="kpi-new"
  icon={<Star className="h-5 w-5" />}
  label="New Metric"
  dataSource="dashboard"
  valueField="total"
/>
```

### Task: Change Chart Colors

**In Browser**: Edit mode → Chart → Properties → Change colors
**In Code**: Change `color: "#6366f1"` to `color: "#ff0000"` (red)

### Task: Connect Your Database

**File**: `src/data/dataSource.js`
**Modify** `getData()` function:
```javascript
if (sourceKey === 'database') {
  // Add your API call here
  const response = await fetch('YOUR_API_URL');
  return await response.json();
}
```

---

## 🆘 Need Help?

1. **Check browser console** (F12) for errors
2. **Read README.md** for detailed explanations
3. **Check component files** to see how they work
4. **Try editing in browser** first (easier than code)

---

## ✅ Checklist: Is Everything Working?

- [ ] `npm run dev` starts without errors
- [ ] Browser shows dashboard (not blank)
- [ ] Can login with Admin/Admin@1881!
- [ ] Can see KPI cards with numbers
- [ ] Can see charts
- [ ] Edit mode works (hover shows buttons)
- [ ] Can edit a component (opens panel)
- [ ] Can change currency in Properties tab
- [ ] Changes save and update

If all checked ✅, you're good to go!

---

**Remember**: Start with editing in the browser, then move to code when comfortable!
