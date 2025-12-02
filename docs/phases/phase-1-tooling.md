# Phase 1: Tooling Foundation

> Phase ini mempersiapkan tooling modern untuk monorepo migration.
> JANGAN mulai phase ini sebelum Phase 0 complete.

---

## Objective

Upgrade tooling untuk:
1. Better monorepo support (pnpm workspaces)
2. Faster linting/formatting (Biome)
3. Efficient builds (Turborepo)

---

## Status: ⬜ Not Started

| Task | Status | Estimated Time |
|------|--------|----------------|
| Migrate npm → pnpm | ⬜ Pending | 1-2 hours |
| Migrate ESLint+Prettier → Biome | ⬜ Pending | 2-3 hours |
| Setup Turborepo | ⬜ Pending | 1-2 hours |
| Update CI/CD for new tools | ⬜ Pending | 1 hour |
| Verify all tests pass | ⬜ Pending | 30 mins |

---

## Prerequisites

Sebelum mulai Phase 1, pastikan:
- [x] Phase 0 complete
- [ ] Semua PR merged/closed
- [ ] No pending changes
- [ ] Backup current state (git tag)

---

## Task Details

### 1. Migrate npm → pnpm

**Why pnpm?**
- Faster installs (symlinks, not copies)
- Disk space efficient
- Better monorepo support
- Strict dependency resolution

**Steps:**
```bash
# 1. Install pnpm globally
npm install -g pnpm

# 2. Delete existing node_modules
rm -rf node_modules
rm -rf backend/node_modules

# 3. Delete package-lock.json
rm package-lock.json
rm backend/package-lock.json

# 4. Create pnpm-workspace.yaml
# (akan dibuat oleh AI)

# 5. Install dependencies
pnpm install

# 6. Verify
pnpm run dev
pnpm run build
pnpm run test:run
```

**Files to Create:**
```yaml
# pnpm-workspace.yaml
packages:
  - 'backend'
  - 'shared'
```

**Files to Update:**
- `package.json` - Update scripts if needed
- `.gitignore` - Add pnpm-lock.yaml (or remove package-lock.json)
- CI/CD workflows - Change npm to pnpm

---

### 2. Migrate ESLint+Prettier → Biome

**Why Biome?**
- 10-100x faster than ESLint+Prettier
- Single tool for lint + format
- Zero config needed
- Better TypeScript support

**Steps:**
```bash
# 1. Install Biome
pnpm add -D @biomejs/biome

# 2. Initialize config
pnpm biome init

# 3. Migrate existing rules
# (manual mapping dari eslint.config.js)

# 4. Remove old tools
pnpm remove eslint prettier eslint-config-* eslint-plugin-* @typescript-eslint/*

# 5. Update scripts
# package.json: "lint": "biome check ."
# package.json: "format": "biome format . --write"

# 6. Run migration
pnpm biome check . --write
```

**Files to Create:**
```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

**Files to Delete:**
- `eslint.config.js`
- `eslint.config.mjs` (backend)
- `.prettierrc`
- `.eslintignore`

---

### 3. Setup Turborepo

**Why Turborepo?**
- Incremental builds (only rebuild what changed)
- Parallel execution
- Remote caching (optional)
- Perfect for monorepo

**Steps:**
```bash
# 1. Install Turborepo
pnpm add -D turbo

# 2. Create turbo.json
# (akan dibuat oleh AI)

# 3. Update root package.json scripts
# "build": "turbo run build"
# "lint": "turbo run lint"
# "test": "turbo run test"

# 4. Verify
pnpm turbo run build
```

**Files to Create:**
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## Verification Checklist

Sebelum Phase 1 dianggap complete:

- [ ] `pnpm install` works
- [ ] `pnpm run dev` works (frontend)
- [ ] `pnpm run dev` works (backend)
- [ ] `pnpm run build` works
- [ ] `pnpm run lint` works (Biome)
- [ ] `pnpm run format` works (Biome)
- [ ] `pnpm run test:run` works
- [ ] CI/CD pipeline green
- [ ] No TypeScript errors
- [ ] Documentation updated

---

## Rollback Plan

Jika Phase 1 gagal:

```bash
# 1. Checkout ke state sebelumnya
git checkout main
git reset --hard <commit-before-phase-1>

# 2. Reinstall dengan npm
npm install
cd backend && npm install

# 3. Verify
npm run dev
npm run build
```

---

## Success Criteria

Phase 1 dianggap COMPLETE jika:

1. ✅ pnpm sebagai package manager
2. ✅ Biome sebagai linter+formatter
3. ✅ Turborepo configured
4. ✅ All existing tests pass
5. ✅ CI/CD updated dan green
6. ✅ Documentation updated

---

## Next Phase

Setelah Phase 1 complete, lanjut ke **Phase 2: Monorepo Migration**

Preview Phase 2:
- Restructure ke `apps/web`, `apps/api`
- Create `packages/shared`, `packages/database`
- Update semua import paths
