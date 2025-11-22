# Project Structure & Architecture

## Folder Organization

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── filters/        # Filter components
│   ├── layout/         # Layout components (AppLayout, ProtectedRoute)
│   ├── table/          # Table components
│   ├── ui/             # Base UI components (shadcn-style)
│   └── uploads/        # File upload components
├── libs/               # Core libraries and utilities
│   ├── api/           # API client and endpoints
│   │   └── mock/      # Mock data for development
│   ├── auth/          # Authentication utilities
│   ├── hooks/         # Custom React hooks
│   ├── store/         # Zustand stores
│   ├── ui/            # UI utilities (toast)
│   ├── utils/         # General utilities
│   └── validation/    # Zod schemas
├── routes/            # Page components (route-based)
│   ├── assets/
│   ├── audit/
│   ├── auth/
│   ├── dashboard/
│   ├── depreciation/
│   ├── inventory/
│   ├── loans/
│   ├── profile/
│   └── reports/
├── constants/         # Application constants
├── styles/            # Global styles
├── test/              # Test setup and utilities
├── App.tsx            # Root component with routing
└── main.tsx           # Application entry point
```

## Architecture Patterns

### Component Organization
- **UI Components** (`components/ui/`): Base reusable components, shadcn-style
- **Feature Components** (`components/[feature]/`): Feature-specific components
- **Page Components** (`routes/[feature]/`): Full page components with routing

### API Layer
- **Client** (`libs/api/client.ts`): Axios instance with interceptors
- **Endpoints** (`libs/api/[feature].ts`): Feature-specific API functions
- **Mock** (`libs/api/mock/`): Mock data for development without backend

### State Management
- **Server State**: TanStack Query for API data
- **Client State**: Zustand stores with localStorage persistence
- **Form State**: React Hook Form with Zod validation

### Validation
- All schemas in `libs/validation/[feature]Schemas.ts`
- Use Zod for runtime validation
- Export both schema and TypeScript types

### Constants
- Centralized in `src/constants/index.ts`
- Grouped by category (API, HTTP, MESSAGES, ROUTES, etc.)
- Use `as const` for type safety

### Error Handling
- **ErrorBoundary**: Catches React component errors
- **Try-Catch**: All async functions wrapped
- **API Interceptors**: Global error handling
- **Logger**: Centralized logging utility

### Logging
- Use `logger` utility from `libs/utils/logger.ts`
- Methods: `info()`, `warning()`, `error()`, `api()`, `apiResponse()`
- Format: `[HH:MM:SS.mmm] [Component] 🎯 Message`
- Active in development, errors only in production

## Naming Conventions

### Files
- Components: PascalCase (e.g., `AssetListPage.tsx`)
- Utilities: camelCase (e.g., `errorHandling.ts`)
- Stores: camelCase with "Store" suffix (e.g., `authStore.ts`)
- Schemas: camelCase with "Schemas" suffix (e.g., `assetSchemas.ts`)

### Code
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase
- Hooks: camelCase with "use" prefix

### Comments
- Use JSDoc-style comments for files and functions
- Comments in Indonesian language
- Include purpose and usage examples

## Import Order
1. External libraries (React, etc.)
2. Internal libraries (`@/libs/`)
3. Components (`@/components/`)
4. Types and interfaces
5. Constants
6. Styles

## Testing
- Test files: `__tests__/[Component].test.tsx`
- Use Testing Library best practices
- Focus on user behavior, not implementation
- Mock API calls using mock data

## Documentation
- Main docs in `project-docs/`
- Debug docs in `debug-docs/`
- Research docs in `research-docs/`
