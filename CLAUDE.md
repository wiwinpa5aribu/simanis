# SIMANIS - Claude AI Context
# File ini untuk Claude (VSCode extension, Claude Desktop, dll)
# Last Updated: 2025-12-02

## PROJECT IDENTITY

**SIMANIS** = Sistem Manajemen Aset Sekolah
- PWA untuk manajemen aset sekolah di Indonesia
- UI dalam Bahasa Indonesia, code dalam English (camelCase)
- Target: Guru dan Staff Sekolah

## CRITICAL RULES

### 1. SELALU Baca Status Dulu
Sebelum mulai task apapun, baca: `docs/progress/CURRENT_STATUS.md`

### 2. SELALU Update Dokumentasi
Setelah selesai task, update: `docs/progress/CURRENT_STATUS.md`

### 3. Naming Convention: camelCase
```typescript
// ✅ BENAR
{ kodeAset: string, namaBarang: string, categoryId: number }

// ❌ SALAH
{ kode_aset: string, nama_barang: string }
```

### 4. Package Manager: pnpm (BUKAN npm)
```bash
# ✅ BENAR
pnpm install
pnpm run dev

# ❌ SALAH
npm install
npm run dev
```

### 5. Linter: Biome (BUKAN ESLint/Prettier)
```bash
# ✅ BENAR
pnpm run lint      # biome check
pnpm run lint:fix  # biome check --write

# ❌ SALAH
npx eslint .
npx prettier --write .
```

## TECH STACK

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind 4, Zustand, TanStack Query |
| Backend | Fastify 4, TypeScript, Prisma, MySQL 8, BullMQ |
| Shared | TypeScript types di `/shared` |
| Tooling | pnpm v10.24.0, Biome v2.3.8, Turborepo v2.6.1 |

## FOLDER STRUCTURE

```
simanis/
├── src/                 # Frontend React
├── backend/             # Backend Fastify (Clean Architecture)
├── shared/              # Shared types & constants
├── docs/progress/       # AI progress tracking (WAJIB UPDATE)
└── docs/                # Documentation
```

## COMMANDS

```bash
# Monorepo (root)
pnpm run dev           # Start frontend
pnpm run dev:all       # Start all (turbo)
pnpm run build:all     # Build all (turbo)
pnpm run lint:all      # Lint all (turbo)

# Backend (/backend)
pnpm run dev
pnpm run prisma:migrate
pnpm run prisma:generate
```

## ROADMAP STATUS

| Phase | Status |
|-------|--------|
| 0 - Documentation | ✅ COMPLETE |
| 1 - Tooling | ✅ COMPLETE |
| 2 - Monorepo | 🎯 NEXT |
| 3 - Quality | ⬜ Not Started |
| 4 - Production | ⬜ Not Started |
| 5 - Tauri | ⬜ Optional |

## DOCUMENTATION TEMPLATE

Setelah selesai task, update `docs/progress/CURRENT_STATUS.md`:

```markdown
## Status Terakhir

| Field | Value |
|-------|-------|
| Tanggal | YYYY-MM-DD |
| AI Tool | Claude |
| Phase | Phase X: Name |
| Status | 🟡 In Progress / ✅ Complete |

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `path/file` | Created/Updated | Deskripsi |
```

Lihat `.cursorrules` untuk detail lengkap.
