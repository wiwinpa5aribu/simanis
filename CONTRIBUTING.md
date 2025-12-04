# Contributing to SIMANIS

## 🔒 Branch Protection Rules

> **PENTING**: Jangan pernah commit langsung ke `main` atau `develop`!

### Protected Branches

| Branch | Purpose | Direct Push |
|--------|---------|-------------|
| `main` | Production code | ❌ DILARANG |
| `develop` | Staging/integration | ❌ DILARANG |
| `feature/*` | Development work | ✅ Allowed |
| `fix/*` | Bug fixes | ✅ Allowed |
| `chore/*` | Maintenance | ✅ Allowed |

---

## 📋 Git Workflow

### 1. Mulai Fitur Baru

```bash
# Pastikan develop up-to-date
git checkout develop
git pull origin develop

# Buat feature branch
git checkout -b feature/nama-fitur

# Contoh nama branch yang baik:
# feature/login-page
# feature/asset-crud
# fix/auth-token-expired
# chore/update-dependencies
```

### 2. Selama Development

```bash
# Commit dengan conventional commits
git add .
git commit -m "feat(auth): add login functionality"

# Push ke remote
git push -u origin feature/nama-fitur
```

### 3. Selesai Development → PR ke Develop

```bash
# Push final changes
git push origin feature/nama-fitur

# Buat PR di GitHub:
# feature/nama-fitur → develop
```

**PR Checklist:**
- [ ] CI checks pass (lint, test, build)
- [ ] Code review approved
- [ ] No merge conflicts

### 4. Release ke Production

```bash
# Buat PR di GitHub:
# develop → main
```

**Release Checklist:**
- [ ] All tests pass
- [ ] QA approved
- [ ] No breaking changes (atau sudah documented)

---

## 📝 Conventional Commits

Format: `type(scope): description`

### Types

| Type | Kapan Digunakan |
|------|-----------------|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `docs` | Dokumentasi |
| `style` | Formatting (tidak ubah logic) |
| `refactor` | Refactoring code |
| `perf` | Performance improvement |
| `test` | Menambah/update tests |
| `build` | Build system changes |
| `ci` | CI/CD changes |
| `chore` | Maintenance tasks |

### Contoh

```bash
feat(auth): add JWT refresh token
fix(assets): resolve pagination bug
docs(readme): update installation guide
chore(deps): update dependencies
test(loans): add unit tests for return flow
```

---

## 🛡️ Branch Protection (GitHub Settings)

### Untuk `main` branch:

1. Require pull request before merging
2. Require approvals: 1
3. Require status checks to pass:
   - `lint`
   - `test-api`
   - `test-web`
   - `build`
4. Require branches to be up to date
5. Do not allow bypassing the above settings

### Untuk `develop` branch:

1. Require pull request before merging
2. Require status checks to pass:
   - `lint`
   - `test-api`
   - `test-web`
   - `build`

---

## 🚫 Yang TIDAK Boleh Dilakukan

```bash
# ❌ JANGAN LAKUKAN INI:
git checkout main
git commit -m "quick fix"
git push origin main

# ❌ JANGAN LAKUKAN INI:
git checkout develop
git commit -m "add feature"
git push origin develop

# ❌ JANGAN LAKUKAN INI:
git push --force origin main
git push --force origin develop
```

---

## ✅ Yang HARUS Dilakukan

```bash
# ✅ SELALU mulai dari develop
git checkout develop && git pull

# ✅ SELALU buat branch baru
git checkout -b feature/nama-fitur

# ✅ SELALU buat PR untuk merge
# feature/* → develop (via PR)
# develop → main (via PR)

# ✅ SELALU tunggu CI pass sebelum merge
```

---

## 🔧 Setup Local Git Hooks

Untuk mencegah push langsung ke protected branches, jalankan:

```bash
# Sudah otomatis via Husky
pnpm install
```

Hook akan mencegah:
- Push langsung ke `main`
- Push langsung ke `develop`
- Commit tanpa conventional commit format

---

## 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        WORKFLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  feature/xxx ──PR──► develop ──PR──► main                   │
│       │                  │              │                    │
│       │                  │              └── Production       │
│       │                  └── Staging/Testing                 │
│       └── Development                                        │
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ feature/ │───►│ develop  │───►│   main   │              │
│  │   fix/   │ PR │          │ PR │          │              │
│  │  chore/  │    │  (CI ✓)  │    │  (CI ✓)  │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
