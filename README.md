# FleetFlow - Modular Fleet & Logistics Management System

> Hackathon: **Odoo x Gujarat Vidyapith Hackathon '26**

A centralized, rule-based digital hub that replaces inefficient manual logbooks to optimize delivery fleet lifecycle, monitor driver safety, and track financial performance.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Nuxt 3 (Full-stack) |
| Frontend | Vue 3 + shadcn-vue + Tailwind CSS |
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
- **RBAC** - Role-based access control (Manager, Dispatcher, Safety Officer, Financial Analyst)

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Manager | admin@fleetflow.com | password123 |
| Dispatcher | dispatch@fleetflow.com | password123 |
| Safety Officer | safety@fleetflow.com | password123 |
| Financial Analyst | finance@fleetflow.com | password123 |

## Documentation

- [Problem Statement](./docs/01-PROBLEM-STATEMENT.md)
- [Tech Stack](./docs/02-TECH-STACK.md)
- [Database Schema](./docs/03-DATABASE-SCHEMA.md)
- [Pages Specification](./docs/04-PAGES.md)
- [API Routes](./docs/05-API-ROUTES.md)
- [Folder Structure](./docs/06-FOLDER-STRUCTURE.md)
- [Development Timeline](./docs/07-TIMELINE.md)
- [Seed Data](./docs/08-SEED-DATA.md)

## Team

- **Team Leader**: Atulya Rai
- **Mentor**: Bharat Singh Rathore ([@bsra-odoo](https://github.com/bsra-odoo))

## License

MIT
