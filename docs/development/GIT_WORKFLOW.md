# Git Workflow & Branching Strategy

> Dokumen ini menjelaskan branching strategy untuk SIMANIS project.

---

## Branch Structure

```
main (production)
  │
  └── develop (integration)
        │
        ├── feature/xxx (new features)
        ├── fix/xxx (bug fixes)
        ├── refactor/xxx (code improvements)
        └── docs/xxx (documentation)
```

---

## Branch Descriptions

| Branch | Purpose | Protected | Deploy To |
|--------|---------|-----------|-----------|
| `main` | Production-ready code | ✅ Yes | Production |
| `develop` | Integration branch | ✅ Yes | Staging |
| `feature/*` | New features | ❌ No | - |
| `fix/*` | Bug fixes | ❌ No | - |
| `refactor/*` | Code improvements | ❌ No | - |
| `docs/*` | Documentation updates | ❌ No | - |

---

## Workflow Rules

### 1. Never Commit Directly to Main
```bash
# ❌ SALAH
git checkout main
git commit -m "some change"

# ✅ BENAR
git checkout develop
git checkout -b feature/my-feature
# ... make changes ...
git commit -m "feat: add my feature"
git push origin feature/my-feature
# Create PR to develop
```

### 2. Feature Branch Naming
```bash
# Format: <type>/<short-description>

feature/asset-export        # New feature
fix/pagination-bug          # Bug fix
refactor/api-service-layer  # Code improvement
docs/update-readme          # Documentation
chore/update-dependencies   # Maintenance
```

### 3. Commit Message Format
```bash
# Format: <type>: <description>

feat: add asset export to Excel
fix: resolve pagination offset error
refactor: extract API service layer
docs: update installation guide
chore: upgrade React to v19
test: add unit tests for loan service
```

---

## Pull Request Process

### From Feature to Develop
1. Create feature branch from `develop`
2. Make changes and commit
3. Push to origin
4. Create PR to `develop`
5. Wait for review/CI
6. Merge (squash recommended)

### From Develop to Main
1. Ensure `develop` is stable
2. Create PR from `develop` to `main`
3. Review all changes since last release
4. Merge (merge commit, not squash)
5. Tag release version

---

## Commands Reference

### Starting New Work
```bash
# Update develop first
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/my-feature
```

### Finishing Work
```bash
# Commit changes
git add .
git commit -m "feat: description"

# Push to origin
git push origin feature/my-feature

# Then create PR via GitHub
```

### Syncing with Develop
```bash
# If develop has new changes
git checkout feature/my-feature
git fetch origin
git rebase origin/develop

# Or merge (if rebase is complex)
git merge origin/develop
```

---

## Protected Branch Rules

### Main Branch
- ✅ Require PR before merge
- ✅ Require status checks (CI)
- ✅ Require 1 approval (if team)
- ✅ No force push
- ✅ No deletion

### Develop Branch
- ✅ Require PR before merge
- ✅ Require status checks (CI)
- ❌ Approval optional for solo dev
- ✅ No force push
- ✅ No deletion

---

## AI Coding & Git

### Rules for AI
1. **JANGAN** commit langsung ke `main` atau `develop`
2. **SELALU** bekerja di feature branch
3. **SELALU** gunakan commit message format yang benar
4. **UPDATE** docs sebelum commit

### Suggested Workflow
```bash
# AI should suggest:
git checkout -b feature/task-name
# ... make changes ...
git add .
git commit -m "feat: description"
git push origin feature/task-name
# User creates PR manually
```

---

## Release Process

### Version Tagging
```bash
# After merging to main
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Semantic Versioning
- `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

---

## Current Status

| Branch | Status | Last Updated |
|--------|--------|--------------|
| `main` | ✅ Active | - |
| `develop` | ✅ Active | - |

> Update tabel ini setiap kali ada perubahan signifikan pada branch structure.
