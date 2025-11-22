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
| Kode Aset | Identitas unik `SCH/KD/KAT/NOURUT` | [Kode-Aset](#kode-aset) |
| Kondisi Aset | Status kondisi fisik aset | [Kondisi-Aset](#kondisi-aset) |
| Sumber Dana | Asal pembiayaan aset | [Sumber-Dana](#sumber-dana) |
| Nilai Buku | Nilai aset setelah penyusutan | [Nilai-Buku](#nilai-buku) |
| Nilai Penyusutan | Nilai penurunan periodik | [Nilai-Penyusutan](#nilai-penyusutan) |
| Masa Manfaat | Periode ekonomis aset (tahun) | [Masa-Manfaat](#masa-manfaat) |
| Tanggal Pencatatan | Waktu entri aset | [Tanggal-Pencatatan](#tanggal-pencatatan) |
| Status Peminjaman | Status transaksi pinjam | [Status-Peminjaman](#status-peminjaman) |
| Peminjam | Pengguna yang meminjam aset | [Peminjam](#peminjam) |
| Tujuan Pinjam | Alasan peminjaman | [Tujuan-Pinjam](#tujuan-pinjam) |
| Lokasi Aktif | Lokasi terakhir aset | [Lokasi-Aktif](#lokasi-aktif) |
| Audit Trail | Jejak perubahan data | [Audit-Trail](#audit-trail) |

---

## Istilah dan Definisi

### Aset
- **Definisi**: Barang inventaris sekolah yang dikelola sistem sebagai objek utama dengan atribut administratif, keuangan, dan kondisi.
- **Contoh penggunaan**: "Operator menambahkan Aset baru dan sistem langsung menghasilkan QR code."
- **Relasi**: Terkait `KategoriAset` (1→n, aset berada pada satu kategori), `Lokasi` via `MutasiAset` (riwayat), `Peminjaman` (1→n), `Penyusutan` (1→1), `Inventarisasi` (1→n).
- **Referensi**: `model_domain.md:5–11`, `model_domain.md:33–45`, `model_domain.md:63–67`; `usecase_userstories.md:61–76`, `usecase_userstories.md:132–142`.

### KategoriAset
- **Definisi**: Pengelompokan aset ke dalam kategori umum (mis. Elektronik, Furniture, Alat Lab) untuk memudahkan pelaporan dan pengelolaan.
- **Contoh penggunaan**: "Aset laptop dicatat dalam KategoriAset Elektronik."
- **Relasi**: `KategoriAset (1) → (n) Aset`.
- **Referensi**: `model_domain.md:12–13`, `model_domain.md:66`; `usecase_userstories.md:166–167`.

### Lokasi
- **Definisi**: Tempat fisik penyimpanan aset dengan hierarki Gedung → Lantai → Ruangan.
- **Contoh penggunaan**: "Aset dipindahkan dari Gedung A Lantai 2 ke Ruang Lab Kimia."
- **Relasi**: `Lokasi (1) → (n) Aset`; aktif ditentukan oleh `MutasiAset` terbaru.
- **Referensi**: `model_domain.md:15–17`, `model_domain.md:67`; `usecase_userstories.md:77–90`.

### MutasiAset
- **Definisi**: Entri yang merekam perpindahan `Aset` antar `Lokasi` dan menentukan `Lokasi Aktif` pada mutasi terbaru.
- **Contoh penggunaan**: "Sarpras membuat MutasiAset untuk memindahkan proyektor ke ruang rapat."
- **Relasi**: `Aset (1) → (n) MutasiAset`; memperbarui `Lokasi Aktif`.
- **Referensi**: `model_domain.md:8`, `model_domain.md:63`; `usecase_userstories.md:81–89`.

### Peminjaman
- **Definisi**: Transaksi penggunaan aset sementara oleh `Pengguna` dengan status Dipinjam, Dikembalikan, Terlambat, atau Rusak.
- **Contoh penggunaan**: "Guru mengajukan Peminjaman proyektor untuk kegiatan kelas."
- **Relasi**: `User (1) → (n) Peminjaman`; `Aset (1) → (n) Peminjaman`.
- **Referensi**: `model_domain.md:19–21`, `model_domain.md:47–53`; `usecase_userstories.md:91–105`.

### Inventarisasi
- **Definisi**: Kegiatan stock opname periodik yang memverifikasi keberadaan/kondisi `Aset` menggunakan pemindaian `QR code` dan foto bukti.
- **Contoh penggunaan**: "Operator melakukan Inventarisasi dengan scan QR dan unggah foto."
- **Relasi**: `Aset (1) → (n) Inventarisasi`.
- **Referensi**: `model_domain.md:22–24`, `model_domain.md:64`; `usecase_userstories.md:106–118`.

### Penyusutan
- **Definisi**: Perhitungan penurunan nilai `Aset` metode garis lurus setiap akhir bulan sehingga menghasilkan `Nilai Penyusutan` dan memperbarui `Nilai Buku`.
- **Contoh penggunaan**: "Akhir bulan, sistem menghitung Penyusutan untuk semua aset aktif."
- **Relasi**: `Aset (1) → (1) Penyusutan`; menggunakan `Masa Manfaat`, `Harga`.
- **Referensi**: `model_domain.md:25–26`, `model_domain.md:56–59`, `model_domain.md:71`; `usecase_userstories.md:119–131`.

### Pengguna
- **Definisi**: Entitas yang mewakili user sistem dengan peran RBAC, termasuk Kepsek, Wakasek Sarpras, Bendahara BOS, Operator, dan Guru.
- **Contoh penggunaan**: "Operator menambah Aset, Kepsek meninjau Audit Trail."
- **Relasi**: `Pengguna` berperan sebagai aktor pada semua use case; memengaruhi hak akses fitur.
- **Referensi**: `model_domain.md:28–29`; `usecase_userstories.md:8–13`, `usecase_userstories.md:169–178`.

### QR code
- **Definisi**: Kode unik yang dihasilkan otomatis saat `Aset` dibuat, digunakan untuk identifikasi cepat pada Inventarisasi.
- **Contoh penggunaan**: "Sistem mengenerate QR code ketika aset baru diregistrasi."
- **Relasi**: Atribut `Aset`; digunakan pada `Inventarisasi`.
- **Referensi**: `model_domain.md:43`, `model_domain.md:72`; `usecase_userstories.md:66–69`, `usecase_userstories.md:109–117`.

### Laporan KIB
- **Definisi**: Laporan inventaris barang sesuai standar KIB yang dapat diunduh dalam format Excel/PDF.
- **Contoh penggunaan**: "Sarpras mengunduh Laporan KIB untuk pelaporan semester."
- **Relasi**: Mengkonsumsi data `Aset`, `Lokasi`, `KategoriAset`, dan kondisi.
- **Referensi**: `model_domain.md:73`; `usecase_userstories.md:132–142`, `usecase_userstories.md:229–233`.

### Berita Acara (BA)
- **Definisi**: Dokumen bukti administratif yang diunggah saat penghapusan aset untuk memvalidasi perubahan status.
- **Contoh penggunaan**: "Sarpras mengunggah BA saat menandai aset sebagai Dihapus."
- **Relasi**: Proses `Penghapusan Aset` (UC7); terkait status `Aset`.
- **Referensi**: `model_domain.md:75`; `usecase_userstories.md:144–156`, `usecase_userstories.md:234–240`.

### Kode Aset
- **Definisi**: Identitas unik aset dengan format `SCH/KD/KAT/NOURUT` untuk keterlacakan.
- **Contoh penggunaan**: "`kode_aset` SCH/01/EL/0005 mengacu pada laptop elektronik urutan ke-5."
- **Relasi**: Atribut kunci `Aset` (unik); digunakan pada registrasi dan Inventarisasi.
- **Referensi**: `model_domain.md:34`; `usecase_userstories.md:66–76`.

### Kondisi Aset
- **Definisi**: Status fisik aset: Baik, Rusak Ringan, Rusak Berat, Hilang.
- **Contoh penggunaan**: "Aset dikembalikan dengan kondisi Rusak Berat setelah peminjaman."
- **Relasi**: Atribut `Aset`; memengaruhi kebijakan `Penghapusan` dan status `Peminjaman`.
- **Referensi**: `model_domain.md:41`; `usecase_userstories.md:99–104`.

### Sumber Dana
- **Definisi**: Asal pembiayaan pengadaan aset, mis. BOS, APBD, Hibah.
- **Contoh penggunaan**: "Aset mikroskop dicatat dengan Sumber Dana BOS."
- **Relasi**: Atribut `Aset`; relevan untuk pelaporan KIB/RKAS.
- **Referensi**: `model_domain.md:40`; `usecase_userstories.md:61–69`.

### Nilai Buku
- **Definisi**: Nilai akuntansi aset setelah akumulasi `Nilai Penyusutan`.
- **Contoh penggunaan**: "Nilai Buku proyektor turun setelah penyusutan bulanan."
- **Relasi**: Diturunkan dari `Penyusutan`; atribut `Aset` secara keuangan.
- **Referensi**: `model_domain.md:57–58`; `usecase_userstories.md:119–131`.

### Nilai Penyusutan
- **Definisi**: Besaran penurunan nilai aset per periode sesuai metode garis lurus.
- **Contoh penggunaan**: "Nilai Penyusutan bulan ini tercatat sebesar Rp200.000."
- **Relasi**: Bagian dari perhitungan `Penyusutan`.
- **Referensi**: `model_domain.md:56`; `usecase_userstories.md:124–131`.

### Masa Manfaat
- **Definisi**: Periode penggunaan ekonomis aset dalam tahun sebagai dasar perhitungan garis lurus.
- **Contoh penggunaan**: "Masa Manfaat laptop ditetapkan 4 tahun."
- **Relasi**: Parameter `Penyusutan`.
- **Referensi**: `model_domain.md:59`; `usecase_userstories.md:122–131`.

### Tanggal Pencatatan
- **Definisi**: Waktu saat data `Aset` dicatat pertama kali ke sistem.
- **Contoh penggunaan**: "Tanggal Pencatatan aset tercatat saat registrasi awal."
- **Relasi**: Atribut `Aset`; berkaitan dengan audit.
- **Referensi**: `model_domain.md:44`; `usecase_userstories.md:61–76`.

### Status Peminjaman
- **Definisi**: Status siklus transaksi: Dipinjam, Dikembalikan, Terlambat, Rusak.
- **Contoh penggunaan**: "Status Peminjaman berubah menjadi Terlambat melewati jatuh tempo."
- **Relasi**: Atribut `Peminjaman`; memengaruhi kondisi `Aset` pada pengembalian.
- **Referensi**: `model_domain.md:20–21`, `model_domain.md:52`; `usecase_userstories.md:99–104`.

### Peminjam
- **Definisi**: `Pengguna` yang mengajukan atau menerima `Peminjaman` aset.
- **Contoh penggunaan**: "Peminjam tercatat sebagai Guru kelas XI IPA."
- **Relasi**: Relasi `User (1) → (n) Peminjaman`.
- **Referensi**: `model_domain.md:50–51`; `usecase_userstories.md:91–98`.

### Tujuan Pinjam
- **Definisi**: Alasan kontekstual peminjaman aset untuk kegiatan tertentu.
- **Contoh penggunaan**: "Tujuan Pinjam: presentasi rapat guru."
- **Relasi**: Atribut `Peminjaman`; dilihat pada persetujuan/serah terima.
- **Referensi**: `model_domain.md:51`; `usecase_userstories.md:95–104`.

### Lokasi Aktif
- **Definisi**: Lokasi terkini tempat aset berada, ditentukan oleh `MutasiAset` terakhir.
- **Contoh penggunaan**: "Lokasi Aktif proyektor adalah Ruang Rapat Gedung A."
- **Relasi**: Turunan dari `MutasiAset` terhadap `Lokasi`.
- **Referensi**: `model_domain.md:8`, `model_domain.md:67`; `usecase_userstories.md:81–89`.

### Audit Trail
- **Definisi**: Jejak perubahan data yang merekam `user_id`, `action`, `timestamp`, dan `field_changed` untuk akuntabilitas.
- **Contoh penggunaan**: "Kepsek meninjau Audit Trail perubahan harga aset."
- **Relasi**: Berlaku untuk perubahan pada entitas utama; ditinjau pada UC10.
- **Referensi**: `model_domain.md:79–83`; `usecase_userstories.md:179–188`, `usecase_userstories.md:243–248`.

---

## Catatan Khusus
- `Kode Aset` memiliki format baku `SCH/KD/KAT/NOURUT` dan wajib unik untuk mencegah duplikasi referensi (`model_domain.md:34`).
- `Lokasi Aktif` tidak diset langsung; sistem menentukannya dari mutasi terbaru untuk menjaga konsistensi data penempatan (`model_domain.md:8`).
- `Penyusutan` berjalan otomatis di akhir bulan menggunakan metode garis lurus sesuai kebijakan BMN; aset tanpa `Masa Manfaat` valid dilewati dan dilaporkan (`model_domain.md:71`, `model_domain.md:59`).
- `Penghapusan Aset` membutuhkan unggahan `BA` sederhana sebagai bukti administratif (`model_domain.md:75`).
- `QR code` dihasilkan saat registrasi aset dan digunakan sebagai kunci operasional Inventarisasi (`model_domain.md:43`, `model_domain.md:72`).

---

## Verifikasi Konsistensi
- Cross-check istilah terhadap `model_domain.md` dan `usecase_userstories.md` menunjukkan konsistensi terminologi dan relasi tanpa kontradiksi.
- Uji alur UC4 Inventarisasi:
  - Menggunakan istilah `Aset`, `QR code`, `Inventarisasi`, `Lokasi Aktif`.
  - Langkah: scan `QR code` → unggah foto → simpan `Inventarisasi` yang tertaut ke `Aset`.
  - Rujukan: `usecase_userstories.md:106–118`; `model_domain.md:22–24`, `model_domain.md:64`.