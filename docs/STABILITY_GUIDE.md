# Stability & Quality Guide - SIMANIS

Panduan ini bertujuan untuk menjaga stabilitas sistem SIMANIS agar tetap handal dalam jangka panjang.

## 1. Prinsip "Database-First"
Setelah migrasi ke Prisma, database MySQL adalah sumber kebenaran tunggal.
- **Modifikasi Skema**: Selalu lakukan perubahan melalui \prisma/schema.prisma\ dan jalankan \prisma generate\.
- **Validasi Zod**: Pastikan setiap data dari database divalidasi dengan Zod di Service Layer sebelum dikirim ke UI.

## 2. CI/CD Resilience (Penting)
Untuk menjaga agar pipeline GitHub Actions tetap hijau:
- **pnpm Hoisting**: Kita menggunakan \shamefully-hoist=true\ di \.npmrc\ untuk memastikan Prisma Client dapat ditemukan oleh Vitest.
- **Environment Variables**: Selalu sertakan \DATABASE_URL\ (meskipun dummy) di level *job* pada workflow GitHub Actions untuk menghindari error inisialisasi Prisma saat build/prerendering.
- **Postinstall**: Script \postinstall\ harus menggunakan \pnpm exec prisma generate\ untuk menjamin ketersediaan client setelah instalasi dependensi.

## 3. Rendering Strategy
- **Dashboard Dynamic**: Gunakan \export const dynamic = 'force-dynamic'\ pada layout dashboard untuk menghindari upaya koneksi database yang gagal selama proses *static prerendering* di CI runner.
- **Server Components**: Gunakan Server Components untuk *data fetching* demi performa dan keamanan.

## 4. Pre-flight Check (Lokal)
Wajib dijalankan sebelum melakukan \git push\:
\\\ash
# 1. Cek Linting
pnpm run lint

# 2. Jalankan Test (Mocked DB)
pnpm exec vitest run

# 3. Uji Build Produksi
pnpm run build
\\\

## 5. Pengembangan Berkelanjutan
- **Conventional Commits**: Budayakan pesan commit yang deskriptif (\ix:\, \eat:\, \efactor:\).
- **Documentation**: Selalu update \DOMAIN_GLOSSARY.md\ jika ada istilah bisnis baru yang masuk ke kode.

---
*Status Terakhir: Stabil - Seluruh rute dashboard (12) lulus prerendering.*
