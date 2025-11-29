# Scripts

Utility scripts untuk SIMANIS.

## Setup

### Windows (PowerShell)
```powershell
.\scripts\setup.ps1
```

### Linux/macOS
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `setup.ps1` / `setup.sh` | Initial project setup (install deps, migrate, seed) |

## Manual Commands

### Frontend
```bash
npm run dev          # Start dev server (port 5000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test:run     # Run tests
```

### Backend
```bash
cd backend
npm run dev              # Start dev server (port 3000)
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
```
