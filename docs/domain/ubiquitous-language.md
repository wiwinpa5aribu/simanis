# Ubiquitous Language Dictionary – SIMANIS (Sistem Manajemen Aset Sekolah)

## Daftar Istilah (Navigasi)
| Istilah | Deskripsi Singkat | Anchor |
|---|---|---|
| Aset | Barang inventaris sekolah | [Aset](#aset) |
| KategoriAset | Pengelompokan aset | [KategoriAset](#kategoriaset) |
| Lokasi | Tempat penyimpanan aset (gedung/lantai/ruang) | [Lokasi](#lokasi) |
| MutasiAset | Riwayat perpindahan lokasi aset | [MutasiAset](#mutasiaset) |
| Peminjaman | Transaksi peminjaman aset | [Peminjaman](#peminjaman) |
| Inventarisasi | Stock opname periodik via QR | [Inventarisasi](#inventarisasi) |
| Penyusutan | Perhitungan nilai buku bulanan | [Penyusutan](#penyusutan) |
| Pengguna | Aktor sistem dengan peran RBAC | [Pengguna](#pengguna) |
| QR code | Kode unik aset yang dapat dipindai | [QR-code](#qr-code) |
| Laporan KIB | Laporan inventaris resmi | [Laporan-KIB](#laporan-kib) |
| Berita Acara (BA) | Dokumen bukti penghapusan aset | [Berita-Acara-BA](#berita-acara-ba) |

---

## Istilah dan Definisi

### Aset
- **Definisi**: Barang inventaris sekolah yang dikelola sistem sebagai objek utama dengan atribut administratif, keuangan, dan kondisi.
- **Contoh penggunaan**: "Operator menambahkan Aset baru dan sistem langsung menghasilkan QR code."

### KategoriAset
- **Definisi**: Pengelompokan aset ke dalam kategori umum (mis. Elektronik, Furniture, Alat Lab) untuk memudahkan pelaporan dan pengelolaan.
- **Contoh penggunaan**: "Aset laptop dicatat dalam KategoriAset Elektronik."

### Lokasi
- **Definisi**: Tempat fisik penyimpanan aset dengan hierarki Gedung → Lantai → Ruangan.
- **Contoh penggunaan**: "Aset dipindahkan dari Gedung A Lantai 2 ke Ruang Lab Kimia."

### MutasiAset
- **Definisi**: Entri yang merekam perpindahan `Aset` antar `Lokasi` dan menentukan `Lokasi Aktif` pada mutasi terbaru.
- **Contoh penggunaan**: "Sarpras membuat MutasiAset untuk memindahkan proyektor ke ruang rapat."

### Peminjaman
- **Definisi**: Transaksi penggunaan aset sementara oleh `Pengguna` dengan status Dipinjam, Dikembalikan, Terlambat, atau Rusak.
- **Contoh penggunaan**: "Guru mengajukan Peminjaman proyektor untuk kegiatan kelas."

### Inventarisasi
- **Definisi**: Kegiatan stock opname periodik yang memverifikasi keberadaan/kondisi `Aset` menggunakan pemindaian `QR code` dan foto bukti.
- **Contoh penggunaan**: "Operator melakukan Inventarisasi dengan scan QR dan unggah foto."

### Penyusutan
- **Definisi**: Perhitungan penurunan nilai `Aset` metode garis lurus setiap akhir bulan sehingga menghasilkan `Nilai Penyusutan` dan memperbarui `Nilai Buku`.
- **Contoh penggunaan**: "Akhir bulan, sistem menghitung Penyusutan untuk semua aset aktif."

### Pengguna
- **Definisi**: Entitas yang mewakili user sistem dengan peran RBAC, termasuk Kepsek, Wakasek Sarpras, Bendahara BOS, Operator, dan Guru.
- **Contoh penggunaan**: "Operator menambah Aset, Kepsek meninjau Audit Trail."

### QR code
- **Definisi**: Kode unik yang dihasilkan otomatis saat `Aset` dibuat, digunakan untuk identifikasi cepat pada Inventarisasi.
- **Contoh penggunaan**: "Sistem mengenerate QR code ketika aset baru diregistrasi."

### Laporan KIB
- **Definisi**: Laporan inventaris barang sesuai standar KIB yang dapat diunduh dalam format Excel/PDF.
- **Contoh penggunaan**: "Sarpras mengunduh Laporan KIB untuk pelaporan semester."

### Berita Acara (BA)
- **Definisi**: Dokumen bukti administratif yang diunggah saat penghapusan aset untuk memvalidasi perubahan status.
- **Contoh penggunaan**: "Sarpras mengunggah BA saat menandai aset sebagai Dihapus."

---

## Catatan Khusus
- `Kode Aset` memiliki format baku `SCH/KD/KAT/NOURUT` dan wajib unik
- `Lokasi Aktif` ditentukan dari mutasi terbaru
- `Penyusutan` berjalan otomatis di akhir bulan menggunakan metode garis lurus
- `Penghapusan Aset` membutuhkan unggahan `BA` sebagai bukti administratif
- `QR code` dihasilkan saat registrasi aset dan digunakan untuk Inventarisasi
