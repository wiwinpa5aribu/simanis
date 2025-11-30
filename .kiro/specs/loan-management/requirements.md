# Requirements Document - Halaman Peminjaman (Loan Management)

## Introduction

Dokumen ini mendefinisikan requirements untuk halaman manajemen peminjaman aset pada aplikasi SIMANIS. Fitur ini memungkinkan Guru untuk mengajukan peminjaman dan Operator untuk mengelola workflow peminjaman.

## Glossary

- **Peminjaman**: Transaksi penggunaan aset sementara oleh pengguna
- **Peminjam**: User yang mengajukan peminjaman (biasanya Guru)
- **Status Peminjaman**: Dipinjam, Dikembalikan, Terlambat, Rusak
- **Tanggal Kembali**: Batas waktu pengembalian aset

## Requirements

### Requirement 1: Daftar Peminjaman (Loan List)

**User Story:** Sebagai Operator, saya ingin melihat daftar semua peminjaman dengan status terkini, sehingga saya dapat memantau aset yang sedang dipinjam.

#### Acceptance Criteria

1. WHEN pengguna membuka halaman peminjaman THEN the System SHALL menampilkan tabel dengan kolom: Kode Peminjaman, Nama Aset, Peminjam, Tanggal Pinjam, Tanggal Kembali, Status
2. WHEN pengguna memilih filter status THEN the System SHALL menampilkan hanya peminjaman dengan status yang dipilih
3. WHEN ada peminjaman yang melewati tanggal kembali THEN the System SHALL menampilkan badge "Terlambat" berwarna merah
4. WHEN pengguna mengetik di kolom pencarian THEN the System SHALL memfilter berdasarkan nama aset atau nama peminjam

### Requirement 2: Ajukan Peminjaman (Create Loan)

**User Story:** Sebagai Guru, saya ingin mengajukan peminjaman aset untuk kegiatan pembelajaran, sehingga saya dapat menggunakan fasilitas sekolah.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol "Ajukan Peminjaman" THEN the System SHALL menampilkan form dengan field: Pilih Aset, Tanggal Pinjam, Tanggal Kembali, Tujuan Peminjaman
2. WHEN pengguna memilih aset THEN the System SHALL hanya menampilkan aset dengan kondisi "Baik" dan tidak sedang dipinjam
3. WHEN pengguna submit form dengan data lengkap THEN the System SHALL membuat peminjaman dengan status "Dipinjam"
4. WHEN tanggal kembali kurang dari tanggal pinjam THEN the System SHALL menampilkan pesan error validasi
5. WHEN peminjaman berhasil dibuat THEN the System SHALL mengirim notifikasi ke Operator

### Requirement 3: Proses Pengembalian (Return Asset)

**User Story:** Sebagai Operator, saya ingin mencatat pengembalian aset, sehingga status peminjaman terupdate dan aset tersedia kembali.

#### Acceptance Criteria

1. WHEN Operator mengklik tombol "Kembalikan" pada peminjaman aktif THEN the System SHALL menampilkan dialog konfirmasi dengan field kondisi aset saat dikembalikan
2. WHEN Operator memilih kondisi "Baik" dan konfirmasi THEN the System SHALL mengubah status peminjaman menjadi "Dikembalikan"
3. WHEN Operator memilih kondisi "Rusak" THEN the System SHALL mengubah status peminjaman menjadi "Rusak" dan update kondisi aset
4. WHEN pengembalian berhasil THEN the System SHALL mencatat tanggal pengembalian aktual

### Requirement 4: Perpanjangan Peminjaman (Extend Loan)

**User Story:** Sebagai Guru, saya ingin memperpanjang masa peminjaman jika masih membutuhkan aset, sehingga saya tidak perlu mengembalikan dan meminjam ulang.

#### Acceptance Criteria

1. WHEN peminjam mengklik tombol "Perpanjang" pada peminjaman aktif THEN the System SHALL menampilkan form dengan field tanggal kembali baru
2. WHEN tanggal perpanjangan valid THEN the System SHALL mengupdate tanggal kembali dan mencatat riwayat perpanjangan
3. IF peminjaman sudah diperpanjang 2 kali THEN the System SHALL tidak mengizinkan perpanjangan lagi

### Requirement 5: Riwayat Peminjaman (Loan History)

**User Story:** Sebagai Operator, saya ingin melihat riwayat peminjaman per aset atau per peminjam, sehingga saya dapat melacak penggunaan aset.

#### Acceptance Criteria

1. WHEN pengguna membuka detail aset THEN the System SHALL menampilkan tab riwayat peminjaman aset tersebut
2. WHEN pengguna membuka profil user THEN the System SHALL menampilkan riwayat peminjaman user tersebut
3. WHEN riwayat ditampilkan THEN the System SHALL mengurutkan dari yang terbaru ke terlama
