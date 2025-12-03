# AI Coding Instructions for SIMANIS

> Dokumen ini berisi instruksi detail untuk semua AI coding tools yang bekerja di project SIMANIS.
> WAJIB dibaca dan diikuti oleh: Kiro, Cursor, Claude, GitHub Copilot, dan AI tools lainnya.

---

## 🎯 Golden Rules

### Rule 1: SELALU Baca Status Dulu
```
Sebelum mulai task APAPUN, baca: docs/progress/CURRENT_STATUS.md
```

### Rule 2: SELALU Update Dokumentasi
```
Setelah selesai task APAPUN, update: docs/progress/CURRENT_STATUS.md
```

### Rule 3: JANGAN Skip Documentation
```
Tidak ada task yang "terlalu kecil" untuk didokumentasikan.
Minimal update status file dengan apa yang dikerjakan.
```

---

## 📋 Task Workflow

### Sebelum Mulai Task

1. **Baca `docs/progress/CURRENT_STATUS.md`**
   - Pahami status terakhir project
   - Lihat apa yang sudah dikerjakan
   - Cek apakah ada blocker

2. **Identifikasi Phase**
   - Task ini masuk Phase berapa?
   - Apakah prerequisite sudah terpenuhi?

3. **Konfirmasi dengan User**
   - Jika task tidak jelas, tanya dulu
   - Jangan asumsi, minta klarifikasi

### Selama Mengerjakan Task

1. **Ikuti Coding Standards**
   - camelCase untuk semua property
   - Zod untuk validasi
   - Proper error handling

2. **Test Sebelum Commit**
   ```bash
   npm run lint
   npm run test:run
   npx tsc --noEmit
   ```

3. **Commit dengan Message yang Jelas**
   ```
   feat: add asset export feature
   fix: resolve pagination bug in loans
   docs: update progress status
   refactor: migrate to Biome linter
   ```

### Setelah Selesai Task

1. **Update `docs/progress/CURRENT_STATUS.md`**
   - Update tanggal dan AI tool
   - Pindahkan task ke Completed
   - Tambahkan files yang diubah
   - Update notes jika perlu

2. **Buat Progress Log (untuk task besar)**
   - Copy `docs/progress/TEMPLATE.md`
   - Isi dengan detail task
   - Simpan sebagai `docs/progress/YYYY-MM-DD-task-name.md`

---

## 🚫 Prohibited Actions

### JANGAN Lakukan

| Action | Alasan |
|--------|--------|
| Gunakan snake_case | Project ini camelCase everywhere |
| Gunakan process.env di frontend | Vite pakai import.meta.env |
| Skip dokumentasi | Akan menyulitkan AI session berikutnya |
| Buat breaking changes tanpa docs | Tim/AI lain tidak akan tau |
| Ignore TypeScript errors | Akan menyebabkan runtime bugs |
| Hardcode credentials | Security risk |
| Commit langsung ke main | Gunakan feature branch |

### JANGAN Asumsi

| Jangan Asumsi | Lakukan Ini |
|---------------|-------------|
| User mau fitur X | Tanya konfirmasi dulu |
| File sudah ada | Cek dulu dengan readFile |
| Package sudah installed | Cek package.json |
| Database schema sudah update | Cek prisma/schema.prisma |

---

## ✅ Required Actions

### WAJIB Lakukan

| Action | Kapan |
|--------|-------|
| Baca CURRENT_STATUS.md | Sebelum mulai task |
| Update CURRENT_STATUS.md | Setelah selesai task |
| Run lint sebelum commit | Setiap kali edit code |
| Run tests sebelum commit | Setiap kali edit code |
| Gunakan camelCase | Setiap membuat property baru |
| Handle errors properly | Setiap API call dan async operation |
| Validasi dengan Zod | Setiap form dan API endpoint |

---

## 📁 File Locations

### AI Context Files
| File | Purpose | Tool |
|------|---------|------|
| `.cursorrules` | AI context | Cursor IDE |
| `CLAUDE.md` | AI context | Claude (VSCode, Desktop) |
| `.kiro/steering/*.md` | AI context | Kiro |
| `docs/AI_INSTRUCTIONS.md` | Detailed rules | All AI tools |

### Progress Tracking
| File | Purpose |
|------|---------|
| `docs/progress/CURRENT_STATUS.md` | Current status (WAJIB UPDATE) |
| `docs/progress/TEMPLATE.md` | Template untuk progress log |
| `docs/progress/phase-X-*.md` | Per-phase progress logs |

### Project Documentation
| File | Purpose |
|------|---------|
| `docs/architecture.md` | System architecture |
| `docs/database.md` | Database schema docs |
| `docs/domain/*.md` | Domain model docs |

---

## 🔄 Phase-Specific Instructions

### Phase 0: Documentation (Current)
- Focus: Setup AI context dan progress tracking
- Output: Semua AI tools bisa baca context yang sama
- Verification: Test dengan berbagai AI tools

### Phase 1: Tooling
- Focus: Migrate ke pnpm, Biome, Turborepo
- Caution: Jangan break existing functionality
- Verification: All tests pass, build success

### Phase 2: Monorepo Migration
- Focus: Restructure folders
- Caution: Update SEMUA import paths
- Verification: No import errors, all features work

### Phase 3: Quality Gates
- Focus: Testing coverage, CI/CD
- Target: ≥80% coverage
- Verification: CI pipeline green

### Phase 4: Production Ready
- Focus: Docker, monitoring, backup
- Caution: Security configurations
- Verification: Can deploy to production

### Phase 5: Tauri (Optional)
- Focus: Desktop app wrapper
- Prerequisite: Service layer abstraction complete
- Verification: Desktop app runs correctly

---

## 🛠️ Troubleshooting

### Jika Tidak Tau Harus Mulai dari Mana
1. Baca `docs/progress/CURRENT_STATUS.md`
2. Lihat "Pending Tasks"
3. Pilih task pertama yang belum dikerjakan
4. Jika masih bingung, tanya user

### Jika Menemukan Bug
1. Dokumentasikan bug di progress log
2. Fix jika dalam scope task
3. Jika di luar scope, catat di "Notes for Next Session"

### Jika Task Terlalu Besar
1. Break down menjadi sub-tasks
2. Kerjakan satu per satu
3. Update progress setiap sub-task selesai

### Jika Conflict dengan Existing Code
1. Jangan force overwrite
2. Pahami kenapa code existing seperti itu
3. Diskusikan dengan user jika perlu
4. Dokumentasikan decision yang dibuat

---

## 📝 Documentation Standards

### Commit Messages
```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks
```

### Code Comments
```typescript
// ✅ Good - explains WHY
// Using debounce to prevent excessive API calls during typing
const debouncedSearch = useDebouncedCallback(search, 300)

// ❌ Bad - explains WHAT (obvious from code)
// Set the value to 300
const delay = 300
```

### Progress Log Format
Lihat `docs/progress/TEMPLATE.md` untuk format lengkap.

---

## 🔗 Quick Reference

### Commands
```bash
# Frontend (root)
npm run dev          # Start dev server
npm run build        # Build production
npm run lint         # Run linter
npm run test:run     # Run tests
npm run format       # Format code

# Backend (/backend)
npm run dev              # Start dev server
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Generate client
npm run prisma:seed      # Seed database
```

### Path Aliases
```typescript
import { Button } from '@/components/ui/button'  // src/
import { Asset } from '@shared/types'            // shared/
```

### Environment Variables
```typescript
// Frontend
import.meta.env.VITE_API_URL

// Backend
process.env.DATABASE_URL
process.env.JWT_SECRET
```
