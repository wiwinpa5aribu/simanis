# ADR 0003: Schema Validation with Zod

## Status
**Active** (Updated 19 Des 2025)

## Context
Ketidakcocokan tipe data antara database dan UI sering menyebabkan runtime error, terutama pada field dinamis seperti status mutasi.

## Decision
Kami mewajibkan **Runtime Validation dengan Zod**.
- Setiap entitas memiliki skema di \lib/validations/\.
- Skema Zod digunakan untuk memvalidasi input form dan data dari database.
- Tipe TypeScript di-infer langsung dari skema Zod (\z.infer\).

## Consequences
- **Pros**:
    - Menjamin integritas data dari "Database -> UI".
    - Memberikan error message yang jelas saat data tidak sinkron.
- **Cons**:
    - Sedikit overhead performa saat validasi di sisi client.

---
*Implementasi: Konsistensi field \equester\, \
otes\, dan status mutasi terjamin.*
