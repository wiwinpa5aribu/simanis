# Tech Stack

## Frontend (Root Directory)
- React 19 + TypeScript
- Vite (rolldown-vite) for build
- Tailwind CSS 4
- Zustand for client state
- TanStack Query for server state
- React Hook Form + Zod for forms
- React Router DOM 7
- PWA support via vite-plugin-pwa

## Backend (`/backend`)
- Fastify 4 + TypeScript
- MySQL 8.0 + Prisma ORM
- JWT authentication (@fastify/jwt) + Argon2 password hashing
- BullMQ + Redis for job queues
- Local storage or Cloudflare R2 for file uploads

## Shared (`/shared`)
- Common TypeScript types and constants used by both frontend and backend

## Common Commands

### Frontend (run from root)
```bash
npm run dev          # Start dev server (port 5000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test:run     # Run tests once
npm run format       # Format with Prettier
```

### Backend (run from `/backend`)
```bash
npm run dev              # Start dev server with tsx watch
npm run build            # Compile TypeScript
npm run lint             # Run ESLint
npm run test             # Run tests
npm run prisma:migrate   # Run database migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
npm run prisma:format    # Format schema with @map conventions
```

## Environment Variables
- Frontend: Use `import.meta.env.VITE_*` (not `process.env`)
- Backend: Use `.env` file with `DATABASE_URL`, JWT secrets, etc.
- See `.env.example` files in root and `/backend`

## Testing
- Vitest for both frontend and backend
- fast-check for property-based testing
- Testing Library for React component tests
