# AI Coding Rules for SIMANIS

> Rules ini WAJIB diikuti oleh Kiro dan semua AI coding tools.
> Last Updated: 2025-12-02

## 🎯 Golden Rules

### 1. SELALU Baca Status Dulu
```
Baca: docs/progress/CURRENT_STATUS.md
```

### 2. SELALU Update Dokumentasi
```
Update: docs/progress/CURRENT_STATUS.md
```

### 3. Gunakan Tools yang Benar
```
Package Manager: pnpm (BUKAN npm)
Linter: Biome (BUKAN ESLint/Prettier)
Build: Turborepo
```

---

## 📋 Task Workflow

### Sebelum Mulai
1. Baca `docs/progress/CURRENT_STATUS.md`
2. Pahami current phase dan pending tasks
3. Konfirmasi dengan user jika tidak jelas

### Selama Mengerjakan
1. Ikuti coding standards (camelCase, Zod, dll)
2. Gunakan pnpm untuk install packages
3. Gunakan biome untuk lint/format

### Setelah Selesai
1. Update `docs/progress/CURRENT_STATUS.md`
2. Run `pnpm run lint` untuk verify
3. Inform user tentang apa yang sudah dikerjakan

---

## 🚫 Prohibited

| JANGAN | GUNAKAN |
|--------|---------|
| snake_case | camelCase |
| npm | pnpm |
| eslint/prettier | biome |
| process.env (frontend) | import.meta.env |
| Skip dokumentasi | Update CURRENT_STATUS.md |
| Commit ke main/develop | Feature branch + PR |

---

## ✅ Required

| WAJIB | KAPAN |
|-------|-------|
| Baca CURRENT_STATUS.md | Sebelum mulai |
| Update CURRENT_STATUS.md | Setelah selesai |
| Gunakan pnpm | Selalu |
| Gunakan biome | Untuk lint/format |
| Gunakan camelCase | Selalu |

---

## 🔄 Current Roadmap

| Phase | Status | Focus |
|-------|--------|-------|
| 0 | ✅ Complete | Documentation |
| 1 | ✅ Complete | Tooling (pnpm, Biome, Turbo) |
| 2 | 🎯 Next | Monorepo Migration |
| 3 | ⬜ Not Started | Quality Gates |
| 4 | ⬜ Not Started | Production Ready |
| 5 | ⬜ Optional | Tauri Integration |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `docs/progress/CURRENT_STATUS.md` | Status tracker (WAJIB) |
| `.cursorrules` | Full AI context |
| `CLAUDE.md` | Claude-specific context |
| `turbo.json` | Turborepo config |
| `biome.json` | Linter config |
| `pnpm-workspace.yaml` | Workspace packages |

---

## 🛠️ Commands

```bash
# Monorepo
pnpm run dev:all       # Start all
pnpm run build:all     # Build all
pnpm run lint:all      # Lint all

# Single
pnpm run lint          # Lint
pnpm run lint:fix      # Fix lint
pnpm run format        # Format
```

---

## 📝 Documentation Format

```markdown
## Status Terakhir

| Field | Value |
|-------|-------|
| Tanggal | YYYY-MM-DD |
| AI Tool | Kiro |
| Phase | Phase X |
| Status | ✅ Complete / 🟡 In Progress |

## Files Changed

| File | Change | Description |
|------|--------|-------------|
| path/file | Created | Deskripsi |
```
