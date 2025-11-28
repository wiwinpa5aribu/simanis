# Requirements Document

## Introduction

Dokumen ini mendefinisikan requirements untuk peningkatan fitur login pada aplikasi SIMANIS (Sistem Manajemen Aset Sekolah). Fitur-fitur ini bertujuan untuk meningkatkan user experience dan keamanan bagi pengguna sekolah (guru, operator, kepala sekolah) yang sering mengakses sistem dari berbagai perangkat.

## Glossary

- **SIMANIS**: Sistem Manajemen Aset Sekolah - aplikasi untuk mengelola inventaris aset sekolah
- **PWA**: Progressive Web App - aplikasi web yang dapat diinstall dan bekerja offline
- **Remember Me**: Fitur untuk menyimpan sesi login lebih lama
- **Token**: JWT (JSON Web Token) yang digunakan untuk autentikasi
- **localStorage**: Penyimpanan browser yang persisten
- **sessionStorage**: Penyimpanan browser yang hilang saat tab ditutup
- **Resend**: Layanan email API untuk mengirim email transaksional
- **Rate Limiting**: Pembatasan jumlah request dalam periode waktu tertentu

## Requirements

### Requirement 1: Remember Me (Ingat Saya)

**User Story:** Sebagai guru/staff sekolah, saya ingin sistem mengingat login saya di perangkat pribadi, sehingga saya tidak perlu login ulang setiap kali membuka aplikasi.

#### Acceptance Criteria

1. WHEN pengguna mengaktifkan checkbox "Ingat Saya" dan berhasil login THEN the System SHALL menyimpan token di localStorage dengan masa berlaku 30 hari
2. WHEN pengguna tidak mengaktifkan checkbox "Ingat Saya" dan berhasil login THEN the System SHALL menyimpan token di sessionStorage yang akan hilang saat browser ditutup
3. WHEN pengguna membuka aplikasi dengan token valid di localStorage THEN the System SHALL secara otomatis mengarahkan pengguna ke halaman dashboard tanpa perlu login ulang
4. WHEN token di localStorage sudah expired (lebih dari 30 hari) THEN the System SHALL menghapus token dan mengarahkan pengguna ke halaman login
5. WHEN pengguna melakukan logout THEN the System SHALL menghapus token dari localStorage atau sessionStorage sesuai dengan pilihan sebelumnya

### Requirement 2: Offline Notice (Notifikasi Offline)

**User Story:** Sebagai pengguna PWA, saya ingin mengetahui status koneksi internet saya, sehingga saya memahami keterbatasan fitur saat offline.

#### Acceptance Criteria

1. WHEN aplikasi mendeteksi koneksi internet terputus THEN the System SHALL menampilkan banner notifikasi di bagian atas layar dengan pesan "Anda sedang offline"
2. WHEN koneksi internet kembali tersedia THEN the System SHALL menghilangkan banner offline dan menampilkan notifikasi singkat "Koneksi kembali tersedia"
3. WHEN pengguna dalam kondisi offline mencoba melakukan aksi yang membutuhkan internet THEN the System SHALL menampilkan pesan error yang informatif bahwa aksi tidak dapat dilakukan tanpa koneksi
4. WHILE pengguna dalam kondisi offline THEN the System SHALL tetap menampilkan data yang sudah di-cache sebelumnya jika tersedia
5. WHEN aplikasi pertama kali dimuat dalam kondisi offline THEN the System SHALL menampilkan halaman offline dengan instruksi untuk memeriksa koneksi internet

### Requirement 3: Lupa Password

**User Story:** Sebagai guru/staff yang lupa password, saya ingin dapat mereset password melalui email, sehingga saya dapat mengakses kembali akun saya tanpa harus menghubungi admin.

#### Acceptance Criteria

1. WHEN pengguna mengklik link "Lupa Password?" di halaman login THEN the System SHALL menampilkan form untuk memasukkan email terdaftar
2. WHEN pengguna memasukkan email yang terdaftar dan submit form THEN the System SHALL mengirim email berisi link reset password yang valid selama 1 jam
3. WHEN pengguna memasukkan email yang tidak terdaftar THEN the System SHALL menampilkan pesan yang sama dengan email terdaftar untuk mencegah enumerasi akun
4. WHEN pengguna mengklik link reset password yang valid THEN the System SHALL menampilkan form untuk memasukkan password baru
5. WHEN pengguna memasukkan password baru yang memenuhi kriteria keamanan THEN the System SHALL mengupdate password dan mengarahkan ke halaman login dengan pesan sukses
6. WHEN pengguna mencoba menggunakan link reset password yang sudah expired atau sudah digunakan THEN the System SHALL menampilkan pesan error dan opsi untuk request link baru
7. IF pengguna melakukan request reset password lebih dari 3 kali dalam 1 jam THEN the System SHALL menolak request dan menampilkan pesan untuk mencoba lagi nanti

### Requirement 4: Peningkatan Error Messages

**User Story:** Sebagai pengguna, saya ingin melihat pesan error yang jelas dan informatif saat login gagal, sehingga saya tahu apa yang harus diperbaiki.

#### Acceptance Criteria

1. WHEN pengguna memasukkan username yang tidak terdaftar THEN the System SHALL menampilkan pesan "Username atau password salah" tanpa mengungkapkan apakah username ada atau tidak
2. WHEN pengguna memasukkan password yang salah THEN the System SHALL menampilkan pesan "Username atau password salah" tanpa mengungkapkan bahwa password yang salah
3. WHEN terjadi error koneksi ke server THEN the System SHALL menampilkan pesan "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
4. WHEN server mengembalikan error 500 THEN the System SHALL menampilkan pesan "Terjadi kesalahan pada server. Silakan coba lagi nanti."
5. WHEN pengguna mencoba login lebih dari 5 kali gagal dalam 15 menit THEN the System SHALL menampilkan pesan "Terlalu banyak percobaan login. Silakan tunggu 15 menit."
