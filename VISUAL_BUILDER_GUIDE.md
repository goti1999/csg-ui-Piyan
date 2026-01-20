# 🛠️ Visual Page Builder - UI Bakery Style

## Overview

Your CSG-UI project now includes a **Visual Page Builder** (similar to UI Bakery) that allows you to drag-and-drop components to build custom pages without coding!

## 🎯 Features

### ✅ Drag & Drop Interface
- **Left Sidebar**: Component palette with all available components
- **Center Canvas**: Drop zone where you build your page
- **Right Sidebar**: Properties panel to customize selected components

### ✅ Component Library (15+ Components)

#### **Input Components** 📝
- Button (with variants: default, secondary, outline, ghost, destructive)
- Input Field (text, email, password, number)
- Select Dropdown

#### **Display Components** 📄
- Text (h1, h2, h3, body, small)
- Badge (default, secondary, outline, destructive)
- Alert (info, warning, error)

#### **Layout Components** 📦
- Card (with header/footer)
- Container (customizable padding)
- Tabs (multi-tab layout)
- Divider (horizontal/vertical)

#### **Data Components** 📊
- Data Table (sortable, filterable, paginated)
- Chart (line, bar, pie, area)

#### **Action Components** ⚡
- Form (with validation)
- Modal Dialog

## 🚀 How to Use

### **1. Enable Builder Mode (Development Only)**

The Visual Builder is **ONLY available in development mode** for security.

```bash
# Copy the development environment file
cp env.development .env

# Make sure VITE_BUILDER_MODE=true is set
```

### **2. Start Development Server**

```bash
npm run dev
```

### **3. Access the Builder**

Navigate to: **http://localhost:8081/builder**

You'll see a new "🛠️ Builder" tab in the navigation ribbon (dev only).

### **4. Build Your Page**

#### **Method 1: Drag & Drop**
1. Find a component in the left palette
2. Drag it to the canvas in the middle
3. Drop it where you want

#### **Method 2: Click to Add**
1. Click any component in the palette
2. It will be added to the canvas automatically

#### **Method 3: Edit Properties**
1. Click on any component in the canvas
2. Right sidebar shows all properties
3. Edit text, colors, sizes, variants, etc.
4. Changes appear instantly!

### **5. Component Operations**

- **Select**: Click any component on canvas
- **Edit**: Properties appear in right panel
- **Delete**: Click trash icon in properties panel
- **Preview**: Toggle "Preview" mode to see final result
- **Save**: Click "Save" to persist your design
- **Export**: Download as JSON for reuse

## 🌍 Environment Configuration

### **3 Environments Configured:**

#### **1. Development** (`env.development`)
```bash
npm run dev              # Start dev server
npm run build:dev        # Build for dev
```
- ✅ Visual Builder **ENABLED**
- ✅ Debug tools enabled
- ✅ Hot reload
- ✅ Source maps

#### **2. Test** (`env.test`)
```bash
npm run dev:test         # Start test server
npm run build:test       # Build for test
npm run preview:test     # Preview test build
```
- ❌ Visual Builder **DISABLED**
- ✅ Test database
- ✅ Staging API

#### **3. Production** (`env.production`)
```bash
npm run build            # Build for production
npm run preview:prod     # Preview production build
```
- ❌ Visual Builder **DISABLED**
- ✅ Production database
- ✅ Production API
- ✅ Optimized & minified

## 📋 Component Properties

Each component has customizable properties:

### **Button**
- Text
- Variant (default, secondary, outline, ghost, destructive)
- Size (sm, default, lg)
- Disabled state

### **Input**
- Label
- Placeholder
- Type (text, email, password, number)
- Required/Disabled

### **Card**
- Title
- Description
- Show/hide header
- Padding

### **Table**
- Sortable columns
- Filters
- Pagination
- Page size

### **Chart**
- Chart type (line, bar, pie, area)
- Title
- Data source

...and many more!

## 🎨 UI Bakery-Inspired Features

### ✅ Implemented:
- ✅ Drag & drop components
- ✅ Component palette with categories
- ✅ Properties panel for real-time editing
- ✅ Canvas with visual feedback
- ✅ Component library (15+ components)
- ✅ Edit/Preview modes
- ✅ Save/Export functionality
- ✅ Environment-based configuration
- ✅ Dev-only builder access

### 🔄 Future Enhancements:
- Data binding to API endpoints
- Custom code actions
- Database integration
- Workflow automation
- User role-based access
- Version control
- Collaboration features

## 🔐 Security

**Important Security Notes:**

- ⚠️ **Builder is disabled in test/production** for security
- ⚠️ Only admins should have dev environment access
- ⚠️ Don't expose `.env` files to version control (already in `.gitignore`)
- ⚠️ Generated pages should be reviewed before deployment

## 📝 Example Workflow

### Building a Custom "Shipments" Page:

1. **Go to Builder**: http://localhost:8081/builder
2. **Add Components**:
   - Drag "Text (h1)" → Set to "Shipments Dashboard"
   - Drag "Card" → Set title to "Active Shipments"
   - Drag "Table" → Enable sorting & filtering
   - Drag "Button" → Set text to "Add Shipment"
3. **Configure Properties**:
   - Select each component
   - Edit properties in right panel
4. **Preview**: Click "Preview" to see final result
5. **Save**: Click "Save" to persist
6. **Export**: Download JSON for production use

## 🎯 Quick Tips

- **Keyboard Shortcuts**:
  - `Delete` - Remove selected component
  - `Cmd/Ctrl + S` - Save (coming soon)
  - `Cmd/Ctrl + Z` - Undo (coming soon)

- **Best Practices**:
  - Start with layout components (Cards, Containers)
  - Add data components (Tables, Charts)
  - Finish with action components (Buttons, Forms)
  - Test in Preview mode frequently

## 🔧 Technical Details

### File Structure:
```
src/
├── builder/
│   ├── types.ts                    # TypeScript definitions
│   ├── componentRegistry.ts        # All available components
│   ├── BuilderContext.tsx          # State management
│   └── components/
│       ├── ComponentPalette.tsx    # Left sidebar
│       ├── PropertiesPanel.tsx     # Right sidebar
│       ├── BuilderCanvas.tsx       # Middle canvas
│       └── ComponentRenderer.tsx   # Component rendering logic
├── pages/
│   └── BuilderPage.tsx             # Main builder page
└── ...
```

### Environment Files:
- `env.development` - Dev config (builder enabled)
- `env.test` - Test config (builder disabled)
- `env.production` - Prod config (builder disabled)

## 🎓 Learn More

This visual builder is inspired by:
- UI Bakery
- Retool
- Appsmith
- Webflow

For advanced customization, you can:
1. Add more components to `componentRegistry.ts`
2. Create custom renderers in `ComponentRenderer.tsx`
3. Add data binding logic
4. Implement API integrations

---

**Built with ❤️ for modern logistics operations**
