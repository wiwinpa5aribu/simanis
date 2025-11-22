# Requirements: SIMANIS Frontend – Phase 2 (PWA, Inventarisasi, QR, Laporan)

## 1. Tujuan Utama Phase 2

Meningkatkan frontend hasil Phase 1 menjadi aplikasi yang:
- Installable sebagai **PWA** (manifest + service worker, basic caching).
- Mendukung **Inventarisasi** dengan **QR scanner kamera** + fallback input manual.
- Mendukung **upload foto aset** dan **dokumen BA** (untuk penghapusan di fase backend yang relevan).
- Menyediakan **Dashboard** ringkas (statistik kunci + aktivitas terbaru).
- Menampilkan **penyusutan bulanan** (view-only, perhitungan tetap di backend).
- Menghasilkan/men-trigger **Laporan KIB** (download PDF/Excel dari backend).
- Menyediakan **Audit Trail Viewer** dengan filter/pagination.

Scope ini mengikuti domain/use case yang sudah ada, tanpa menambah kompleksitas mode offline atau desktop.

---

## 2. Project Context

- Referensi:
  - `docs/model_domain.md`, `docs/usecase_userstories.md`, `docs/ubiquitous_language_dictionary.md`
  - `docs/database_schema.md`, `docs/algorithm_datastructure.md`, `docs/tech_stack.md`
  - Output Phase 1: `requirements.md`, `design.md`, `tasks.md`

- Tech Stack (lanjutan Phase 1):
  - React 18 + TypeScript, Vite 5, Tailwind + shadcn/ui
  - Zustand, TanStack Query, React Router, Zod + React Hook Form
  - Axios
  - Tambahan Phase 2:
    - `vite-plugin-pwa` (PWA)
    - `html5-qrcode` (QR scan)
    - `browser-image-compression` (opsional kompresi gambar)
    - (Export KIB) Frontend hanya trigger download; render file di backend

---

## 3. Lingkup Fungsional Phase 2

### 3.1. PWA Enablement (Installable)
- Fitur:
  - `manifest.json` (name, icons 192/512, theme/background color, display=standalone)
  - Service worker (Workbox via vite-plugin-pwa): cache-first untuk aset statis
  - Install prompt & status (ikon install di header opsional)
- Acceptance Criteria:
  - Aplikasi dapat di-install di Chrome/Edge (desktop & Android)
  - Lighthouse PWA score ≥ 85
  - Static assets cached; update otomatis saat versi baru dirilis

---

### 3.2. UC4 Inventarisasi dengan QR Scanner
- Fitur:
  - Halaman Scan Inventarisasi
    - Akses kamera via `html5-qrcode`
    - Fallback: input manual `kode_aset`
    - Tampilkan info aset yang ditemukan
    - Upload foto bukti (jpeg/png/webp, ≤ 5MB; kompres opsional)
    - Input catatan; simpan entri inventarisasi
  - Halaman daftar inventarisasi: filter by tanggal, search by kode/nama
- Acceptance Criteria:
  - QR scan berhasil menampilkan aset valid (≤ 1–2 detik di perangkat modern)
  - Fallback manual berfungsi jika kamera tidak tersedia/izin ditolak
  - Foto terunggah dan tampil di daftar/detail inventarisasi
  - Tersedia filter tanggal dan pagination

---

### 3.3. Upload Foto Aset & Dokumen BA
- Fitur:
  - Di detail aset: upload/ubah foto aset (preview sebelum submit)
  - Di alur penghapusan (jika backend siap): upload **BA_PENGHAPUSAN**
  - Validasi ukuran & tipe file; tampilkan progress upload
- Acceptance Criteria:
  - Foto aset tersimpan dan tampil pada detail aset
  - Dokumen BA terlampir pada entri penghapusan (bila alur aktif)
  - Error handling jelas: ukuran berlebih/tipe tidak didukung/permisson

---

### 3.4. Dashboard Ringkas
- Fitur:
  - Cards: total aset, aset per kategori (Top N), aset per kondisi, peminjaman aktif
  - Recent activities (5–10 terakhir): registrasi/mutasi/peminjaman/inventarisasi
- Acceptance Criteria:
  - Data tampil dengan loading & error state
  - Klik activity menuju halaman detail terkait
  - Responsif mobile/desktop

---

### 3.5. UC5 Penyusutan Bulanan (View Only)
- Fitur:
  - Halaman penyusutan: tabel entri per tanggal (bulan), nilai penyusutan, nilai buku
  - Filter per aset/kategori/bulan-tahun
  - Tidak ada perhitungan di frontend (hanya menampilkan data backend)
- Acceptance Criteria:
  - Data tersaji sesuai filter; pagination untuk dataset besar
  - Tidak ada kalkulasi di UI; semua angka dari backend

---

### 3.6. UC6 Laporan KIB – Generate & Download
- Fitur:
  - Form filter: kategori, lokasi (opsional), kondisi, rentang waktu (opsional)
  - Tombol Generate → backend memproses dan mengembalikan link download (PDF/Excel)
  - Indikator proses (spinner/progress) + handle error
- Acceptance Criteria:
  - File PDF/Excel dapat diunduh dan terbuka
  - Validasi jika tidak ada data → tetap menghasilkan laporan kosong dengan catatan

---

### 3.7. UC10 Audit Trail Viewer
- Fitur:
  - Daftar audit logs: entity_type, entity_id, user, action, timestamp, field_changed (summary)
  - Filter by entitas, user, rentang waktu
  - Pagination & sort by waktu
- Acceptance Criteria:
  - Filter bekerja; pagination stabil pada dataset besar
  - Klik baris → tampilkan detail perubahan (field_changed) secara readable

---

### 3.8. Peningkatan UX & RBAC UI (Should Have)
- Fitur (opsional prioritas):
  - RBAC UI refinement: sembunyikan/disable aksi sesuai role
  - Assets advanced table: search, filter kombinasi, sort kolom, pagination server-side
  - Generate & download QR code aset dari halaman detail
  - Lokasi: cascading selector penuh (Gedung → Lantai → Ruangan)
- Acceptance Criteria:
  - Aksi yang tidak sesuai role tidak dapat diakses via UI
  - Tabel aset tetap responsif di dataset menengah (ribuan baris via server-side)

---

## 4. Non-Fungsional Requirements (Phase 2)

### Performance
- Daftar data besar (assets/audit): server-side pagination, page load < 1.5s per halaman
- QR scanner response: ≤ 2s di perangkat modern
- Upload gambar: maksimal 5MB; kompresi opsional hingga ~1MB tanpa menurunkan kualitas berlebihan

### Compatibility
- Browser: Chrome 95+, Edge 95+, Firefox 95+, Safari 14+
- Mobile: Android 10+ (kamera), iOS 14+ (kamera via Safari)

### Security
- Token-based auth; Authorization header hanya via HTTPS
- Validasi file upload (tipe/ukuran); hindari XSS dari preview gambar
- Sanitasi input semua form (Zod + escaping di UI)

### Accessibility
- WCAG 2.1 AA: fokus terlihat, ARIA labels, kontras warna
- Komponen hasil scan & upload dapat dioperasikan via keyboard

---

## 5. Technical Constraints & Integrasi API

### Endpoints (contoh, menyesuaikan backend)
- PWA: tidak perlu endpoint
- Inventarisasi: `GET /inventory?from=&to=`, `POST /inventory` (asset_id, photo_url/file, note)
- Upload berkas: gunakan endpoint storage backend (URL pre-signed atau multipart)
- Penyusutan: `GET /depreciations?assetId=&month=&year=`
- Laporan KIB: `POST /reports/kib` → returns job/link → `GET /reports/:id/download`
- Audit Logs: `GET /audit-logs?entity_type=&entity_id=&user_id=&from=&to=`

### Pola Integrasi
- Bearer token di header setiap request
- Pagination server-side: `page`, `pageSize` (atau cursor-based jika disediakan)
- Error format konsisten: `{ error: string, message: string }`
- React Query: cache key per filter; invalidasi pada perubahan

### File Upload
- Tipe: image/jpeg, image/png, image/webp; untuk BA: PDF juga diizinkan (jika backend)
- Batas ukuran: 5MB; tampilkan progress bar
- Kompresi opsional: `browser-image-compression`

---

## 6. Validation & Error Handling

- Zod schemas baru:
  - Inventarisasi: `{ asset_id, photo(file|url), note? }`
  - Upload Foto Aset: `{ file }`
  - Filter KIB: `{ kategori?, lokasi?, kondisi?, dari?, sampai? }`
  - Penyusutan filter: `{ assetId?, month?, year? }`
  - Audit filter: `{ entity_type?, entity_id?, user_id?, from?, to? }`

- Error Handling pola:
  - 401: logout & redirect ke login
  - 422/400: tampilkan pesan validasi dari server
  - 500: pesan umum + opsi retry

---

## 7. Development Workflow (Phase 2)

- Branching: `feat/pwa`, `feat/inventory-qr`, `feat/asset-upload`, `feat/dashboard`, `feat/depreciation-view`, `feat/kib-export`, `feat/audit-view`.
- Commit message mengikuti konvensi Phase 1.
- Manual testing checklist per fitur; Lighthouse PWA audit setelah PWA enable.

---

## 8. Risks & Mitigations

- Izin kamera ditolak / tidak ada kamera
  - Fallback input manual; tampilkan panduan mengaktifkan izin
- Kualitas kamera rendah / low light
  - Tersedia toggle kamera belakang (facingMode), sorotan/torch jika didukung
- Laporan KIB lambat (backend proses berat)
  - Tampilkan progress/polling; beri tahu user saat siap diunduh
- Dataset besar (audit/assets)
  - Wajib server-side pagination + indeks DB; batasi pageSize default (mis. 20–50)
- Unggah file lambat
  - Kompresi, progress bar, batas ukuran tegas, pesan error jelas

---

## 9. Success Metrics (Phase 2)

- Fungsional:
  - PWA installable dan berjalan setelah refresh/update
  - QR scanner bekerja di Chrome Android; fallback manual berfungsi
  - Foto aset & dokumen (BA) berhasil diunggah
  - Dashboard menampilkan statistik dan aktivitas terbaru
  - Tampilan penyusutan sesuai data backend
  - Laporan KIB dapat diunduh (PDF/Excel)
  - Audit Trail dapat difilter & dipaginasi tanpa error

- Teknis:
  - Lighthouse PWA ≥ 85, Performance ≥ 80
  - Tanpa error fatal di console
  - Response daftar (assets/audit) < 1.5s pada koneksi wajar

---

## 10. Timeline (Estimasi 4 Minggu)

- Week 1: PWA enablement + Upload Foto Aset
- Week 2: Inventarisasi (QR + list) + Audit Trail Viewer
- Week 3: Dashboard + Penyusutan (view-only)
- Week 4: KIB export + Polishing (aksesibilitas, performa, error states)

---

**Status**: Draft Requirements Phase 2  
**Owner**: Frontend Developer  
**Last Updated**: 2025-01-XX
