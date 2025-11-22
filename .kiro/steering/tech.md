# Tech Stack & Build System

## Core Technologies

- **React 19**: UI library
- **TypeScript**: Type safety and developer experience
- **Vite**: Build tool and dev server (using rolldown-vite variant)
- **Tailwind CSS 4**: Utility-first styling

## Key Libraries

### State & Data Management
- **TanStack Query v5**: Server state, data fetching, and caching
- **Zustand**: Client state management with persist middleware
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation

### Routing & Navigation
- **React Router v7**: Client-side routing

### UI & Components
- **Lucide React**: Icon library
- **Sonner**: Toast notifications
- **clsx + tailwind-merge**: Conditional class names

### API & Network
- **Axios**: HTTP client with interceptors

### Utilities
- **date-fns**: Date manipulation
- **html5-qrcode**: QR code scanning

### Testing
- **Vitest**: Unit testing framework
- **Testing Library**: React component testing
- **jsdom**: DOM environment for tests

## Build System

### Development
```bash
npm run dev              # Start dev server on port 5000
npm run preview          # Preview production build
```

### Production
```bash
npm run build            # TypeScript check + Vite build
```

### Testing
```bash
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once (CI mode)
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
```

### Code Quality
```bash
npm run lint             # ESLint check
npm run format           # Format with Prettier
npm run format:check     # Check formatting
```

## Environment Configuration

Create `.env.local` file with:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_USE_MOCK_API=true
VITE_ENABLE_LOGGING=true
VITE_PWA_ENABLED=true
```

## Dev Server

- Host: `0.0.0.0` (accessible from network)
- Port: `5000` (strict)
- HMR enabled

## PWA Configuration

- Auto-update registration
- Network-first for documents
- Stale-while-revalidate for assets
- Icons: 192x192 and 512x512

## Path Alias

Use `@/` for imports from `src/` directory:
```typescript
import { api } from '@/libs/api/client'
```
