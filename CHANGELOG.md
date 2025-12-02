# Changelog

Semua perubahan penting pada proyek SIMANIS akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [Unreleased]

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
