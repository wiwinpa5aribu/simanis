# Panduan Kontribusi SIMANIS

Selamat datang di proyek SIMANIS! Untuk menjaga proyek ini tetap konsisten , ikuti panduan berikut sebelum melakukan push ke GitHub.

## 1. Alur Kerja (Workflow)
- Buat branch baru untuk setiap fitur atau perbaikan bug: `git checkout -b feat/nama-fitur`.
- Lakukan perubahan sesuai dengan standar arsitektur **Feature-First**.
- Jalankan `npm run lint` dan `npx vitest` sebelum melakukan commit.

## 2. Standar Pesan Commit
Kami menggunakan **Conventional Commits**. Contoh:
- `feat(aset): tambah validasi harga perolehan`
- `fix(users): perbaikan bug modal tidak muncul`
- `refactor: optimasi service layer`

## 3. Aturan Arsitektur
- **Dilarang** mengimpor data mentah dari `lib/data.ts`. Gunakan service di `lib/services/`.
- **Wajib** menggunakan Zod untuk validasi data baru.
- Komponen UI harus dipisahkan ke dalam folder `components/` di masing-masing modul.

## 4. Pull Request
- Gunakan template yang sudah disediakan.
- Pastikan semua CI check (GitHub Actions) lulus sebelum meminta review.
- Satu PR sebaiknya hanya fokus pada satu fitur atau satu perbaikan.
