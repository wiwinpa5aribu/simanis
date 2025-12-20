# Requirements Document

## Introduction

Migrasi proyek SIMANIS dari setup hybrid (pnpm + manual Zod schemas) ke setup standar sesuai ADR 0007 dan .cursorrules (Bun + zod-prisma-types). Tujuannya adalah sinkronisasi antara dokumentasi, konfigurasi, dan implementasi aktual.

## Glossary

- **Bun**: JavaScript runtime dan package manager yang diwajibkan oleh .cursorrules
- **zod-prisma-types**: Generator Prisma yang menghasilkan skema Zod otomatis dari schema.prisma
- **Generated_Schemas**: Skema Zod yang dihasilkan otomatis di lib/generated/zod/index.ts
- **Manual_Schemas**: Skema Zod yang ditulis manual di lib/validations/
- **CI_Pipeline**: GitHub Actions workflow di .github/workflows/main_ci.yml

## Requirements

### Requirement 1: Setup zod-prisma-types Generator

**User Story:** Sebagai developer, saya ingin skema Zod dihasilkan otomatis dari Prisma schema, sehingga validasi selalu sinkron dengan database.

#### Acceptance Criteria

1. WHEN prisma generate dijalankan, THE Generator SHALL menghasilkan file di lib/generated/zod/index.ts
2. THE Generated_Schemas SHALL mencakup semua model dari schema.prisma (Asset, Location, Mutation, User, AuditLog, StockOpnameSession)
3. THE Generated_Schemas SHALL mencakup semua enum dari schema.prisma
4. IF zod-prisma-types belum terinstall, THEN THE System SHALL menambahkannya sebagai devDependency

### Requirement 2: Migrasi Package Manager ke Bun

**User Story:** Sebagai developer, saya ingin menggunakan Bun sebagai satu-satunya package manager, sehingga konsisten dengan .cursorrules.

#### Acceptance Criteria

1. THE System SHALL memiliki file bun.lockb sebagai satu-satunya lock file
2. WHEN pnpm-lock.yaml dihapus, THE System SHALL tetap dapat menjalankan semua commands
3. THE package.json SHALL tidak memiliki dependency pada pnpm
4. WHEN developer menjalankan `bun install`, THE System SHALL menginstall semua dependencies dengan benar

### Requirement 3: Update CI/CD Pipeline

**User Story:** Sebagai developer, saya ingin CI/CD menggunakan Bun, sehingga pipeline konsisten dengan development environment.

#### Acceptance Criteria

1. THE CI_Pipeline SHALL menggunakan Bun untuk install dependencies
2. THE CI_Pipeline SHALL menggunakan `bun x` untuk menjalankan prisma generate
3. THE CI_Pipeline SHALL menggunakan `bun run` untuk lint, test, dan build
4. WHEN CI dijalankan, THE Pipeline SHALL berhasil tanpa error terkait package manager
5. THE CI_Pipeline SHALL setup Bun dengan versi yang kompatibel (>=1.0)

### Requirement 4: Integrasi Manual Schemas dengan Generated Schemas

**User Story:** Sebagai developer, saya ingin manual schemas di lib/validations/ tetap berfungsi dan terintegrasi dengan generated schemas.

#### Acceptance Criteria

1. THE Manual_Schemas di lib/validations/ SHALL tetap berfungsi untuk input validation
2. WHERE generated schemas tersedia, THE Manual_Schemas SHOULD menggunakan atau extend dari generated schemas
3. THE createAssetSchema, createLocationSchema, createMutationSchema, createUserSchema, createAuditLogSchema SHALL tetap valid
4. WHEN tests dijalankan, THE System SHALL pass semua 49 existing tests

### Requirement 5: Verifikasi dan Dokumentasi

**User Story:** Sebagai developer, saya ingin memastikan migrasi berhasil dan terdokumentasi dengan baik.

#### Acceptance Criteria

1. WHEN `bun x prisma generate` dijalankan, THE System SHALL menghasilkan Prisma Client dan Zod schemas
2. WHEN `bun run dev` dijalankan, THE Application SHALL berjalan tanpa error
3. WHEN `bun test` dijalankan, THE System SHALL pass semua tests
4. THE Migration SHALL tidak merusak fungsionalitas existing (forms, server actions, audit logs)
