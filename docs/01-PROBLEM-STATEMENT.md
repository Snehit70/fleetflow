# FleetFlow - Problem Statement

## Hackathon
**Odoo x Gujarat Vidyapith Hackathon '26**

## Objective
To replace inefficient, manual logbooks with a centralized, rule-based digital hub that optimizes the lifecycle of a delivery fleet, monitors driver safety, and tracks financial performance.

## Target Users

| Role | Responsibilities |
|------|------------------|
| **Fleet Manager** | Oversee vehicle health, asset lifecycle, and scheduling |
| **Dispatcher** | Create trips, assign drivers, and validate cargo loads |
| **Safety Officer** | Monitor driver compliance, license expirations, and safety scores |
| **Financial Analyst** | Audit fuel spend, maintenance ROI, and operational costs |

## Core System Pages (8 Total)

### Page 1: Login & Authentication
- Secure access for different user roles (Manager vs. Dispatcher)
- Email/Password fields, "Forgot Password"
- Role-Based Access Control (RBAC)

### Page 2: Command Center (Main Dashboard)
- High-level "at-a-glance" fleet oversight
- **KPIs:**
  - Active Fleet: Count of vehicles currently "On Trip"
  - Maintenance Alerts: Number of vehicles marked "In Shop"
  - Utilization Rate: % of fleet assigned vs. idle
  - Pending Cargo: Shipments waiting for assignment
- Filters: By Vehicle Type (Truck, Van, Bike), Status, or Region

### Page 3: Vehicle Registry (Asset Management)
- CRUD operations for physical assets
- Data Points: Name/Model, License Plate (Unique ID), Max Load Capacity (kg/tons), Odometer
- Logic: Manual toggle for "Out of Service" (Retired)

### Page 4: Trip Dispatcher & Management
- Workflow for moving goods from Point A to Point B
- Creation Form: Select Available Vehicle + Available Driver
- **Validation Rule:** Prevent trip creation if CargoWeight > MaxCapacity
- Lifecycle: Draft → Dispatched → Completed → Cancelled

### Page 5: Maintenance & Service Logs
- Preventative and reactive health tracking
- **Logic Link:** Adding a vehicle to a "Service Log" automatically switches its status to "In Shop", removing it from the Dispatcher's selection pool

### Page 6: Completed Trip, Expense & Fuel Logging
- Financial tracking per asset
- Record Liters, Cost, and Date
- Calculation: Automated "Total Operational Cost" (Fuel + Maintenance) per Vehicle ID

### Page 7: Driver Performance & Safety Profiles
- Human resource and compliance management
- **Compliance:** License expiry tracking (Blocks assignment if expired)
- **Performance:** Trip completion rates and "Safety Scores"
- **Status:** Toggle between On Duty, Off Duty, or Suspended

### Page 8: Operational Analytics & Financial Reports
- Data-driven decision making
- **Metrics:**
  - Fuel Efficiency: km / L
  - Vehicle ROI: (Revenue - (Maintenance + Fuel)) / Acquisition Cost
- **Exports:** One-click CSV/PDF for monthly payroll and health audits

## Business Logic & Workflow

```
1. Vehicle Intake: Add "Van-05" (500kg capacity) → Status: Available
2. Compliance: Add Driver "Alex" → System verifies license validity for "Van" category
3. Dispatching: Assign "Alex" to "Van-05" for 450kg load
   - Check: 450 < 500 (Pass)
   - Status Update: Vehicle & Driver → On Trip
4. Completion: Driver marks trip "Done," enters final Odometer
   - Status Update: Vehicle & Driver → Available
5. Maintenance: Manager logs "Oil Change"
   - Auto-Logic: Status → In Shop. Vehicle hidden from Dispatcher
6. Analytics: System updates "Cost-per-km" based on fuel logs from the last trip
```

## Technical Requirements
- **Frontend:** Modular UI with scannable data tables and status pills
- **Backend:** Real-time state management for vehicle/driver availability
- **Database:** Relational structure to link Expenses/Trips to a specific Vehicle ID

## Mockup
https://link.excalidraw.com/l/65VNwvy7c4X/9gLrP9aS4YZ
