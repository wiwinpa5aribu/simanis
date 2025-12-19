# Panduan Stabilitas & CI/CD - SIMANIS

Dokumen ini berisi prinsip-prinsip utama untuk menjaga proyek SIMANIS tetap stabil, konsisten, dan bebas error dalam jangka panjang, terutama pada alur kerja CI/CD (GitHub Actions).

## 1. Kontrak Data via Zod
Validasi data adalah benteng pertahanan pertama kita. Semua data dari sumber eksternal (Mock, API, DB) **wajib** divalidasi melalui skema Zod di `lib/validations/`.

*   **Aturan Emas**: Jangan mengubah struktur data tanpa memperbarui skema Zod terkait.
*   **Contoh**: Jika `parentId` pada `TLocation` bisa bernilai `null`, pastikan skema menggunakan `.nullable()`.
*   **Kenapa?**: Mencegah "Prerender Error" saat build akibat ketidakcocokan data.

## 2. Abstraksi Service Layer
Hindari mengimpor data mentah langsung ke dalam komponen UI. Gunakan service yang tersedia di `lib/services/`.

*   **Pola**: `UI -> Service -> Validation -> Data`.
*   **Manfaat**: Perubahan pada struktur data hanya memerlukan perbaikan di satu file Service, bukan di puluhan komponen UI.

## 3. Disiplin Tooling & Dependencies
Kesamaan lingkungan lokal dan CI adalah kunci keberhasilan build.

*   **pnpm-lock.yaml**: Jangan pernah menghapus atau mengabaikan file ini. Ia menjamin versi *library* di GitHub sama persis dengan di komputer Anda.
*   **Versi Node/pnpm**: Pastikan versi di `.github/workflows/main_ci.yml` sinkron dengan versi lokal. Saat ini kita menggunakan Node 20 dan pnpm 10.

## 4. Pre-flight Check (Lokal)
Jangan biarkan GitHub menjadi alat uji coba pertama. Lakukan pengecekan mandiri sebelum melakukan `git push`.

Jalankan perintah ini secara berurutan:
```bash
# 1. Cek Linting
pnpm run lint

# 2. Jalankan Test
pnpm exec vitest run

# 3. Uji Build (Sangat Penting)
pnpm run build
```
Jika ketiga perintah di atas lulus secara lokal, kemungkinan besar CI/CD di GitHub akan berwarna hijau.

## 5. Strategi Commit & Branch
*   **Conventional Commits**: Gunakan format pesan commit yang jelas (misal: `fix:`, `feat:`, `chore:`).
*   **Small Commits**: Lakukan commit untuk satu perubahan fitur/perbaikan kecil agar jika terjadi error, pelacakan menjadi sangat mudah.
*   **Branch Protection**: Jangan mematikan pengecekan status di GitHub. Pastikan integrasi selalu lulus sebelum kode digabungkan ke `main`.

---
*Dibuat dengan tujuan menjaga SIMANIS tetap handal dan mudah dikembangkan oleh siapa saja (Manusia atau AI).*
