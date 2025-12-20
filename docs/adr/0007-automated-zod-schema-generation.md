# ADR 0007: Otomatisasi Skema Zod dengan zod-prisma-types

## Status
**Active** (20 Des 2025)

## Context
Sebelumnya skema Zod ditulis secara manual di `lib/validations/`. Hal ini menyebabkan redundansi data dan risiko *desync* jika schema database berubah namun validasi UI tidak diperbarui.

## Decision
Kami mengintegrasikan **`zod-prisma-types`** sebagai generator di dalam `schema.prisma`.
- Skema Zod untuk setiap model database dihasilkan secara otomatis setiap kali menjalankan `bun x prisma generate`.
- Kode aplikasi diarahkan untuk menggunakan skema hasil generate di `lib/generated/zod/` untuk operasi CRUD umum.

## Consequences
- **Pros**:
    - Integritas tipe 100% sinkron antara Database ↔ Server ↔ Client.
    - Mengurangi kode boilerplate (tidak perlu menulis validasi field database secara manual).
    - Memudahkan AI dalam memahami relasi dan tipe data proyek.
- **Cons**:
    - Ukuran file hasil generate cukup besar (single index file).
    - Butuh pemilahan antara skema database murni dan skema input UI (omitting fields).

---
*Implementasi: Tersedia di `lib/generated/zod/index.ts`.*
