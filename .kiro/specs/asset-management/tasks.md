# Implementation Plan - Asset Management

## Overview

Implementasi fitur manajemen aset sesuai dengan requirements dan design document. Tasks disusun secara incremental dengan fokus pada frontend terlebih dahulu, kemudian integrasi dengan backend.

---

- [x] 1. Update AssetsListPage - Tambah kolom Kondisi dan perbaiki pagination







  - [ ] 1.1 Tambahkan kolom "Kondisi" di tabel dengan badge warna sesuai status
    - Baik: green, Rusak Ringan: yellow, Rusak Berat: orange, Hilang: red
    - _Requirements: 1.1_
  - [ ] 1.2 Implementasi pagination dengan opsi 10, 25, 50 item per halaman
    - Tambah state pageSize dan dropdown selector
    - Update query params untuk server-side pagination
    - _Requirements: 1.5_
  - [ ]* 1.3 Write property test untuk filter pencarian
    - **Property 1: Search Filter Correctness**





    - **Validates: Requirements 1.2**
  - [x]* 1.4 Write property test untuk filter kategori dan kondisi

    - **Property 2: Category Filter Correctness**
    - **Property 3: Condition Filter Correctness**


    - **Validates: Requirements 1.3, 1.4**







- [ ] 2. Implementasi responsive DataTable dengan card view mobile
  - [x] 2.1 Buat AssetCard component untuk tampilan mobile

    - Tampilkan: kode aset, nama, kategori, lokasi, kondisi badge, nilai
    - Tombol detail dan favorite
    - _Requirements: 1.1_
  - [x] 2.2 Update DataTable untuk switch ke card view di breakpoint < md

    - Gunakan mobileCardRenderer prop
    - _Requirements: 1.1_
  - [ ] 2.3 Buat FilterBar collapsible untuk mobile
    - Toggle button untuk expand/collapse filters
    - Default collapsed di mobile
    - _Requirements: 1.2, 1.3, 1.4_





- [x] 3. Checkpoint - Pastikan semua tests passing

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Update AssetCreatePage - Hapus input kode aset manual dan tambah foto upload
  - [ ] 4.1 Hapus field kode aset dari form (akan di-generate backend)
    - Update schema validation
    - Tampilkan info bahwa kode akan di-generate otomatis
    - _Requirements: 2.2_
  - [ ] 4.2 Tambahkan FileUpload component untuk foto aset
    - Accept: image/jpeg, image/png
    - Max size: 2MB
    - Preview sebelum upload
    - _Requirements: 2.5_
  - [ ] 4.3 Update form layout responsive (grid 1 col mobile, 2 col desktop)
    - _Requirements: 2.1_
  - [ ]* 4.4 Write property test untuk validasi field wajib
    - **Property 7: Required Field Validation**
    - **Validates: Requirements 2.4**
  - [ ]* 4.5 Write property test untuk validasi foto upload
    - **Property 8: Photo Upload Validation**
    - **Validates: Requirements 2.5**

- [ ] 5. Update AssetEditPage - Kode aset readonly
  - [ ] 5.1 Set field kode aset sebagai readonly/disabled
    - Tampilkan dengan style berbeda (grayed out)
    - _Requirements: 3.4_
  - [ ] 5.2 Update form layout responsive sama seperti create page
    - _Requirements: 3.1_
  - [ ]* 5.3 Write property test untuk immutability kode aset
    - **Property 11: Asset Code Immutability**
    - **Validates: Requirements 3.4**

- [ ] 6. Checkpoint - Pastikan semua tests passing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Update AssetDetailPage - Tambah QR code display dan cetak
  - [ ] 7.1 Buat QRCodeDisplay component
    - Render QR code dari data aset
    - Tombol download (PNG)
    - Tombol cetak
    - _Requirements: 4.2_
  - [ ] 7.2 Integrasikan QRCodeDisplay ke AssetDetailPage
    - Tampilkan di sidebar (desktop) atau section terpisah (mobile)
    - _Requirements: 4.2_
  - [ ] 7.3 Implementasi fungsi cetak QR dengan dialog print
    - Buat print-friendly layout dengan CSS @media print
    - Include: QR code, kode aset, nama barang, kategori
    - _Requirements: 4.3_
  - [ ] 7.4 Update layout responsive untuk detail page
    - 2 kolom di desktop, 1 kolom di mobile
    - _Requirements: 4.1_

- [ ] 8. Tambah riwayat mutasi lokasi di AssetDetailPage
  - [ ] 8.1 Buat AssetMutationHistory component
    - Timeline view dengan tanggal, dari ruangan, ke ruangan, catatan
    - Empty state jika belum ada mutasi
    - _Requirements: 4.4_
  - [ ] 8.2 Fetch data mutasi dari API /assets/:id/mutations
    - Integrasikan dengan TanStack Query
    - _Requirements: 4.4_

- [ ] 9. Checkpoint - Pastikan semua tests passing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implementasi DeleteAssetDialog dengan upload Berita Acara
  - [ ] 10.1 Buat DeleteAssetDialog component
    - Modal dialog dengan konfirmasi
    - FileUpload untuk Berita Acara (PDF)
    - Tombol batal dan konfirmasi hapus
    - _Requirements: 5.1, 5.4_
  - [ ] 10.2 Implementasi permission check untuk tombol hapus
    - Hanya tampilkan untuk role: wakasek_sarpras, kepsek
    - Tampilkan pesan info untuk role operator
    - _Requirements: 5.1, 5.3_
  - [ ] 10.3 Integrasikan DeleteAssetDialog ke AssetDetailPage
    - Replace confirm() dengan dialog baru
    - _Requirements: 5.1_
  - [ ]* 10.4 Write property test untuk soft delete dengan Berita Acara
    - **Property 12: Soft Delete with Berita Acara**
    - **Validates: Requirements 5.2, 5.4**

- [ ] 11. Backend - Update asset code generator dan QR code service
  - [ ] 11.1 Implementasi AssetCodeGenerator service
    - Format: SCH/XX/YYY/NNN
    - Auto-increment nomor urut per kategori
    - _Requirements: 2.2_
  - [ ] 11.2 Update CreateAssetUseCase untuk auto-generate kode dan QR
    - Generate kode aset sebelum save
    - Generate QR code setelah kode dibuat
    - _Requirements: 2.2, 2.3_
  - [ ]* 11.3 Write property test untuk format kode aset
    - **Property 5: Asset Code Format Validation**
    - **Validates: Requirements 2.2**
  - [ ]* 11.4 Write property test untuk QR code round trip
    - **Property 6: QR Code Round Trip**
    - **Validates: Requirements 2.3**

- [ ] 12. Backend - Implementasi audit trail untuk update aset
  - [ ] 12.1 Update UpdateAssetUseCase untuk mencatat perubahan di audit_logs
    - Record: entity_type, entity_id, user_id, action, field_changed
    - _Requirements: 3.2_
  - [ ]* 12.2 Write property test untuk audit trail
    - **Property 9: Audit Trail on Update**
    - **Validates: Requirements 3.2**

- [ ] 13. Backend - Implementasi soft delete dengan Berita Acara
  - [ ] 13.1 Update DeleteAssetUseCase
    - Require berita acara file
    - Set is_deleted = true, deleted_at = now
    - Save berita acara ke asset_documents
    - Record di asset_deletions table
    - _Requirements: 5.2, 5.4_
  - [ ] 13.2 Implementasi permission check di controller
    - Hanya allow role: wakasek_sarpras, kepsek
    - Return 403 untuk role lain
    - _Requirements: 5.1, 5.3_

- [ ] 14. Checkpoint - Pastikan semua tests passing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Final integration dan testing
  - [ ] 15.1 Test end-to-end flow: create → view → edit → delete
    - Verifikasi semua fitur bekerja dengan data real
  - [ ] 15.2 Test responsive design di berbagai device
    - Mobile (320px - 640px)
    - Tablet (768px - 1024px)
    - Desktop (1280px+)
  - [ ] 15.3 Test print QR code functionality
    - Verifikasi layout print sesuai

- [ ] 16. Final Checkpoint - Pastikan semua tests passing
  - Ensure all tests pass, ask the user if questions arise.
