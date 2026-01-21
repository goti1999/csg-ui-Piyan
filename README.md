# 🚀 CSG Logistics Dashboard - Complete Enterprise Solution


```

## 📦 Build Commands

```bash
# Development
npm run dev              # Start dev server (builder enabled)
npm run build:dev        # Build dev version

# Test
npm run dev:test         # Start test server (builder disabled)
npm run build:test       # Build test version
npm run preview:test     # Preview test build

# Production
npm run build            # Build production (builder disabled)
npm run preview:prod     # Preview production build

# Other
npm run lint             # Run linter
npm test                 # Run tests
```

## 🎯 Project Structure

```
csg-ui/
├── src/
│   ├── builder/                    # 🛠️ Visual Builder System
│   │   ├── types.ts                # TypeScript definitions
│   │   ├── componentRegistry.ts    # Component library
│   │   ├── BuilderContext.tsx      # State management
│   │   └── components/
│   │       ├── ComponentPalette.tsx    # Left: Component library
│   │       ├── PropertiesPanel.tsx     # Right: Settings panel
│   │       ├── BuilderCanvas.tsx       # Center: Drop zone
│   │       └── ComponentRenderer.tsx   # Render logic
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppLayout.tsx       # Main layout (header, ribbon, sidebar)
│   │   ├── tasks/                  # Task components
│   │   └── ui/                     # shadcn/ui components (50+)
│   ├── data/
│   │   └── logistics.ts            # Mock data
│   ├── pages/
│   │   ├── Auth.tsx                # Login page
│   │   ├── DashboardPage.tsx       # Main dashboard
│   │   ├── TablePage.tsx           # Reusable data tables
│   │   ├── ReportsPage.tsx         # Executive reports
│   │   └── BuilderPage.tsx         # 🛠️ Visual Builder (dev only)
│   └── ...
├── env.development                 # Dev environment config
├── env.test                        # Test environment config
├── env.production                  # Prod environment config
├── env.example                     # Template
└── package.json
```
