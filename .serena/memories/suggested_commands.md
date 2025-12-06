# Suggested Commands for SIMANIS Development

## Development
```powershell
pnpm dev              # Run all apps in dev mode
pnpm dev:web          # Run web only (localhost:5173)
pnpm dev:api          # Run API only (localhost:3000)
```

## Build & Test
```powershell
pnpm build            # Build all packages
pnpm test             # Run all tests (vitest --run)
pnpm test:coverage    # Run tests with coverage
```

## Linting & Formatting (Biome)
```powershell
pnpm lint             # Lint all packages
pnpm lint:fix         # Auto-fix lint issues
pnpm format           # Format code with Biome
```

## Database (Prisma)
```powershell
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations (dev)
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Prisma Studio
```

## Code Quality
```powershell
pnpm knip             # Find unused exports/dependencies
pnpm knip:fix         # Auto-fix knip issues
```

## Windows System Commands
```powershell
Get-ChildItem         # List files (ls equivalent)
Get-Content file.txt  # View file content (cat equivalent)
Select-String -Path *.ts -Pattern "search"  # Search in files (grep equivalent)
```
