# SIMANIS - Sistem Manajemen Aset Sekolah

[![CI](https://github.com/wiwinpa5aribu/simanis/actions/workflows/ci.yml/badge.svg)](https://github.com/wiwinpa5aribu/simanis/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/wiwinpa5aribu/simanis/branch/main/graph/badge.svg)](https://codecov.io/gh/wiwinpa5aribu/simanis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Sistem manajemen aset sekolah modern berbasis web dengan fitur QR code, inventory check, dan loan management.

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/wiwinpa5aribu/simanis.git
cd simanis

# Install dependencies (menggunakan pnpm)
pnpm install

# Setup database
pnpm --filter @simanis/database db:generate
pnpm --filter @simanis/database db:push

# Run development
pnpm run dev:api    # Backend di port 3000
pnpm run dev:web    # Frontend di port 5000
```

---

## 📊 Project Status

| Phase | Status | Coverage |
|-------|--------|----------|
| Phase 0: Documentation | ✅ Complete | - |
| Phase 1: Tooling | ✅ Complete | - |
| Phase 2: Monorepo | ✅ Complete | - |
| **Phase 3: Quality Gates** | **✅ Complete** | **85.49%** |
| Phase 4: Production | 🎯 Next | - |

**Latest Update:** December 3, 2025

---

## ✨ Features

### Core Features
- ✅ **Asset Management** - Create, read, update, delete aset sekolah
- ✅ **QR Code Integration** - Generate dan scan QR code untuk setiap aset
- ✅ **Inventory Check** - Periodic inventory checking dengan foto dan kondisi
- ✅ **Loan Management** - Peminjaman aset dengan tracking kondisi
- ✅ **Audit Trail** - Complete audit logging untuk semua perubahan
- ✅ **Category Management** - Kategorisasi aset dengan kode unik
- ✅ **Location Tracking** - Building, floor, dan room management

### Technical Features
- ✅ **Monorepo Architecture** - Organized dengan Turborepo
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Testing** - 181 tests dengan 85%+ coverage
- ✅ **CI/CD** - Automated testing dan building
- ✅ **Modern Tooling** - pnpm, Biome, Vitest

---

## 🏗️ Architecture

```
simanis/
├── apps/
│   ├── api/                 # Backend Fastify + Prisma
│   │   ├── src/
│   │   │   ├── application/ # Use cases & DTOs
│   │   │   ├── domain/      # Entities & Repositories
│   │   │   ├── infrastructure/ # Database, crypto, storage
│   │   │   ├── presentation/   # Controllers, routes, middleware
│   │   │   └── shared/      # Errors, utils, logger
│   │   └── tests/           # Unit & integration tests
│   └── web/                 # Frontend React + Vite
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── libs/        # API clients, stores, hooks
│       │   ├── routes/      # Page components
│       │   └── styles/      # Global styles
│       └── tests/           # Frontend tests
├── packages/
│   ├── database/            # Prisma client & types
│   └── shared/              # Shared constants & types
└── docs/                    # Documentation
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite (Rolldown)
- **Styling:** Tailwind CSS 4
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Router:** React Router 7

### Backend
- **Framework:** Fastify 4
- **Database:** MySQL 8 + Prisma ORM
- **Auth:** JWT + Argon2
- **Storage:** Local / Cloudflare R2
- **Queue:** BullMQ (optional)

### Dev Tools
- **Package Manager:** pnpm 9
- **Monorepo:** Turborepo 2.6
- **Linter/Formatter:** Biome 2.3
- **Testing:** Vitest 4 + fast-check
- **CI/CD:** GitHub Actions

---

## 📦 Installation

### Prerequisites
- Node.js 20+
- pnpm 9+
- MySQL 8+

### Steps

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup environment**
   ```bash
   # Copy example env files
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   
   # Edit with your configuration
   ```

3. **Setup database**
   ```bash
   # Generate Prisma Client
   pnpm --filter @simanis/database db:generate
   
   # Push schema to database
   pnpm --filter @simanis/database db:push
   
   # (Optional) Seed data
   pnpm --filter @simanis/database db:seed
   ```

4. **Run development servers**
   ```bash
   # Terminal 1: Backend
   pnpm run dev:api
   
   # Terminal 2: Frontend
   pnpm run dev:web
   ```

5. **Access application**
   - Frontend: http://localhost:5000
   - Backend: http://localhost:3000
   - API Docs: http://localhost:3000/docs (if available)

---

## 🧪 Testing

### Run Tests

```bash
# All tests
pnpm run test

# Backend tests with coverage
pnpm --filter @simanis/api test:cov

# Frontend tests
pnpm --filter @simanis/web test

# Watch mode
pnpm --filter @simanis/api test:watch

# UI mode
pnpm --filter @simanis/web test:ui
```

### Coverage Report

Current backend coverage: **85.49%** ✅

| Metric | Coverage | Target |
|--------|----------|--------|
| Statements | 85.49% | 80% ✅ |
| Branches | 77.21% | 75% ✅ |
| Functions | 80.76% | 80% ✅ |
| Lines | 85.26% | 80% ✅ |

---

## 🔨 Development

### Available Scripts

```bash
# Development
pnpm run dev           # Run all apps
pnpm run dev:web       # Frontend only
pnpm run dev:api       # Backend only

# Build
pnpm run build         # Build all packages

# Linting & Formatting
pnpm run lint          # Lint all packages
pnpm run lint:fix      # Fix lint issues
pnpm run format        # Format code
pnpm run format:check  # Check formatting

# Testing
pnpm run test          # Run all tests
pnpm run test:coverage # Run tests with coverage

# Database
pnpm run db:generate   # Generate Prisma Client
pnpm run db:migrate    # Run migrations
pnpm run db:push       # Push schema changes
pnpm run db:studio     # Open Prisma Studio

# Analysis
pnpm run knip          # Check unused dependencies
pnpm run knip:fix      # Remove unused dependencies
```

---

## 📚 Documentation

- [Architecture](docs/architecture.md)
- [Database Schema](docs/database.md)
- [CI/CD Pipeline](docs/ci-cd.md)
- [Development Guide](docs/development/)
- [Domain Model](docs/domain/model-domain.md)
- [Ubiquitous Language](docs/domain/ubiquitous-language.md)
- [Phase Documentation](docs/phases/)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards

- Use **pnpm** (not npm)
- Use **Biome** for linting and formatting
- Use **camelCase** for property names
- Write tests for new features
- Maintain ≥80% test coverage
- Follow existing code structure

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Wiwin Pasaribu** - [@wiwinpa5aribu](https://github.com/wiwinpa5aribu)

---

## 🙏 Acknowledgments

- [Fastify](https://fastify.dev/) - Lightning fast web framework
- [React](https://react.dev/) - UI library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Turborepo](https://turbo.build/) - High-performance build system
- [Biome](https://biomejs.dev/) - Fast linter and formatter
- [Vitest](https://vitest.dev/) - Blazing fast test runner

---

## 📞 Support

For support, email wiwinpa5aribu@example.com or open an issue on GitHub.

---

**Built with ❤️ using modern web technologies**
