# FleetFlow - Tech Stack

## Overview

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Nuxt 4 | Latest |
| **Frontend** | Vue 3 + Composition API | 3.x |
| **UI Components** | shadcn-vue | Latest |
| **Styling** | Tailwind CSS | 3.x |
| **Database** | SQLite | 3.x |
| **ORM** | Prisma | 5.x |
| **Authentication** | JWT (JSON Web Tokens) | - |
| **Language** | TypeScript | 5.x |
| **Charts** | Vue Chart.js or similar | - |

## Why These Choices?

### Nuxt 4 (Full-Stack Framework)
- **Single codebase** for frontend and backend
- **Server routes** (`/server/api/`) work like Express.js
- **No CORS issues** - same origin for API calls
- **SSR/SSG** capabilities for performance
- **Auto-imports** reduce boilerplate
- Built on **Nitro** - powerful server engine

### Vue 3 + Composition API
- Familiar framework (team expertise)
- Reactive state management
- Better TypeScript support than Options API
- Composables for reusable logic

### shadcn-vue
- Pre-built, customizable components
- Not a component library - you own the code
- Tailwind-based, easy to modify
- Includes: Tables, Forms, Modals, Dropdowns, etc.

### Tailwind CSS
- Utility-first, rapid prototyping
- No context switching between CSS files
- Easy responsive design
- Works perfectly with shadcn-vue

### SQLite + Prisma
- **SQLite:** Zero-config, file-based database
- **Prisma:** Type-safe ORM with auto-generated types
- **Relations:** Perfect for linked data (vehicles ↔ trips ↔ drivers)
- **Migrations:** Easy schema changes
- **Seeding:** Built-in support for demo data

### JWT Authentication
- Stateless authentication
- Easy to implement
- Works well with API routes
- Role information embedded in token

## Architecture Diagram

```text
┌─────────────────────────────────────────────────────────┐
│                      NUXT 4 APP                         │
├─────────────────────────────────────────────────────────┤
│  PAGES (Vue 3)                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Login   │ │Dashboard│ │Vehicles │ │ Trips   │  ...  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────┤
│  COMPONENTS (shadcn-vue + Custom)                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Tables  │ │ Forms   │ │ Modals  │ │ Charts  │  ...  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────┤
│  COMPOSABLES                                            │
│  ┌─────────────┐ ┌─────────────┐                       │
│  │ useAuth.ts  │ │ useApi.ts   │                       │
│  └─────────────┘ └─────────────┘                       │
├─────────────────────────────────────────────────────────┤
│  SERVER (/server)                      │ NITRO ENGINE  │
│  ┌─────────────────────────────────┐   │               │
│  │ /api/auth/*     (login, me)     │   │               │
│  │ /api/vehicles/* (CRUD)          │   │               │
│  │ /api/drivers/*  (CRUD)          │   │               │
│  │ /api/trips/*    (CRUD + logic)  │   │               │
│  │ /api/maintenance/*              │   │               │
│  │ /api/analytics/*                │   │               │
│  └─────────────────────────────────┘   │               │
│  ┌─────────────────────────────────┐   │               │
│  │ /middleware/auth.ts (JWT check) │   │               │
│  └─────────────────────────────────┘   │               │
├─────────────────────────────────────────────────────────┤
│  PRISMA ORM                                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ schema.prisma → Generated Client → Type Safety  │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  SQLite DATABASE (dev.db)                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Users │ Vehicles │ Drivers │ Trips │ Expenses  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Development Tools

| Tool | Purpose |
|------|---------|
| **bun** | Package manager and runtime |
| **Prisma Studio** | GUI for database inspection |
| **Vue DevTools** | Browser extension for debugging |
| **TypeScript** | Type checking and intellisense |

## Deployment (Post-Hackathon)

For the hackathon, we'll run locally. 

**Note:** SQLite is a file-based database and requires persistent storage. It works on local machines and platforms like Railway, Render, or Fly.io. For serverless platforms (Vercel, Netlify), switch Prisma to PostgreSQL (one-line provider change: `provider = "postgresql"`).

Deployment options:
- **Railway** - Supports SQLite with persistent storage
- **Render** - Supports SQLite with persistent disk
- **Fly.io** - Supports SQLite with volumes
- **Vercel/Netlify** - Requires PostgreSQL (change Prisma provider)
