# ADR 0008: Standarisasi Kualitas Kode & DX (Developer Experience)

## Status
**Active** (20 Des 2025)

## Context
Inkoneistensi formatting antar developer menyebabkan diff git yang "kotor" dan menyulitkan AI assistant dalam memberikan saran refactoring yang akurat. Kode juga kurang terlindungi dari kesalahan tipe dasar.

## Decision
Kami memperketat standar kualitas kode dengan langkah-langkah berikut:
1.  **Formating**: Mewajibkan **Prettier** dengan integrasi ESLint.
2.  **Strict TS**: Mengaktifkan `strict` mode, `noImplicitAny`, dan `sourceMap` di `tsconfig.json`.
3.  **Logging**: Mengaktifkan Prisma Query Logging di mode `development` untuk transparansi operasi database.
4.  **Source Maps**: Menambahkan `source-map-support` untuk stack trace error yang menunjuk langsung ke baris TypeScript asli.

## Consequences
- **Pros**:
    - Base code yang bersih dan mudah dibaca oleh manusia maupun AI.
    - Debugging jauh lebih cepat dengan query log dan source maps.
    - Catch bug lebih dini berkat aturan TypeScript yang ketat.
- **Cons**:
    - Developer harus mengikuti aturan linting/formatting yang ketat.

---
*Implementasi: Terintegrasi dalam `package.json`, `tsconfig.json`, dan `.prettierrc`.*
