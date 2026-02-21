# FleetFlow - Database Schema

## Entity Relationship Diagram (Text)

```text
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    USER      │       │   VEHICLE    │       │    DRIVER    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ email        │       │ name         │       │ name         │
│ password     │       │ licensePlate │       │ email        │
│ name         │       │ type         │       │ licenseNumber│
│ role         │       │ maxCapacity  │       │ licenseExpiry│
│ createdAt    │       │ odometer     │       │ licenseCategory
└──────────────┘       │ status       │       │ status       │
                       │ region       │       │ safetyScore  │
                       └──────┬───────┘       └──────┬───────┘
                              │                      │
                              │ 1:N                  │ 1:N
                              ▼                      ▼
                       ┌──────────────────────────────┐
                       │           TRIP               │
                       ├──────────────────────────────┤
                       │ id (PK)                      │
                       │ vehicleId (FK) ──────────────┼─→ Vehicle
                       │ driverId (FK) ───────────────┼─→ Driver
                       │ origin                       │
                       │ destination                  │
                       │ cargoWeight                  │
                       │ status                       │
                       │ startOdometer                │
                       │ endOdometer                  │
                       └──────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ MAINTENANCE  │       │   FUEL_LOG   │       │   EXPENSE    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ vehicleId(FK)│       │ vehicleId(FK)│       │ vehicleId(FK)│
│ description  │       │ liters       │       │ category     │
│ cost         │       │ cost         │       │ amount       │
│ date         │       │ odometer     │       │ description  │
│ notes        │       │ date         │       │ date         │
└──────────────┘       └──────────────┘       └──────────────┘
      │                       │                      │
      └───────────────────────┴──────────────────────┘
                              │
                              ▼
                       All linked to VEHICLE (1:N)
```

## Enums

### VehicleStatus

| Value | Description |
|-------|-------------|
| `AVAILABLE` | Ready for dispatch |
| `ON_TRIP` | Currently on a trip |
| `IN_SHOP` | Under maintenance |
| `RETIRED` | Out of service permanently |

### VehicleType

| Value | Description |
|-------|-------------|
| `TRUCK` | Heavy goods vehicle (2000+ kg) |
| `VAN` | Medium capacity (500-2000 kg) |
| `BIKE` | Light delivery (up to 50 kg) |

### DriverStatus

| Value | Description |
|-------|-------------|
| `ON_DUTY` | Available for assignment |
| `OFF_DUTY` | Not working |
| `SUSPENDED` | Cannot be assigned (compliance issue) |

### TripStatus

| Value | Description |
|-------|-------------|
| `DRAFT` | Created but not dispatched |
| `DISPATCHED` | In progress |
| `COMPLETED` | Successfully finished |
| `CANCELLED` | Aborted |

### UserRole

| Value | Access Level |
|-------|--------------|
| `MANAGER` | Full access to all features |
| `DISPATCHER` | Trips, view vehicles/drivers |
| `SAFETY_OFFICER` | Drivers, safety metrics |
| `FINANCIAL_ANALYST` | Expenses, analytics |

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// ============ ENUMS ============

enum VehicleStatus {
  AVAILABLE
  ON_TRIP
  IN_SHOP
  RETIRED
}

enum VehicleType {
  TRUCK
  VAN
  BIKE
}

enum DriverStatus {
  ON_DUTY
  OFF_DUTY
  SUSPENDED
}

enum TripStatus {
  DRAFT
  DISPATCHED
  COMPLETED
  CANCELLED
}

enum UserRole {
  MANAGER
  DISPATCHER
  SAFETY_OFFICER
  FINANCIAL_ANALYST
}

// ============ MODELS ============

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      UserRole @default(DISPATCHER)
  createdAt DateTime @default(now())
}

model Vehicle {
  id           String        @id @default(uuid())
  name         String
  licensePlate String        @unique
  type         VehicleType   @default(VAN)
  maxCapacity  Int
  odometer     Int           @default(0)
  status       VehicleStatus @default(AVAILABLE)
  region       String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  trips           Trip[]
  maintenanceLogs Maintenance[]
  fuelLogs        FuelLog[]
  expenses        Expense[]
}

model Driver {
  id              String       @id @default(uuid())
  name            String
  email           String       @unique
  phone           String?
  licenseNumber   String       @unique
  licenseExpiry   DateTime
  licenseCategory String
  status          DriverStatus @default(ON_DUTY)
  safetyScore     Int          @default(100)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  trips Trip[]
}

model Trip {
  id               String     @id @default(uuid())
  origin           String
  destination      String
  cargoWeight      Int
  cargoDescription String?
  status           TripStatus @default(DRAFT)
  startOdometer    Int?
  endOdometer      Int?
  startedAt        DateTime?
  completedAt      DateTime?
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  vehicleId String
  vehicle   Vehicle @relation(fields: [vehicleId], references: [id])

  driverId String
  driver   Driver @relation(fields: [driverId], references: [id])
}

model Maintenance {
  id          String   @id @default(uuid())
  description String
  cost        Float
  date        DateTime @default(now())
  notes       String?
  createdAt   DateTime @default(now())

  vehicleId String
  vehicle   Vehicle @relation(fields: [vehicleId], references: [id])
}

model FuelLog {
  id        String   @id @default(uuid())
  liters    Float
  cost      Float
  odometer  Int
  date      DateTime @default(now())
  createdAt DateTime @default(now())

  vehicleId String
  vehicle   Vehicle @relation(fields: [vehicleId], references: [id])
}

model Expense {
  id          String   @id @default(uuid())
  category    String
  amount      Float
  description String?
  date        DateTime @default(now())
  createdAt   DateTime @default(now())

  vehicleId String
  vehicle   Vehicle @relation(fields: [vehicleId], references: [id])
}
```

## Indexes & Constraints

| Model | Constraint | Purpose |
|-------|------------|---------|
| User | `email @unique` | No duplicate accounts |
| Vehicle | `licensePlate @unique` | Unique identifier |
| Driver | `email @unique` | No duplicate accounts |
| Driver | `licenseNumber @unique` | Legal requirement |
| Trip | `vehicleId` FK | Link to vehicle |
| Trip | `driverId` FK | Link to driver |
| All expense types | `vehicleId` FK | Track costs per vehicle |

## Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| Vehicle → Trip | 1:N | One vehicle can have many trips |
| Driver → Trip | 1:N | One driver can have many trips |
| Vehicle → Maintenance | 1:N | One vehicle has maintenance history |
| Vehicle → FuelLog | 1:N | One vehicle has fuel history |
| Vehicle → Expense | 1:N | One vehicle has expense history |
