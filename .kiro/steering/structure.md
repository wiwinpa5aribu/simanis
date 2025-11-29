# Project Structure

## Monorepo Layout
```
simanis/
├── shared/                 # Shared types & constants (frontend + backend)
├── src/                    # Frontend React application
├── backend/                # Backend Fastify API
├── docs/                   # Documentation
├── scripts/                # Utility scripts
└── public/                 # Static assets
```

## Frontend Structure (`src/`)
```
src/
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Input, Card, etc.)
│   ├── layout/             # App shell, navigation, protected routes
│   ├── dashboard/          # Dashboard-specific components
│   ├── filters/            # Filter bar components
│   ├── table/              # DataTable component
│   └── uploads/            # File upload components
├── routes/                 # Page components organized by feature
│   ├── assets/             # Asset CRUD pages
│   ├── loans/              # Loan management pages
│   ├── inventory/          # Inventory check pages
│   ├── depreciation/       # Depreciation pages
│   ├── reports/            # Report generation
│   └── auth/               # Login page
├── libs/
│   ├── api/                # API client functions per domain
│   ├── store/              # Zustand stores (auth, filters, favorites)
│   ├── hooks/              # Custom React hooks
│   ├── validation/         # Zod schemas per domain
│   ├── utils/              # Utility functions
│   └── auth/               # Permission helpers
├── contexts/               # React contexts (NetworkContext)
├── constants/              # App constants
└── test/                   # Test setup and property tests
```

## Backend Structure (`backend/src/`)
Uses Clean Architecture / Layered Architecture:

```
backend/src/
├── application/            # Application layer
│   ├── dto/                # Data Transfer Objects
│   ├── use-cases/          # Business logic organized by domain
│   │   ├── assets/
│   │   ├── auth/
│   │   ├── loans/
│   │   └── ...
│   └── validators/         # Zod validation schemas
├── domain/                 # Domain layer
│   ├── entities/           # Domain entities (currently using Prisma types)
│   └── repositories/       # Repository interfaces
├── infrastructure/         # Infrastructure layer
│   ├── database/
│   │   └── repositories/   # Repository implementations
│   ├── crypto/             # JWT and password services
│   ├── storage/            # File storage (local, R2)
│   ├── jobs/               # Background job processors
│   └── queue/              # Queue configuration
├── presentation/           # Presentation layer
│   ├── controllers/        # HTTP request handlers
│   ├── middleware/         # Auth, RBAC, error handling, logging
│   └── routes/             # Route definitions
├── shared/                 # Shared utilities
│   ├── config/             # Environment configuration
│   ├── errors/             # Custom error classes
│   ├── logger/             # Winston logger setup
│   └── utils/              # Pagination, response helpers
└── main.ts                 # Application entry point
```

## Key Conventions
- Controllers instantiate use cases with repository implementations
- Repository interfaces in `domain/`, implementations in `infrastructure/`
- Validation happens at controller level using Zod schemas
- Custom error classes extend base `AppError` for consistent error handling
- API responses use `createSuccessResponse()` utility for consistent format
