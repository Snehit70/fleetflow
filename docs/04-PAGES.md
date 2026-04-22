# FleetFlow - Pages Specification

## Page Overview

| # | Page | Route | Priority |
|---|------|-------|----------|
| 1 | Login | `/login` | High |
| 2 | Dashboard | `/` | High |
| 3 | Vehicles | `/vehicles` | High |
| 4 | Drivers | `/drivers` | High |
| 5 | Trips | `/trips` | High |
| 6 | Maintenance | `/maintenance` | Medium |
| 7 | Expenses | `/expenses` | Medium |
| 8 | Analytics | `/analytics` | Low |

## RBAC Access Matrix

| Page | Manager | Dispatcher | Safety Officer | Financial Analyst |
|------|---------|------------|----------------|-------------------|
| Dashboard | Full | Full | Full | Full |
| Vehicles | Full CRUD | View Only | No Access | No Access |
| Drivers | Full CRUD | View Only | Full CRUD | No Access |
| Trips | Full CRUD | Full CRUD | View Only | No Access |
| Maintenance | Full CRUD | No Access | No Access | View Only |
| Expenses | Full CRUD | No Access | No Access | Full CRUD |
| Analytics | Full | No Access | View Only | Full |

---

## Page 1: Login (`/login`)

### Purpose
Secure access point with role-based authentication.

### Layout
- Centered card on page
- No sidebar/navbar (auth layout)

### Components
- `LoginForm.vue`
  - Email input
  - Password input
  - Submit button
  - "Forgot Password" link (placeholder)
  - Error message display

### Features
- Form validation
- JWT token storage on success
- Redirect to dashboard
- Show role after login (in navbar)

### API Calls
- `POST /api/auth/login` - Authenticate user

---

## Page 2: Dashboard (`/`)

### Purpose
High-level fleet oversight with KPIs.

### Layout
- Main layout with sidebar
- KPI cards at top
- Quick actions below
- Recent activity feed (optional)

### Components
- `KPICard.vue` (4 instances)
  - Active Fleet count
  - Maintenance Alerts count
  - Utilization Rate percentage
  - Pending Cargo count
- `QuickActions.vue`
  - New Trip button
  - Add Vehicle button
- `FilterBar.vue`
  - Vehicle Type dropdown
  - Status dropdown
  - Region dropdown

### Features
- Real-time KPI updates
- Click KPI to navigate to relevant page
- Filters affect displayed data

### API Calls
- `GET /api/analytics/dashboard` - Fetch all KPIs

---

## Page 3: Vehicles (`/vehicles`)

### Purpose
Asset management with full CRUD.

### Layout
- Data table with actions
- Add button in header
- Modal for create/edit

### Components
- `VehicleTable.vue`
  - Columns: Name, License Plate, Type, Capacity, Odometer, Status, Actions
  - Status pills (colored badges)
  - Edit/Delete buttons
- `VehicleForm.vue` (in modal)
  - Name input
  - License Plate input
  - Type dropdown (Truck/Van/Bike)
  - Max Capacity input
  - Odometer input
  - Region input
  - Status toggle (for retirement)
- `VehicleFilters.vue`
  - Search by name/plate
  - Filter by type
  - Filter by status

### Features
- Pagination
- Sorting by columns
- Status pills with colors:
  - Green: Available
  - Blue: On Trip
  - Orange: In Shop
  - Gray: Retired
- Cannot delete vehicle with active trips

### API Calls
- `GET /api/vehicles` - List all
- `POST /api/vehicles` - Create
- `PUT /api/vehicles/:id` - Update
- `DELETE /api/vehicles/:id` - Delete

---

## Page 4: Drivers (`/drivers`)

### Purpose
Driver management and compliance tracking.

### Layout
- Data table with actions
- License expiry warnings
- Modal for create/edit

### Components
- `DriverTable.vue`
  - Columns: Name, License #, Category, Expiry, Status, Safety Score, Actions
  - Warning badge if expiry < 30 days
  - Expired badge if past expiry
- `DriverForm.vue` (in modal)
  - Name input
  - Email input
  - Phone input
  - License Number input
  - License Expiry date picker
  - License Category dropdown (VAN/TRUCK/BIKE)
  - Status dropdown
- `SafetyScoreBadge.vue`
  - Color-coded score display

### Features
- License expiry tracking
- Visual warnings for compliance
- Block assignment if expired (shown in UI)
- Safety score display (0-100)
- Status toggle (ON_TRIP is system-managed by trip dispatch workflow)

### API Calls
- `GET /api/drivers` - List all
- `POST /api/drivers` - Create
- `PUT /api/drivers/:id` - Update
- `DELETE /api/drivers/:id` - Delete

---

## Page 5: Trips (`/trips`)

### Purpose
Trip creation, dispatch, and lifecycle management.

### Layout
- Data table with status workflow
- Create trip form (can be modal or sidebar)
- Trip details view

### Components
- `TripTable.vue`
  - Columns: ID, Origin, Destination, Vehicle, Driver, Cargo, Status, Actions
  - Status workflow buttons
- `TripForm.vue`
  - Vehicle dropdown (only AVAILABLE)
  - Driver dropdown (only ON_DUTY + valid license)
  - Origin input
  - Destination input
  - Cargo Weight input
  - Cargo Description textarea
  - **Validation display**
- `TripStatusActions.vue`
  - Dispatch button (Draft → Dispatched)
  - Complete button (Dispatched → Completed)
  - Cancel button (any → Cancelled)

### Features
- **Critical Validation:** CargoWeight <= Vehicle.MaxCapacity
- Driver license category must match vehicle type
- Driver license must not be expired
- Auto-update statuses on dispatch/complete:
  - Dispatch: Vehicle → ON_TRIP, Driver → ON_TRIP
  - Complete: Vehicle → AVAILABLE, Driver → ON_DUTY
- Odometer tracking on completion

### API Calls
- `GET /api/trips` - List all
- `POST /api/trips` - Create (with validation)
- `POST /api/trips/:id/dispatch` - Dispatch trip
- `POST /api/trips/:id/complete` - Complete trip
- `POST /api/trips/:id/cancel` - Cancel trip

---

## Page 6: Maintenance (`/maintenance`)

### Purpose
Preventative and reactive maintenance tracking.

### Layout
- Log form at top or sidebar
- Maintenance history table
- Vehicle status display

### Components
- `MaintenanceForm.vue`
  - Vehicle dropdown
  - Description input (or preset options)
  - Cost input
  - Date picker
  - Notes textarea
- `MaintenanceTable.vue`
  - Columns: Date, Vehicle, Description, Cost, Notes
  - Grouped by vehicle (optional)
- `VehicleStatusCard.vue`
  - Show vehicles currently IN_SHOP
  - "Back in Service" button

### Features
- **Auto-logic:** Adding maintenance → Vehicle.status = IN_SHOP
- "Back in Service" button → Vehicle.status = AVAILABLE
- Cost tracking per vehicle
- Maintenance history

### API Calls
- `GET /api/maintenance` - List all
- `POST /api/maintenance` - Create (auto-updates vehicle)
- `PUT /api/vehicles/:id` - Update status back to AVAILABLE

---

## Page 7: Expenses (`/expenses`)

### Purpose
Financial tracking for fuel and other expenses.

### Layout
- Tabbed interface: Fuel Logs | Other Expenses
- Forms for each type
- Summary cards

### Components
- `FuelLogForm.vue`
  - Vehicle dropdown
  - Liters input
  - Cost input
  - Odometer input
  - Date picker
- `ExpenseForm.vue`
  - Vehicle dropdown
  - Category dropdown
  - Amount input
  - Description input
  - Date picker
- `FuelLogTable.vue`
- `ExpenseTable.vue`
- `CostSummaryCard.vue`
  - Total fuel cost
  - Total maintenance cost
  - Total other expenses
  - Cost per vehicle

### Features
- Fuel efficiency calculation (km/L)
- Total operational cost per vehicle
- Date range filtering
- Category breakdown

### API Calls
- `GET /api/fuel-logs` - List all
- `POST /api/fuel-logs` - Create
- `GET /api/expenses` - List all
- `POST /api/expenses` - Create

---

## Page 8: Analytics (`/analytics`)

### Purpose
Data-driven decision making with reports.

### Layout
- Chart cards
- Metrics summary
- Export section

### Components
- `FuelEfficiencyChart.vue`
  - Bar chart: km/L per vehicle
- `CostBreakdownChart.vue`
  - Pie chart: Fuel vs Maintenance vs Other
- `UtilizationChart.vue`
  - Line chart: Fleet utilization over time
- `ROITable.vue`
  - Vehicle ROI calculations
- `ExportButtons.vue`
  - CSV export
  - PDF export (optional)

### Features
- Fuel Efficiency: total km / total liters
- Vehicle ROI: (Revenue - Costs) / Acquisition Cost
- Time-based filtering
- Export to CSV

### API Calls
- `GET /api/analytics/fuel-efficiency` - Get efficiency data
- `GET /api/analytics/costs` - Get cost breakdown
- `GET /api/analytics/utilization` - Get utilization data
- `GET /api/analytics/export` - Download CSV

---

## Shared Components

| Component | Usage |
|-----------|-------|
| `Navbar.vue` | Top navigation with user info |
| `Sidebar.vue` | Left navigation menu |
| `DataTable.vue` | Reusable table with sorting/pagination |
| `Modal.vue` | Reusable modal wrapper |
| `StatusPill.vue` | Colored status badges |
| `ConfirmDialog.vue` | Delete confirmations |
| `LoadingSpinner.vue` | Loading states |
| `EmptyState.vue` | No data messages |
