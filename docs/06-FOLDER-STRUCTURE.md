# FleetFlow - Folder Structure

## Project Tree

```text
fleetflow/
├── .gitignore                # Git ignore rules
├── .env                      # Environment variables (not committed)
├── README.md                 # Project overview
├── nuxt.config.ts            # Nuxt configuration
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
│
├── docs/                     # Project documentation
│   ├── 01-PROBLEM-STATEMENT.md
│   ├── 02-TECH-STACK.md
│   ├── 03-DATABASE-SCHEMA.md
│   ├── 04-PAGES.md
│   ├── 05-API-ROUTES.md
│   ├── 06-FOLDER-STRUCTURE.md
│   ├── 07-TIMELINE.md
│   └── 08-SEED-DATA.md
│
├── prisma/                   # Database layer
│   ├── schema.prisma         # Database schema definition
│   ├── seed.ts               # Seed data script
│   └── dev.db                # SQLite database file (not committed)
│
├── server/                   # Backend (Nuxt server routes)
│   ├── api/                  # API endpoints
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── register.post.ts
│   │   │   └── me.get.ts
│   │   ├── vehicles/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── drivers/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── trips/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id]/
│   │   │   │   ├── dispatch.post.ts
│   │   │   │   ├── complete.post.ts
│   │   │   │   └── cancel.post.ts
│   │   ├── maintenance/
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   ├── fuel-logs/
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   ├── expenses/
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   └── analytics/
│   │       ├── dashboard.get.ts
│   │       ├── fuel-efficiency.get.ts
│   │       ├── costs.get.ts
│   │       └── export.get.ts
│   ├── middleware/
│   │   └── auth.ts           # JWT verification middleware
│   └── utils/
│       ├── prisma.ts         # Prisma client singleton
│       └── jwt.ts            # JWT helper functions
│
├── pages/                    # Vue pages (file-based routing)
│   ├── index.vue             # Dashboard (/)
│   ├── login.vue             # Login page (/login)
│   ├── vehicles.vue          # Vehicle registry (/vehicles)
│   ├── drivers.vue           # Driver profiles (/drivers)
│   ├── trips.vue             # Trip dispatcher (/trips)
│   ├── maintenance.vue       # Maintenance logs (/maintenance)
│   ├── expenses.vue          # Expense tracking (/expenses)
│   └── analytics.vue         # Analytics & reports (/analytics)
│
├── components/               # Vue components
│   ├── ui/                   # shadcn-vue components
│   │   ├── button/
│   │   ├── card/
│   │   ├── dialog/
│   │   ├── dropdown-menu/
│   │   ├── input/
│   │   ├── label/
│   │   ├── select/
│   │   ├── table/
│   │   ├── tabs/
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.vue        # Top navigation bar
│   │   ├── Sidebar.vue       # Left sidebar menu
│   │   └── PageHeader.vue    # Page title and actions
│   ├── dashboard/
│   │   ├── KPICard.vue       # Single KPI display
│   │   ├── KPIGrid.vue       # Grid of KPIs
│   │   └── QuickActions.vue  # Action buttons
│   ├── vehicles/
│   │   ├── VehicleTable.vue  # Vehicle data table
│   │   ├── VehicleForm.vue   # Create/edit form
│   │   └── VehicleCard.vue   # Vehicle summary card
│   ├── drivers/
│   │   ├── DriverTable.vue   # Driver data table
│   │   ├── DriverForm.vue    # Create/edit form
│   │   └── LicenseWarning.vue # Expiry warning badge
│   ├── trips/
│   │   ├── TripTable.vue     # Trip data table
│   │   ├── TripForm.vue      # Create trip form
│   │   └── TripActions.vue   # Status action buttons
│   ├── maintenance/
│   │   ├── MaintenanceTable.vue
│   │   └── MaintenanceForm.vue
│   ├── expenses/
│   │   ├── FuelLogTable.vue
│   │   ├── FuelLogForm.vue
│   │   ├── ExpenseTable.vue
│   │   └── ExpenseForm.vue
│   ├── analytics/
│   │   ├── FuelEfficiencyChart.vue
│   │   ├── CostBreakdownChart.vue
│   │   └── ExportButton.vue
│   └── shared/
│       ├── StatusPill.vue    # Colored status badge
│       ├── ConfirmDialog.vue # Delete confirmation
│       ├── LoadingSpinner.vue
│       └── EmptyState.vue
│
├── composables/              # Vue composables (shared logic)
│   ├── useAuth.ts            # Authentication state & methods
│   ├── useApi.ts             # API fetch wrapper
│   ├── useVehicles.ts        # Vehicle CRUD operations
│   ├── useDrivers.ts         # Driver CRUD operations
│   ├── useTrips.ts           # Trip operations
│   └── useToast.ts           # Toast notifications
│
├── layouts/                  # Nuxt layouts
│   ├── default.vue           # Main layout (sidebar + navbar)
│   └── auth.vue              # Auth layout (no sidebar)
│
├── middleware/               # Nuxt route middleware
│   ├── auth.ts               # Require authentication
│   └── role.ts               # Role-based access
│
├── lib/                      # Utility functions
│   └── utils.ts              # Helper functions (cn, formatDate, etc.)
│
├── types/                    # TypeScript type definitions
│   └── index.ts              # Shared types
│
├── assets/                   # Static assets
│   └── css/
│       └── main.css          # Global styles & Tailwind imports
│
└── public/                   # Public static files
    └── favicon.ico
```

## Folder Purposes

| Folder | Purpose |
|--------|---------|
| `docs/` | Project documentation for reference and hackathon judges |
| `prisma/` | Database schema, migrations, and seed data |
| `server/api/` | Backend API routes (REST endpoints) |
| `server/middleware/` | Server-side middleware (auth verification) |
| `server/utils/` | Server utilities (Prisma client, JWT helpers) |
| `pages/` | Vue pages with automatic routing |
| `components/` | Reusable Vue components |
| `components/ui/` | shadcn-vue base components |
| `composables/` | Shared Vue composition functions |
| `layouts/` | Page layout templates |
| `middleware/` | Client-side route guards |
| `lib/` | General utility functions |
| `types/` | TypeScript type definitions |
| `assets/` | CSS and other build-processed assets |
| `public/` | Static files served as-is |

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | lowercase | `vehicles.vue` |
| Components | PascalCase | `VehicleTable.vue` |
| Composables | camelCase with `use` prefix | `useAuth.ts` |
| API Routes | lowercase with method suffix | `index.get.ts` |
| Types | PascalCase | `Vehicle`, `Driver` |

## Key Files

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Nuxt modules, plugins, runtime config |
| `prisma/schema.prisma` | Database models and relations |
| `server/utils/prisma.ts` | Prisma client singleton |
| `composables/useAuth.ts` | Auth state management |
| `layouts/default.vue` | Main app shell with navigation |
