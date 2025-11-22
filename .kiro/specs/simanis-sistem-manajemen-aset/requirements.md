# Requirements: SIMANIS Frontend – Phase 1 (Sangat Realistis & Minimal)

## 1. Tujuan Utama Phase 1

Membangun **SPA web frontend** yang:

- Sudah bisa **dipakai nyata di sekolah** untuk:
  - Login
  - Registrasi & melihat aset
  - Mutasi lokasi sederhana
  - Peminjaman dasar
- Menggunakan **1 codebase** (React + TS) yang rapi dan mudah di-maintenance:
  - **Komentar kode selalu dalam Bahasa Indonesia**
  - Struktur folder sederhana
- **Belum fokus PWA, QR scan kamera, dashboard, laporan kompleks**  
  (disimpan untuk fase berikutnya agar tidak terlalu ambisius).

---

## 2. Project Context

- **Referensi Dokumentasi**: 
  - `docs/model_domain.md` - Domain model dan entitas
  - `docs/usecase_userstories.md` - Use cases dan user stories
  - `docs/ubiquitous_language_dictionary.md` - Terminologi standar
  - `docs/database_schema.md` - Struktur database
  - `docs/algorithm_datastructure.md` - Algoritma bisnis
  - `docs/tech_stack.md` - Stack teknologi

- **Tech Stack Frontend (Phase 1)**:
  - React 18 + TypeScript
  - Vite 5
  - Tailwind CSS 3
  - shadcn/ui (dipakai seperlunya, tidak wajib di semua form)
  - Zustand (state management global ringan)
  - TanStack Query v5 (data fetching)
  - React Router v6
  - Zod + React Hook Form (validasi form)

> Catatan: PWA (manifest, service worker) **bukan fokus Phase 1**.

---

## 3. Lingkup Fungsional Phase 1

### 3.1. Autentikasi Sederhana (Login + Logout)

**Tujuan**: Bisa membedakan user login vs tidak login. RBAC detail disederhanakan.

**Fitur**:
- Halaman `/login`:
  - Input: `username/email`, `password`.
  - Tombol Login.
- Setelah login:
  - Simpan token di store Zustand (dan/atau `localStorage`).
  - Simpan informasi user dasar (misal: nama, role).
- Logout:
  - Tombol Logout menghapus token + user dari store & storage.
  - Redirect ke `/login`.
- Protected route sederhana:
  - Jika tidak ada token → redirect ke `/login`.

**Acceptance Criteria**:
- User dengan kredensial valid dapat login dan masuk ke halaman utama (mis. `/assets`).
- Tanpa token, akses ke route selain `/login` dialihkan ke `/login`.
- Logout mengosongkan token dan kembali ke `/login`.

---

### 3.2. Master Kategori Aset (Sederhana)

**Tujuan**: Menyediakan daftar kategori agar form aset bisa dipakai.

**Fitur**:
- Halaman `/categories`:
  - Tabel daftar kategori: `nama`.
  - Tombol "Tambah Kategori".
- Form kategori (modal atau halaman terpisah):
  - Field: `nama` (required).
- Aksi:
  - Tambah kategori.
  - Edit kategori.
  - Hapus kategori.

**Acceptance Criteria**:
- Operator dapat menambah kategori baru dengan nama.
- Jika backend mengembalikan error duplikat, pesan error tampil jelas.
- Daftar kategori selalu ter-update setelah operasi CRUD.

**Penyederhanaan**:
- Belum ada pagination dan search; cukup tampilkan semua kategori.

---

### 3.3. Registrasi & Daftar Aset (Versi Minimal)

**Tujuan**: Aset dapat dicatat dan dilihat.

**Fitur**:
- Halaman `/assets`:
  - Tabel: `kode_aset`, `nama_barang`, `kategori`, `kondisi`.
  - Tombol "Tambah Aset".
- Halaman `/assets/new` (atau modal):
  - Field minimal:
    - `kode_aset` (required)
    - `nama_barang` (required)
    - `category_id` (dropdown dari kategori)
    - `kondisi` (dropdown: Baik, Rusak Ringan, Rusak Berat, Hilang)
  - Field opsional (boleh ditampilkan atau ditunda): `merk`, `spesifikasi`, `tahun_perolehan`, `harga`, `sumber_dana`.
- Validasi di frontend dengan Zod + React Hook Form:
  - Field required tidak boleh kosong.
- Menangani error backend:
  - Jika `kode_aset` duplikat → tampilkan pesan error.

**Acceptance Criteria**:
- Aset baru dapat dibuat dan muncul di daftar.
- Error dari backend (mis. duplikat) ditampilkan ke user.

**Penyederhanaan**:
- Belum ada upload foto.
- Belum ada QR code generate & download.
- Belum ada filter/sort kompleks di tabel.

---

### 3.4. Mutasi Lokasi Aset (Lokasi Sederhana)

**Tujuan**: Menandai aset berada di ruangan mana.

**Fitur**:
- Untuk Phase 1, lokasi boleh dimodelkan sederhana di UI:
  - Misal: hanya `Ruangan` (tanpa harus tampilkan Gedung/Lantai di frontend).
- Di halaman detail aset (mis. `/assets/:id`):
  - Menampilkan lokasi saat ini (jika ada).
  - Tombol "Mutasi Lokasi":
    - Dropdown pilih ruangan baru.
    - Submit ke API mutasi.
- Menampilkan riwayat mutasi dalam bentuk list sederhana (jika API tersedia).

**Acceptance Criteria**:
- Lokasi aset dapat diubah ke ruangan lain melalui UI.
- Setelah mutasi, lokasi terbaru tampil di detail aset.

**Penyederhanaan**:
- Hierarki Gedung → Lantai → Ruangan tidak perlu divisualisasikan penuh.
- Validasi "tidak boleh mutasi saat Dipinjam" cukup ditangani backend; frontend hanya menampilkan error.

---

### 3.5. Peminjaman Aset – Versi Basic

**Tujuan**: Bisa mencatat peminjaman dan pengembalian dasar.

**Fitur**:
- Halaman `/loans`:
  - Tabel daftar peminjaman: `peminjam`, `tanggal_pinjam`, `status`.
  - Tombol "Tambah Peminjaman".
- Form tambah peminjaman:
  - Pilih peminjam (bisa dropdown user atau input teks sederhana sesuai API).
  - Pilih aset (untuk Phase 1, boleh satu aset per peminjaman dulu).
  - Input `tujuan_pinjam`.
- Aksi:
  - Membuat peminjaman baru (status awal: Dipinjam).
  - Tombol "Tandai Dikembalikan" di daftar/detail peminjaman → ubah status ke Dikembalikan.

**Acceptance Criteria**:
- Peminjaman dapat dibuat dan muncul di daftar.
- Status bisa diubah ke Dikembalikan lewat UI.

**Penyederhanaan**:
- Belum ada status Terlambat / Rusak.
- Belum ada approval berlapis.
- Filtering & search bisa ditunda.

---

## 4. Non-Fungsional – Fokus Realistis

### 4.1. Struktur Folder Frontend

Struktur awal di `frontend/` yang sederhana dan mudah di-maintain:

```txt
frontend/
  src/
    main.tsx              // entry React + Router
    App.tsx               // root layout + konfigurasi route

    routes/               // halaman utama (per fitur)
      auth/
        LoginPage.tsx
      assets/
        AssetsListPage.tsx
        AssetCreatePage.tsx
        AssetDetailPage.tsx
      categories/
        CategoriesPage.tsx
      loans/
        LoansListPage.tsx
        LoanCreatePage.tsx
      mutations/
        AssetMutationPage.tsx   // bisa digabung dengan AssetDetailPage jika sederhana

    components/           // komponen reusable
      ui/                 // wrapper komponen shadcn/ui (jika dipakai)
      forms/              // form-field reusable (input, select, dsb.)
      layout/             // header, sidebar, shell utama

    libs/
      api/                // wrapper axios/fetch + hooks React Query
      store/              // Zustand store (auth, UI global ringan)
      validation/         // skema Zod per form

    styles/
      index.css           // import Tailwind CSS
```

**Aturan komentar kode:**
- Setiap file TS/TSX harus memiliki komentar **Bahasa Indonesia** di:
  - Atas komponen/fungsi utama (menjelaskan peran file/komponen).
  - Bagian logika yang penting atau tidak langsung jelas.
- Komentar menjelaskan **apa yang dilakukan dan kenapa**, bukan hanya mengulang nama fungsi.

Contoh pola komentar:

```tsx
// Komponen halaman login untuk autentikasi pengguna SIMANIS
// Menyediakan form username/password dan memanggil API backend untuk proses login
function LoginPage() {
  // State form login dikelola oleh React Hook Form
  // Tujuannya agar validasi dan penanganan error lebih konsisten di seluruh aplikasi
}
```

---

### 4.2. State Management & Data Fetching

- **Zustand**:
  - Menyimpan state global minimal:
    - Token autentikasi
    - Informasi user login
    - State UI kecil (misal: status sidebar)
- **TanStack Query**:
  - Untuk data API:
    - `useQuery` untuk daftar aset, kategori, peminjaman.
    - `useMutation` untuk operasi create/update/delete.

---

### 4.3. Validasi & Error Handling

- **Zod + React Hook Form** untuk semua form utama:
  - Login, Kategori, Aset, Peminjaman.
- Penanganan error:
  - Jika respons `400/422` dari backend → tampilkan pesan error dari API.
  - Jika `401` → hapus token (jika perlu) dan redirect ke `/login`.
  - Jika `500` → tampilkan pesan umum: "Terjadi kesalahan pada server, silakan coba lagi nanti".

---

## 5. PWA & Fitur Lanjutan – Out of Scope Phase 1

Berikut ini **dengan sengaja tidak dikerjakan** di Phase 1, untuk menjaga scope agar realistis:

- PWA:
  - `manifest.json`
  - Service worker
  - Offline caching
- QR code scanner via kamera.
- Upload foto aset & dokumen.
- Dashboard statistik & grafik.
- Penyusutan bulanan, laporan KIB, penghapusan aset, audit trail.
- Desktop app (Tauri).

Fitur-fitur ini akan direncanakan di **Phase 2+** setelah core Phase 1 stabil.

---

## 6. Kualitas Kode & Praktik Penulisan

- TypeScript dalam mode **strict**.
- ESLint + Prettier konfigurasi dasar.
- Komentar Bahasa Indonesia di:
  - File komponen halaman.
  - Hooks custom.
  - Fungsi utilitas penting.
- Penamaan konsisten:
  - PascalCase untuk komponen (`LoginPage`).
  - camelCase untuk fungsi & variabel.

---

## 7. Workflow Implementasi Frontend (Phase 1)

Urutan kerja yang disarankan:

1. **Setup Project**
   - Vite + React + TypeScript.
   - Tailwind CSS.
   - React Router.
   - TanStack Query + Zustand + Zod + React Hook Form.

2. **Layout & Routing Dasar**
   - Rute: `/login`, `/assets`, `/categories`, `/loans`.
   - ProtectedRoute sederhana berbasis token.

3. **Implementasi Fitur**
   1. Login (autentikasi dasar).
   2. Categories: list + create + edit + delete.
   3. Assets: list + create (versi minimal field).
   4. Asset detail + mutasi lokasi sederhana.
   5. Loans: list + create + mark returned.

Setiap penyelesaian task dapat di-commit ke repo GitHub:  
`https://github.com/wiwinpa5aribu/simanis.git` dengan pesan commit yang jelas.

---

## 8. Kriteria Sukses Phase 1

Phase 1 dianggap berhasil jika:

- User bisa login dan logout tanpa error fatal.
- User bisa:
  - Menambah kategori aset.
  - Menambah dan melihat aset.
  - Memindahkan lokasi aset.
  - Mencatat peminjaman dan pengembalian.
- Tidak ada error JavaScript kritis di console pada alur utama.
- Struktur folder rapi dan setiap file utama memiliki komentar kunci dalam Bahasa Indonesia.

---

**Status**: Draft realistis – acuan implementasi frontend Phase 1.
