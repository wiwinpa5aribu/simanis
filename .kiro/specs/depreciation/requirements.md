# Requirements Document - Halaman Penyusutan (Depreciation)

## Introduction

Dokumen ini mendefinisikan requirements untuk halaman penyusutan aset pada aplikasi SIMANIS. Fitur ini menghitung nilai penyusutan aset secara otomatis menggunakan metode garis lurus sesuai standar BMN (Barang Milik Negara).

## Glossary

- **Penyusutan**: Penurunan nilai aset seiring waktu penggunaan
- **Metode Garis Lurus**: Metode penyusutan dengan nilai tetap per periode
- **Nilai Perolehan**: Harga beli aset saat pertama kali diperoleh
- **Nilai Buku**: Nilai aset setelah dikurangi akumulasi penyusutan
- **Masa Manfaat**: Estimasi umur ekonomis aset dalam tahun
- **BMN**: Barang Milik Negara - standar pengelolaan aset pemerintah

## Requirements

### Requirement 1: Dashboard Penyusutan (Depreciation Dashboard)

**User Story:** Sebagai Bendahara BOS, saya ingin melihat ringkasan nilai penyusutan seluruh aset, sehingga saya dapat melaporkan nilai buku aset untuk keperluan keuangan.

#### Acceptance Criteria

1. WHEN pengguna membuka halaman penyusutan THEN the System SHALL menampilkan ringkasan: Total Nilai Perolehan, Total Akumulasi Penyusutan, Total Nilai Buku
2. WHEN halaman ditampilkan THEN the System SHALL menampilkan grafik tren penyusutan 12 bulan terakhir
3. WHEN pengguna memilih filter kategori THEN the System SHALL menampilkan ringkasan penyusutan per kategori aset
4. WHEN pengguna memilih filter tahun THEN the System SHALL menampilkan data penyusutan untuk tahun yang dipilih

### Requirement 2: Daftar Penyusutan Aset (Asset Depreciation List)

**User Story:** Sebagai Bendahara BOS, saya ingin melihat detail penyusutan per aset, sehingga saya dapat memverifikasi perhitungan nilai buku.

#### Acceptance Criteria

1. WHEN pengguna membuka tab daftar aset THEN the System SHALL menampilkan tabel dengan kolom: Kode Aset, Nama, Nilai Perolehan, Masa Manfaat, Penyusutan/Bulan, Akumulasi Penyusutan, Nilai Buku
2. WHEN pengguna mengklik baris aset THEN the System SHALL menampilkan detail riwayat penyusutan bulanan
3. WHEN pengguna mengurutkan kolom THEN the System SHALL mengurutkan data sesuai kolom yang dipilih
4. WHEN nilai buku aset mencapai 0 THEN the System SHALL menampilkan badge "Habis Disusutkan"

### Requirement 3: Kalkulasi Penyusutan Otomatis (Auto Calculation)

**User Story:** Sebagai Admin Sistem, saya ingin sistem menghitung penyusutan secara otomatis setiap akhir bulan, sehingga nilai buku aset selalu terupdate.

#### Acceptance Criteria

1. WHEN tanggal berubah ke tanggal 1 bulan baru THEN the System SHALL menjalankan kalkulasi penyusutan untuk semua aset aktif
2. WHEN kalkulasi dijalankan THEN the System SHALL menggunakan rumus: Penyusutan Bulanan = Nilai Perolehan / (Masa Manfaat x 12)
3. WHEN kalkulasi selesai THEN the System SHALL mencatat entri penyusutan dengan tanggal, nilai penyusutan, dan nilai buku terbaru
4. IF aset sudah habis disusutkan (nilai buku = 0) THEN the System SHALL tidak menambah entri penyusutan baru
5. WHEN terjadi error saat kalkulasi THEN the System SHALL mencatat log error dan mengirim notifikasi ke admin

### Requirement 4: Pengaturan Masa Manfaat (Useful Life Settings)

**User Story:** Sebagai Wakasek Sarpras, saya ingin mengatur masa manfaat default per kategori aset, sehingga penyusutan dihitung sesuai standar BMN.

#### Acceptance Criteria

1. WHEN pengguna membuka pengaturan penyusutan THEN the System SHALL menampilkan daftar kategori dengan masa manfaat default
2. WHEN pengguna mengubah masa manfaat kategori THEN the System SHALL menyimpan perubahan untuk aset baru di kategori tersebut
3. WHEN aset baru dibuat THEN the System SHALL menggunakan masa manfaat default dari kategori aset
4. WHEN pengguna mengubah masa manfaat aset individual THEN the System SHALL menggunakan nilai tersebut untuk kalkulasi

### Requirement 5: Laporan Penyusutan (Depreciation Report)

**User Story:** Sebagai Bendahara BOS, saya ingin mengexport laporan penyusutan untuk pelaporan keuangan, sehingga saya dapat melampirkan ke laporan BOS.

#### Acceptance Criteria

1. WHEN pengguna mengklik "Export Laporan" THEN the System SHALL menampilkan opsi format: Excel, PDF
2. WHEN pengguna memilih periode dan format THEN the System SHALL generate laporan dengan kolom sesuai standar BMN
3. WHEN laporan di-generate THEN the System SHALL menyertakan: Header Instansi, Periode Laporan, Daftar Aset dengan Nilai Penyusutan, Total, Tanda Tangan
4. WHEN pengguna memilih filter kategori THEN the System SHALL generate laporan hanya untuk kategori yang dipilih

### Requirement 6: Simulasi Penyusutan (Depreciation Simulation)

**User Story:** Sebagai Wakasek Sarpras, saya ingin melakukan simulasi penyusutan untuk perencanaan anggaran, sehingga saya dapat memproyeksikan nilai aset di masa depan.

#### Acceptance Criteria

1. WHEN pengguna membuka fitur simulasi THEN the System SHALL menampilkan form dengan field: Pilih Aset/Kategori, Periode Simulasi (bulan)
2. WHEN pengguna menjalankan simulasi THEN the System SHALL menampilkan proyeksi nilai buku per bulan dalam bentuk tabel dan grafik
3. WHEN simulasi selesai THEN the System SHALL menampilkan estimasi kapan aset akan habis disusutkan
