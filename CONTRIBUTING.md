# Panduan Kontribusi SIMANIS

Terima kasih telah berkontribusi pada SIMANIS! 🎉

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/wiwinpa5aribu/simanis.git
cd simanis

# Install dependencies
npm install
cd backend && npm install && cd ..

# Setup database
cd backend
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
cd ..

# Run development
npm run dev          # Frontend (port 5000)
cd backend && npm run dev  # Backend (port 3000)
```

## 🌿 Git Flow Branching Strategy

```
main (protected)
  │
  ├── develop (integration branch)
  │     │
  │     ├── feature/add-qr-scanner
  │     ├── feature/bulk-import
  │     └── feature/kib-report
  │
  ├── release/v1.1.0
  │
  ├── hotfix/critical-auth-fix
  │
  └── bugfix/loan-calculation
```

### Branch Types

| Branch | Base | Merge To | Naming | Purpose |
|--------|------|----------|--------|---------|
| `main` | - | - | `main` | Production-ready code (protected) |
| `develop` | main | main | `develop` | Integration branch |
| `feature/*` | develop | develop | `feature/nama-fitur` | New features |
| `bugfix/*` | develop | develop | `bugfix/nama-bug` | Bug fixes |
| `release/*` | develop | main + develop | `release/v1.x.x` | Release preparation |
| `hotfix/*` | main | main + develop | `hotfix/nama-fix` | Emergency production fixes |

### Workflow

1. **New Feature**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nama-fitur
   # ... work on feature ...
   git push origin feature/nama-fitur
   # Create PR to develop
   ```

2. **Bug Fix**
   ```bash
   git checkout develop
   git checkout -b bugfix/nama-bug
   # ... fix bug ...
   git push origin bugfix/nama-bug
   # Create PR to develop
   ```

3. **Release**
   ```bash
   git checkout develop
   git checkout -b release/v1.1.0
   # ... final testing, version bump ...
   # Create PR to main AND develop
   ```

4. **Hotfix (Emergency)**
   ```bash
   git checkout main
   git checkout -b hotfix/critical-fix
   # ... fix critical bug ...
   # Create PR to main AND develop
   ```

## 📝 Conventional Commits

Semua commit harus mengikuti format:

```
<type>(<scope>): <subject>
```

**Types:**
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Dokumentasi
- `style`: Formatting, semicolons, dll
- `refactor`: Refactoring code
- `perf`: Performance improvement
- `test`: Menambah/memperbaiki test
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Contoh:**
```
feat(assets): add QR code bulk print
fix(auth): resolve token refresh issue
docs: update API documentation
refactor(api): extract dashboard types to separate file
```

## 🧪 Testing

```bash
# Frontend tests
npm run test:run
npm run test:coverage

# Backend tests
cd backend && npm test

# Analysis tools
npm run knip              # Unused code detection
npx madge --circular src/ # Circular dependency check
npx depcheck              # Unused dependencies
```

## 🔍 Code Quality Checklist

Sebelum commit, pastikan:

- [ ] `npm run lint` - No errors
- [ ] `npm run format:check` - Formatting OK
- [ ] `npm run test:run` - Tests pass
- [ ] `npx tsc --noEmit` - No TypeScript errors
- [ ] `npx madge --circular src/` - No circular dependencies

Pre-commit hooks akan otomatis menjalankan lint dan format.

## 📐 Coding Standards

### Naming Convention: camelCase

Semua property menggunakan **camelCase** sesuai Prisma schema:

```typescript
// ✅ Benar
asset.kodeAset
asset.namaBarang
asset.categoryId

// ❌ Salah
asset.kode_aset
asset.nama_barang
```

### Zod v4 Enum Validation

Gunakan `message` bukan `errorMap`:

```typescript
// ✅ Benar
z.enum(['Baik', 'Rusak Ringan'], { message: 'Pilih kondisi valid' })

// ❌ Salah
z.enum(['Baik', 'Rusak Ringan'], { errorMap: () => ({ message: '...' }) })
```

### Vite Environment Variables

```typescript
// ✅ Benar (frontend)
import.meta.env.DEV
import.meta.env.VITE_API_URL

// ❌ Salah (tidak tersedia di browser)
process.env.NODE_ENV
```

### Unused Parameters

Gunakan underscore prefix untuk parameter yang intentionally unused:

```typescript
// ✅ Benar
constructor(_callback: CallbackType, _options?: OptionsType) {}

// ❌ Salah - akan error ESLint
constructor(callback: CallbackType, options?: OptionsType) {}
```

Dokumentasi lengkap: `.kiro/steering/coding-standards.md`

## 📦 Pull Request Process

1. Buat branch dari `develop` (atau `main` untuk hotfix)
2. Commit dengan conventional commit format
3. Push dan buat PR
4. Isi PR template dengan lengkap
5. Tunggu CI pass dan review approval
6. Squash merge ke target branch

### PR Title Format
```
feat(scope): description
fix(scope): description
docs: description
```

## 🏗️ Project Structure

```
simanis/
├── src/                 # Frontend React
│   ├── components/      # Reusable components
│   ├── routes/          # Page components
│   ├── libs/            # Utilities, hooks, stores
│   └── test/            # Test setup
├── backend/             # Backend Fastify
│   ├── src/
│   │   ├── application/ # Use cases, DTOs
│   │   ├── domain/      # Entities, repositories
│   │   ├── infrastructure/ # Database, external services
│   │   └── presentation/   # Controllers, routes
│   └── prisma/          # Database schema
├── shared/              # Shared types & constants
├── docs/                # Documentation
└── .github/             # CI/CD, templates
```

## 🏷️ Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature request |
| `documentation` | Documentation improvements |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `priority: high` | High priority |
| `priority: medium` | Medium priority |
| `priority: low` | Low priority |
| `platform: frontend` | Frontend related |
| `platform: backend` | Backend related |
| `platform: database` | Database related |

## ❓ Questions?

Buat issue dengan label `question` atau gunakan GitHub Discussions.
