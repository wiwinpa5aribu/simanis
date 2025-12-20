# Domain Glossary - SIMANIS

Dokumen ini berisi definisi istilah dan konsep utama yang digunakan dalam pengembangan sistem SIMANIS.

## Istilah Dasar
| Istilah | Definisi | Konteks Penggunaan |
| :--- | :--- | :--- |
| **Aset** | Barang milik sekolah yang memiliki nilai ekonomi dan masa manfaat lebih dari satu tahun. | Objek utama yang dikelola di modul \/aset\. |
| **Mutasi** | Perpindahan fisik aset dari satu lokasi ke lokasi lain. | Dicatat untuk menjaga akurasi lokasi aset di modul \/mutasi\. |
| **Depresiasi (Penyusutan)** | Alokasi sistematis dari nilai aset tetap selama masa manfaatnya. | Digunakan dalam laporan keuangan aset di \/laporan\. |
| **Lokasi (Hierarchy)** | Struktur pohon lokasi aset (Gedung -> Lantai -> Ruangan). | Memudahkan pelacakan fisik di modul \/lokasi\. |
| **Audit Log** | Catatan permanen aktivitas user (siapa, apa, kapan, hasil). | Digunakan untuk kontrol keamanan di modul \/audit\. |
| **Kondisi Aset** | Status fisik aset (Baik, Cukup, Kurang, Rusak). | Menentukan kebutuhan pemeliharaan atau penghapusan. |

## Konsep Teknis (Prisma & Next.js)
| Istilah | Definisi | Peran dalam Sistem |
| :--- | :--- | :--- |
| **Prisma Schema** | File sumber kebenaran (\schema.prisma\) untuk struktur database. | Menjamin konsistensi antara kode dan database MySQL. |
| **Zod Schema** | Definisi skema validasi runtime menggunakan library Zod. | Memastikan data yang masuk ke Service Layer selalu valid secara tipe. |
| **Service Layer** | Lapisan abstraksi (\lib/services\) yang menangani logika bisnis. | Memisahkan UI dari akses langsung ke database (Prisma). |
| **Server Components** | Komponen Next.js yang berjalan di sisi server. | Digunakan untuk pengambilan data (Data Fetching) yang efisien. |
| **Client Components** | Komponen UI interaktif (Form, Filter, Chart). | Menangani interaksi user di sisi browser. |

## Aturan Bisnis Penting
1. **Uniknya ID Aset**: Format ID harus mengikuti pola \AST-XXXX\ dan tidak boleh duplikat.
2. **Integritas Lokasi**: Aset hanya bisa ditempatkan di lokasi dengan tipe \uangan\.
3. **Status Mutasi**:
    - \diproses\: Mutasi sedang dalam perjalanan atau menunggu verifikasi.
    - \selesai\: Aset sudah sampai di lokasi tujuan dan terkonfirmasi.
    - \dibatalkan\: Mutasi dibatalkan sebelum perpindahan selesai.
4. **Sesi Stock Opname**: Proses berkala (\/stock-opname\) untuk mencocokkan jumlah fisik dengan data sistem.
5. **Kepatuhan Audit**: Setiap perubahan kritis (Create/Update/Delete) wajib menghasilkan \AuditLog\.

---
*Terakhir diperbarui: 19 Desember 2025*
