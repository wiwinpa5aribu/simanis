# Implementation Tasks: SIMANIS Frontend – Phase 1 (Realistis & Minimal)

Daftar tugas implementasi frontend berdasarkan `requirements.md` dan `design.md`
Phase 1. Fokus: **Login, Kategori, Aset, Mutasi Lokasi sederhana, Peminjaman basic**.
Tidak ada PWA, QR kamera, dashboard, inventarisasi, penyusutan, laporan, dll.

Setiap task di bawah ini dapat menjadi 1–2 commit kecil di repo:
`https://github.com/wiwinpa5aribu/simanis.git`.

---

## 1. Setup Proyek & Infrastruktur Dasar

### 1.1. Inisialisasi Proyek Vite + React + TypeScript

- [x] Buat project `frontend` dengan Vite template React TS.
- [x] Aktifkan TypeScript **strict mode** di `tsconfig.json`.
- [x] Tambahkan path alias `@` ke folder `src`.
- [x] Commit awal: struktur dasar Vite + TS.

### 1.2. Setup Tailwind CSS

- [x] Install Tailwind, PostCSS, Autoprefixer.
- [x] Buat `tailwind.config.js`, `postcss.config.js`.
- [x] Tambahkan direktif Tailwind ke `src/styles/index.css`.
- [x] Uji satu komponen sederhana menggunakan kelas Tailwind.

### 1.3. Struktur Folder Sesuai Desain

- [x] Buat struktur folder:
  - `src/main.tsx`, `src/App.tsx`.
  - `src/routes/{auth,assets,categories,loans,mutations}/`.
  - `src/components/{layout,ui,forms}/`.
  - `src/libs/{api,store,validation}/`.
  - `src/styles/index.css`.
- [x] Tambahkan komentar Bahasa Indonesia di beberapa file awal (mis. `main.tsx`, `App.tsx`).

### 1.4. Instalasi Library Inti

- [x] Install:
  - React Router v6
  - Zustand
  - @tanstack/react-query v5
  - Axios
  - React Hook Form + @hookform/resolvers
  - Zod
- [x] Buat `QueryClient` dan bungkus app dengan `QueryClientProvider` di `main.tsx`.

### 1.5. Konfigurasi API Client & Auth Store

- [x] Buat `src/libs/store/authStore.ts` (Zustand + persist) dengan state:
  - `user`, `token`, `isAuthenticated`, `login()`, `logout()`.
- [x] Buat `src/libs/api/client.ts` (Axios instance):
  - `baseURL` dari `import.meta.env.VITE_API_URL`.
  - Interceptor request untuk menyisipkan header `Authorization: Bearer <token>`.

---

## 2. Routing & Layout Dasar

### 2.1. Routing Dasar

- [x] Pasang React Router dengan rute:
  - `/login`
  - `/` (root, nanti redirect ke `/assets`)
  - `/assets`, `/assets/new`, `/assets/:id`
  - `/categories`
  - `/loans`, `/loans/new`
- [x] Buat `ProtectedRoute` sederhana:
  - Cek `useAuthStore().isAuthenticated`.
  - Jika `false` → `Navigate` ke `/login`.

### 2.2. Layout Utama (AppLayout)

- [x] Buat `components/layout/AppLayout.tsx`:
  - Header: judul aplikasi, info user, tombol logout.
  - Sidebar: link ke `Aset`, `Kategori`, `Peminjaman`.
  - Area konten: `<Outlet />`.
- [x] Pastikan layout responsif sederhana (sidebar boleh fixed di desktop, stack di mobile).

---

## 3. Fitur Autentikasi (Login + Logout)

### 3.1. Skema & API Auth

- [x] Buat `libs/validation/authSchemas.ts`:
  - Skema Zod `loginSchema` (username/email & password required).
- [x] Buat `libs/api/auth.ts`:
  - Fungsi `login(credentials)` → `POST /auth/login`.

### 3.2. Halaman Login

- [x] Buat `routes/auth/LoginPage.tsx`:
  - Form React Hook Form + Zod.
  - Field: username/email, password.
  - Panggil API `login`, lalu `authStore.login(user, token)`.
  - Redirect ke `/assets` setelah sukses.
  - Tampilkan error pesan dari backend jika gagal.
- [x] Tambahkan komentar Bahasa Indonesia yang menjelaskan alur login.

### 3.3. Logout

- [x] Tambah tombol "Logout" di header (`AppLayout`).
- [x] Klik logout:
  - Panggil `authStore.logout()`.
  - Redirect ke `/login`.

---

## 4. Fitur Kategori Aset (Sederhana)

### 4.1. Skema & API Kategori

- [x] Buat `libs/validation/categorySchemas.ts` dengan `categorySchema` (field `name`).
- [x] Buat `libs/api/categories.ts`:
  - `getCategories()` → `GET /categories`.
  - `createCategory(data)` → `POST /categories`.
  - `updateCategory(id, data)` → `PUT /categories/:id`.
  - `deleteCategory(id)` → `DELETE /categories/:id`.

### 4.2. Halaman CategoriesPage

- [x] Buat `routes/categories/CategoriesPage.tsx`:
  - Gunakan `useQuery` untuk daftar kategori.
  - Tampilkan tabel sederhana (`nama`).
  - Tombol "Tambah Kategori" membuka form (inline atau modal).
  - Form create/edit menggunakan React Hook Form + Zod.
  - Gunakan `useMutation` untuk create/update/delete, dan `invalidateQueries` setelah sukses.
- [x] Tangani error API (mis. duplikat) dengan menampilkan pesan.
- [x] Tambahkan komentar Bahasa Indonesia di file ini.

---

## 5. Fitur Aset (List & Create Minimal)

### 5.1. Skema & API Aset

- [x] Buat `libs/validation/assetSchemas.ts`:
  - Field minimal: `kode_aset`, `nama_barang`, `category_id`, `kondisi`.
  - Pesan error dalam Bahasa Indonesia.
- [x] Buat `libs/api/assets.ts`:
  - `getAssets()` → `GET /assets`.
  - `getAssetById(id)` → `GET /assets/:id`.
  - `createAsset(data)` → `POST /assets`.

### 5.2. Halaman AssetsListPage

- [x] Buat `routes/assets/AssetsListPage.tsx`:
  - `useQuery` untuk daftar aset.
  - Tampilkan tabel: `kode_aset`, `nama_barang`, `kategori`, `kondisi`.
  - Tombol "Tambah Aset" → navigate ke `/assets/new`.
  - Tampilkan loading & error state dengan komponen reusable.

### 5.3. Halaman AssetCreatePage

- [x] Buat `routes/assets/AssetCreatePage.tsx`:
  - Form React Hook Form + Zod.
  - Dropdown kategori (fetch dari API kategori).
  - Dropdown kondisi (enum statis di frontend).
  - Submit → `createAsset`, redirect ke `/assets` setelah sukses.
  - Tampilkan error `kode_aset` duplikat jika backend mengembalikan error.
- [x] Tambahkan komentar penjelas alur pada file ini.

### 5.4. Halaman AssetDetailPage (Dasar)

- [x] Buat `routes/assets/AssetDetailPage.tsx`:
  - `useParams` untuk `id`, `useQuery` untuk detail aset.
  - Tampilkan info dasar aset.
  - Siapkan section untuk menampilkan lokasi saat ini & riwayat mutasi (sederhana).

---

## 6. Fitur Mutasi Lokasi Sederhana

### 6.1. API Mutasi & Lokasi (Minimal)

- [x] Buat `libs/api/mutations.ts`:
  - `getAssetMutations(assetId)` → `GET /assets/:id/mutations`.
  - `createMutation(assetId, data)` → `POST /assets/:id/mutations`.
- [x] Jika backend menyediakan endpoint ruangan:
  - Buat `libs/api/rooms.ts` → `getRooms()`.

### 6.2. UI Mutasi di AssetDetailPage

- [x] Di `AssetDetailPage.tsx`:
  - Tampilkan lokasi saat ini (field dari detail aset atau mutasi terakhir).
  - Dropdown ruangan (data dari `getRooms()`).
  - Tombol "Mutasi Lokasi" → panggil `createMutation`.
  - Setelah sukses, `refetch` detail aset & riwayat mutasi.
- [x] Tampilkan list riwayat mutasi sederhana (tanggal, dari, ke) jika data tersedia.

---

## 7. Fitur Peminjaman Aset – Basic

### 7.1. Skema & API Peminjaman

- [x] Buat `libs/validation/loanSchemas.ts`:
  - Field: `borrower` (atau `borrowerId`), `assetId`, `tujuan_pinjam`.
- [x] Buat `libs/api/loans.ts`:
  - `getLoans()` → `GET /loans`.
  - `createLoan(data)` → `POST /loans`.
  - `returnLoan(id)` → `POST /loans/:id/return` atau `PATCH /loans/:id`.

### 7.2. Halaman LoansListPage

- [x] Buat `routes/loans/LoansListPage.tsx`:
  - `useQuery` daftar peminjaman.
  - Tabel: `peminjam`, `tanggal_pinjam`, `status`.
  - Tombol "Tambah Peminjaman" → navigate ke `/loans/new`.
  - Tombol "Tandai Dikembalikan" untuk baris dengan status `Dipinjam`.

### 7.3. Halaman LoanCreatePage

- [x] Buat `routes/loans/LoanCreatePage.tsx`:
  - Form React Hook Form + Zod.
  - Dropdown aset (gunakan `getAssets` untuk daftar aset yang tersedia).
  - Input peminjam (dropdown user atau teks sesuai desain backend).
  - Field `tujuan_pinjam`.
  - Submit → `createLoan`, redirect ke `/loans` setelah sukses.

---

## 8. Polishing Minimal & Kriteria Sukses

### 8.1. Komponen Reusable untuk Loading & Error

- [x] Buat `components/ui/Loading.tsx`:
  - Spinner + teks, komentar Bahasa Indonesia.
- [x] Buat `components/ui/ErrorAlert.tsx`:
  - Tampilan error sederhana dengan warna merah.

### 8.2. Review Komentar & Konsistensi

- [x] Pastikan setiap file utama memiliki komentar Bahasa Indonesia di bagian atas.
- [x] Pastikan nama komponen & fungsi konsisten (PascalCase vs camelCase).

### 8.3. Uji Alur Utama (Manual)

- [x] Login → berhasil & redirect.
- [x] Akses halaman tanpa login → redirect ke `/login`.
- [x] CRUD kategori berjalan.
- [x] Tambah aset & lihat di daftar.
- [x] Ubah lokasi aset via mutasi sederhana.
- [x] Tambah peminjaman & tandai dikembalikan.
- [x] Tidak ada error fatal di console untuk alur di atas.

---

**Status**: Draft task list Phase 1 – hanya mencakup bagian yang realistis & minimal.

---
