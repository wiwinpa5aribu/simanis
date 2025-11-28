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
```

## 🧪 Testing

```bash
# Frontend tests
npm run test:run
npm run test:coverage

# Backend tests
cd backend && npm test
```

## 🔍 Code Quality

Sebelum commit, pastikan:

1. **Lint pass**: `npm run lint`
2. **Format check**: `npm run format:check`
3. **Tests pass**: `npm run test:run`
4. **Type check**: `npx tsc --noEmit`

Pre-commit hooks akan otomatis menjalankan lint dan format.

## 🌿 Branch Naming

```
feature/nama-fitur
fix/nama-bug
docs/nama-dokumentasi
refactor/nama-refactor
```

## 📦 Pull Request

1. Buat branch dari `develop`
2. Commit dengan conventional commit format
3. Push dan buat PR ke `develop`
4. Isi PR template dengan lengkap
5. Tunggu review dan CI pass

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
└── .github/             # CI/CD, templates
```

## ❓ Questions?

Buat issue dengan label `question` jika ada pertanyaan.
