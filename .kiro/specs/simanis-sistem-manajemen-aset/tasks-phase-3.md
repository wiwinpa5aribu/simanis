# Implementation Tasks: SIMANIS Frontend – Phase 3 (Penguatan Fitur & UX)

Task list ini menurunkan `requirements-phase-3.md` dan `design-phase-3.md`
menjadi langkah implementasi konkret. Fokus: penguatan UX daftar data,
bulk actions, favorite aset, riwayat aktivitas, preset filter, dan RBAC UI.

Setiap task sebaiknya dipecah ke branch kecil (mis. `feat/table-refactor`, `feat/bulk-actions`)
dan di-commit bertahap di repo:
`https://github.com/wiwinpa5aribu/simanis.git`.

---

## 1) Refactor Tabel & Filter (Foundation Phase 3)

- [x] 1.1 Buat komponen `DataTable`
  - [x] Tambah folder `src/components/table/`.
  - [x] Implement `DataTable.tsx` (props generik: columns, data, pagination, rowActions).
  - [x] Pastikan bisa menampilkan kolom checkbox (opsional) untuk bulk select.
- [x] 1.2 Buat `DataTableToolbar` / `FilterBar`
  - [x] Tambah folder `src/components/filters/`.
  - [x] Implement `FilterBar.tsx` untuk layout filter seragam + tombol Reset.
- [x] 1.3 Store untuk last filters
  - [x] Tambah `src/libs/store/filterStore.ts` untuk menyimpan filter per routeKey.
  - [x] Terapkan pola `setFilter(routeKey, value)` dan `filters[routeKey]`.
- [x] 1.4 Migrasi halaman ke DataTable + FilterBar
  - [x] AssetsListPage
  - [x] LoansListPage
  - [x] InventoryListPage
  - [x] AuditListPage
- [x] 1.5 Uji manual
  - [x] Filter bekerja seperti semula.
  - [x] Struktur & gaya tabel seragam.

---

## 2) Bulk Actions di Daftar Aset

- [x] 2.1 Seleksi multi baris
  - [x] Di konfigurasi kolom AssetsListPage, tambahkan checkbox per baris.
  - [x] Simpan `selectedAssetIds` di state halaman (bukan global).
- [x] 2.2 Panel aksi bulk
  - [x] Buat komponen `AssetBulkActions.tsx` di `routes/assets/`.
  - [x] Aksi minimal:
    - Ubah kondisi massal.
    - Mutasi massal ke ruangan tertentu.
- [x] 2.3 Integrasi API
  - [x] Jika backend punya endpoint bulk → pakai.
  - [x] Jika belum: loop beberapa request dengan progress dan summary hasil.
- [x] 2.4 Uji
  - [x] Aksi bulk menampilkan konfirmasi sebelum jalan.
  - [x] Hasil sukses/gagal dirangkum (toast / dialog ringkasan).

---

## 3) Notifikasi In-App (Toast/Banner)

- [x] 3.1 Util notifikasi
  - [x] Tambah `src/libs/ui/toast.ts` (wrap library toast yang sudah dipakai atau buat sendiri).
  - [x] Fungsi: `showSuccessToast(msg)`, `showErrorToast(msg)`, `showWarningToast(msg)`.
- [x] 3.2 Integrasi di alur penting
  - [x] Registrasi aset (success/error).
  - [x] Inventarisasi (success/error).
  - [x] Peminjaman (create/return).
  - [x] Mutasi aset.
  - [x] Generate KIB, upload foto/BA.
- [x] 3.3 Uji
  - [x] Notifikasi muncul di tempat & waktu yang tepat, tidak menghalangi interaksi.

---

## 4) Favorite / Pin Aset

- [x] 4.1 Store favorite aset
  - [x] Tambah `src/libs/store/favoriteStore.ts`.
  - [x] Implement `favoriteAssetIds: number[]` + `toggleFavorite(id)` dengan persist.
- [x] 4.2 UI pin/bintang
  - [x] Tambah ikon favorit di AssetsListPage (kolom tambahan) dan AssetDetailPage.
  - [x] Klik ikon memanggil `toggleFavorite`.
- [x] 4.3 Halaman "Aset Favorit Saya"
  - [x] Tambah route baru (mis. `/assets/favorites`).
  - [x] Filter daftar aset berdasarkan `favoriteAssetIds`.
- [x] 4.4 (Opsional) Integrasi backend
  - [x] Jika tersedia endpoint favorit per user, sesuaikan store untuk sinkronisasi.
- [x] 4.5 Uji
  - [x] Favorit bertahan setelah refresh (persist).
  - [x] Menambah/menghapus favorit segera tercermin di halaman favorit.

---

## 5) Riwayat Aktivitas per Aset & per User

- [x] 5.1 Komponen riwayat di detail aset
  - [x] Tambah tab "Riwayat Aktivitas" di `AssetDetailPage.tsx`.
  - [x] Buat `AssetActivityTimeline.tsx` untuk menampilkan aktivitas berupa list/timeline.
  - [x] Ambil data dari audit/peminjaman/inventarisasi per aset (sesuai API yang tersedia).
- [x] 5.2 Halaman aktivitas per user (minimal)
  - [x] Tambah route sederhana (mis. `/me/activity` atau `/users/:id/activity`).
  - [x] Tampilkan aktivitas terakhir user berdasarkan audit logs.
- [x] 5.3 Uji
  - [x] Riwayat aset menampilkan kombinasi event yang relevan (minimal dari audit).
  - [x] Riwayat user menampilkan aktivitas terbaru user tersebut.

---

## 6) Preset Filter untuk KIB & Penyusutan

- [x] 6.1 Store preset
  - [x] Tambah `src/libs/store/reportPresetStore.ts`.
  - [x] Struktur: `presets[reportKey] = [{ name, value }]` + fungsi `addPreset`, `removePreset`.
- [x] 6.2 Integrasi di KIB
  - [x] Di `KIBGeneratePage.tsx`, tambahkan:
    - Tombol "Simpan sebagai preset" (buka dialog nama preset).
    - Dropdown "Preset" untuk memilih preset dan set nilai form.
- [x] 6.3 Integrasi di Penyusutan
  - [x] Di `DepreciationListPage.tsx`, terapkan pola yang sama.
- [x] 6.4 Uji
  - [x] Preset tersimpan dan bisa dipilih ulang.
  - [x] Nilai filter berubah sesuai preset.

---

## 7) Penguatan RBAC di UI

- [x] 7.1 Definisi permissions
  - [x] Tambah `src/libs/auth/permissions.ts` berisi mapping role → hak akses (canViewAudit, canGenerateKIB, dll.).
  - [x] Buat hook `usePermission()` untuk baca mapping berbasis `authStore.user.role`.
- [x] 7.2 Penerapan di menu & tombol
  - [x] Sembunyikan menu dan tombol yang tidak boleh diakses suatu role.
  - [x] Untuk beberapa aksi, bisa nonaktif + tooltip penjelasan.
- [x] 7.3 Uji
  - [x] Login sebagai role berbeda (jika tersedia akun) → menu & aksi berubah sesuai.

---

## 8) Performance & DRY Refactor

- [x] 8.1 Debounce search/filter
  - [x] Buat `libs/hooks/useDebouncedValue.ts`.
  - [x] Terapkan di search/filter list besar (assets, audit, inventory) agar tidak spam API.
- [x] 8.2 Review duplikasi
  - [x] Refaktor list lama yang masih pakai tabel/filter custom ke DataTable + FilterBar.
  - [x] Pastikan tidak ada logic filter/pagination yang duplikasi berlebihan.

---

## 9) Testing Manual & Verifikasi Phase 3

- [x] 9.1 List + Filter
  - [x] Filter tersimpan per halaman; kembali setelah reload.
  - [x] Tabel di assets/loans/inventory/audit seragam.
- [x] 9.2 Bulk actions
  - [x] Ubah kondisi massal & mutasi massal aset → hasil sesuai, feedback jelas.
- [x] 9.3 Notifikasi
  - [x] Setiap aksi penting memberikan toast yang sesuai.
- [x] 9.4 Favorite & aktivitas
  - [x] Favorit bekerja; halaman favorit menampilkan benar.
  - [x] Riwayat aset & user terlihat dan sesuai data.
- [x] 9.5 Preset & RBAC
  - [x] Preset filter dapat disimpan/digunakan.
  - [x] RBAC UI: role berbeda melihat tombol/menu berbeda.

---

**Status**: Draft Task List Phase 3 – fokus penguatan UX dan produktivitas pengguna.
