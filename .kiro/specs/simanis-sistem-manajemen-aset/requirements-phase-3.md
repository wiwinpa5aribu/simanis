# Requirements: SIMANIS Frontend – Phase 3 (Penguatan Fitur & Kenyamanan Pengguna)

## 1. Tujuan Utama Phase 3

Menyempurnakan SIMANIS yang sudah berjalan (Phase 1–2) dengan:

- **Pengalaman pakai lebih halus** (UX, konsistensi, kecepatan kerja user).
- **Penguatan fitur yang sudah ada**, bukan penambahan domain baru besar.
- **Dukungan multi-perangkat** yang lebih baik (desktop, tablet, mobile).
- Tetap menjaga codebase mudah di-maintenance (komentar Bahasa Indonesia, struktur rapi).

Tidak ada lompatan arsitektur besar (mis. offline-sync penuh, multi-tenant, real-time) di fase ini.

---

## 2. Ruang Lingkup Fungsional Phase 3

### 2.1. Peningkatan UX Daftar Data (Aset, Peminjaman, Inventarisasi, Audit)

**Fitur:**
- Tabel daftar (assets, loans, inventory, audit) mendapatkan:
  - Kolom yang konsisten (urut, lebar, alignment).
  - **Quick actions** per baris (lihat, edit, mutasi, pinjam, dsb. yang relevan).
  - **Save last filters** per halaman (disimpan di localStorage / Zustand).
- Komponen filter:
  - Komponen filter reusable (`FilterBar`) dengan pola yang sama di semua list.
  - Tombol "Reset filter".

**Acceptance Criteria:**
- User yang sering mengulang filter di halaman yang sama tidak perlu mengisi ulang setiap reload.
- UI tabel di berbagai halaman terasa "satu keluarga" (gaya & UX seragam).

---

### 2.2. Bulk Actions Sederhana

**Fitur:**
- Di halaman daftar aset:
  - Multi-select baris (checkbox).
  - Aksi massal minimal:
    - Ubah kondisi massal (mis. dari Baik ke Rusak Ringan).
    - Mutasi massal ke ruangan tertentu.
- Di daftar peminjaman (opsional):
  - Multi-select, "Tandai Dikembalikan" massal (jika backend mendukung).

**Acceptance Criteria:**
- Operator dapat mengubah kondisi / lokasi untuk banyak aset sekaligus.
- Aksi massal menampilkan konfirmasi dan ringkasan hasil (berhasil/gagal).

---

### 2.3. Notifikasi In-App Sederhana

**Fitur:**
- Menggunakan toast / banner di dalam app (bukan push notif):
  - Notifikasi keberhasilan: registrasi aset, inventarisasi, peminjaman, mutasi, penghapusan.
  - Notifikasi peringatan: batas ukuran file, QR gagal, laporan KIB kosong, dsb.
- Panel kecil "Riwayat aksi terbaru oleh user ini" (opsional) di profil / menu.

**Acceptance Criteria:**
- Setiap aksi penting mengembalikan feedback yang jelas, bukan hanya diam di layar.
- Notifikasi tidak mengganggu (auto-dismiss, dapat ditutup manual).

---

### 2.4. Fitur "Favorite / Pin Aset" untuk Akses Cepat

**Fitur:**
- User dapat **menandai aset tertentu sebagai favorit**:
  - Ikon bintang/flag di tabel aset & detail aset.
- Halaman/tab "Aset Favorit Saya":
  - Menampilkan hanya aset yang dipin (per user, bukan global).
- Penyimpanan bisa:
  - Di backend (relasi user–asset favorit) **atau**
  - Sementara di frontend (localStorage) jika backend belum siap.

**Acceptance Criteria:**
- Guru/Operator dapat dengan cepat mengakses aset yang sering mereka pakai (mis. proyektor, speaker, laptop tertentu).

---

### 2.5. Riwayat Aktivitas per Aset & per User (Ringkasan)

**Fitur:**
- Di **detail aset**:
  - Tab "Riwayat Aktivitas" (ringkasan dari audit + peminjaman + inventarisasi + mutasi).
  - Tampilkan list singkat dengan jenis aktivitas, waktu, user, dan link ke detail.
- Di **profil user** (atau halaman user minimal):
  - Tampilkan daftar aktivitas terakhir user tersebut (view-only).

**Acceptance Criteria:**
- Operator dapat melihat "cerita hidup" sebuah aset di satu tempat.
- Kepala sekolah dapat melihat aktivitas terakhir per user (untuk cross-check manual).

---

### 2.6. Template & Preset Filter untuk Laporan KIB dan Penyusutan

**Fitur:**
- Di halaman KIB & penyusutan:
  - Simpan **preset filter** (mis. "Semester 1 BOS", "Lab Fisika saja").
  - User dapat menyimpan beberapa preset (nama preset disimpan per user).
- Aksi:
  - Tombol "Simpan sebagai preset".
  - Dropdown "Gunakan preset".

**Acceptance Criteria:**
- Pengguna yang rutin mengeluarkan laporan dengan filter yang sama tidak perlu mengisi ulang setiap kali.

---

### 2.7. Penguatan RBAC di UI

**Fitur:**
- Pemetaan lebih eksplisit antara **role** dan **aksi UI**:
  - Kepsek: lihat semua, approve penghapusan, lihat audit penuh.
  - Wakasek Sarpras: kelola aset/lokasi/laporan.
  - Bendahara BOS: fokus ke penyusutan & KIB.
  - Operator: input operasional (aset, mutasi, peminjaman, inventarisasi).
  - Guru: peminjaman & lihat aset terbatas.
- Di UI:
  - Tombol/aksi yang tidak boleh digunakan oleh role tertentu:
    - Tidak ditampilkan **atau** nonaktif dengan tooltip penjelasan.

**Acceptance Criteria:**
- User biasa (Guru) tidak melihat fitur manajemen tingkat sarpras/keuangan.
- Operator tidak bisa mengakses menu yang hanya untuk Kepsek/Bendahara (di UI).

---

## 3. Non-Fungsional Phase 3

### Performa & Responsivitas

- Halaman list yang sudah berat (assets, audit, inventory):
  - Tetap responsif (tidak freeze) saat filter/page berganti.
  - Pakai pagination server-side dari Phase 2, dioptimasi jika perlu (debounce search, dsb).
- Bulk actions:
  - Feedback progres (mis. "5/20 aset berhasil dimutasi").

### Kualitas Kode

- Refaktor komponen tabel/filter agar **DRY**:
  - Komponen basis tabel / filter shared untuk mengurangi duplikasi.
- Tetap jaga:
  - TypeScript strict.
  - ESLint + Prettier.
  - Komentar Bahasa Indonesia yang relevan.

---

## 4. Integrasi API & Batasan

- Bulk actions:
  - Diutamakan gunakan endpoint backend bulk (jika tersedia).
  - Jika belum ada, UX Phase 3 bisa menyiapkan sisi frontend dulu, sambil memanggil beberapa request berurutan (dengan catatan performa).
- Favorite aset & preset filter:
  - Idealnya disimpan di backend (per user).
  - Jika backend belum siap, Phase 3 dapat **sementara** menyimpan di localStorage dengan antarmuka yang mudah dipindah ke backend di fase berikutnya.

---

## 5. Risks & Mitigations (Phase 3)

- **Risiko**: Bulk actions membebani backend / DB.  
  **Mitigasi**: batasi jumlah item per bulk (mis. maks 50), tampilkan hasil sebagian sukses.

- **Risiko**: UI makin kompleks & sulit di-maintain.  
  **Mitigasi**: refaktor ke komponen tabel/filter/layout reusable sebelum menambah fitur baru.

- **Risiko**: RBAC UI tidak sinkron dengan aturan backend.  
  **Mitigasi**: semua kontrol kritis tetap divalidasi di backend; UI hanya "membantu", bukan satu-satunya proteksi.

---

## 6. Metrics Keberhasilan Phase 3

- Pengguna internal (Operator/Wakasek) melaporkan:
  - Waktu kerja untuk tugas rutin (mutasi massal, laporan berkala) berkurang.
  - Akses fitur yang sering digunakan lebih cepat (favorit, preset filter).
- Secara teknis:
  - Tidak ada penurunan signifikan skor Lighthouse/performa dibanding Phase 2.
  - Codebase tetap mudah dinavigasi (komponen tabel/filter tidak duplikasi berlebihan).

---

**Status**: Draft Requirements Phase 3 – fokus penguatan fitur & UX, tanpa memperluas domain secara berlebihan.
