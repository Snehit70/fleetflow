# FleetFlow - Seed Data

## Overview

Demo data for hackathon presentation. This data demonstrates all features and edge cases.

---

## Users (Login Credentials)

| Email | Password | Role | Access |
|-------|----------|------|--------|
| `admin@fleetflow.com` | `password123` | MANAGER | Full access |
| `dispatch@fleetflow.com` | `password123` | DISPATCHER | Trips, view vehicles/drivers |
| `safety@fleetflow.com` | `password123` | SAFETY_OFFICER | Drivers, safety metrics |
| `finance@fleetflow.com` | `password123` | FINANCIAL_ANALYST | Expenses, analytics |

---

## Vehicles (5)

| Name | License Plate | Type | Capacity | Odometer | Status | Region |
|------|---------------|------|----------|----------|--------|--------|
| Van-01 | GJ01AB1234 | VAN | 500 kg | 25,000 km | AVAILABLE | Ahmedabad |
| Van-02 | GJ01CD5678 | VAN | 500 kg | 18,500 km | ON_TRIP | Ahmedabad |
| Truck-01 | GJ05EF9012 | TRUCK | 2,000 kg | 45,000 km | AVAILABLE | Surat |
| Truck-02 | GJ05GH3456 | TRUCK | 2,500 kg | 32,000 km | IN_SHOP | Surat |
| Bike-01 | GJ01JK7890 | BIKE | 30 kg | 8,000 km | AVAILABLE | Ahmedabad |

### Status Distribution
- AVAILABLE: 3 (60%)
- ON_TRIP: 1 (20%)
- IN_SHOP: 1 (20%)

---

## Drivers (5)

| Name | Email | License # | Category | Expiry | Status | Safety Score |
|------|-------|-----------|----------|--------|--------|--------------|
| Alex Kumar | alex@fleetflow.com | DL-GJ-2020-001234 | VAN | 2027-06-15 | ON_DUTY | 95 |
| Priya Sharma | priya@fleetflow.com | DL-GJ-2019-005678 | VAN, TRUCK | 2026-12-31 | ON_TRIP | 88 |
| Raj Patel | raj@fleetflow.com | DL-GJ-2021-009012 | TRUCK | 2026-03-10 | ON_DUTY | 92 |
| Sara Singh | sara@fleetflow.com | DL-GJ-2018-003456 | VAN | 2026-02-15 | OFF_DUTY | 85 |
| Mike Johnson | mike@fleetflow.com | DL-GJ-2022-007890 | BIKE | 2027-09-20 | ON_DUTY | 98 |

### Edge Cases Demonstrated
- **Raj Patel**: License expiring in ~17 days (warning)
- **Sara Singh**: License EXPIRED (cannot be assigned)
- **Priya Sharma**: Currently on trip (ON_TRIP status)

---

## Trips (6)

| ID | Origin | Destination | Vehicle | Driver | Cargo | Status |
|----|--------|-------------|---------|--------|-------|--------|
| T001 | Ahmedabad | Surat | Van-02 | Priya Sharma | 450 kg | DISPATCHED |
| T002 | Surat | Vadodara | Truck-01 | Raj Patel | 1,800 kg | COMPLETED |
| T003 | Ahmedabad | Rajkot | Van-01 | Alex Kumar | 300 kg | DRAFT |
| T004 | Vadodara | Ahmedabad | Van-01 | Alex Kumar | 480 kg | COMPLETED |
| T005 | Surat | Mumbai | Truck-01 | Raj Patel | 2,000 kg | COMPLETED |
| T006 | Ahmedabad | Gandhinagar | Bike-01 | Mike Johnson | 25 kg | CANCELLED |

### Status Distribution
- DRAFT: 1 (pending cargo)
- DISPATCHED: 1 (in progress)
- COMPLETED: 3 (history)
- CANCELLED: 1 (shows full lifecycle)

---

## Maintenance Logs (4)

| Date | Vehicle | Description | Cost | Notes |
|------|---------|-------------|------|-------|
| 2026-02-20 | Truck-02 | Engine Repair | ₹15,000 | Major repair, parts replaced |
| 2026-02-18 | Van-01 | Oil Change | ₹2,500 | Synthetic oil |
| 2026-02-15 | Truck-01 | Tire Replacement | ₹8,000 | All 6 tires |
| 2026-02-10 | Van-02 | AC Repair | ₹3,500 | Compressor fixed |

### Notes
- Truck-02 is currently IN_SHOP due to recent maintenance
- Shows variety of maintenance types

---

## Fuel Logs (8)

| Date | Vehicle | Liters | Cost | Odometer |
|------|---------|--------|------|----------|
| 2026-02-20 | Van-02 | 45 L | ₹4,500 | 18,500 km |
| 2026-02-19 | Truck-01 | 80 L | ₹8,000 | 45,000 km |
| 2026-02-18 | Van-01 | 40 L | ₹4,000 | 25,000 km |
| 2026-02-17 | Truck-02 | 90 L | ₹9,000 | 32,000 km |
| 2026-02-15 | Van-02 | 42 L | ₹4,200 | 18,150 km |
| 2026-02-14 | Bike-01 | 5 L | ₹500 | 8,000 km |
| 2026-02-12 | Van-01 | 38 L | ₹3,800 | 24,650 km |
| 2026-02-10 | Truck-01 | 85 L | ₹8,500 | 44,500 km |

### Fuel Efficiency Calculations
- Van-01: ~350 km / 78 L = 4.5 km/L
- Van-02: ~350 km / 87 L = 4.0 km/L
- Truck-01: ~500 km / 165 L = 3.0 km/L
- Bike-01: ~200 km / 5 L = 40 km/L

---

## Expenses (5)

| Date | Vehicle | Category | Amount | Description |
|------|---------|----------|--------|-------------|
| 2026-02-01 | Van-01 | Insurance | ₹12,000 | Annual renewal |
| 2026-02-01 | Van-02 | Insurance | ₹12,000 | Annual renewal |
| 2026-02-01 | Truck-01 | Insurance | ₹25,000 | Annual renewal |
| 2026-02-15 | Truck-02 | Toll | ₹500 | Highway toll |
| 2026-02-18 | Van-01 | Parking | ₹200 | Monthly parking |

---

## Dashboard KPIs (Expected Values)

| KPI | Value | Calculation |
|-----|-------|-------------|
| Active Fleet | 1 | Vehicles with ON_TRIP status |
| Maintenance Alerts | 1 | Vehicles with IN_SHOP status |
| Utilization Rate | 20% | ON_TRIP / Total (1/5) |
| Pending Cargo | 1 | Trips with DRAFT status |
| Total Vehicles | 5 | All vehicles |
| Total Drivers | 5 | All drivers |

---

## Seed Script Location

```
prisma/seed.ts
```

## Running Seed

```bash
npx prisma db seed
```

## Resetting Database

```bash
npx prisma db push --force-reset
npx prisma db seed
```

---

## Demo Workflow Script

For video presentation, demonstrate:

1. **Login as Manager** (`admin@fleetflow.com`)
2. **Dashboard**: Show KPIs, explain each metric
3. **Vehicles**: Show list, add new vehicle "Van-03"
4. **Drivers**: Show list, point out Raj's expiring license, Sara's expired license
5. **Create Trip**: 
   - Try to assign Sara (blocked - expired license)
   - Assign Alex to Van-01 with 400kg cargo
   - Show validation (try 600kg - blocked)
6. **Dispatch Trip**: Show status changes
7. **Complete Trip**: Enter end odometer
8. **Maintenance**: Add maintenance for Van-01, show it becomes IN_SHOP
9. **Analytics**: Show fuel efficiency, cost breakdown
10. **Export**: Download CSV

Total demo time: ~5 minutes
