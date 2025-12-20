# Design Document

## Overview

Dokumen ini menjelaskan desain teknis untuk migrasi SIMANIS dari setup hybrid (pnpm + manual Zod) ke setup standar (Bun + zod-prisma-types). Migrasi ini memastikan konsistensi antara dokumentasi (ADR 0007, .cursorrules) dan implementasi aktual.

## Architecture

### Current State (Before Migration)

```
┌─────────────────────────────────────────────────────────────┐
│                    CURRENT STATE                             │
├─────────────────────────────────────────────────────────────┤
│  Package Manager: Hybrid (pnpm-lock.yaml + bun.lock)        │
│  Zod Schemas: Manual (lib/validations/*.ts)                 │
│  CI/CD: pnpm-based (.github/workflows/main_ci.yml)          │
│  Generated Zod: NOT EXISTS (lib/generated/zod/index.ts)     │
└─────────────────────────────────────────────────────────────┘
```

### Target State (After Migration)

```
┌─────────────────────────────────────────────────────────────┐
│                    TARGET STATE                              │
├─────────────────────────────────────────────────────────────┤
│  Package Manager: Bun only (bun.lockb)                      │
│  Zod Schemas: Generated + Extended                          │
│    ├── lib/validations/generated/ (auto-generated)          │
│    └── lib/validations/*.ts (extends generated)             │
│  CI/CD: Bun-based (.github/workflows/main_ci.yml)           │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow: Schema Generation

```
┌──────────────────┐     prisma generate     ┌─────────────────────────┐
│ prisma/          │ ──────────────────────► │ lib/validations/        │
│ schema.prisma    │                         │ generated/              │
│                  │                         │   ├── index.ts          │
│ - Models         │                         │   └── (all schemas)     │
│ - Enums          │                         │                         │
│ - Relations      │                         │ Auto-generated:         │
└──────────────────┘                         │ - AssetSchema           │
                                             │ - LocationSchema        │
                                             │ - MutationSchema        │
                                             │ - UserSchema            │
                                             │ - AuditLogSchema        │
                                             │ - All Enums             │
                                             └─────────────────────────┘
                                                        │
                                                        │ import & extend
                                                        ▼
                                             ┌─────────────────────────┐
                                             │ lib/validations/        │
                                             │   ├── asset.ts          │
                                             │   ├── location.ts       │
                                             │   ├── mutation.ts       │
                                             │   ├── user.ts           │
                                             │   └── audit-log.ts      │
                                             │                         │
                                             │ Custom schemas:         │
                                             │ - createAssetSchema     │
                                             │ - updateAssetSchema     │
                                             │ - (form-specific)       │
                                             └─────────────────────────┘
```

## Components

### Component 1: zod-prisma-types Generator

**Purpose:** Menghasilkan skema Zod otomatis dari Prisma schema

**Interface:**
```prisma
// prisma/schema.prisma
generator zod {
  provider = "zod-prisma-types"
  output   = "../lib/validations/generated"
}
```

**Behavior:**
- Input: prisma/schema.prisma (models, enums, relations)
- Output: lib/validations/generated/index.ts
- Trigger: `bun x prisma generate`

**Generated Exports:**
```typescript
// lib/validations/generated/index.ts (auto-generated)
export const AssetSchema = z.object({...})
export const LocationSchema = z.object({...})
export const MutationSchema = z.object({...})
export const UserSchema = z.object({...})
export const AuditLogSchema = z.object({...})
export const StockOpnameSessionSchema = z.object({...})

// Enums
export const UserRoleSchema = z.enum([...])
export const StatusSchema = z.enum([...])
export const LocTypeSchema = z.enum([...])
export const AssetStatusSchema = z.enum([...])
export const ConditionSchema = z.enum([...])
export const MutationStatusSchema = z.enum([...])
export const StockOpnameStatusSchema = z.enum([...])
```

### Component 2: Manual Validation Schemas

**Purpose:** Menyediakan skema khusus untuk form input (omit auto-generated fields)

**Interface:**
```typescript
// lib/validations/asset.ts
import { AssetSchema } from './generated'

export const createAssetSchema = AssetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateAssetInput = z.infer<typeof createAssetSchema>
```

**Behavior:**
- Extends atau omit dari generated schemas
- Menambahkan custom validations (refinements)
- Digunakan oleh React Hook Form dan Server Actions

### Component 3: CI/CD Pipeline (Bun-based)

**Purpose:** Menjalankan build, test, dan deploy menggunakan Bun

**Interface:**
```yaml
# .github/workflows/main_ci.yml
- uses: oven-sh/setup-bun@v2
  with:
    bun-version: latest
```

**Behavior:**
- Setup Bun runtime
- Install dependencies: `bun install`
- Generate Prisma: `bun x prisma generate`
- Run lint: `bun run lint`
- Run tests: `bun test`
- Build: `bun run build`

## Correctness Properties

### Property 1: Schema Synchronization
**Invariant:** Generated Zod schemas MUST match Prisma schema structure
**Verification:** 
- Compare field names and types between Prisma model and generated Zod schema
- Run `bun x prisma generate` and verify no errors

### Property 2: Backward Compatibility
**Invariant:** All existing tests MUST pass after migration
**Verification:**
- Run `bun test` (or `npx vitest --run`)
- All 49 existing tests must pass
- No type errors in existing code

### Property 3: Single Lock File
**Invariant:** Only bun.lockb should exist as lock file
**Verification:**
- `pnpm-lock.yaml` must be deleted
- `bun.lock` or `bun.lockb` must exist
- `bun install` must succeed

### Property 4: CI/CD Consistency
**Invariant:** CI/CD must use same package manager as development
**Verification:**
- CI workflow uses `oven-sh/setup-bun@v2`
- All commands use `bun` or `bun x`
- CI pipeline passes on GitHub Actions

### Property 5: Import Path Validity
**Invariant:** All imports from generated schemas must resolve correctly
**Verification:**
- `import { AssetSchema } from '@/lib/validations/generated'` must work
- TypeScript compilation must succeed
- No runtime import errors

## Error Handling

### Error 1: zod-prisma-types Not Installed
**Detection:** `prisma generate` fails with "Generator not found"
**Recovery:** Run `bun add -D zod-prisma-types`

### Error 2: Generated Directory Not Created
**Detection:** Import from `lib/validations/generated` fails
**Recovery:** 
1. Verify generator config in schema.prisma
2. Run `bun x prisma generate`
3. Check output directory exists

### Error 3: Type Mismatch After Generation
**Detection:** TypeScript errors in validation files
**Recovery:**
1. Update manual schemas to match new generated types
2. Use `.omit()`, `.pick()`, or `.extend()` appropriately

### Error 4: CI Pipeline Fails
**Detection:** GitHub Actions workflow fails
**Recovery:**
1. Verify Bun version compatibility
2. Check all commands use `bun` prefix
3. Ensure DATABASE_URL is set for prisma generate

## Dependencies

### Runtime Dependencies
- `zod` (existing) - Runtime validation library

### Development Dependencies
- `zod-prisma-types` (to add) - Prisma generator for Zod schemas
- `bun` (existing) - Package manager and runtime

### Peer Dependencies
- `prisma` (existing) - Database ORM
- `@prisma/client` (existing) - Prisma client

## Migration Checklist

1. [ ] Install zod-prisma-types: `bun add -D zod-prisma-types`
2. [ ] Verify generator config in prisma/schema.prisma
3. [ ] Run `bun x prisma generate`
4. [ ] Verify lib/validations/generated/index.ts exists
5. [ ] Update manual schemas to import from generated
6. [ ] Delete pnpm-lock.yaml
7. [ ] Update .github/workflows/main_ci.yml to use Bun
8. [ ] Run all tests: `bun test` or `npx vitest --run`
9. [ ] Verify CI pipeline passes
