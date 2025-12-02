# AI Coding Rules for SIMANIS

> Rules ini WAJIB diikuti oleh Kiro dan semua AI coding tools.

## 🎯 Golden Rules

### 1. SELALU Baca Status Dulu
Sebelum mulai task apapun:
```
Baca: docs/progress/CURRENT_STATUS.md
```

### 2. SELALU Update Dokumentasi
Setelah selesai task apapun:
```
Update: docs/progress/CURRENT_STATUS.md
```

### 3. JANGAN Skip Documentation
Tidak ada task yang terlalu kecil untuk didokumentasikan.

---

## 📋 Task Workflow

### Sebelum Mulai
1. Baca `docs/progress/CURRENT_STATUS.md`
2. Pahami current phase dan pending tasks
3. Konfirmasi dengan user jika tidak jelas

### Selama Mengerjakan
1. Ikuti coding standards (camelCase, Zod, dll)
2. Test sebelum commit
3. Commit dengan message yang jelas

### Setelah Selesai
1. Update `docs/progress/CURRENT_STATUS.md`
2. Buat progress log untuk task besar
3. Inform user tentang apa yang sudah dikerjakan

---

## 🚫 Prohibited

| JANGAN | ALASAN |
|--------|--------|
| Gunakan snake_case | Project ini camelCase |
| Gunakan process.env di frontend | Vite pakai import.meta.env |
| Skip dokumentasi | AI berikutnya tidak tau context |
| Buat breaking changes tanpa docs | Tim tidak tau |
| Ignore TypeScript errors | Runtime bugs |

---

## ✅ Required

| WAJIB | KAPAN |
|-------|-------|
| Baca CURRENT_STATUS.md | Sebelum mulai |
| Update CURRENT_STATUS.md | Setelah selesai |
| Run lint | Sebelum commit |
| Run tests | Sebelum commit |
| Gunakan camelCase | Selalu |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `docs/progress/CURRENT_STATUS.md` | Status tracker (WAJIB BACA/UPDATE) |
| `docs/progress/TEMPLATE.md` | Template untuk logs |
| `docs/AI_INSTRUCTIONS.md` | Detailed rules |
| `.cursorrules` | Context untuk Cursor |
| `CLAUDE.md` | Context untuk Claude |

---

## 🔄 Current Roadmap

| Phase | Status | Focus |
|-------|--------|-------|
| 0 | ✅ Complete | Documentation |
| 1 | 🎯 Next Phase | Tooling (pnpm, Biome) |
| 2 | ⬜ Not Started | Monorepo Migration |
| 3 | ⬜ Not Started | Quality Gates |
| 4 | ⬜ Not Started | Production Ready |
| 5 | ⬜ Optional | Tauri Integration |

---

## 📝 Documentation Format

Setelah selesai task, update CURRENT_STATUS.md dengan:

```markdown
## Status Terakhir
- Tanggal: YYYY-MM-DD
- AI Tool: Kiro
- Task: [deskripsi]

## Completed
- [x] Task yang selesai

## Files Changed
- `path/file.ts` - deskripsi
```

---

## 🔗 Reference

Untuk detail lengkap, lihat:
- `docs/AI_INSTRUCTIONS.md` - Full AI instructions
- `docs/phases/phase-X-*.md` - Per-phase details
- `.cursorrules` - Coding standards
