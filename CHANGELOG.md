# Changelog

Semua perubahan penting pada proyek SIMANIS akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [Unreleased]

### Phase 4 - Production Ready (Planned)
- Environment configuration management
- Docker containerization
- Deployment automation
- Monitoring and logging setup
- Performance optimization
- Security hardening

---

## [1.1.0] - 2025-12-03

### Phase 3 - Quality Gates ✅ COMPLETE

#### Added - Testing Infrastructure
- **Test Coverage Setup**
  - Added `@vitest/coverage-v8` package for coverage reporting
  - Configured coverage thresholds (80% for statements/lines/functions, 75% for branches)
  - Added test scripts: `test:watch`, `test:cov`, `test:ui`
  - Configured multiple coverage reporters: text, json, html, lcov

#### Added - Backend Unit Tests (181 tests total, 85.49% coverage)

**Auth Module (17 tests)**
- `login.use-case.test.ts` - Login scenarios, error handling, edge cases
- `get-current-user.use-case.test.ts` - User retrieval, role handling, validation

**Assets Module (30 tests)**
- `get-assets.use-case.test.ts` - Pagination, filtering, empty results
- `update-asset.use-case.test.ts` - Field updates, audit logging, validation
- `delete-asset.use-case.test.ts` - Soft delete, berita acara, error handling

**Loans Module (17 tests)**
- `create-loan.use-case.test.ts` - Loan creation, multiple items, date handling
- `return-loan.use-case.test.ts` - Return processing, condition tracking, validation

**Categories Module (15 tests)**
- `create-category.use-case.test.ts` - Creation, conflict detection, edge cases
- `get-categories.use-case.test.ts` - Listing, empty results, data consistency

**Inventory Module (26 tests)**
- `create-inventory.use-case.test.ts` - Check creation, condition updates, audit trail
- `get-inventory.use-case.test.ts` - Pagination, filtering, DTO mapping

**Utilities (35 tests)**
- `qr-code.utils.test.ts` - QR generation, validation, parsing
- `pagination.utils.test.ts` - Pagination calculations, parameter sanitization

#### Added - CI/CD Pipeline
- **GitHub Actions Workflow** (`.github/workflows/ci.yml`)
  - Lint & Format Check job
  - API Tests & Coverage job with Codecov integration
  - Web Tests job
  - Build All Apps job with artifact uploads
  - Parallel execution for speed (4 jobs)
  - pnpm caching for performance (~2min savings)
  - Runs on push/PR to main/develop branches

#### Added - Documentation
- `docs/ci-cd.md` - Complete CI/CD pipeline documentation
- `docs/progress/PHASE_3_SUMMARY.md` - Detailed phase 3 completion report
- `README.md` - Project overview with badges and comprehensive setup guide
- Updated `docs/progress/CURRENT_STATUS.md` - Latest project status

#### Changed
- Updated `apps/api/vitest.config.ts` with coverage configuration and thresholds
- Updated `apps/api/package.json` with new test scripts
- Fixed QR code test timeouts by reducing property-based test runs

#### Performance
- **Coverage Achievement:**
  - Statements: 85.49% (Target: 80%) ✅ +5.49%
  - Branches: 77.21% (Target: 75%) ✅ +2.21%
  - Functions: 80.76% (Target: 80%) ✅ +0.76%
  - Lines: 85.26% (Target: 80%) ✅ +5.26%

- **CI/CD Performance:**
  - Total pipeline time: ~10-12 minutes
  - Parallel job execution saves ~5 minutes
  - pnpm caching saves ~2 minutes per run

---

## [1.0.1] - 2025-12-02

### Added
- Setup monorepo analysis tools (depcheck, madge, ts-prune)
- MCP servers untuk development (sequential-thinking, context7, playwright)

### Changed
- Refactor dashboard types untuk menghilangkan circular dependency

### Fixed
- Circular dependency antara dashboard.ts dan dashboard.mock.ts

### Removed
- File .env dari repository (security)
- Folder dist/ dari repository (build artifacts)
- Folder .kilocode/ (deprecated tool)

## [1.0.0] - 2025-12-02

### Added
- Initial release SIMANIS (Sistem Manajemen Aset Sekolah)
- Manajemen aset dengan QR Code
- Manajemen peminjaman (loans)
- Inventarisasi dengan foto dokumentasi
- Perhitungan penyusutan aset
- Manajemen lokasi (gedung, lantai, ruangan)
- Role-based access control (RBAC)
- Audit trail untuk semua perubahan
- PWA support untuk akses offline
- Dashboard dengan statistik real-time

### Technical
- Frontend: React 19 + TypeScript + Vite
- Backend: Fastify 4 + TypeScript + Prisma
- Database: MySQL 8.0
- State Management: Zustand + TanStack Query
- Styling: Tailwind CSS 4

---

## Panduan Versioning

### Major (X.0.0)
- Breaking changes
- Perubahan arsitektur besar
- Migrasi database yang tidak backward compatible

### Minor (0.X.0)
- Fitur baru
- Penambahan endpoint API
- Perubahan UI yang signifikan

### Patch (0.0.X)
- Bug fixes
- Security patches
- Performance improvements
- Documentation updates
