# Requirements Document - Halaman Inventarisasi (Inventory Check)

## Introduction

Dokumen ini mendefinisikan requirements untuk halaman inventarisasi/stock opname pada aplikasi SIMANIS. Fitur ini memungkinkan Operator untuk melakukan verifikasi keberadaan dan kondisi aset menggunakan QR scanner dan upload foto bukti.

## Glossary

- **Inventarisasi**: Kegiatan stock opname periodik untuk verifikasi aset
- **QR Scanner**: Fitur untuk memindai QR code aset menggunakan kamera
- **Foto Bukti**: Dokumentasi visual kondisi aset saat inventarisasi
- **Periode Opname**: Rentang waktu pelaksanaan inventarisasi

## Requirements

### Requirement 1: Daftar Inventarisasi (Inventory List)

**User Story:** Sebagai Operator, saya ingin melihat daftar sesi inventarisasi yang sudah dilakukan, sehingga saya dapat melacak progress stock opname.

#### Acceptance Criteria

1. WHEN pengguna membuka halaman inventarisasi THEN the System SHALL menampilkan daftar sesi inventarisasi dengan kolom: Tanggal, Lokasi, Jumlah Aset Dicek, Status, Petugas
2. WHEN pengguna memilih filter lokasi THEN the System SHALL menampilkan hanya inventarisasi di lokasi tersebut
3. WHEN pengguna memilih filter periode THEN the System SHALL menampilkan inventarisasi dalam rentang tanggal yang dipilih

### Requirement 2: Mulai Inventarisasi Baru (Start Inventory Session)

**User Story:** Sebagai Operator, saya ingin memulai sesi inventarisasi baru untuk lokasi tertentu, sehingga saya dapat melakukan stock opname secara terstruktur.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol "Mulai Inventarisasi" THEN the System SHALL menampilkan form dengan field: Pilih Lokasi (Gedung/Lantai/Ruangan), Catatan
2. WHEN pengguna memilih lokasi dan submit THEN the System SHALL membuat sesi inventarisasi baru dan menampilkan daftar aset di lokasi tersebut
3. WHEN sesi dimulai THEN the System SHALL mencatat tanggal mulai dan petugas yang melakukan

### Requirement 3: Scan QR Code Aset (QR Scanner)

**User Story:** Sebagai Operator, saya ingin memindai QR code aset menggunakan kamera, sehingga saya dapat memverifikasi keberadaan aset dengan cepat.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol "Scan QR" THEN the System SHALL mengaktifkan kamera perangkat untuk memindai QR code
2. WHEN QR code berhasil dipindai THEN the System SHALL menampilkan informasi aset dan form untuk input kondisi terkini
3. WHEN QR code tidak ditemukan di database THEN the System SHALL menampilkan pesan "Aset tidak ditemukan"
4. WHEN aset sudah di-scan dalam sesi yang sama THEN the System SHALL menampilkan pesan "Aset sudah dicek"

### Requirement 4: Input Kondisi dan Upload Foto (Condition Input)

**User Story:** Sebagai Operator, saya ingin mencatat kondisi aset dan upload foto bukti, sehingga ada dokumentasi visual saat inventarisasi.

#### Acceptance Criteria

1. WHEN aset berhasil di-scan THEN the System SHALL menampilkan form dengan field: Kondisi (Baik/Rusak Ringan/Rusak Berat/Hilang), Catatan, Upload Foto
2. WHEN pengguna memilih kondisi berbeda dari data sebelumnya THEN the System SHALL menandai aset sebagai "Perlu Review"
3. WHEN pengguna upload foto THEN the System SHALL menerima format JPG, PNG dengan ukuran maksimal 5MB
4. WHEN pengguna submit THEN the System SHALL menyimpan hasil pengecekan dan update timestamp

### Requirement 5: Selesaikan Inventarisasi (Complete Session)

**User Story:** Sebagai Operator, saya ingin menyelesaikan sesi inventarisasi dan melihat ringkasan hasil, sehingga saya dapat melaporkan ke atasan.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol "Selesaikan" THEN the System SHALL menampilkan ringkasan: Total Aset di Lokasi, Aset Dicek, Aset Tidak Ditemukan, Aset Kondisi Berubah
2. WHEN ada aset yang belum dicek THEN the System SHALL menampilkan peringatan dengan daftar aset yang belum di-scan
3. WHEN sesi diselesaikan THEN the System SHALL mengubah status sesi menjadi "Selesai" dan mencatat tanggal selesai
4. WHEN sesi selesai THEN the System SHALL menyediakan opsi export laporan inventarisasi ke PDF

### Requirement 6: Laporan Inventarisasi (Inventory Report)

**User Story:** Sebagai Wakasek Sarpras, saya ingin melihat laporan hasil inventarisasi, sehingga saya dapat mengetahui kondisi aset sekolah.

#### Acceptance Criteria

1. WHEN pengguna membuka detail sesi inventarisasi THEN the System SHALL menampilkan laporan lengkap dengan foto bukti
2. WHEN pengguna mengklik "Export PDF" THEN the System SHALL generate dokumen PDF dengan format laporan inventarisasi standar
3. WHEN ada aset dengan kondisi berubah THEN the System SHALL menampilkan highlight pada aset tersebut
