# Tech Stack & Build System

## Frontend (Root Directory)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (rolldown-vite)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM 7
- **UI Components**: Custom components in `src/components/ui/`
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **PWA**: vite-plugin-pwa with offline support
- **Error Tracking**: Sentry

## Backend (`backend/` Directory)
- **Framework**: Fastify 4
- **Database**: MySQL 8.0 with Prisma ORM
- **Authentication**: JWT (@fastify/jwt)
- **Password Hashing**: Argon2
- **File Upload**: @fastify/multipart
- **Queue**: BullMQ with Redis (ioredis)
- **Storage**: Local or Cloudflare R2 (S3-compatible)
- **Logging**: Winston
- **Reports**: ExcelJS, PDFKit
- **QR Codes**: qrcode library

## Testing
- **Test Runner**: Vitest
- **Property Testing**: fast-check
- **React Testing**: @testing-library/react
- **DOM Environment**: jsdom

## Code Quality
- **Linting**: ESLint 9 with TypeScript and accessibility rules (jsx-a11y)
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Commits**: Conventional Commits format required

## Common Commands

### Frontend
```bash
npm run dev          # Start dev server (port 5000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage
```

### Backend
```bash
cd backend
npm run dev              # Start dev server (port 3000)
npm run build            # Compile TypeScript
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
npm test                 # Run tests
```

## Path Aliases
- Frontend uses `@/` alias pointing to `./src/`
