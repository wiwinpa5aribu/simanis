# SIMANIS - Claude AI Context
# File ini untuk Claude (VSCode extension, Claude Desktop, dll)
# Identik dengan .cursorrules tapi format untuk Claude

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

### 4. Environment Variables
```typescript
// ✅ Frontend
import.meta.env.VITE_API_URL

// ❌ SALAH
process.env.API_URL
```

## TECH STACK

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind 4, Zustand, TanStack Query |
| Backend | Fastify 4, TypeScript, Prisma, MySQL 8, BullMQ |
| Shared | TypeScript types di `/shared` |

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
# Frontend (root)
npm run dev          # Port 5000
npm run build
npm run test:run

# Backend (/backend)
npm run dev
npm run prisma:migrate
npm run prisma:generate
```

## DOCUMENTATION TEMPLATE

Setelah selesai task, update `docs/progress/CURRENT_STATUS.md`:

```markdown
## Status Terakhir
- Tanggal: YYYY-MM-DD
- AI Tool: Claude
- Task: [deskripsi]

## Completed
- [x] Task yang selesai

## Pending
- [ ] Task yang belum

## Files Changed
- `path/file.ts` - deskripsi

## Notes for Next Session
- Context penting
```

## CURRENT ROADMAP

Phase 0: Documentation ✅ COMPLETE
Phase 1: Tooling (pnpm, Biome, Turborepo) ← NEXT PHASE
Phase 2: Monorepo Migration
Phase 3: Quality Gates (testing, CI/CD)
Phase 4: Production Ready
Phase 5: Tauri Integration (optional)

Lihat `.cursorrules` untuk detail lengkap.
