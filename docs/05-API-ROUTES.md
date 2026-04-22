# FleetFlow - API Routes

## Base URL
```text
http://localhost:3000/api
```

## Authentication
All protected routes require the auth cookie set by login (`HttpOnly`, `SameSite=Lax`, `Secure` in production).

`/api/auth/register` is public only when `ALLOW_SELF_REGISTRATION=true`; otherwise it requires a logged-in MANAGER.

---

## Auth Routes

### POST `/api/auth/login`
Authenticate user and set auth cookie.

**Request:**
```json
{
  "email": "admin@fleetflow.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@fleetflow.com",
    "name": "Admin User",
    "role": "MANAGER"
  }
}
```

**Errors:**
- 401: Invalid credentials

---

### POST `/api/auth/register`
Create new user account. New users are always created with `DISPATCHER` role.

**Request:**
```json
{
  "email": "user@fleetflow.com",
  "password": "password123",
  "name": "New User"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "user@fleetflow.com",
  "name": "New User",
  "role": "DISPATCHER"
}
```

**Access Rules:**
- Public only when `ALLOW_SELF_REGISTRATION=true`
- Otherwise requires a logged-in `MANAGER`

---

### GET `/api/auth/me`
Get current user info.

**Response (200):**
```json
{
  "id": "uuid",
  "email": "admin@fleetflow.com",
  "name": "Admin User",
  "role": "MANAGER"
}
```

---

## Vehicle Routes

### GET `/api/vehicles`
List all vehicles.

**Query Params:**
- `type`: VAN | TRUCK | BIKE
- `status`: AVAILABLE | ON_TRIP | IN_SHOP | RETIRED
- `region`: string
- `search`: string (name or license plate)

**Response (200):**
```json
{
  "vehicles": [
    {
      "id": "uuid",
      "name": "Van-01",
      "licensePlate": "GJ01AB1234",
      "type": "VAN",
      "maxCapacity": 500,
      "odometer": 15000,
      "status": "AVAILABLE",
      "region": "Ahmedabad",
      "createdAt": "2026-02-21T00:00:00Z"
    }
  ],
  "total": 1
}
```

---

### POST `/api/vehicles`
Create new vehicle.

**Request:**
```json
{
  "name": "Van-01",
  "licensePlate": "GJ01AB1234",
  "type": "VAN",
  "maxCapacity": 500,
  "odometer": 0,
  "region": "Ahmedabad"
}
```

**Response (201):** Vehicle object

---

### GET `/api/vehicles/:id`
Get single vehicle with relations.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Van-01",
  "licensePlate": "GJ01AB1234",
  "type": "VAN",
  "maxCapacity": 500,
  "odometer": 15000,
  "status": "AVAILABLE",
  "region": "Ahmedabad",
  "trips": [...],
  "maintenanceLogs": [...],
  "fuelLogs": [...],
  "totalCost": 25000
}
```

---

### PUT `/api/vehicles/:id`
Update vehicle.

**Request:**
```json
{
  "name": "Van-01 Updated",
  "status": "RETIRED"
}
```

**Response (200):** Updated vehicle object

---

### DELETE `/api/vehicles/:id`
Delete vehicle.

**Response (200):**
```json
{ "message": "Vehicle deleted" }
```

**Errors:**
- 400: Cannot delete vehicle with active trips

---

## Driver Routes

### GET `/api/drivers`
List all drivers.

**Query Params:**
- `status`: ON_DUTY | ON_TRIP | OFF_DUTY | SUSPENDED
- `category`: VAN | TRUCK | BIKE
- `search`: string

**Response (200):**
```json
{
  "drivers": [
    {
      "id": "uuid",
      "name": "Alex Kumar",
      "email": "alex@fleetflow.com",
      "licenseNumber": "DL1234567890",
      "licenseExpiry": "2027-06-15T00:00:00Z",
      "licenseCategory": "VAN",
      "status": "ON_DUTY",
      "safetyScore": 95,
      "isLicenseValid": true,
      "isExpiringSoon": false
    }
  ],
  "total": 1
}
```

---

### POST `/api/drivers`
Create new driver.

**Request:**
```json
{
  "name": "Alex Kumar",
  "email": "alex@fleetflow.com",
  "phone": "+91 9876543210",
  "licenseNumber": "DL1234567890",
  "licenseExpiry": "2027-06-15",
  "licenseCategory": "VAN"
}
```

**Response (201):** Driver object

---

### PUT `/api/drivers/:id`
Update driver.

**Request:**
```json
{
  "status": "SUSPENDED",
  "safetyScore": 70
}
```

**Response (200):** Updated driver object

---

### DELETE `/api/drivers/:id`
Delete driver.

**Errors:**
- 400: Cannot delete driver with active trips

---

## Trip Routes

### GET `/api/trips`
List all trips.

**Query Params:**
- `status`: DRAFT | DISPATCHED | COMPLETED | CANCELLED
- `vehicleId`: uuid
- `driverId`: uuid
- `dateFrom`: ISO date
- `dateTo`: ISO date

**Response (200):**
```json
{
  "trips": [
    {
      "id": "uuid",
      "origin": "Ahmedabad",
      "destination": "Surat",
      "cargoWeight": 450,
      "cargoDescription": "Electronics",
      "status": "DISPATCHED",
      "vehicle": {
        "id": "uuid",
        "name": "Van-01",
        "licensePlate": "GJ01AB1234"
      },
      "driver": {
        "id": "uuid",
        "name": "Alex Kumar"
      },
      "startedAt": "2026-02-21T09:00:00Z"
    }
  ],
  "total": 1
}
```

---

### POST `/api/trips`
Create new trip.

**Request:**
```json
{
  "vehicleId": "uuid",
  "driverId": "uuid",
  "origin": "Ahmedabad",
  "destination": "Surat",
  "cargoWeight": 450,
  "cargoDescription": "Electronics"
}
```

**Validation Rules:**
1. Vehicle must be AVAILABLE
2. Driver must be ON_DUTY
3. Driver license must not be expired
4. Driver licenseCategory must support vehicle type
5. cargoWeight <= vehicle.maxCapacity

**Response (201):** Trip object

**Errors:**
- 400: Validation errors with details

---

### POST `/api/trips/:id/dispatch`
Dispatch a draft trip.

**Request:** Empty body

**Side Effects:**
- Trip.status → DISPATCHED
- Trip.startedAt → now()
- Vehicle.status → ON_TRIP
- Driver.status → ON_TRIP

**Response (200):** Updated trip object

---

### POST `/api/trips/:id/complete`
Complete a dispatched trip.

**Request:**
```json
{
  "endOdometer": 15350
}
```

**Side Effects:**
- Trip.status → COMPLETED
- Trip.completedAt → now()
- Vehicle.odometer → endOdometer
- Vehicle.status → AVAILABLE
- Driver.status → ON_DUTY

**Response (200):** Updated trip object

---

### POST `/api/trips/:id/cancel`
Cancel a trip.

**Side Effects:**
- Trip.status → CANCELLED
- If was DISPATCHED: Vehicle.status → AVAILABLE and Driver.status → ON_DUTY

**Response (200):** Updated trip object

---

## Maintenance Routes

### GET `/api/maintenance`
List all maintenance logs.

**Query Params:**
- `vehicleId`: uuid
- `dateFrom`: ISO date
- `dateTo`: ISO date

**Response (200):**
```json
{
  "logs": [
    {
      "id": "uuid",
      "vehicleId": "uuid",
      "vehicle": {
        "name": "Van-01",
        "licensePlate": "GJ01AB1234"
      },
      "description": "Oil Change",
      "cost": 2500,
      "date": "2026-02-20T00:00:00Z",
      "notes": "Used synthetic oil"
    }
  ],
  "total": 1,
  "totalCost": 2500
}
```

---

### POST `/api/maintenance`
Create maintenance log.

**Request:**
```json
{
  "vehicleId": "uuid",
  "description": "Oil Change",
  "cost": 2500,
  "date": "2026-02-20",
  "notes": "Used synthetic oil"
}
```

**Side Effects:**
- Vehicle.status → IN_SHOP

**Response (201):** Maintenance log object

---

## Fuel Log Routes

### GET `/api/fuel-logs`
List all fuel logs.

**Query Params:**
- `vehicleId`: uuid
- `dateFrom`: ISO date
- `dateTo`: ISO date

**Response (200):**
```json
{
  "logs": [
    {
      "id": "uuid",
      "vehicleId": "uuid",
      "vehicle": {
        "name": "Van-01"
      },
      "liters": 45.5,
      "cost": 4550,
      "odometer": 15350,
      "date": "2026-02-21T00:00:00Z"
    }
  ],
  "total": 1,
  "totalLiters": 45.5,
  "totalCost": 4550
}
```

---

### POST `/api/fuel-logs`
Create fuel log.

**Request:**
```json
{
  "vehicleId": "uuid",
  "liters": 45.5,
  "cost": 4550,
  "odometer": 15350,
  "date": "2026-02-21"
}
```

**Response (201):** Fuel log object

---

## Expense Routes

### GET `/api/expenses`
List all expenses.

**Query Params:**
- `vehicleId`: uuid
- `category`: string
- `dateFrom`: ISO date
- `dateTo`: ISO date

---

### POST `/api/expenses`
Create expense.

**Request:**
```json
{
  "vehicleId": "uuid",
  "category": "Insurance",
  "amount": 15000,
  "description": "Annual insurance renewal",
  "date": "2026-02-01"
}
```

---

## Analytics Routes

### GET `/api/analytics/dashboard`
Get dashboard KPIs.

**Response (200):**
```json
{
  "activeFleet": 3,
  "maintenanceAlerts": 1,
  "utilizationRate": 60,
  "pendingCargo": 2,
  "totalVehicles": 5,
  "totalDrivers": 4
}
```

---

### GET `/api/analytics/fuel-efficiency`
Get fuel efficiency per vehicle.

**Response (200):**
```json
{
  "data": [
    {
      "vehicleId": "uuid",
      "vehicleName": "Van-01",
      "totalKm": 5000,
      "totalLiters": 500,
      "efficiency": 10.0
    }
  ]
}
```

---

### GET `/api/analytics/costs`
Get cost breakdown.

**Response (200):**
```json
{
  "totalFuel": 45500,
  "totalMaintenance": 25000,
  "totalOther": 15000,
  "byVehicle": [
    {
      "vehicleId": "uuid",
      "vehicleName": "Van-01",
      "fuel": 15000,
      "maintenance": 5000,
      "other": 3000,
      "total": 23000
    }
  ]
}
```

---

### GET `/api/analytics/export`
Export data as CSV.

**Query Params:**
- `type`: vehicles | drivers | trips | expenses

**Response:** CSV file download
