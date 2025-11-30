# Requirements Document - Laporan KIB (KIB Report)

## Introduction

Dokumen ini mendefinisikan requirements untuk halaman laporan Kartu Inventaris Barang (KIB) pada aplikasi SIMANIS. Fitur ini memungkinkan Wakasek Sarpras dan Bendahara BOS untuk generate laporan inventaris sesuai standar pemerintah Indonesia.

## Glossary

- **KIB**: Kartu Inventaris Barang - dokumen pencatatan aset sesuai standar pemerintah
- **KIB A**: Kartu Inventaris Tanah
- **KIB B**: Kartu Inventaris Peralatan dan Mesin
- **KIB C**: Kartu Inventaris Gedung dan Bangunan
- **KIB D**: Kartu Inventaris Jalan, Irigasi, dan Jaringan
- **KIB E**: Kartu Inventaris Aset Tetap Lainnya
- **KIB F**: Kartu Inventaris Konstruksi Dalam Pengerjaan
- **Rekapitulasi**: Ringkasan total aset per kategori KIB

## Requirements

### Requirement 1: Dashboard Laporan KIB (KIB Dashboard)

**User Story:** Sebagai Wakasek Sarpras, saya ingin melihat ringkasan aset per kategori KIB, sehingga saya dapat memantau distribusi aset sekolah.

#### Acceptance Criteria

1. WHEN pengguna membuka halaman laporan KIB THEN the System SHALL menampilkan ringkasan jumlah dan nilai aset per kategori KIB (A-F)
2. WHEN halaman ditampilkan THEN the System SHALL menampilkan chart distribusi aset per kategori KIB
3. WHEN pengguna mengklik kategori KIB THEN the System SHALL menampilkan daftar aset dalam kategori tersebut
4. WHEN data ditampilkan THEN the System SHALL menampilkan total nilai perolehan dan nilai buku per kategori

### Requirement 2: Generate Laporan KIB (Generate KIB Report)

**User Story:** Sebagai Wakasek Sarpras, saya ingin generate laporan KIB sesuai format standar pemerintah, sehingga saya dapat melaporkan inventaris ke dinas pendidikan.

#### Acceptance Criteria

1. WHEN pengguna mengklik "Generate Laporan" THEN the System SHALL menampilkan form dengan opsi: Jenis KIB (A/B/C/D/E/F/Semua), Periode, Format Output (Excel/PDF)
2. WHEN pengguna memilih KIB B (Peralatan dan Mesin) THEN the System SHALL generate laporan dengan kolom: No Urut, Kode Barang, Nama Barang, Merk/Type, Ukuran, Bahan, Tahun Pembuatan, Nomor Pabrik, Nomor Rangka, Nomor Mesin, Nomor Polisi, Asal Usul, Harga, Kondisi, Keterangan
3. WHEN pengguna memilih format Excel THEN the System SHALL generate file .xlsx dengan format sesuai template KIB standar
4. WHEN pengguna memilih format PDF THEN the System SHALL generate file .pdf dengan header instansi dan tanda tangan

### Requirement 3: Laporan KIB B - Peralatan dan Mesin (KIB B Report)

**User Story:** Sebagai Bendahara BOS, saya ingin generate laporan KIB B untuk peralatan dan mesin sekolah, sehingga saya dapat melaporkan aset elektronik dan furniture.

#### Acceptance Criteria

1. WHEN pengguna generate KIB B THEN the System SHALL menyertakan aset dengan kategori: Elektronik, Furniture, Peralatan Kantor, Mesin
2. WHEN laporan di-generate THEN the System SHALL mengurutkan aset berdasarkan kode barang
3. WHEN laporan di-generate THEN the System SHALL menghitung subtotal per jenis barang dan grand total
4. WHEN ada aset dengan kondisi "Rusak Berat" atau "Hilang" THEN the System SHALL menandai dengan warna berbeda di laporan

### Requirement 4: Laporan KIB E - Aset Tetap Lainnya (KIB E Report)

**User Story:** Sebagai Bendahara BOS, saya ingin generate laporan KIB E untuk aset tetap lainnya seperti buku dan koleksi, sehingga inventaris perpustakaan tercatat.

#### Acceptance Criteria

1. WHEN pengguna generate KIB E THEN the System SHALL menyertakan aset dengan kategori: Buku, Koleksi, Barang Bercorak Kesenian
2. WHEN laporan di-generate THEN the System SHALL menampilkan kolom sesuai format KIB E standar
3. WHEN laporan di-generate THEN the System SHALL menghitung jumlah item dan total nilai

### Requirement 5: Rekapitulasi KIB (KIB Summary)

**User Story:** Sebagai Wakasek Sarpras, saya ingin melihat rekapitulasi seluruh KIB dalam satu laporan, sehingga saya dapat melihat gambaran lengkap aset sekolah.

#### Acceptance Criteria

1. WHEN pengguna memilih "Rekapitulasi" THEN the System SHALL generate laporan ringkasan semua kategori KIB
2. WHEN rekapitulasi di-generate THEN the System SHALL menampilkan: Kategori KIB, Jumlah Item, Nilai Perolehan, Akumulasi Penyusutan, Nilai Buku
3. WHEN rekapitulasi di-generate THEN the System SHALL menampilkan grand total di baris terakhir
4. WHEN pengguna export rekapitulasi THEN the System SHALL menyertakan grafik pie chart distribusi nilai aset

### Requirement 6: Riwayat Laporan (Report History)

**User Story:** Sebagai Operator, saya ingin melihat riwayat laporan KIB yang sudah di-generate, sehingga saya dapat mengunduh ulang laporan sebelumnya.

#### Acceptance Criteria

1. WHEN pengguna membuka tab riwayat THEN the System SHALL menampilkan daftar laporan yang sudah di-generate dengan kolom: Tanggal, Jenis KIB, Periode, Format, User
2. WHEN pengguna mengklik baris riwayat THEN the System SHALL menyediakan opsi download ulang
3. WHEN laporan sudah lebih dari 1 tahun THEN the System SHALL menampilkan opsi untuk generate ulang dengan data terbaru

### Requirement 7: Pengaturan Header Laporan (Report Header Settings)

**User Story:** Sebagai Admin, saya ingin mengatur header laporan KIB dengan informasi sekolah, sehingga laporan memiliki identitas instansi yang benar.

#### Acceptance Criteria

1. WHEN admin membuka pengaturan laporan THEN the System SHALL menampilkan form: Nama Sekolah, NPSN, Alamat, Kota/Kabupaten, Provinsi, Logo Sekolah
2. WHEN admin menyimpan pengaturan THEN the System SHALL menggunakan informasi tersebut di semua laporan KIB
3. WHEN laporan di-generate THEN the System SHALL menampilkan header dengan logo dan informasi sekolah
4. WHEN laporan PDF di-generate THEN the System SHALL menyertakan area tanda tangan: Mengetahui (Kepala Sekolah), Dibuat oleh (Operator)
