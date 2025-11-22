# 🤝 Panduan Kolaborasi - SIMANIS Project

## 📊 Informasi Repository

**Repository Owner:**

- Username: `wiwinpsrb`
- Email: syirahamirahlubis@gmail.com
- Repository: https://github.com/wiwinpsrb/simanis.git

## 👥 Contributors

### 1. Wiwin Pasaribu (Owner)

- **GitHub**: wiwinpsrb
- **Email**: syirahamirahlubis@gmail.com
- **Role**: Project Owner & Main Developer

### 2. wiwinpa5aribu (Replit Collaborator)

- **GitHub**: wiwinpa5aribu
- **Email**: 49928044-wiwinpa5aribu@users.noreply.replit.com
- **Role**: Development via Replit
- **Commits**: Phase 2 features (Dashboard, Depreciation, Audit Trail)

### 3. Jeje Xiang (AI Assistant)

- **Email**: xxxjejexian9
- **Role**: AI Development Assistant
- **Commits**: Phase 1 & Phase 2 initial implementation

## 🔧 Git Configuration

### Konfigurasi Lokal (Repository ini)

```bash
git config --local user.name "Wiwin Pasaribu"
git config --local user.email "syirahamirahlubis@gmail.com"
```

### Verifikasi Konfigurasi

```bash
# Cek konfigurasi lokal
git config --local --list | Select-String "user"

# Cek konfigurasi global
git config --global --list | Select-String "user"
```

## 📋 Workflow Kolaborasi

### 1. Sebelum Mulai Coding

```bash
# Pastikan di branch master
git checkout master

# Pull perubahan terbaru dari GitHub
git pull origin master

# Cek status
git status
```

### 2. Membuat Perubahan

```bash
# Buat branch baru untuk fitur (opsional tapi direkomendasikan)
git checkout -b feat/nama-fitur

# Lakukan perubahan code...

# Cek file yang berubah
git status

# Add file yang diubah
git add .

# Commit dengan pesan yang jelas
git commit -m "feat: deskripsi perubahan"
```

### 3. Push ke GitHub

```bash
# Push ke branch
git push origin feat/nama-fitur

# Atau jika langsung ke master
git push origin master
```

### 4. Sinkronisasi dengan Replit

Replit akan otomatis pull perubahan dari GitHub jika:

- Repository sudah di-connect dengan GitHub
- Auto-pull enabled di Replit settings

## 🌿 Branching Strategy

### Branch Utama

- **`master`**: Production-ready code
- **`main`**: Backup branch (gitsafe-backup)

### Branch Fitur (Recommended)

Untuk setiap fitur baru, buat branch dengan format:

- `feat/nama-fitur` - Fitur baru
- `fix/nama-bug` - Bug fix
- `docs/nama-doc` - Dokumentasi
- `refactor/nama-refactor` - Refactoring

### Contoh:

```bash
git checkout -b feat/dashboard
# ... coding ...
git add .
git commit -m "feat: implement dashboard with stats cards"
git push origin feat/dashboard
```

## 📝 Commit Message Convention

Gunakan format berikut untuk commit message:

```
<type>: <description>

[optional body]
```

### Types:

- **feat**: Fitur baru
- **fix**: Bug fix
- **docs**: Perubahan dokumentasi
- **style**: Formatting, missing semicolons, dll
- **refactor**: Refactoring code
- **test**: Menambah test
- **chore**: Maintenance tasks

### Contoh:

```bash
git commit -m "feat: add QR scanner for inventory"
git commit -m "fix: resolve login validation error"
git commit -m "docs: update README with setup instructions"
```

## 🔄 Sinkronisasi Lokal ↔ GitHub ↔ Replit

### Alur Kerja Normal:

1. **Lokal (Windows) → GitHub**

   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin master
   ```

2. **GitHub → Replit** (Otomatis)

   - Replit akan auto-pull jika enabled
   - Atau manual: `git pull origin master` di Replit shell

3. **Replit → GitHub**

   - Replit akan auto-commit & push
   - Atau manual di Replit shell

4. **GitHub → Lokal**
   ```bash
   git pull origin master
   ```

## ⚠️ Troubleshooting

### Jika Ada Conflict

```bash
# Pull dengan rebase
git pull --rebase origin master

# Jika ada conflict, resolve manually lalu:
git add .
git rebase --continue

# Atau abort rebase
git rebase --abort
```

### Jika Lupa Pull Sebelum Push

```bash
# Pull dengan merge
git pull origin master

# Resolve conflicts jika ada
git add .
git commit -m "merge: resolve conflicts"
git push origin master
```

### Reset ke Commit Tertentu (Hati-hati!)

```bash
# Lihat history
git log --oneline -10

# Reset ke commit tertentu (soft - keep changes)
git reset --soft <commit-hash>

# Reset ke commit tertentu (hard - discard changes)
git reset --hard <commit-hash>
```

## 📊 Status Saat Ini

### Latest Commit

```
cb1f30b - Wiwin Pasaribu : replit
```

### Struktur Repository

```
simanis/
├── .git/                 # Git repository (root)
├── frontend/             # Frontend React app (NO nested .git)
│   ├── src/
│   ├── public/
│   └── ...
├── docs/                 # Documentation
├── .kiro/               # Specs & tasks
└── README.md
```

### Verifikasi

✅ Repository structure: **BENAR** (tidak ada nested git)
✅ Git config lokal: **BENAR** (Wiwin Pasaribu)
✅ Remote origin: **BENAR** (https://github.com/wiwinpsrb/simanis.git)
✅ Sync status: **UP TO DATE** dengan GitHub

## 🎯 Best Practices

1. **Selalu pull sebelum mulai coding**

   ```bash
   git pull origin master
   ```

2. **Commit sering dengan pesan yang jelas**

   - Lebih baik banyak commit kecil daripada 1 commit besar

3. **Gunakan branch untuk fitur besar**

   - Jangan langsung commit ke master untuk fitur kompleks

4. **Review perubahan sebelum commit**

   ```bash
   git diff
   git status
   ```

5. **Jangan commit file yang tidak perlu**
   - Cek `.gitignore` sudah benar
   - Jangan commit `node_modules/`, `dist/`, dll

## 📞 Kontak

Jika ada masalah dengan Git/GitHub:

1. Cek dokumentasi ini terlebih dahulu
2. Lihat Git history: `git log --oneline -10`
3. Cek status: `git status`
4. Konsultasi dengan team

---

**Last Updated**: 2025-11-19
**Maintained by**: Wiwin Pasaribu (wiwinpsrb)
