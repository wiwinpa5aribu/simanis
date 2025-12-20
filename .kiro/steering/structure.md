# Project Structure

## Architecture Pattern
**Feature-First (Colocation)** - Each dashboard module contains its own components, keeping related code together.

## Directory Layout
```
app/
├── (dashboard)/           # Dashboard route group
│   ├── layout.tsx         # Shared dashboard layout (sidebar, header)
│   ├── page.tsx           # Dashboard home
│   └── [module]/          # Feature modules (aset, lokasi, mutasi, etc.)
│       ├── page.tsx       # Server Component - data fetching
│       ├── loading.tsx    # Loading UI
│       └── components/    # Module-specific components
│           └── *-content.tsx  # Main client component

components/
├── ui/                    # shadcn/ui primitives (Button, Card, Dialog, etc.)
├── dashboard/             # Shared dashboard components (charts, cards)
├── app-sidebar.tsx        # Main navigation sidebar
└── dashboard-header.tsx   # Top header with breadcrumbs

lib/
├── services/              # Service layer (database operations)
│   └── [entity]-service.ts
├── validations/           # Zod schemas for each entity
│   └── [entity].ts
├── db.ts                  # Prisma client instance
├── utils.ts               # Utility functions (cn, formatters)
└── constants.ts           # App-wide constants

types/                     # TypeScript type definitions
prisma/
├── schema.prisma          # Database schema (source of truth)
├── migrations/            # Database migrations
└── seed.ts                # Seed data script

docs/adr/                  # Architecture Decision Records
```

## Key Patterns

### Data Flow
1. `page.tsx` (Server Component) → calls service layer
2. Service (`lib/services/`) → queries Prisma, validates with Zod
3. Data passed to `*-content.tsx` (Client Component) via props

### Component Conventions
- Server Components: `page.tsx` files - handle data fetching
- Client Components: Use `"use client"` directive - handle interactivity
- Content components: Named `[module]-content.tsx` - main interactive wrapper

### Service Layer Rules
- UI must NOT import from `lib/data.ts` directly
- All database access goes through `lib/services/`
- Services validate output with Zod schemas before returning

### Validation
- Schemas live in `lib/validations/[entity].ts`
- Types inferred from Zod: `type TEntity = z.infer<typeof entitySchema>`
- Used for both form validation and database output validation
