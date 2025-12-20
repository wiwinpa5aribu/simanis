# Panduan Pengembangan (Developer Guide) SIMANIS

Dokumen ini berisi informasi krusial bagi developer untuk menjaga stabilitas dan kecepatan pengembangan proyek SIMANIS.

## 🛠️ Stack & Workflow Dasar
- **Runtime**: Bun (Wajib terinstal di sistem).
- **Package Manager**: Bun (`bun install` bukan `npm install`).
- **Dev Server**: `bun dev`.
- **Database**: Prisma + MySQL.
- **Formatting**: Prettier (Otomatis dijalankan oleh IDE atau via `bun run format`).

## ⚠️ Aturan "Dos & Don'ts" (Mencegah Kesalahan)

### 1. Perubahan Schema Database
- **Jangan** mengubah tabel langsung di database (PHPMyAdmin/MySQL Workbench).
- **Selalu** ubah di `prisma/schema.prisma`.
- Jalankan `bun x prisma generate` setelah setiap perubahan schema untuk memperbarui skema Zod otomatis.
- Gunakan `bun x prisma migrate dev` untuk sinkronisasi database.

### 2. Validasi Data
- **Gunakan** skema Zod yang sudah di-generate di `lib/generated/zod` untuk operasi CRUD standar.
- Jika butuh validasi kustom (misal: password confirmation), buat skema baru di `lib/validations/` dengan melakukan `extend` dari skema generate.

### 3. Debugging
- Cek terminal saat mode `dev` untuk melihat **Query SQL** yang dijalankan oleh Prisma.
- Gunakan `bun x prisma studio` untuk melihat data secara visual.

## 🚀 Sebelum Commit
Pastikan Anda menjalankan perintah berikut untuk menjaga kualitas kode:
1. `bun run format` - Pastikan kode rapi.
2. `bun x tsc --noEmit` - Pastikan tidak ada error TypeScript yang terlewat.

---
*Pemberitahuan: Pelanggaran terhadap standar ini akan menyebabkan kegagalan pada pipeline CI/CD proyek.*
