# Tech Stack

## Frontend (root directory)

- React 19 + TypeScript
- Vite (rolldown-vite) - build tool
- Tailwind CSS 4 - styling
- Zustand - state management
- TanStack Query - server state
- React Router 7 - routing
- React Hook Form + Zod - forms & validation
- Sonner - toast notifications
- Lucide React - icons
- PWA enabled via vite-plugin-pwa

## Backend (`/backend` directory)

- Fastify 4 + TypeScript
- Prisma ORM 5.22 - database access
- MySQL - database
- Zod - validation
- Argon2 - password hashing
- JWT (@fastify/jwt) - authentication
- BullMQ + IORedis - job queue
- Winston - logging
- ExcelJS / PDFKit - report generation
- Cloudflare R2 / Local - file storage

## Common Commands

### Frontend
```bash
npm run dev          # Start dev server (port 5000)
npm run build        # Build for production
npm run test         # Run tests (watch mode)
npm run test:run     # Run tests once
npm run lint         # ESLint
npm run format       # Prettier format
```

### Backend
```bash
cd backend
npm run dev              # Start dev server with tsx watch
npm run build            # Compile TypeScript
npm run prisma:migrate   # Run database migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
npm run test             # Run tests
```

## Testing

- Vitest for both frontend and backend
- Testing Library for React components
- fast-check for property-based testing (backend)
- Test files: `*.test.ts` or `*.test.tsx`
- Setup file: `src/test/setup.ts` (frontend)

## Path Aliases

- Frontend: `@/` maps to `./src/`
- Backend: No aliases, use relative imports
