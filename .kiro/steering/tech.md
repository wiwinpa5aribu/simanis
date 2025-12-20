# Tech Stack & Commands

## Core Stack
- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript (strict mode)
- **Database**: MySQL via Prisma ORM
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **Validation**: Zod (runtime schema validation)
- **Forms**: React Hook Form + @hookform/resolvers
- **Charts**: Recharts
- **Testing**: Vitest + Testing Library
- **Component Dev**: Storybook 10

## Common Commands
```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm exec prisma generate    # Generate Prisma client
pnpm exec prisma migrate dev # Run migrations
pnpm exec prisma db seed     # Seed database (via prisma/seed.ts)

# Testing
npx vitest            # Run tests (watch mode)
npx vitest --run      # Run tests once

# Storybook
pnpm storybook        # Start Storybook dev
pnpm build-storybook  # Build static Storybook
```

## Path Aliases
- `@/*` maps to project root (e.g., `@/components/ui/button`)

## Key Dependencies
- `lucide-react` - Icons
- `date-fns` - Date utilities
- `sonner` - Toast notifications
- `cmdk` - Command palette
- `vaul` - Drawer component
