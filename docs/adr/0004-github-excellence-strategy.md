# ADR 0004: GitHub Excellence Strategy

## Status
**Active** (Updated 19 Des 2025)

## Context
SIMANIS memerlukan infrastruktur kolaborasi yang disiplin agar kodenya tetap bersih, aman, dan mudah dikelola baik oleh pengembang manusia maupun agen AI.

## Decision
Kami mengadopsi standar "GitHub Excellence" dengan pilar berikut:
1.  **Strict CI Pipeline**: Setiap push ke main wajib melewati linting, vitest, dan next build.
2.  **Prisma CI Support**: Mengatasi limitasi module resolution di GitHub runner dengan:
    - Menetapkan shamefully-hoist=true di .npmrc.
    - Memasukkan prisma ke devDependencies.
3.  **Build Environment Isolation**: Menyediakan DATABASE_URL di level job pada GitHub Actions untuk menjamin ketersediaan env var selama proses kompilasi Turbopack.
4.  **Conventional Commits**: Standarisasi pesan commit untuk kemudahan pelacakan otomatis.

## Consequences
- **Pros**:
    - Build produksi di CI dijamin konsisten dengan build lokal.
    - Menghindari regression bug terkait skema database.
- **Cons**:
    - File workflow (main_ci.yml) sedikit lebih kompleks.

---
*Follow-up: Migrasi total ke Prisma berhasil dijalankan di CI dengan status Sukses.*
