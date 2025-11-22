# Design: SIMANIS Frontend – Phase 3 (Penguatan Fitur & Kenyamanan Pengguna)

Dokumen ini menurunkan `requirements-phase-3.md` menjadi desain teknis frontend.
Fokus: penguatan UX di daftar data, bulk actions, favorite aset, riwayat aktivitas, preset filter, dan RBAC di UI.

Semua kode tetap mengikuti pola Phase 1–2:
- React + TS + Vite
- Zustand + TanStack Query
- React Hook Form + Zod
- Tailwind + shadcn/ui
- Komentar Bahasa Indonesia di komponen/logic penting.

---

## 1. Perubahan Struktur & Komponen Reusable

### 1.1. Shared Table & Filter Components

Tambahan di `src/components`:

```txt
components/
  table/
    DataTable.tsx          // wrapper tabel generic (kolom, data, pagination)
    DataTableToolbar.tsx   // search + filter area generik
  filters/
    FilterBar.tsx          // layout filter seragam (form inline, reset)
```

**Tujuan:**
- Menghindari duplikasi pola tabel & filter di assets, loans, inventory, audit.
- Mempermudah penambahan quick actions & penyimpanan filter.

### 1.2. Penyimpanan Filter Terakhir

Tambahan di `libs/store`:

```txt
libs/store/
  filterStore.ts   // menyimpan last filters per halaman (keyed by route)
```

Struktur state contoh:

```ts
// Menyimpan filter terakhir yang digunakan per halaman/list
export type FilterState = {
  [routeKey: string]: Record<string, unknown>
}

export const useFilterStore = create<{
  filters: FilterState
  setFilter: (routeKey: string, value: Record<string, unknown>) => void
}>((set) => ({
  filters: {},
  setFilter: (routeKey, value) =>
    set((state) => ({
      filters: { ...state.filters, [routeKey]: value },
    })),
}))
```

Route key misalnya: `assets-list`, `loans-list`, `inventory-list`, `audit-list`.

---

## 2. Peningkatan UX Daftar Data

### 2.1. DataTable.tsx

Konsep:
- Menerima props: `columns`, `data`, `pagination`, `onPageChange`, `rowActions`.
- Menggunakan shadcn/ui Table atau Tailwind semantic table.

```tsx
// Komponen tabel generik untuk menampilkan daftar data SIMANIS
// Digunakan ulang oleh halaman aset, peminjaman, inventarisasi, dan audit
export function DataTable<T>({ columns, data, pagination, onPageChange, rowActions }: Props<T>) {
  // ...
}
```

### 2.2. DataTableToolbar & FilterBar

- `FilterBar` menerima children berupa elemen form, tombol apply/reset.
- Integrasi dengan `useFilterStore` untuk menyimpan/restore nilai filter.

Pola penggunaan di AssetsListPage, LoansListPage, InventoryListPage, AuditListPage.

---

## 3. Bulk Actions Sederhana

### 3.1. Seleksi Multi Baris

Di tabel aset:
- Tambah kolom checkbox di `DataTable` (opsional via props).
- State terpilih disimpan sebagai `selectedIds` di komponen halaman (bukan global).

### 3.2. Panel Aksi Bulk

Tambahan komponen kecil di halaman aset:

```tsx
// Panel aksi massal untuk daftar aset
// Menampilkan jumlah aset terpilih dan tombol aksi (ubah kondisi, mutasi lokasi)
function AssetBulkActions({ selectedIds }: { selectedIds: number[] }) {
  // ...
}
```

Aksi bulk:
- Memanggil endpoint bulk (jika ada) atau loop beberapa request dengan progress.
- Tampilkan hasil ringkasan (berapa berhasil/gagal).

---

## 4. Notifikasi In-App

Gunakan library toast yang sudah dipakai (mis. `sonner` bila sudah ada di Phase 2) atau pattern sederhana.

Desain:
- Bungkus root app dengan ToastProvider (bila perlu).
- Di setiap aksi penting (success/fail), panggil fungsi util `showSuccessToast`, `showErrorToast`.

File util baru: `libs/ui/toast.ts`.

---

## 5. Favorite / Pin Aset

### 5.1. Penyimpanan

Dua opsi (dipilih sesuai kesiapan backend):

1) **Backend-ready**:
- Endpoint: `POST /assets/:id/favorite`, `DELETE /assets/:id/favorite`, `GET /users/me/favorites`.
- Simpan di server; cache dengan React Query.

2) **Frontend-only sementara**:
- Zustand store dengan persist localStorage:

```ts
// Menyimpan daftar ID aset favorit per browser/user
export const useFavoriteStore = create<{
  favoriteAssetIds: number[]
  toggleFavorite: (id: number) => void
}>((set, get) => ({
  favoriteAssetIds: [],
  toggleFavorite: (id) => {
    const list = get().favoriteAssetIds
    const exists = list.includes(id)
    set({
      favoriteAssetIds: exists ? list.filter((x) => x !== id) : [...list, id],
    })
  },
}))
```

### 5.2. UI

- Ikon bintang di tabel & detail aset yang memanggil `toggleFavorite`.
- Halaman/tab "Aset Favorit" memfilter berdasarkan daftar favorit.

---

## 6. Riwayat Aktivitas per Aset & per User

### 6.1. Di Detail Aset

Tambahan tab baru di `AssetDetailPage`:

```txt
Aset | Mutasi Lokasi | Riwayat Aktivitas
```

- `Riwayat Aktivitas` memanggil endpoint gabungan atau memanfaatkan audit + peminjaman + inventarisasi per aset.
- Jika belum ada endpoint khusus, untuk Phase 3 bisa mulai dari audit saja (entity_type=Asset, Loan, InventoryCheck dengan entity_id terkait aset).

Komponen: `AssetActivityTimeline.tsx`.

### 6.2. Di Profil User

- Halaman sederhana `UserActivityPage.tsx` (atau panel jika profil sudah ada):
  - Menampilkan aktivitas terakhir user (diambil dari audit logs by user_id).

---

## 7. Template & Preset Filter (KIB & Penyusutan)

### 7.1. Penyimpanan Preset

Jika backend mendukung → simpan di server. Jika belum → gunakan localStorage via Zustand store:

```ts
// Menyimpan preset filter laporan per user di sisi frontend
export const useReportPresetStore = create<{
  presets: { [reportKey: string]: { name: string; value: Record<string, unknown> }[] }
  addPreset: (reportKey: string, preset: { name: string; value: Record<string, unknown> }) => void
}>((set, get) => ({
  presets: {},
  addPreset: (reportKey, preset) => {
    const list = get().presets[reportKey] ?? []
    set({ presets: { ...get().presets, [reportKey]: [...list, preset] } })
  },
}))
```

`reportKey` contoh: `kib`, `depreciation`.

### 7.2. UI di Halaman KIB & Penyusutan

- Form filter menambahkan:
  - Tombol "Simpan sebagai preset" → buka dialog nama preset → simpan.
  - Dropdown "Preset" → pilih preset, set nilai form.

---

## 8. Penguatan RBAC di UI

### 8.1. Mapping Role → Permissions

File baru: `libs/auth/permissions.ts`:

```ts
// Pemetaan sederhana antara role dan hak akses fitur di UI SIMANIS
export const PERMISSIONS = {
  Kepsek: {
    canViewAudit: true,
    canApproveDeletion: true,
    canManageAssets: false,
    // ...
  },
  WakasekSarpras: {
    canManageAssets: true,
    canViewDepreciation: true,
    canGenerateKIB: true,
  },
  // dst untuk BendaharaBOS, Operator, Guru
} as const

export function usePermission() {
  const user = useAuthStore((s) => s.user)
  const role = user?.role
  const perms = role ? PERMISSIONS[role] : {}
  return perms
}
```

### 8.2. Penggunaan di Komponen

- Tombol/aksi sensitif dibungkus pengecekan:

```tsx
const { canGenerateKIB } = usePermission()

if (!canGenerateKIB) return null

return <Button>Generate KIB</Button>
```

Atau nonaktif + tooltip jika ingin ditampilkan tapi tidak bisa digunakan.

---

## 9. Performance & DRY Refactor

### 9.1. Debounce Filter & Search

- Saat user mengetik di search bar, gunakan debounce (mis. 300–500ms) sebelum memanggil API.
- Implementasi via hook `useDebouncedValue` di `libs/hooks/useDebouncedValue.ts`.

### 9.2. Reuse Komponen

- Semua list besar (assets, loans, inventory, audit) memakai `DataTable + FilterBar`.
- Pengurangan duplikasi logic filter/pagination di tiap halaman.

---

## 10. Testing Manual Fokus Phase 3

- Verifikasi:
  - Filter disimpan & dipulihkan per halaman.
  - Bulk actions di daftar aset berjalan; hasil berhasil/gagal jelas.
  - Notifikasi muncul di setiap aksi penting (success/error).
  - Favorite aset: toggling konsisten, halaman favorit menampilkan benar.
  - Riwayat aktivitas aset & user sesuai data audit/peminjaman/inventarisasi.
  - Preset filter di KIB & penyusutan dapat disimpan & digunakan ulang.
  - RBAC UI: role yang berbeda melihat set menu & tombol yang berbeda.

---

**Status**: Draft Desain Teknis Phase 3 – siap diturunkan ke tasks implementation.
