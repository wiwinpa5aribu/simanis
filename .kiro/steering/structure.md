# Project Structure

```
simanis/
├── shared/                    # Shared code between frontend & backend
│   ├── types/                 # Entity types, API types
│   └── constants/             # Roles, status enums
│
├── src/                       # Frontend (React)
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base components (button, input, etc.)
│   │   ├── layout/            # Layout components
│   │   ├── table/             # DataTable component
│   │   └── filters/           # Filter components
│   ├── routes/                # Page components (route-based)
│   ├── libs/
│   │   ├── api/               # API client functions
│   │   ├── store/             # Zustand stores
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── validation/        # Zod schemas for forms
│   ├── contexts/              # React contexts
│   └── test/                  # Test setup and utilities
│
├── backend/                   # Backend (Fastify) - Clean Architecture
│   ├── src/
│   │   ├── presentation/      # HTTP layer
│   │   │   ├── controllers/   # Request handlers
│   │   │   ├── routes/        # Route definitions
│   │   │   └── middleware/    # Auth, RBAC, error handling
│   │   ├── application/       # Business logic
│   │   │   ├── use-cases/     # Use case implementations
│   │   │   ├── dto/           # Data transfer objects
│   │   │   └── validators/    # Zod validators
│   │   ├── domain/            # Core domain
│   │   │   ├── entities/      # Domain entities
│   │   │   └── repositories/  # Repository interfaces
│   │   ├── infrastructure/    # External services
│   │   │   ├── database/      # Prisma repository implementations
│   │   │   ├── storage/       # File storage (local/R2)
│   │   │   ├── crypto/        # JWT, password services
│   │   │   └── jobs/          # BullMQ job processors
│   │   └── shared/            # Shared utilities
│   │       ├── config/        # Configuration
│   │       ├── errors/        # Custom error classes
│   │       └── utils/         # Helpers (pagination, response)
│   ├── prisma/                # Database
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Migration files
│   │   └── seed.ts            # Database seeder
│   └── tests/                 # Backend tests
│
├── docs/                      # Documentation
└── scripts/                   # Setup and utility scripts
```

## Architecture Pattern (Backend)
The backend follows Clean Architecture with 4 layers:
1. **Presentation**: HTTP concerns (controllers, routes, middleware)
2. **Application**: Business logic (use cases, DTOs, validators)
3. **Domain**: Core entities and repository interfaces
4. **Infrastructure**: External implementations (database, storage, queues)

## Path Aliases
- `@/` → `src/` (frontend)
- `@shared/` → `shared/` (shared types)
