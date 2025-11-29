# Domain Model Sistem Manajemen Aset Sekolah (SIMANIS)

## 1. Entitas Utama dan Relasinya

- Aset: Inti sistem yang merepresentasikan barang inventaris sekolah
  - Relasi:
    - 1→n dengan KategoriAset (satu kategori memiliki banyak aset; aset berada pada satu kategori)
    - 1→n dengan Lokasi melalui MutasiAset (aset dapat berpindah lokasi; lokasi aktif adalah mutasi terbaru)
    - 1→n dengan Peminjaman (aset bisa dipinjam berkali-kali)
    - 1→1 dengan Penyusutan (setiap aset memiliki jadwal/perhitungan penyusutan)

- KategoriAset: Pengelompokan sederhana aset (10–15 kategori umum)
  - Contoh: Elektronik, Furniture, Alat Lab, Kendaraan, Perangkat TIK, Buku/Perpustakaan, Peralatan Olahraga, Peralatan Kantor, Kebersihan, Peraga Edukasi, Mesin/Peralatan Teknis, Audio-Visual, Jaringan/Komunikasi, Tanaman/Taman, Lainnya

- Lokasi: Tempat penyimpanan aset
  - Hierarki: Gedung → Lantai → Ruangan
  - Contoh path: Gedung A / Lantai 2 / Lab Kimia

- Peminjaman: Mencatat transaksi peminjaman aset oleh guru/staf
  - Status: Dipinjam, Dikembalikan, Terlambat, Rusak

- Inventarisasi: Catatan stock opname periodik
  - Dilakukan via scan QR code dan upload foto bukti

- Penyusutan: Perhitungan nilai buku aset (metode garis lurus)
  - Mengacu kebijakan BMN untuk masa manfaat aset

- Pengguna: User sistem dengan role-based access control
  - Roles: Kepsek, Wakasek Sarpras, Bendahara BOS, Operator, Guru

## 2. Atribut Penting per Entitas

- Aset:
  - `kode_aset` (String, unique) — format: SCH/KD/KAT/NOURUT
  - `nama_barang` (String)
  - `merk` (String)
  - `spesifikasi` (Text)
  - `tahun_perolehan` (Date)
  - `harga` (Decimal)
  - `sumber_dana` (Enum: BOS, APBD, Hibah)
  - `kondisi` (Enum: Baik, Rusak Ringan, Rusak Berat, Hilang)
  - `foto` (URL)
  - `qr_code` (String)
  - `tanggal_pencatatan` (DateTime)
  - `created_by` (User)

- Peminjaman:
  - `tanggal_pinjam` (DateTime)
  - `tanggal_kembali` (DateTime)
  - `peminjam` (User)
  - `tujuan_pinjam` (Text)
  - `status` (Enum: Dipinjam, Dikembalikan, Terlambat, Rusak)
  - `catatan` (Text)

- Penyusutan:
  - `nilai_penyusutan` (Decimal)
  - `nilai_buku` (Decimal)
  - `tanggal_hitung` (Date)
  - `masa_manfaat` (Integer, tahun)

## 3. Hubungan yang Direkomendasikan

- Aset (1) → (n) MutasiAset (riwayat perpindahan lokasi)
- Aset (1) → (n) Inventarisasi (riwayat stock opname)
- User (1) → (n) Peminjaman (user bisa meminjam banyak aset)
- KategoriAset (1) → (n) Aset (kategori memiliki banyak aset)
- Lokasi (1) → (n) Aset (lokasi bisa menampung banyak aset)

## 4. Business Rules Penting

- Penyusutan dihitung otomatis tiap akhir bulan
- QR code generate otomatis saat aset dibuat
- Laporan KIB bisa di-generate dalam format Excel/PDF
- Mutasi aset harus update lokasi terakhir
- Penghapusan aset cukup dengan status + upload BA sederhana

## 5. Audit Trail Minimal

- Setiap perubahan data aset mencatat:
  - `user_id` (User)
  - `action` (Enum: CREATE, UPDATE, DELETE)
  - `timestamp` (DateTime)
  - `field_changed` (JSON)
