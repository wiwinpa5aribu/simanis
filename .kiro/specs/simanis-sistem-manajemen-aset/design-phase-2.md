# Design: SIMANIS Frontend – Phase 2 (PWA, Inventarisasi, QR, Laporan)

Dokumen ini merinci desain teknis frontend Phase 2 yang selaras dengan
`requirements-phase-2.md`.

Fokus:
- PWA (manifest + service worker) – caching dasar & installable
- Inventarisasi dengan QR scanner + fallback manual, upload foto
- Upload foto aset & dokumen BA
- Dashboard ringkas + recent activities
- Penyusutan bulanan (view-only)
- Laporan KIB (trigger backend, unduh PDF/Excel)
- Audit Trail Viewer (filter + pagination)

---

## 1. Arsitektur & Perubahan dari Phase 1

```text
Browser
└── React SPA (Vite + TypeScript)
    ├── PWA (vite-plugin-pwa: manifest + service worker)
    ├── Routing (React Router)
    ├── State Global (Zustand)
    ├── Server State (TanStack Query)
    ├── Forms (React Hook Form + Zod)
    ├── UI (Tailwind + shadcn/ui)
    └── API Client (Axios)
```

- Penambahan PWA menggunakan `vite-plugin-pwa` untuk generate SW & manifest.
- Integrasi `html5-qrcode` untuk akses kamera & scanning QR.
- Komponen upload berkas dengan validasi tipe/ukuran dan progress.

---

## 2. Struktur Folder (Tambahan Phase 2)

```txt
frontend/
  src/
    routes/
      dashboard/
        DashboardPage.tsx
      inventory/
        InventoryListPage.tsx
        InventoryScanPage.tsx
        components/
          QRScanner.tsx           // komponen kamera & scan
          InventoryForm.tsx       // upload foto + note
      depreciation/
        DepreciationListPage.tsx
      reports/
        KIBGeneratePage.tsx
      audit/
        AuditListPage.tsx
        AuditDetailDrawer.tsx

    components/
      uploads/
        FileUpload.tsx            // generic upload dengan progress
      charts/
        SimpleBarChart.tsx        // opsional, statistik ringan

    libs/
      api/
        inventory.ts
        depreciation.ts
        reports.ts
        audit.ts
      validation/
        inventorySchemas.ts
        reportSchemas.ts
        auditSchemas.ts

    pwa/
      pwa.ts                      // inisialisasi vite-plugin-pwa (jika dipisah)
```

Catatan: semua file wajib diberi komentar Bahasa Indonesia yang menjelaskan tujuan komponen & logika penting.

---

## 3. PWA Design

### 3.1. Konfigurasi vite-plugin-pwa

```ts
// vite.config.ts (cuplikan)
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'SIMANIS - Sistem Manajemen Aset Sekolah',
        short_name: 'SIMANIS',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst'
          },
          {
            urlPattern: ({ request }) => ['style','script','image','font'].includes(request.destination),
            handler: 'StaleWhileRevalidate'
          }
        ]
      }
    })
  ]
})
```

- Strategy: `NetworkFirst` untuk HTML, `StaleWhileRevalidate` untuk static assets.
- Tidak ada caching untuk API write; GET API bisa tetap lewat network (default) untuk kesederhanaan.

### 3.2. UI Install Prompt (opsional)
- Tambahkan tombol "Install App" di header bila PWA belum terpasang.
- Simpan state prompt di Zustand (sederhana) untuk menghindari spam.

---

## 4. Inventarisasi (QR + Upload)

### 4.1. Alur Scan & Simpan

```text
InventoryScanPage
  ├─ QRScanner (html5-qrcode)
  │    • Buka kamera belakang (jika tersedia)
  │    • Parse hasil QR → kode_aset
  ├─ Fetch detail aset berdasarkan kode
  ├─ InventoryForm
       • Upload foto bukti (≤ 5MB, jpeg/png/webp, kompres opsional)
       • Input catatan (optional)
       • Submit → POST /inventory
```

### 4.2. QRScanner.tsx
- Props: `onScanSuccess(kode: string)`, `onError(err)`
- Opsi: pilih kamera (front/back), torch jika didukung.
- Komentar menjelaskan pengaturan permission & error handling.

### 4.3. InventoryForm.tsx
- Form RHF + Zod: `{ asset_id, photo(file|url), note? }`
- Upload: gunakan FileUpload.tsx (progress bar, validasi ukuran/tipe).
- `useMutation` untuk submit; invalidate daftar inventarisasi.

### 4.4. InventoryListPage.tsx
- Tabel: waktu, aset, foto, note, user.
- Filter tanggal (from–to), pagination server-side.

---

## 5. Upload Foto Aset & Dokumen BA

### 5.1. FileUpload.tsx (Generic)
- Props: `accept`, `maxSizeMB`, `onUpload(file)`, `onProgress(p)`
- Validasi: tipe (image/*, pdf untuk BA), ukuran ≤ 5MB.
- Komentar: jelaskan alasan validasi & feedback ke user.

### 5.2. Integrasi di AssetDetailPage
- Seksi Foto Aset: tampilkan preview; tombol ganti foto → upload → update aset.
- Seksi Dokumen (opsional): unggah BA_PENGHAPUSAN (jika alur aktif di backend).

---

## 6. Dashboard Ringkas

### 6.1. Komponen
- `StatCard.tsx`: menampilkan angka kunci (total aset, per kondisi, per kategori, peminjaman aktif)
- `RecentActivities.tsx`: list 5–10 aktivitas terbaru; klik ke detail

### 6.2. Data
- Endpoint statistik & activity disediakan backend; React Query untuk fetch.
- Loading & error state standar; responsif grid.

---

## 7. Penyusutan Bulanan (View-Only)

### 7.1. DepreciationListPage.tsx
- Tabel: asset, tanggal_hitung (bulan), nilai_penyusutan, nilai_buku.
- Filter: aset/kategori, bulan–tahun. Pagination.
- Catatan di UI: angka berasal dari backend; tidak ada perhitungan di frontend.

---

## 8. Laporan KIB (Generate & Download)

### 8.1. KIBGeneratePage.tsx
- Form filter: kategori, lokasi (opsional), kondisi, rentang waktu (opsional).
- Submit: `POST /reports/kib` → terima job/link → polling/redirect download.
- Tampilkan progress & error.

### 8.2. Unduh
- Gunakan anchor dengan `download` atau `window.open(url)` untuk file.
- Tangani 404/timeout dengan pesan jelas.

---

## 9. Audit Trail Viewer

### 9.1. AuditListPage.tsx
- Tabel: entity_type, entity_id, user, action, timestamp, ringkasan field_changed.
- Filter: entitas, user, rentang waktu; pagination server-side.
- Klik baris → `AuditDetailDrawer.tsx` menampilkan JSON perubahan terformat.

---

## 10. API Integration Detail

### 10.1. Query Keys
- `['inventory', { from, to, page }]`
- `['depreciations', { assetId, month, year, page }]`
- `['reports', 'kib', { filtersHash }]`
- `['audit', { entity_type, entity_id, user_id, from, to, page }]`

### 10.2. Pola Pagination & Error
- Pagination server-side: `page`, `pageSize` atau cursor.
- Error 401: logout → `/login`.
- Error 422/400: tampilkan pesan validasi server.
- Error 500: pesan umum + retry.

---

## 11. Validasi (Zod) – Skema Baru

```ts
// inventorySchemas.ts
export const inventoryCreateSchema = z.object({
  asset_id: z.number({ required_error: 'Aset wajib dipilih' }),
  note: z.string().optional(),
  file: z
    .instanceof(File)
    .refine((f) => ['image/jpeg','image/png','image/webp'].includes(f.type), 'Tipe berkas harus JPEG/PNG/WebP')
    .refine((f) => f.size <= 5 * 1024 * 1024, 'Ukuran berkas maksimal 5MB')
})

// reportSchemas.ts
export const kibFilterSchema = z.object({
  category_id: z.number().optional(),
  room_id: z.number().optional(),
  condition: z.enum(['Baik','Rusak Ringan','Rusak Berat','Hilang']).optional(),
  from: z.string().optional(),
  to: z.string().optional()
})

// auditSchemas.ts
export const auditFilterSchema = z.object({
  entity_type: z.string().optional(),
  entity_id: z.string().optional(),
  user_id: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional()
})
```

---

## 12. Routing (Tambahan Phase 2)

```tsx
// Tambahan pada router utama
{
  path: '/',
  element: (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'inventory', children: [
        { index: true, element: <InventoryListPage /> },
        { path: 'scan', element: <InventoryScanPage /> },
    ]},
    { path: 'depreciation', element: <DepreciationListPage /> },
    { path: 'reports/kib', element: <KIBGeneratePage /> },
    { path: 'audit', element: <AuditListPage /> },
  ]
}
```

---

## 13. Performance & Accessibility

- Server-side pagination untuk dataset besar (audit/assets/inventory).
- Hindari render gambar beresolusi besar; gunakan `loading="lazy"`.
- PWA Lighthouse ≥ 85; Performance ≥ 80.
- WCAG AA: ARIA pada tombol, focus ring, kontras warna.

---

## 14. Keamanan & Upload

- semua request via HTTPS; header Authorization disisipkan interceptor.
- Validasi file: tipe & ukuran, tampilkan error jika melanggar.
- Jangan render konten file mentah tanpa sanitasi; gunakan URL Object untuk preview gambar.

---

## 15. Testing & Observabilitas (Manual – Minimal)

- Test QR scanner di Chrome Android + fallback manual.
- Test upload foto batas 5MB & tipe tidak valid.
- Test download KIB (PDF/Excel) – ukuran file & waktu tunggu.
- Test pagination & filter audit.
- Audit PWA via Lighthouse; pastikan installable.

---

## 16. Kesesuaian dengan Requirements

- Semua fitur dirancang sesuai `requirements-phase-2.md`.
- Tidak ada kalkulasi keuangan di frontend; hanya view & trigger backend.
- PWA hanya caching dasar; tidak ada offline sync kompleks di Phase 2.

---

**Status**: Draft Desain Teknis Phase 2 – siap untuk diturunkan ke tasks.
