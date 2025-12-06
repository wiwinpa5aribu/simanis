# SIMANIS - Sistem Manajemen Aset Sekolah

## Purpose
School asset management system (Indonesian) to track, manage, and report on school assets throughout their lifecycle.

## Core Features
- Asset Management: Track assets with unique codes, QR codes, categories, conditions, locations
- Loan Management: Asset borrowing with condition tracking before/after
- Inventory Checks: QR-based verification with photo documentation
- Depreciation Tracking: Straight-line method calculation
- Audit Trail: Complete logging of entity changes
- Reports: KIB (Kartu Inventaris Barang) and asset reports
- User Management: Role-based access (Admin, Operator)

## Domain Terminology (Indonesian)
- Aset/Barang - Asset/Item
- Pinjaman - Loan
- Penyusutan - Depreciation
- Inventarisasi - Inventory check
- Mutasi - Asset location transfer
- Kondisi - Condition (Baik/Rusak Ringan/Rusak Berat)
- Sumber Dana - Funding source (BOS/APBD/Hibah)
- Masa Manfaat - Useful life (years)
- Nilai Buku - Book value

## Tech Stack
- **Monorepo**: pnpm 10.x workspaces + Turborepo
- **API**: Fastify 4.x, Prisma ORM, MySQL 8.0, JWT auth, BullMQ
- **Web**: React 19, Vite, React Router 7, Zustand, React Query, Tailwind CSS 4
- **Shared**: Zod schemas, calculation utilities
- **Testing**: Vitest, fast-check, @testing-library/react
- **Linting**: Biome (replaces ESLint + Prettier)
