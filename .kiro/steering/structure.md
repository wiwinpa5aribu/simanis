# Project Structure

Monorepo with frontend at root and backend in `/backend`.

## Frontend (`/src`)

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (button, input, card, etc.)
│   ├── layout/         # App layout, navigation, protected routes
│   ├── dashboard/      # Dashboard-specific components
│   ├── filters/        # Filter bar components
│   ├── table/          # Data table components
│   └── uploads/        # File upload components
├── routes/             # Page components (file-based routing pattern)
├── libs/
│   ├── api/            # API client and endpoint functions
│   ├── auth/           # Permission utilities
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Zustand stores
│   ├── ui/             # UI utilities (toast)
│   ├── utils/          # Helper functions
│   └── validation/     # Zod schemas for forms
├── constants/          # App constants
├── styles/             # Global CSS
└── test/               # Test setup and utilities
```

## Backend (`/backend/src`)

Clean Architecture pattern:

```
backend/src/
├── main.ts                    # Entry point, Fastify setup
├── application/               # Application layer
│   ├── dto/                   # Data Transfer Objects
│   ├── use-cases/             # Business logic (organized by domain)
│   │   ├── assets/
│   │   ├── auth/
│   │   ├── loans/
│   │   └── ...
│   └── validators/            # Zod validation schemas
├── domain/                    # Domain layer
│   ├── entities/              # Domain entities
│   ├── repositories/          # Repository interfaces
│   └── value-objects/         # Value objects
├── infrastructure/            # Infrastructure layer
│   ├── crypto/                # JWT, password services
│   ├── database/
│   │   └── repositories/      # Prisma repository implementations
│   ├── jobs/                  # Background job processors
│   ├── queue/                 # Job queue setup
│   └── storage/               # File storage (local, R2)
├── presentation/              # Presentation layer
│   ├── controllers/           # Route handlers
│   ├── middleware/            # Auth, RBAC, error handling, logging
│   └── routes/                # Route definitions
└── shared/                    # Shared utilities
    ├── config/                # Environment config
    ├── errors/                # Custom error classes
    ├── logger/                # Winston logger
    └── utils/                 # Pagination, QR code, response utils
```

## Key Conventions

- Controllers call use-cases, use-cases call repositories
- Repository interfaces in `domain/`, implementations in `infrastructure/`
- Validation at controller level using Zod schemas
- Custom error classes for different HTTP status codes
- Consistent API response format via `createSuccessResponse()`
