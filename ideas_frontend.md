# SIMANIS Frontend - UI/UX Concept Documentation

**Dokumentasi konsep tampilan dan user experience untuk SIMANIS (Sistem Manajemen Aset Sekolah)**

---

## 1. Design System Overview

### Color Palette
```css
/* Primary Colors */
--primary: #2563eb (Blue-600)
--primary-dark: #1e40af
--primary-light: #3b82f6

/* Status Colors */
--success: #10b981 (Green)
--warning: #f59e0b (Amber)
--error: #ef4444 (Red)
--info: #3b82f6 (Blue)

/* Kondisi Aset Colors */
--kondisi-baik: #10b981
--kondisi-rusak-ringan: #f59e0b
--kondisi-rusak-berat: #ef4444
--kondisi-hilang: #6b7280

/* Neutral */
--background: #ffffff
--card: #f9fafb
--border: #e5e7eb
--text: #111827
```

### Typography
- **Font Family:** Inter (Google Fonts)
- **Heading:** 600-700 weight
- **Body:** 400-500 weight
- **Code/ID:** Monospace (JetBrains Mono)

### Components (shadcn/ui)
- Button, Card, Badge, Table, Form, Dialog, Dropdown, Toast, Tabs

---

## 2. Login Page

### Layout
```
┌─────────────────────────────────────────┐
│           SIMANIS Logo                  │
│    Sistem Manajemen Aset Sekolah       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Username                         │ │
│  │  [________________]               │ │
│  │                                   │ │
│  │  Password                         │ │
│  │  [________________] [👁]          │ │
│  │                                   │ │
│  │  [x] Remember me                  │ │
│  │                                   │ │
│  │  [     Login    ]                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│    © 2025 SMA - Powered by SIMANIS     │
└─────────────────────────────────────────┘
```

### Features
- Auto-focus username field
- Show/hide password toggle
- Enter key to submit
- Loading state during authentication
- Error message display (toast)
- Remember me (localStorage)

---

## 3. Dashboard Layout

### Sidebar Navigation
```
┌──────────────────┐
│  SIMANIS         │
│                  │
│  📊 Dashboard    │
│  📦 Aset         │
│  📁 Kategori     │
│  📍 Lokasi       │
│  🔄 Mutasi       │
│  📤 Peminjaman   │
│  📋 Inventaris   │
│  📉 Penyusutan   │
│  📄 Laporan      │
│  🗑️ Penghapusan  │
│  📜 Audit Trail  │
│  ───────────     │
│  ⚙️ Settings     │
│  👤 Profile      │
│  🚪 Logout       │
└──────────────────┘
```

### Top Bar
```
┌────────────────────────────────────────────────┐
│ 📊 Dashboard          🔍 Search    🔔 👤 User │
└────────────────────────────────────────────────┘
```

---

## 4. Dashboard Page - Statistics Cards

### Layout
```
┌─────────────────────────────────────────────┐
│  Dashboard - Ringkasan Aset                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────┐  ┌───────┐  ┌───────┐  ┌──────┐│
│  │ 📦 150│  │ ✅ 120│  │ ⚠️ 25 │  │ 📤 12││
│  │ Total │  │ Baik  │  │ Rusak │  │ Dipinjam│
│  └───────┘  └───────┘  └───────┘  └──────┘│
│                                             │
│  ┌─────────────────────┐  ┌────────────────┐
│  │ 📊 Per Kategori     │  │ 📍 Per Lokasi  │
│  │ ┌─────────────────┐ │  │ ┌────────────┐ │
│  │ │ Elektronik: 45  │ │  │ │ Gedung A   │ │
│  │ │ Furniture:  30  │ │  │ │ Lab Komp.  │ │
│  │ │ Kendaraan:  12  │ │  │ │ Perpus.    │ │
│  │ └─────────────────┘ │  │ └────────────┘ │
│  └─────────────────────┘  └────────────────┘
│                                             │
│  Recent Activities (5 latest)               │
│  ┌─────────────────────────────────────────┐
│  │ 🆕 Laptop Dell - Aset baru (2h ago)    │
│  │ 🔄 Proyektor - Mutasi ke Lab (5h ago) │
│  │ 📤 Kamera - Dipinjam Pak Budi (1d ago)│
│  └─────────────────────────────────────────┘
└─────────────────────────────────────────────┘
```

---

## 5. Assets List Page

### Table View
```
┌──────────────────────────────────────────────────────┐
│  Daftar Aset                    [+ Tambah Aset]     │
├──────────────────────────────────────────────────────┤
│  🔍 Search  | 📁 Kategori ▼ | 📍 Lokasi ▼ | 🏷️ Status ▼ │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Kode Aset    │ Nama Barang  │ Kategori │ Kondisi  │
│  ────────────────────────────────────────────────── │
│  SCH/KD/EL/01 │ Laptop HP    │ Elektro  │ ✅ Baik   │
│  SCH/KD/FU/02 │ Meja Guru    │ Furniture│ ✅ Baik   │
│  SCH/KD/EL/03 │ Proyektor    │ Elektro  │ ⚠️ Rusak  │
│                                                      │
│  Showing 1-20 of 150    [ < ]  1 2 3 4 5  [ > ]    │
└──────────────────────────────────────────────────────┘
```

### Filters & Search
- Debounced search (300ms)
- Multi-select kategori
- Multi-select lokasi
- Status: Baik, Rusak Ringan, Rusak Berat, Hilang
- Date range (tahun perolehan)

### Actions per Row
- **View Details** - Modal/side panel
- **Edit** - Form dialog
- **Mutasi** - Quick mutasi dialog
- **QR Code** - Display/download QR
- **Delete** - Confirmation + BA upload

---

## 6. Asset Detail Page

### Layout
```
┌─────────────────────────────────────────────────┐
│  ← Back    Laptop HP Pavilion    [Edit] [QR]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌────────┐    Informasi Aset                  │
│  │ [Foto] │    Kode: SCH/KD/EL/0001            │
│  │        │    Kategori: Elektronik             │
│  │        │    Kondisi: ✅ Baik                 │
│  └────────┘    Harga: Rp 7.500.000             │
│                Tahun: 2024                      │
│                Sumber Dana: BOS                 │
│                                                 │
│  ┌─── Tabs ─────────────────────────────────┐  │
│  │ Detail | Mutasi | Peminjaman | Activity │  │
│  ├────────────────────────────────────────────│
│  │                                            │
│  │  Spesifikasi:                             │
│  │  - Intel i5                               │
│  │  - RAM 8GB                                │
│  │  - SSD 256GB                              │
│  │                                            │
│  │  Lokasi Saat Ini: Gedung A > Lt.2 > Lab  │
│  │                                            │
│  └────────────────────────────────────────────┘
└─────────────────────────────────────────────────┘
```

### Tabs Content
**Detail Tab:**
- Informasi lengkap aset
- Foto (bisa multiple)
- Spesifikasi
- Dokumen terkait (BA, Invoice)

**Mutasi Tab:**
- Timeline mutasi lokasi
- Tanggal, dari, ke, catatan

**Peminjaman Tab:**
- Riwayat peminjaman
- Status: Dipinjam/Dikembalikan

**Activity Tab:**
- Audit trail specific untuk aset ini
- User, action, timestamp

---

## 7. Asset Registration Form

### Form Layout
```
┌──────────────────────────────────────────┐
│  Registrasi Aset Baru                    │
├──────────────────────────────────────────┤
│                                          │
│  Kode Aset *                             │
│  [SCH/KD/___/____]  Auto-generate ☑     │
│                                          │
│  Nama Barang *                           │
│  [________________________]              │
│                                          │
│  Kategori *                              │
│  [▼ Pilih Kategori ]                     │
│                                          │
│  Merk                                    │
│  [________________________]              │
│                                          │
│  Spesifikasi                             │
│  [________________________]              │
│  [________________________]              │
│                                          │
│  Harga * (Rp)                            │
│  [____________]                          │
│                                          │
│  Tahun Perolehan *                       │
│  [▼ 2024 ]                               │
│                                          │
│  Sumber Dana *                           │
│  ( ) BOS  ( ) APBD  ( ) Hibah           │
│                                          │
│  Kondisi *                               │
│  ( ) Baik  ( ) Rusak Ringan             │
│                                          │
│  Masa Manfaat (Tahun)                    │
│  [4]  (untuk penyusutan)                │
│                                          │
│  Foto Aset                               │
│  [📷 Upload]  Max 5MB                    │
│                                          │
│  [ Batal ]         [ Simpan ]            │
└──────────────────────────────────────────┘
```

### Validation Rules
- Kode aset format: `SCH/KD/{KAT}/{NOURUT}`
- Nama barang: required, max 160 char
- Harga: required, number, min 0
- Tahun: required, 1900-current year
- Auto-generate QR code on save

---

## 8. Mutation Form (Quick Dialog)

```
┌────────────────────────────────────┐
│  Mutasi Aset: Laptop HP            │
├────────────────────────────────────┤
│                                    │
│  Lokasi Saat Ini                   │
│  📍 Gedung A > Lantai 2 > Lab Komp │
│                                    │
│  Pindah ke *                       │
│  [▼ Gedung ]  [▼ Lantai ]          │
│  [▼ Ruangan ]                      │
│                                    │
│  Catatan                           │
│  [______________________]          │
│  [______________________]          │
│                                    │
│  [ Batal ]      [ Pindahkan ]      │
└────────────────────────────────────┘
```

### Validation
- Destination room required
- Prevent mutation jika sedang dipinjam
- Confirmation dialog sebelum submit

---

## 9. Loans List Page

### Table View
```
┌──────────────────────────────────────────────────┐
│  Daftar Peminjaman         [+ Pinjam Aset]      │
├──────────────────────────────────────────────────┤
│  🔍 Search  | 🏷️ Status ▼ | 📅 Tanggal ▼        │
├──────────────────────────────────────────────────┤
│                                                  │
│  ID  │ Peminjam  │ Aset     │ Tgl Pinjam │ Status│
│  ───────────────────────────────────────────────│
│  001 │ Pak Budi  │ 3 items  │ 2024-01-15 │ 📤    │
│  002 │ Bu Siti   │ 1 item   │ 2024-01-14 │ ✅    │
│  003 │ Pak Ahmad │ 2 items  │ 2024-01-10 │ ⚠️    │
│                                                  │
│  Badge Colors:                                   │
│  📤 Dipinjam (Blue)                              │
│  ✅ Dikembalikan (Green)                         │
│  ⚠️ Rusak (Orange/Red)                           │
│  ⏰ Terlambat (Red)                              │
└──────────────────────────────────────────────────┘
```

---

## 10. Loan Create Form

```
┌─────────────────────────────────────────────┐
│  Form Peminjaman Aset                       │
├─────────────────────────────────────────────┤
│                                             │
│  Peminjam *                                 │
│  [▼ Pilih User (Guru) ]                     │
│                                             │
│  Tujuan Peminjaman *                        │
│  [_____________________________]            │
│                                             │
│  Tanggal Pinjam *                           │
│  [📅 2024-01-15 ]                           │
│                                             │
│  Aset yang Dipinjam *                       │
│  ┌──────────────────────────────────────┐  │
│  │ [+ Tambah Aset]                      │  │
│  │                                      │  │
│  │ 1. Laptop HP        [❌ Remove]      │  │
│  │    Kondisi: ✅ Baik                  │  │
│  │                                      │  │
│  │ 2. Proyektor EPSON  [❌ Remove]      │  │
│  │    Kondisi: ✅ Baik                  │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  [ Batal ]              [ Submit ]          │
└─────────────────────────────────────────────┘
```

### Asset Selection Dialog
- Search & filter aset
- Show only available assets
- Show kondisi aset
- Multi-select capability

---

## 11. Loan Return Form

```
┌────────────────────────────────────────┐
│  Pengembalian Aset - Pak Budi          │
│  Tanggal Pinjam: 2024-01-15            │
├────────────────────────────────────────┤
│                                        │
│  Aset yang Dikembalikan                │
│                                        │
│  1. Laptop HP                          │
│     Kondisi Saat Pinjam: ✅ Baik       │
│     Kondisi Saat Kembali:              │
│     ( ) Baik  ( ) Rusak Ringan         │
│     ( ) Rusak Berat                    │
│                                        │
│  2. Proyektor EPSON                    │
│     Kondisi Saat Pinjam: ✅ Baik       │
│     Kondisi Saat Kembali:              │
│     ( ) Baik  ( ) Rusak Ringan         │
│                                        │
│  Catatan Pengembalian                  │
│  [________________________]            │
│  [________________________]            │
│                                        │
│  [ Batal ]      [ Kembalikan ]         │
└────────────────────────────────────────┘
```

### Business Logic
- Auto-calculate status: Dikembalikan/Rusak/Terlambat
- Update kondisi aset jika rusak
- Create audit log

---

## 12. Inventory Page

### QR Scanner Interface
```
┌──────────────────────────────────────┐
│  Inventarisasi Periodik              │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │
│  │                                │ │
│  │      📷 SCAN QR CODE           │ │
│  │                                │ │
│  │     [Camera Preview]           │ │
│  │                                │ │
│  │  atau input manual:            │ │
│  │  [_________________]           │ │
│  │                                │ │
│  └────────────────────────────────┘ │
│                                      │
│  Hasil Scan:                         │
│  ┌────────────────────────────────┐ │
│  │ Laptop HP Pavilion             │ │
│  │ SCH/KD/EL/0001                 │ │
│  │ Kondisi: ✅ Baik               │ │
│  │                                │ │
│  │ [📷 Tambah Foto]               │ │
│  │                                │ │
│  │ Catatan:                       │ │
│  │ [___________________]          │ │
│  │                                │ │
│  │ [ Submit ]                     │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Features
- HTML5 QR Code scanner (html5-qrcode library)
- Manual input fallback
- Photo upload (optional)
- Notes field
- Real-time validation

---

## 13. Inventory List Page

```
┌──────────────────────────────────────────────────┐
│  Riwayat Inventarisasi                           │
├──────────────────────────────────────────────────┤
│  📅 From: [____] To: [____]  [Filter]           │
├──────────────────────────────────────────────────┤
│                                                  │
│  Tanggal    │ Aset         │ Petugas  │ Status │
│  ──────────────────────────────────────────────│
│  2024-01-15 │ Laptop HP    │ Bu Siti  │ ✅     │
│  2024-01-15 │ Proyektor    │ Bu Siti  │ ✅     │
│  2024-01-14 │ Meja Guru    │ Pak Budi │ ✅     │
│                                                  │
│  Export: [📄 Excel] [📄 PDF]                    │
└──────────────────────────────────────────────────┘
```

---

## 14. Depreciation Page (View Only)

```
┌──────────────────────────────────────────────────┐
│  Penyusutan Bulanan Otomatis                     │
├──────────────────────────────────────────────────┤
│  📅 Bulan: [▼ Januari 2024 ]  [Filter]          │
├──────────────────────────────────────────────────┤
│                                                  │
│  Kode Aset  │ Nama      │ Penyusutan │ Nilai   │
│                         │  Bulan Ini │ Buku    │
│  ──────────────────────────────────────────────│
│  SCH/KD/EL01│ Laptop HP │ Rp 156.250 │ Rp 7.3M│
│  SCH/KD/FU02│ Meja Guru │ Rp 125.000 │ Rp 5.8M│
│                                                  │
│  Info: Penyusutan dihitung otomatis setiap       │
│        akhir bulan oleh sistem                   │
│                                                  │
│  Export: [📄 Excel] [📄 PDF]                    │
└──────────────────────────────────────────────────┘
```

---

## 15. KIB Report Generate Page

```
┌─────────────────────────────────────────────┐
│  Generate Laporan KIB                       │
├─────────────────────────────────────────────┤
│                                             │
│  Filter Laporan                             │
│                                             │
│  Kategori                                   │
│  ☑ Semua  ☐ Elektronik  ☐ Furniture       │
│                                             │
│  Lokasi                                     │
│  [▼ Pilih Lokasi ]  (Optional)             │
│                                             │
│  Kondisi                                    │
│  ☑ Semua  ☐ Baik  ☐ Rusak                 │
│                                             │
│  Periode                                    │
│  From: [📅 ____]  To: [📅 ____]            │
│                                             │
│  Format                                     │
│  ( ) Excel  ( ) PDF                        │
│                                             │
│  [ Generate Report ]                        │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Riwayat Report (Cache 7 hari)        │ │
│  │ ────────────────────────────────────│ │
│  │ KIB_2024-01-15.xlsx  [📥 Download] │ │
│  │ KIB_2024-01-10.pdf   [📥 Download] │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Report Generation Flow
1. User submit filters
2. Backend create job (BullMQ)
3. Show progress indicator
4. Poll status every 2 seconds
5. Download button available when done

---

## 16. Audit Trail Page

```
┌──────────────────────────────────────────────────┐
│  Audit Trail - Activity Log                      │
├──────────────────────────────────────────────────┤
│  🔍 Search                                       │
│  Entity: [▼ All] User: [▼ All] Action: [▼ All] │
│  📅 From: [____] To: [____]                     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Time       │ User     │ Action │ Entity       │
│  ──────────────────────────────────────────────│
│  10:30      │ Bu Siti  │ CREATE │ Asset #123  │
│             │          │        │ Laptop HP    │
│  ──────────────────────────────────────────────│
│  09:15      │ Pak Budi │ UPDATE │ Asset #45   │
│             │          │        │ kondisi:     │
│             │          │        │ Baik→Rusak   │
│  ──────────────────────────────────────────────│
│                                                  │
│  Export: [📄 Excel]                             │
└──────────────────────────────────────────────────┘
```

### Features
- Server-side pagination
- Multi-filter (entity type, user, action, date range)
- Expandable rows untuk field_changed detail
- Export capability

---

## 17. Responsive Design Principles

### Breakpoints
- **Mobile:** < 640px (Stack vertically, hamburger menu)
- **Tablet:** 640px - 1024px (Collapsible sidebar)
- **Desktop:** > 1024px (Full sidebar visible)

### Mobile Adaptations
- Bottom navigation for primary actions
- Swipe gestures for table rows
- Simplified forms (one column)
- Floating action button (FAB) untuk quick actions

---

## 18. Accessibility (A11y)

- **Keyboard Navigation:** Tab, Enter, Escape
- **ARIA labels:** Proper semantic HTML
- **Color Contrast:** WCAG AA compliant
- **Screen Reader:** Alt text untuk images, proper heading hierarchy

---

## 19. Performance Optimizations

### Frontend
- **Code Splitting:** Per route/page
- **Lazy Loading:** Images, tables
- **Debouncing:** Search inputs (300ms)
- **Caching:** TanStack Query (5 min stale time)
- **Virtual Scrolling:** Large tables (>100 rows)

### Backend Integration
- **Pagination:** Server-side, default 20 items
- **Optimistic Updates:** UI updates before API confirm
- **Retry Logic:** Auto-retry failed requests (3x)

---

## 20. User Flows Diagram

### Asset Registration Flow
```
Login → Dashboard → Assets → [+ Tambah Aset] → 
Fill Form → Validate → Generate QR → Save → 
Show Success Toast → Redirect to Asset Detail
```

### Loan Flow
```
Login → Loans → [+ Pinjam Aset] → Select User → 
Select Assets (multiple) → Confirm → Create Loan → 
Show Success → Print Receipt (optional)
```

### Inventory Flow
```
Login → Inventory → [Scan QR] → Camera Active → 
Scan Code → Load Asset Info → Add Photo → 
Add Notes → Submit → Show Next Asset
```

---

## 21. Error States & Empty States

### Error States
- **Network Error:** "Gagal terhubung ke server. Coba lagi."
- **Validation Error:** Inline error di bawah field
- **Permission Error:** "Anda tidak memiliki akses untuk fitur ini."
- **Not Found:** "Data tidak ditemukan."

### Empty States
- **No Assets:** "Belum ada aset terdaftar. Klik tombol + untuk menambah."
- **No Loans:** "Belum ada peminjaman."
- **No Search Results:** "Tidak ada hasil untuk '{query}'."

---

## 22. Notifications & Feedback

### Toast Notifications (shadcn/ui Toast)
- **Success:** Green, auto-dismiss 3s
- **Error:** Red, persist until close
- **Warning:** Orange, auto-dismiss 5s
- **Info:** Blue, auto-dismiss 4s

### In-App Notifications (Future)
- Bell icon di top bar
- Dropdown dengan latest 5 notifications
- Badge count untuk unread

---

## 23. Bulk Actions UI (Phase 3)

```
┌──────────────────────────────────────────────────┐
│  Daftar Aset          [Bulk Actions ▼]          │
├──────────────────────────────────────────────────┤
│  [x] Select All (5 selected)                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  [✓] SCH/KD/EL/01 │ Laptop HP    │ Baik        │
│  [✓] SCH/KD/EL/02 │ Proyektor    │ Baik        │
│  [✓] SCH/KD/FU/03 │ Meja Guru    │ Baik        │
│  [ ] SCH/KD/EL/04 │ Kamera       │ Rusak       │
│                                                  │
│  Actions:                                        │
│  - Update Kondisi                                │
│  - Mutasi Massal                                 │
│  - Export Selected                               │
└──────────────────────────────────────────────────┘
```

---

## 24. QR Code Display

### In Asset Detail
```
┌───────────────────┐
│  QR Code Aset     │
├───────────────────┤
│  ┌─────────────┐  │
│  │█████████████│  │
│  │█████████████│  │
│  │█████████████│  │
│  │█████████████│  │
│  └─────────────┘  │
│                   │
│  SCH/KD/EL/0001   │
│                   │
│  [📥 Download]    │
│  [🖨️ Print]       │
└───────────────────┘
```

### Bulk Print View
- Grid layout (4x6 per page)
- Includes kode aset below QR
- Print-friendly CSS

---

## 25. Summary: Key UI/UX Principles

### ✅ User-Centric
- Minimal clicks to complete tasks
- Clear visual hierarchy
- Helpful error messages dalam Bahasa Indonesia

### ✅ Consistent
- Unified color palette
- Standard component usage (shadcn/ui)
- Predictable interaction patterns

### ✅ Performant
- Fast page loads (< 2s)
- Smooth animations (60fps)
- Optimistic UI updates

### ✅ Accessible
- Keyboard navigable
- Screen reader friendly
- High contrast colors

### ✅ Responsive
- Mobile-first approach
- Adaptive layouts
- Touch-friendly targets (min 44px)

---

**Dokumentasi ini menjadi panduan visual dan interaction design untuk implementasi frontend SIMANIS.**

**Status:** Complete ✅  
**Last Updated:** 2025-01-22  
**Maintainer:** Backend Developer Team
