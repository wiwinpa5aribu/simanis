# Requirements Document - Halaman Aset (Asset Management)

## Introduction

Dokumen ini mendefinisikan requirements untuk halaman manajemen aset pada aplikasi SIMANIS. Fitur ini memungkinkan Operator dan Wakasek Sarpras untuk mengelola data aset sekolah secara lengkap dengan generate QR code otomatis.

## Glossary

- **Aset**: Barang inventaris sekolah yang dikelola sistem
- **Kode Aset**: Identifier unik dengan format SCH/KD/KAT/NOURUT
- **QR Code**: Kode unik yang dihasilkan otomatis saat aset dibuat
- **KategoriAset**: Pengelompokan aset (Elektronik, Furniture, dll)
- **Kondisi**: Status fisik aset (Baik, Rusak Ringan, Rusak Berat, Hilang)
- **Sumber Dana**: Asal pendanaan aset (BOS, APBD, Hibah)

## Requirements

### Requirement 1: Daftar Aset (Asset List)

**User Story:** Sebagai Operator, saya ingin melihat daftar semua aset sekolah dengan filter dan pencarian, sehingga saya dapat menemukan aset dengan cepat.

#### Acceptance Criteria

1. WHEN pengguna membuka halaman daftar aset THEN the System SHALL menampilkan tabel aset dengan kolom: Kode Aset, Nama Barang, Kategori, Lokasi, Kondisi, dan Nilai
2. WHEN pengguna mengetik di kolom pencarian THEN the System SHALL memfilter aset berdasarkan kode aset atau nama barang secara real-time
3. WHEN pengguna memilih filter kategori THEN the System SHALL menampilkan hanya aset dari kategori yang dipilih
4. WHEN pengguna memilih filter kondisi THEN the System SHALL menampilkan hanya aset dengan kondisi yang dipilih
5. WHEN jumlah aset melebihi 10 item THEN the System SHALL menampilkan pagination dengan opsi 10, 25, 50 item per halaman

### Requirement 2: Tambah Aset Baru (Create Asset)

**User Story:** Sebagai Operator, saya ingin mendaftarkan aset baru ke sistem dengan data lengkap, sehingga inventaris sekolah tercatat dengan baik.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol "Tambah Aset" THEN the System SHALL menampilkan form dengan field: Nama Barang, Merk, Spesifikasi, Kategori, Lokasi, Tahun Perolehan, Harga, Sumber Dana, Kondisi, dan Foto
2. WHEN pengguna mengisi semua field wajib dan submit form THEN the System SHALL membuat kode aset otomatis dengan format SCH/KD/KAT/NOURUT
3. WHEN aset berhasil disimpan THEN the System SHALL generate QR code secara otomatis berdasarkan kode aset
4. WHEN pengguna tidak mengisi field wajib THEN the System SHALL menampilkan pesan validasi pada field yang kosong
5. WHEN pengguna upload foto THEN the System SHALL menerima format JPG, PNG dengan ukuran maksimal 2MB

### Requirement 3: Edit Aset (Update Asset)

**User Story:** Sebagai Operator, saya ingin mengubah data aset yang sudah ada, sehingga informasi aset tetap akurat dan terkini.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol edit pada baris aset THEN the System SHALL menampilkan form edit dengan data aset yang sudah terisi
2. WHEN pengguna mengubah data dan submit THEN the System SHALL menyimpan perubahan dan mencatat di audit trail
3. WHEN pengguna mengubah kondisi aset THEN the System SHALL memvalidasi bahwa kondisi baru valid (Baik, Rusak Ringan, Rusak Berat, Hilang)
4. IF kode aset sudah di-generate THEN the System SHALL tidak mengizinkan perubahan kode aset

### Requirement 4: Detail Aset (Asset Detail)

**User Story:** Sebagai Operator, saya ingin melihat detail lengkap aset termasuk QR code, sehingga saya dapat mencetak label aset.

#### Acceptance Criteria

1. WHEN pengguna mengklik baris aset THEN the System SHALL menampilkan halaman detail dengan semua informasi aset
2. WHEN halaman detail ditampilkan THEN the System SHALL menampilkan QR code yang dapat di-download atau dicetak
3. WHEN pengguna mengklik tombol "Cetak QR" THEN the System SHALL membuka dialog print dengan QR code dan informasi aset
4. WHEN halaman detail ditampilkan THEN the System SHALL menampilkan riwayat mutasi lokasi aset

### Requirement 5: Hapus Aset (Delete Asset)

**User Story:** Sebagai Wakasek Sarpras, saya ingin menghapus aset yang sudah tidak digunakan dengan upload Berita Acara, sehingga data inventaris tetap akurat.

#### Acceptance Criteria

1. WHEN pengguna dengan role Wakasek Sarpras atau Kepsek mengklik tombol hapus THEN the System SHALL menampilkan dialog konfirmasi dengan field upload Berita Acara
2. WHEN pengguna upload Berita Acara dan konfirmasi THEN the System SHALL mengubah status aset menjadi "Dihapus" (soft delete)
3. WHEN pengguna dengan role Operator mencoba menghapus aset THEN the System SHALL menampilkan pesan bahwa aksi memerlukan persetujuan Wakasek Sarpras
4. IF Berita Acara tidak di-upload THEN the System SHALL tidak mengizinkan penghapusan aset
