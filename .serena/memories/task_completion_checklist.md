# Task Completion Checklist

When completing a task, run these commands:

## 1. Format & Lint
```powershell
pnpm lint:fix         # Auto-fix lint issues with Biome
pnpm format           # Format code with Biome
```

## 2. Type Check
```powershell
pnpm build            # Build will catch TypeScript errors
```

## 3. Run Tests
```powershell
pnpm test             # Run all tests (vitest --run)
```

## 4. Check for Unused Code (optional)
```powershell
pnpm knip             # Find unused exports/dependencies
```

## 5. Database Changes (if applicable)
```powershell
pnpm db:generate      # Regenerate Prisma client after schema changes
pnpm db:migrate       # Create migration for schema changes
```
