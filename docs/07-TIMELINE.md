# FleetFlow - Development Timeline

## Hackathon Schedule

| Event | Time |
|-------|------|
| Coding Start | 21 Feb 2026, 09:00 AM IST |
| Coding End | 21 Feb 2026, 05:00 PM IST |
| Video Submission | 21 Feb 2026, 05:30 PM IST |
| **Total Time** | **8 hours** |

---

## Phase 1: Foundation (09:00 - 10:00) - 1 hour

### 09:00 - 09:30 | Project Setup (30 min)
- [x] Initialize Git repo
- [x] Create documentation
- [ ] Initialize Nuxt 3 project
- [ ] Install dependencies:
  - Prisma
  - Tailwind CSS
  - shadcn-vue
  - JWT library
- [ ] Configure Tailwind
- [ ] Add shadcn-vue components

### 09:30 - 10:00 | Database Setup (30 min)
- [ ] Create Prisma schema
- [ ] Generate Prisma client
- [ ] Push schema to SQLite
- [ ] Create seed script
- [ ] Run seed to populate demo data

---

## Phase 2: Core Infrastructure (10:00 - 11:00) - 1 hour

### 10:00 - 10:30 | Authentication (30 min)
- [ ] Create login API route
- [ ] Implement JWT token generation
- [ ] Create auth middleware
- [ ] Create login page
- [ ] Create useAuth composable
- [ ] Test login flow

### 10:30 - 11:00 | Layout & Navigation (30 min)
- [ ] Create default layout
- [ ] Create auth layout
- [ ] Build Navbar component
- [ ] Build Sidebar component
- [ ] Implement route guards
- [ ] Add role-based menu items

---

## Phase 3: Dashboard & Vehicles (11:00 - 12:15) - 1h 15min

### 11:00 - 11:30 | Dashboard (30 min)
- [ ] Create dashboard API (KPIs)
- [ ] Build KPICard component
- [ ] Build dashboard page
- [ ] Add filters (vehicle type, status)
- [ ] Add quick action buttons

### 11:30 - 12:15 | Vehicle Management (45 min)
- [ ] Create vehicle API routes (CRUD)
- [ ] Build VehicleTable component
- [ ] Build VehicleForm component
- [ ] Build vehicles page
- [ ] Add status pills
- [ ] Test CRUD operations

---

## LUNCH BREAK (12:15 - 12:45) - 30 min

Take a break! Stay hydrated.

---

## Phase 4: Drivers & Trips (12:45 - 14:30) - 1h 45min

### 12:45 - 13:30 | Driver Management (45 min)
- [ ] Create driver API routes (CRUD)
- [ ] Build DriverTable component
- [ ] Build DriverForm component
- [ ] Build drivers page
- [ ] Add license expiry warnings
- [ ] Add safety score display

### 13:30 - 14:30 | Trip Dispatcher (60 min)
- [ ] Create trip API routes
- [ ] Implement validation logic:
  - Vehicle availability
  - Driver availability
  - License validity
  - Cargo weight check
- [ ] Build TripForm component
- [ ] Build TripTable component
- [ ] Build TripActions (dispatch/complete/cancel)
- [ ] Implement status auto-updates
- [ ] Test full trip workflow

---

## Phase 5: Financial Features (14:30 - 15:30) - 1 hour

### 14:30 - 15:00 | Maintenance Logs (30 min)
- [ ] Create maintenance API routes
- [ ] Build MaintenanceForm component
- [ ] Build MaintenanceTable component
- [ ] Build maintenance page
- [ ] Implement auto "In Shop" status

### 15:00 - 15:30 | Expenses & Fuel Logs (30 min)
- [ ] Create fuel log API routes
- [ ] Create expense API routes
- [ ] Build expense forms and tables
- [ ] Build expenses page with tabs
- [ ] Add cost summaries

---

## Phase 6: Analytics & Polish (15:30 - 16:45) - 1h 15min

### 15:30 - 16:00 | Analytics (30 min)
- [ ] Create analytics API routes
- [ ] Build fuel efficiency chart
- [ ] Build cost breakdown chart
- [ ] Build analytics page
- [ ] Implement CSV export

### 16:00 - 16:45 | Polish & Bug Fixes (45 min)
- [ ] Fix any bugs discovered
- [ ] Improve UI/UX
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all workflows
- [ ] Clean up code

---

## Phase 7: Submission (16:45 - 17:30) - 45 min

### 16:45 - 17:00 | Final Commit (15 min)
- [ ] Final code review
- [ ] Update README with screenshots
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Verify repo is public

### 17:00 - 17:30 | Video Recording (30 min)
- [ ] Prepare demo script
- [ ] Record video showing:
  - Login with different roles
  - Dashboard KPIs
  - Create vehicle
  - Create driver
  - Create and dispatch trip
  - Complete trip
  - Add maintenance
  - View analytics
- [ ] Upload video
- [ ] Submit video link

---

## Priority Order (If Running Out of Time)

| Priority | Feature | Why |
|----------|---------|-----|
| 1 | Login + Dashboard | Core requirement |
| 2 | Vehicles CRUD | Foundation for trips |
| 3 | Drivers CRUD | Required for trips |
| 4 | Trip Dispatcher | Main business logic |
| 5 | Maintenance | Demonstrates auto-logic |
| 6 | Expenses | Financial tracking |
| 7 | Analytics | Nice to have |

---

## Checkpoints

| Time | Checkpoint | Status |
|------|------------|--------|
| 10:00 | Project running locally | - |
| 11:00 | Can login and see dashboard | - |
| 12:15 | Vehicles CRUD working | - |
| 13:30 | Drivers CRUD working | - |
| 14:30 | Full trip workflow working | - |
| 15:30 | Maintenance + expenses working | - |
| 16:45 | All features complete | - |
| 17:00 | Code pushed to GitHub | - |
| 17:30 | Video submitted | - |

---

## Emergency Fallback

If significantly behind schedule:

1. **Skip analytics charts** - Use simple tables instead
2. **Skip CSV export** - Just display data
3. **Simplify RBAC** - Just show role, don't enforce
4. **Skip filters** - Show all data
5. **Reduce seed data** - Minimum viable demo
