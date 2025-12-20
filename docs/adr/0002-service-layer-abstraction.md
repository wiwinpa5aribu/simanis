# ADR 0002: Service Layer Abstraction

## Status
**Active** (Updated 19 Des 2025)

## Context
Awalnya sistem menggunakan data statis. Migrasi ke database memerlukan lapisan yang memisahkan logika akses data dari tampilan UI.

## Decision
Kami menggunakan **Service Layer Abstraction** di \lib/services/\.
- UI tidak boleh memanggil database secara langsung.
- Setiap service menggunakan **Prisma Client** untuk operasi CRUD.
- Service mengembalikan objek yang sudah divalidasi oleh Zod.

## Consequences
- **Pros**:
    - Mudah untuk mengganti provider database atau strategi caching tanpa mengubah UI.
    - Testability: Service dapat di-test secara independen.
- **Cons**:
    - Menambah lapisan kode tambahan (boilerplate) untuk setiap entitas.

---
*Implementasi: Full persistence menggunakan MySQL & Prisma.*
