# ADR 0006: Migrasi ke Bun sebagai Runtime & Package Manager Utama

## Status
**Active** (20 Des 2025)

## Context
Proyek sebelumnya menggunakan Node.js dan pnpm. Meskipun stabil, feedback loop pengembangan dirasa kurang cepat, terutama saat menjalankan script TypeScript, instalasi dependensi, dan hot-reloade dev server.

## Decision
Kami menetapkan **Bun** sebagai runtime, package manager, dan test runner utama proyek.
- Menggunakan `bun install` untuk manajemen paket (menghasilkan `bun.lock`).
- Menggunakan `bun dev` untuk menjalankan server pengembangan.
- Menggunakan `bun x` sebagai pengganti `npx` atau `pnpm exec`.

## Consequences
- **Pros**:
    - Instalasi dependensi jauh lebih cepat (10-20x).
    - Eksekusi file TypeScript instan tanpa tahap komit manual tambahan.
    - Cold-start Next.js dev server lebih responsif.
- **Cons**:
    - Membutuhkan instalasi Bun pada mesin developer (bersifat global).
    - Metadata `bun.lock` berbeda dengan `pnpm-lock.yaml`.

---
*Implementasi: `pnpm-lock.yaml` dan `node_modules` lama telah dibersihkan dan diganti dengan struktur Bun.*
