# FleetFlow - Modular Fleet & Logistics Management System

> Hackathon: **Odoo x Gujarat Vidyapith Hackathon '26**

A centralized, rule-based digital hub that optimizes delivery fleet lifecycle, monitors driver safety, and tracks financial performance.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Nuxt 3 (Full-stack) |
| Frontend | Vue 3 + Tailwind CSS |
| Database | SQLite + Prisma ORM |
| Authentication | JWT |
| Language | TypeScript |

## Features

- **Dashboard** - Real-time KPIs (Active Fleet, Maintenance Alerts, Utilization Rate)
- **Vehicle Management** - CRUD operations with status tracking
- **Driver Management** - License compliance and safety scores
- **Trip Dispatcher** - Cargo validation, auto-status updates
- **Maintenance Logs** - Auto vehicle status updates
- **Expense Tracking** - Fuel logs and operational costs
- **Analytics** - Fuel efficiency, ROI, CSV exports
- **RBAC** - Role-based access control

## Quick Start

```bash
# Install dependencies
bun install

# Setup database
bunx prisma generate
bunx prisma db push

# Run development server
bun run dev
```

Open http://localhost:3000

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Manager | admin@fleetflow.com | password123 |
| Dispatcher | dispatch@fleetflow.com | password123 |
| Safety Officer | safety@fleetflow.com | password123 |
| Financial Analyst | finance@fleetflow.com | password123 |

## Documentation

See `docs/` folder for detailed documentation.

## Team

- **Team Leader:** Atulya Rai
- **Mentor:** Bharat Singh Rathore ([@bsra-odoo](https://github.com/bsra-odoo))

## License

MIT
