# ADR 0001: Feature-First Architecture

## Status
**Active** (Updated 19 Des 2025)

## Context
SIMANIS tumbuh menjadi aplikasi kompleks dengan banyak modul dashboard. Mengelola semua komponen dalam satu folder \components\ global menyulitkan pemeliharaan.

## Decision
Kami menetapkan struktur **Feature-First**. Setiap modul dashboard (Aset, Lokasi, Mutasi, dsb.) memiliki folder sendiri yang berisi:
- \page.tsx\ (Server Component)
- \components/\ (Client/Server components lokal)
- \hooks/\ (Optional, client-side logic)

## Consequences
- **Pros**:
    - Kohesi tinggi: kode yang berkaitan berada di tempat yang sama.
    - Navigasi kode oleh AI menjadi jauh lebih efisien.
- **Cons**:
    - Struktur folder menjadi lebih dalam.

---
*Implementasi: 12 rute dashboard telah terverifikasi menggunakan struktur ini.*
