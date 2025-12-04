# GitHub Branch Protection Setup

> Panduan untuk setup branch protection di GitHub agar workflow konsisten.

## 🎯 Tujuan

Mencegah:
- Push langsung ke `main` atau `develop`
- Merge tanpa CI pass
- Merge tanpa code review

---

## 📋 Setup di GitHub

### Langkah 1: Buka Repository Settings

1. Buka repository di GitHub
2. Klik **Settings** (tab paling kanan)
3. Di sidebar kiri, klik **Branches**

### Langkah 2: Add Branch Protection Rule untuk `main`

1. Klik **Add branch protection rule**
2. Isi **Branch name pattern**: `main`
3. Centang opsi berikut:

#### Required Settings:

- [x] **Require a pull request before merging**
  - [x] Require approvals: `1`
  - [x] Dismiss stale pull request approvals when new commits are pushed
  
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Search dan tambahkan status checks:
    - `Lint & Format Check`
    - `API Tests & Coverage`
    - `Web Tests`
    - `Build All Apps`

- [x] **Require conversation resolution before merging**

- [x] **Do not allow bypassing the above settings**

- [x] **Restrict who can push to matching branches**
  - Kosongkan (tidak ada yang boleh push langsung)

4. Klik **Create** atau **Save changes**

### Langkah 3: Add Branch Protection Rule untuk `develop`

1. Klik **Add branch protection rule**
2. Isi **Branch name pattern**: `develop`
3. Centang opsi berikut:

#### Required Settings:

- [x] **Require a pull request before merging**
  - Require approvals: `0` (optional, bisa 1 untuk team)
  
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Search dan tambahkan status checks:
    - `Lint & Format Check`
    - `API Tests & Coverage`
    - `Web Tests`
    - `Build All Apps`

- [x] **Do not allow bypassing the above settings**

4. Klik **Create** atau **Save changes**

---

## ✅ Verifikasi Setup

Setelah setup, coba test:

```bash
# Ini harus GAGAL (blocked by pre-push hook)
git checkout main
echo "test" >> test.txt
git add . && git commit -m "test"
git push origin main
# Expected: Push ditolak oleh hook

# Ini harus BERHASIL
git checkout develop
git checkout -b feature/test-branch
echo "test" >> test.txt
git add . && git commit -m "feat: test commit"
git push -u origin feature/test-branch
# Expected: Push berhasil
```

---

## 🔧 Troubleshooting

### Hook tidak jalan?

```bash
# Pastikan husky terinstall
pnpm install

# Pastikan hooks executable
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

### Bypass hook (EMERGENCY ONLY)?

```bash
# HANYA untuk emergency, JANGAN digunakan rutin!
git push --no-verify origin main
```

### Reset branch protection?

Jika perlu reset, buka GitHub Settings > Branches > Edit rule > Delete rule

---

## 📊 Status Checks yang Diperlukan

| Check Name | Job di CI | Wajib Pass |
|------------|-----------|------------|
| `Lint & Format Check` | `lint` | ✅ Ya |
| `API Tests & Coverage` | `test-api` | ✅ Ya |
| `Web Tests` | `test-web` | ✅ Ya |
| `Build All Apps` | `build` | ✅ Ya |
| `Danger JS Code Review` | `danger` | ⚠️ Optional |

---

## 🎓 Best Practices

1. **Selalu buat feature branch** dari `develop`
2. **Gunakan conventional commits** untuk pesan commit
3. **Tunggu CI pass** sebelum merge
4. **Request review** untuk perubahan penting
5. **Squash merge** untuk keep history clean

---

## 📚 Referensi

- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
