# Code Style & Conventions

## Formatting (Biome)
- Indent: 2 spaces
- Line width: 80 characters
- Semicolons: as needed (no trailing)
- Quotes: single quotes for JS/TS
- Trailing commas: ES5 style
- Arrow parens: always

## Architecture Patterns

### API (Clean Architecture)
- `application/use-cases/` - Business logic by domain
- `application/dto/` - Data Transfer Objects
- `application/validators/` - Zod validation schemas
- `domain/repositories/` - Repository interfaces
- `infrastructure/` - Implementations (database, storage, jobs)
- `presentation/controllers/` - Route handlers (delegate to use-cases)
- `presentation/routes/` - Route definitions

### Web (Feature-based)
- `components/ui/` - Reusable UI primitives
- `routes/` - Page components by feature
- `libs/api/` - API client & service functions
- `libs/hooks/` - Custom React hooks
- `libs/store/` - Zustand stores
- `libs/validation/` - Zod schemas for forms

## Key Conventions
- Use-cases organized by domain (assets, loans, inventory, etc.)
- Controllers never contain business logic
- Repositories abstract database access
- DTOs define API request/response shapes
- Validators use Zod for runtime validation
- Zustand for client-side state
- React Query for server state & caching

## TypeScript
- Strict mode enabled
- No explicit `any` (warn)
- Use `const` over `let`
- No CommonJS imports
