# Phase 3: Quality Gates

> Target: Testing coverage ≥80%, CI/CD pipeline, code quality automation

## Overview

Phase ini fokus pada peningkatan kualitas kode melalui testing dan automation.

## Goals

1. **Testing Coverage ≥80%** untuk critical paths
2. **CI/CD Pipeline** dengan GitHub Actions
3. **Pre-commit Hooks** untuk quality gates
4. **Fix Existing Lint Issues** secara incremental

---

## Task Breakdown

### 3.1 Backend Testing (Priority: HIGH)

**Target Files:**
- `apps/api/src/application/use-cases/` - Business logic tests
- `apps/api/src/infrastructure/database/repositories/` - Repository tests
- `apps/api/src/presentation/controllers/` - Controller tests

**Testing Stack:**
- Vitest (sudah installed)
- fast-check untuk property-based testing

**Commands:**
```bash
cd apps/api
pnpm run test        # Run tests
pnpm run test:cov    # Run with coverage (perlu setup)
```

**Priority Use Cases to Test:**
1. `auth/login.use-case.ts` - Authentication
2. `auth/register.use-case.ts` - User registration
3. `assets/create-asset.use-case.ts` - Asset CRUD
4. `assets/get-assets.use-case.ts` - Asset listing
5. `loans/create-loan.use-case.ts` - Loan management

### 3.2 Frontend Testing (Priority: MEDIUM)

**Target Files:**
- `apps/web/src/libs/api/services/` - API service tests
- `apps/web/src/libs/store/` - Zustand store tests
- `apps/web/src/components/` - Component tests (critical only)

**Testing Stack:**
- Vitest + @testing-library/react (sudah installed)
- jsdom environment

**Commands:**
```bash
cd apps/web
pnpm run test        # Run tests
```

**Priority Components to Test:**
1. Auth flow (login, logout)
2. Asset CRUD operations
3. Form validations (Zod schemas)

### 3.3 CI/CD Pipeline (Priority: HIGH)

**File:** `.github/workflows/ci.yml`

**Pipeline Steps:**
1. Install dependencies (pnpm)
2. Lint check (biome)
3. Type check (tsc --noEmit)
4. Run tests
5. Build all packages

**Triggers:**
- Push to `main`, `develop`
- Pull requests

### 3.4 Fix Existing Lint Issues (Priority: LOW)

**Current Issues:**
- `noExplicitAny` - 12 occurrences (replace with proper types)
- `useExhaustiveDependencies` - 4 occurrences (fix React hooks)
- `a11y` warnings - 6 occurrences (add keyboard handlers, labels)

**Approach:** Fix incrementally, tidak blocking

---

## Database Schema Reference

Gunakan MCP MySQL untuk query langsung:

```
Tables: assets, asset_categories, asset_mutations, buildings, floors, rooms,
        loans, loan_items, users, roles, inventory_checks, audit_logs, dll.
```

**Quick Commands:**
- `mcp_mysql_list_tables` - List semua tabel
- `mcp_mysql_describe_table` - Lihat struktur tabel
- `mcp_mysql_fetch_data` - Query data

---

## Success Criteria

| Metric | Target | Current |
|--------|--------|---------|
| Backend Test Coverage | ≥80% | ~0% |
| Frontend Test Coverage | ≥60% | ~0% |
| Lint Errors | 0 | 12 |
| CI Pipeline | ✅ Working | ❌ None |
| Pre-commit Hooks | ✅ Working | ⚠️ Partial |

---

## Recommended Order

1. **Setup test infrastructure** (vitest config, coverage)
2. **Backend use-case tests** (auth, assets, loans)
3. **CI/CD pipeline** (GitHub Actions)
4. **Frontend service tests**
5. **Fix lint issues** (incremental)

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `apps/api/vitest.config.ts` | Verify | Test configuration |
| `apps/api/src/**/*.test.ts` | Create | Unit tests |
| `apps/web/vitest.config.ts` | Verify | Test configuration |
| `.github/workflows/ci.yml` | Create | CI pipeline |
| `apps/api/package.json` | Update | Add test:cov script |

---

## Notes

- Gunakan `pnpm` untuk semua commands
- Gunakan `biome` untuk lint/format
- Property names: **camelCase**
- Database: MySQL via Prisma (atau MCP untuk quick queries)
