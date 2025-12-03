# Phase 2: Monorepo Migration

> Phase ini melakukan restructure project menjadi monorepo proper.
> JANGAN mulai phase ini sebelum Phase 1 complete.

---

## Objective

Restructure codebase menjadi:
1. **apps/** - Application code (web, api)
2. **packages/** - Shared packages (ui, database, types)
3. **Scalable** - Mudah add apps/packages baru

---

## Status: ⬜ Not Started

| Task | Status | Estimated Time |
|------|--------|----------------|
| Create monorepo structure | ⬜ Pending | 2-3 hours |
| Migrate frontend → apps/web | ⬜ Pending | 2 hours |
| Migrate backend → apps/api | ⬜ Pending | 2 hours |
| Create packages/shared | ⬜ Pending | 1 hour |
| Create packages/database | ⬜ Pending | 1 hour |
| Create packages/ui (optional) | ⬜ Pending | 2 hours |
| Update all import paths | ⬜ Pending | 3-4 hours |
| Update CI/CD pipelines | ⬜ Pending | 1 hour |
| Verify all features work | ⬜ Pending | 2 hours |

**Total Estimated:** 14-17 hours

---

## Prerequisites

Sebelum mulai Phase 2, pastikan:
- [ ] Phase 1 complete (pnpm, Biome, Turborepo)
- [ ] All tests passing
- [ ] No pending changes
- [ ] Backup current state (git tag v1.0-pre-monorepo)

---

## Target Structure

```
simanis/
├── apps/
│   ├── web/                    # Frontend (React 19)
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── api/                    # Backend (Fastify)
│       ├── src/
│       ├── prisma/
│       └── package.json
├── packages/
│   ├── shared/                 # Shared types & constants
│   │   ├── src/
│   │   └── package.json
│   ├── database/               # Prisma schema & migrations
│   │   ├── prisma/
│   │   └── package.json
│   └── ui/                     # Shared UI components (optional)
│       ├── src/
│       └── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

## Task Details

### 1. Create Monorepo Structure

**Steps:**
```bash
# 1. Create folder structure
mkdir -p apps/web apps/api
mkdir -p packages/shared packages/database

# 2. Update pnpm-workspace.yaml
# (akan dibuat oleh AI)

# 3. Update turbo.json
# (akan diupdate oleh AI)
```

**Files to Create:**
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

### 2. Migrate Frontend → apps/web

**Steps:**
```bash
# 1. Move frontend files
mv src apps/web/src
mv public apps/web/public
mv index.html apps/web/index.html
mv vite.config.ts apps/web/vite.config.ts
mv tsconfig.json apps/web/tsconfig.json

# 2. Create apps/web/package.json
# (akan dibuat oleh AI)

# 3. Update import paths
# @/ → @simanis/web/
# @shared/ → @simanis/shared/

# 4. Verify
cd apps/web
pnpm install
pnpm run dev
```

**apps/web/package.json:**
```json
{
  "name": "@simanis/web",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "biome check src",
    "format": "biome format src --write",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "latest",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

---

### 3. Migrate Backend → apps/api

**Steps:**
```bash
# 1. Move backend files
mv backend/src apps/api/src
mv backend/tests apps/api/tests
mv backend/tsconfig.json apps/api/tsconfig.json

# 2. Move Prisma to packages/database
mv backend/prisma packages/database/prisma

# 3. Create apps/api/package.json
# (akan dibuat oleh AI)

# 4. Update import paths
# @shared/ → @simanis/shared/
# prisma imports → @simanis/database/client

# 5. Verify
cd apps/api
pnpm install
pnpm run dev
```

**apps/api/package.json:**
```json
{
  "name": "@simanis/api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "biome check src",
    "test": "vitest run"
  },
  "dependencies": {
    "fastify": "^4.28.0",
    "@simanis/shared": "workspace:*",
    "@simanis/database": "workspace:*"
  }
}
```

---

### 4. Create packages/shared

**Steps:**
```bash
# 1. Move shared folder
mv shared packages/shared/src

# 2. Create packages/shared/package.json
# (akan dibuat oleh AI)

# 3. Add exports in package.json
# "exports": { "./types": "./src/types.ts" }
```

**packages/shared/package.json:**
```json
{
  "name": "@simanis/shared",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./types": "./src/types/index.ts",
    "./constants": "./src/constants/index.ts",
    "./utils": "./src/utils/index.ts"
  },
  "devDependencies": {
    "typescript": "^5.6.0"
  }
}
```

---

### 5. Create packages/database

**Steps:**
```bash
# 1. Prisma files already moved (step 3)

# 2. Create packages/database/package.json

# 3. Generate Prisma client
cd packages/database
pnpm prisma generate

# 4. Export client
# Create src/index.ts that exports PrismaClient
```

**packages/database/package.json:**
```json
{
  "name": "@simanis/database",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./client": "./src/index.ts"
  },
  "scripts": {
    "generate": "prisma generate",
    "migrate": "prisma migrate dev",
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^6.0.0"
  },
  "devDependencies": {
    "prisma": "^6.0.0",
    "tsx": "^4.0.0"
  }
}
```

**packages/database/src/index.ts:**
```typescript
export { PrismaClient } from '@prisma/client'
export * from '@prisma/client'
```

---

### 6. Update Import Paths (CRITICAL)

**Before (old structure):**
```typescript
// Frontend
import { Button } from '@/components/ui/button'
import { Asset } from '@shared/types'

// Backend
import { Asset } from '@shared/types'
import { PrismaClient } from '@prisma/client'
```

**After (monorepo):**
```typescript
// Frontend (apps/web)
import { Button } from '@simanis/web/components/ui/button'
import { Asset } from '@simanis/shared/types'

// Backend (apps/api)
import { Asset } from '@simanis/shared/types'
import { PrismaClient } from '@simanis/database/client'
```

**Path Alias Updates:**

**apps/web/tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@simanis/web/*": ["./src/*"],
      "@simanis/shared/*": ["../../packages/shared/src/*"]
    }
  }
}
```

**apps/api/tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@simanis/api/*": ["./src/*"],
      "@simanis/shared/*": ["../../packages/shared/src/*"],
      "@simanis/database/*": ["../../packages/database/src/*"]
    }
  }
}
```

---

### 7. Update CI/CD Pipelines

**Changes needed in `.github/workflows/*.yml`:**

```yaml
# Before
- run: npm install
- run: npm run build

# After
- run: pnpm install
- run: pnpm turbo run build --filter=@simanis/web
- run: pnpm turbo run build --filter=@simanis/api
```

---

## Verification Checklist

Sebelum Phase 2 dianggap complete:

### Build & Runtime
- [ ] `pnpm install` works (root)
- [ ] `pnpm run dev --filter=@simanis/web` works
- [ ] `pnpm run dev --filter=@simanis/api` works
- [ ] `pnpm turbo run build` works (all apps)
- [ ] Frontend dapat fetch dari backend API
- [ ] Database connection works

### Code Quality
- [ ] `pnpm turbo run lint` works (all apps)
- [ ] `pnpm turbo run test` works (all apps)
- [ ] No TypeScript errors
- [ ] All imports resolved correctly

### Features
- [ ] Login/logout works
- [ ] Asset CRUD works
- [ ] QR code generation works
- [ ] Reports generation works
- [ ] Permissions/RBAC works

### Infrastructure
- [ ] CI/CD pipeline green
- [ ] Documentation updated
- [ ] README updated with new structure

---

## Rollback Plan

Jika Phase 2 gagal:

```bash
# 1. Checkout ke state sebelum Phase 2
git checkout main
git reset --hard v1.0-pre-monorepo

# 2. Reinstall
pnpm install

# 3. Verify
pnpm run dev
```

---

## Migration Script (Optional)

Untuk automate import path updates:

```bash
# Find and replace imports
find apps/web/src -type f -name "*.ts" -o -name "*.tsx" | \
  xargs sed -i "s|@/|@simanis/web/|g"

find apps/web/src -type f -name "*.ts" -o -name "*.tsx" | \
  xargs sed -i "s|@shared/|@simanis/shared/|g"

find apps/api/src -type f -name "*.ts" | \
  xargs sed -i "s|@shared/|@simanis/shared/|g"

find apps/api/src -type f -name "*.ts" | \
  xargs sed -i "s|@prisma/client|@simanis/database/client|g"
```

---

## Success Criteria

Phase 2 dianggap COMPLETE jika:

1. ✅ Monorepo structure in place (apps/, packages/)
2. ✅ All imports use workspace packages
3. ✅ All existing features work
4. ✅ All tests pass
5. ✅ CI/CD updated dan green
6. ✅ Documentation updated

---

## Next Phase

Setelah Phase 2 complete, lanjut ke **Phase 3: Quality Gates**

Preview Phase 3:
- Test coverage ≥ 80%
- E2E tests with Playwright
- Performance benchmarks
- CI/CD with automated deployments
