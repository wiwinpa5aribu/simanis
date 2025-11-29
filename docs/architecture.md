# System Architecture - SIMANIS

## Overview
SIMANIS adalah sistem manajemen aset sekolah dengan arsitektur monorepo yang memisahkan frontend dan backend.

## Tech Stack

### Frontend (Root Directory)
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite (rolldown-vite)
- **Styling**: Tailwind CSS 4
- **State**: Zustand (client), TanStack Query (server)
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM 7
- **PWA**: vite-plugin-pwa

### Backend (`/backend`)
- **Framework**: Fastify 4 + TypeScript
- **Database**: MySQL 8.0 + Prisma ORM
- **Auth**: JWT (@fastify/jwt) + Argon2
- **Queue**: BullMQ + Redis
- **Storage**: Local / Cloudflare R2

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   React Frontend                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │    │
│  │  │  Zustand │  │ TanStack │  │ React Hook Form  │  │    │
│  │  │  (State) │  │  Query   │  │     + Zod        │  │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Fastify Backend                     │    │
│  │  ┌────────────────────────────────────────────────┐ │    │
│  │  │              Presentation Layer                 │ │    │
│  │  │  Controllers → Routes → Middleware              │ │    │
│  │  └────────────────────────────────────────────────┘ │    │
│  │  ┌────────────────────────────────────────────────┐ │    │
│  │  │              Application Layer                  │ │    │
│  │  │  Use Cases → DTOs → Validators                  │ │    │
│  │  └────────────────────────────────────────────────┘ │    │
│  │  ┌────────────────────────────────────────────────┐ │    │
│  │  │                Domain Layer                     │ │    │
│  │  │  Entities → Repository Interfaces               │ │    │
│  │  └────────────────────────────────────────────────┘ │    │
│  │  ┌────────────────────────────────────────────────┐ │    │
│  │  │             Infrastructure Layer                │ │    │
│  │  │  Prisma Repos → Storage → Queue → Crypto        │ │    │
│  │  └────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │  MySQL   │   │  Redis   │   │ Storage  │
        │ Database │   │  Queue   │   │  (R2)    │
        └──────────┘   └──────────┘   └──────────┘
```

## Folder Structure

```
simanis/
├── shared/                 # Shared types & constants
│   ├── types/              # Entity & API types
│   └── constants/          # Roles, status constants
├── src/                    # Frontend React
│   ├── components/         # UI components
│   ├── routes/             # Page components
│   └── libs/               # Utilities, hooks, stores
├── backend/                # Backend Fastify
│   ├── src/
│   │   ├── application/    # Use cases, DTOs
│   │   ├── domain/         # Entities, interfaces
│   │   ├── infrastructure/ # Database, services
│   │   └── presentation/   # Controllers, routes
│   └── prisma/             # Database schema
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## Key Design Decisions

### 1. Monorepo Structure
- Frontend di root untuk simplicity
- Backend di `/backend` dengan clean architecture
- Shared types di `/shared` untuk konsistensi

### 2. Clean Architecture (Backend)
- Separation of concerns yang jelas
- Dependency injection via constructor
- Repository pattern untuk database access

### 3. Type Safety
- TypeScript strict mode
- Shared types antara frontend & backend
- Zod validation di kedua sisi

### 4. Offline Support
- PWA dengan service worker
- Optimistic updates dengan TanStack Query
- Local storage untuk draft data
