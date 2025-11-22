# Design: SIMANIS Frontend – Phase 1 (Realistis & Minimal)

Dokumen ini menjabarkan **desain teknis frontend** untuk Phase 1 berdasarkan
`requirements.md` yang sudah disederhanakan.

Fokus utama:
- SPA web **tanpa** PWA, QR kamera, dashboard, dan fitur lanjutan.
- Fitur inti: Login, Kategori Aset, Aset, Mutasi Lokasi sederhana, Peminjaman dasar.
- Struktur kode sederhana, mudah dipahami, dengan komentar Bahasa Indonesia.

---

## 1. Arsitektur Frontend (High Level)

```text
Browser
└── React SPA (Vite + TypeScript)
    ├── Routing (React Router)
    ├── State Global (Zustand)
    ├── Server State (TanStack Query)
    ├── Forms (React Hook Form + Zod)
    ├── UI (Tailwind + shadcn/ui seperlunya)
    └── API Client (Axios)
```

- **Tidak ada** service worker / manifest khusus di Phase 1.
- Semua data diperoleh dari **Backend API** via HTTP (JSON).

---

## 2. Struktur Folder Implementasi

Mengacu `requirements.md` bagian 4.1, direalisasikan seperti berikut:

```txt
frontend/
  src/
    main.tsx              // Entry React + inisialisasi Router & QueryClient
    App.tsx               // Root layout + definisi route utama

    routes/               // Halaman (page) per fitur
      auth/
        LoginPage.tsx
      assets/
        AssetsListPage.tsx
        AssetCreatePage.tsx
        AssetDetailPage.tsx
      categories/
        CategoriesPage.tsx
      loans/
        LoansListPage.tsx
        LoanCreatePage.tsx
      mutations/
        AssetMutationPage.tsx   // opsional: bisa di-embed dalam AssetDetailPage

    components/
      layout/
        AppLayout.tsx          // shell utama (header + sidebar + outlet)
        Sidebar.tsx
        Header.tsx
      ui/                      // wrapper komponen shadcn/ui (Button, Input, Modal, dll.)
      forms/                   // komponen form-field reusable
        TextField.tsx
        SelectField.tsx
        FormError.tsx

    libs/
      api/
        client.ts              // konfigurasi Axios
        auth.ts                // fungsi panggil API auth
        assets.ts              // fungsi panggil API aset
        categories.ts          // fungsi panggil API kategori
        loans.ts               // fungsi panggil API peminjaman
        mutations.ts           // fungsi panggil API mutasi

      store/
        authStore.ts           // Zustand store untuk autentikasi

      validation/
        authSchemas.ts         // Zod schema login
        categorySchemas.ts     // Zod schema kategori
        assetSchemas.ts        // Zod schema aset (versi minimal)
        loanSchemas.ts         // Zod schema peminjaman

    styles/
      index.css               // Tailwind base + custom styles
```

**Prinsip komentar kode**:
- Setiap file TS/TSX minimal memiliki komentar di bagian atas yang menjelaskan tujuan file/komponen **dalam Bahasa Indonesia**.
- Blok logika penting diberi komentar singkat: "apa" dan "kenapa".

Contoh header komentar:

```tsx
// Komponen halaman daftar aset SIMANIS
// Menampilkan tabel aset dari backend dan menyediakan tombol untuk menambah aset baru
export function AssetsListPage() {
  // ...
}
```

---

## 3. Desain per Fitur

### 3.1. Autentikasi (Login + Logout)

**Rute:**
- `/login`
- Semua rute lain dibungkus `ProtectedRoute` sederhana.

**Flow:**
1. User mengisi form login (username/email + password).
2. Frontend memanggil `POST /auth/login`.
3. Jika sukses: backend mengembalikan `token` + data user.
4. Token & user disimpan di `authStore` (Zustand, dengan persist ke `localStorage`).
5. User diarahkan ke `/assets`.
6. Logout: memanggil `authStore.logout()` dan redirect ke `/login`.

**Komponen & file utama:**
- `routes/auth/LoginPage.tsx`
- `libs/store/authStore.ts`
- `libs/api/auth.ts`
- `libs/validation/authSchemas.ts`

**ProtectedRoute (konsep sederhana):**

```tsx
// Komponen pembungkus untuk melindungi route yang butuh login
// Jika tidak ada token, user akan diarahkan ke halaman login
export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
```

---

### 3.2. Kategori Aset (CRUD Sederhana)

**Rute:** `/categories`

**UI:**
- Tabel sederhana daftar kategori (nama).
- Tombol "Tambah Kategori" → membuka form (bisa modal atau section di atas).
- Aksi edit & hapus di setiap baris.

**Data flow:**
- `GET /categories` → di-fetch dengan `useQuery`.
- `POST /categories` → tambah kategori (useMutation, invalidasi query).
- `PUT /categories/:id` → edit.
- `DELETE /categories/:id` → hapus.

**File utama:**
- `routes/categories/CategoriesPage.tsx`
- `libs/api/categories.ts`
- `libs/validation/categorySchemas.ts`

**Skema Zod contoh:**

```ts
// Skema validasi form kategori aset
export const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
})
```

---

### 3.3. Aset – List & Create Minimal

**Rute:**
- `/assets` → daftar aset
- `/assets/new` → tambah aset
- `/assets/:id` → detail aset (termasuk informasi lokasi & mutasi sederhana)

**UI:**
- `AssetsListPage`:
  - Tabel: `kode_aset`, `nama_barang`, `kategori`, `kondisi`.
  - Tombol "Tambah Aset" (link ke `/assets/new`).
- `AssetCreatePage`:
  - Form dengan field minimal (mengacu requirements):
    - `kode_aset`, `nama_barang`, `category_id`, `kondisi`.
  - Validasi dengan Zod.

**Data flow:**
- `GET /assets` → daftar.
- `POST /assets` → buat aset baru.

**File utama:**
- `routes/assets/AssetsListPage.tsx`
- `routes/assets/AssetCreatePage.tsx`
- `libs/api/assets.ts`
- `libs/validation/assetSchemas.ts`

**Catatan desain:**
- Field opsional (`merk`, `spesifikasi`, dll.) dapat ditambahkan di form tapi tidak wajib diisi.
- Error duplikat `kode_aset` di-handle dengan menampilkan pesan error dari API.

---

### 3.4. Mutasi Lokasi Aset (Sederhana)

**Rute:**
- Ditanam di halaman detail aset: `/assets/:id`.

**UI:**
- Menampilkan informasi aset.
- Menampilkan lokasi saat ini (nama ruangan).
- Bagian "Mutasi Lokasi":
  - Dropdown pilih ruangan baru.
  - Tombol "Simpan Mutasi".
- (Opsional) List riwayat mutasi sederhana (tanggal, dari, ke).

**Data flow (perkiraan API):**
- `GET /rooms` → daftar ruangan untuk dropdown.
- `GET /assets/:id/mutations` → riwayat mutasi.
- `POST /assets/:id/mutations` → membuat mutasi baru.

**File utama:**
- `routes/assets/AssetDetailPage.tsx`
- `libs/api/mutations.ts`

**Desain logika:**
- Setelah mutasi sukses, panggil `refetch` data aset & mutasi.
- Jika API mengembalikan error "asset is on loan", tampilkan error jelas.

---

### 3.5. Peminjaman Aset – Basic

**Rute:**
- `/loans` → daftar peminjaman
- `/loans/new` → form peminjaman

**UI:**
- `LoansListPage`:
  - Tabel: `peminjam`, `tanggal_pinjam`, `status`.
  - Tombol "Tambah Peminjaman".
  - Tombol "Tandai Dikembalikan" per baris (jika status = Dipinjam).
- `LoanCreatePage`:
  - Pilih peminjam (dropdown user atau input teks, tergantung API).
  - Pilih aset (dropdown aset yang tersedia, satu aset dulu).
  - Input tujuan pinjam.

**Data flow:**
- `GET /loans` → daftar.
- `POST /loans` → buat peminjaman.
- `POST /loans/:id/return` atau `PATCH /loans/:id` → tandai dikembalikan.

**File utama:**
- `routes/loans/LoansListPage.tsx`
- `routes/loans/LoanCreatePage.tsx`
- `libs/api/loans.ts`
- `libs/validation/loanSchemas.ts`

---

## 4. Desain State Management

### 4.1. Auth Store (Zustand)

**Tujuan:** menyimpan token dan informasi user secara global dan persisten.

Contoh desain `authStore.ts` (ringkas):

```ts
// Store global untuk menyimpan status autentikasi pengguna SIMANIS
// Menyimpan token, data user, dan flag isAuthenticated
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'simanis-auth' },
  ),
)
```

### 4.2. Server State (TanStack Query)

- Satu `QueryClient` diinisialisasi di `main.tsx`.
- Query key per resource:
  - `['categories']`, `['assets']`, `['assets', id]`, `['loans']`, dll.
- Mutasi akan **meng-invalidasi** query terkait setelah sukses.

---

## 5. Desain API Client (Axios)

**File:** `libs/api/client.ts`

Tujuan: konfigurasi baseURL dan penyisipan token otomatis.

```ts
// Klien HTTP utama untuk berkomunikasi dengan backend SIMANIS
// Menyisipkan token autentikasi dari authStore ke setiap request
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

Fungsi per-resource (`auth.ts`, `assets.ts`, dll.) cukup menjadi wrapper tipis di atas `api`.

---

## 6. Desain Validasi Form (Zod + React Hook Form)

**Prinsip:**
- Satu schema per form.
- Pesan error dalam Bahasa Indonesia.

Contoh `authSchemas.ts`:

```ts
// Skema validasi untuk form login SIMANIS
// Memastikan username/email dan password diisi sebelum dikirim ke backend
export const loginSchema = z.object({
  username: z.string().min(1, 'Username atau email wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
```

Penggunaan di halaman login:

```tsx
// Komponen form login dengan validasi Zod dan React Hook Form
const form = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: { username: '', password: '' },
})
```

---

## 7. Routing & Layout

**File utama:** `App.tsx`

Konsep rute (disederhanakan untuk Phase 1):

```tsx
// Definisi routing dasar untuk aplikasi SIMANIS
// Menggunakan ProtectedRoute untuk melindungi halaman yang membutuhkan login
const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/assets" replace /> },
      { path: 'assets', element: <AssetsListPage /> },
      { path: 'assets/new', element: <AssetCreatePage /> },
      { path: 'assets/:id', element: <AssetDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'loans', element: <LoansListPage /> },
      { path: 'loans/new', element: <LoanCreatePage /> },
    ],
  },
])
```

`AppLayout` berisi header + sidebar sederhana dan `<Outlet />` untuk konten.

---

## 8. Error & Loading State

Akan digunakan pola komponen kecil reusable:

- `components/ui/Loading.tsx`:
  - Menampilkan spinner + pesan sederhana (Bahasa Indonesia).
- `components/ui/ErrorAlert.tsx`:
  - Menampilkan error umum dengan warna merah.

Contoh penggunaan:

```tsx
// Tampilkan indikator loading saat data kategori sedang diambil dari server
if (isLoading) {
  return <Loading message="Memuat data kategori..." />
}

// Tampilkan pesan error jika terjadi kegagalan pemanggilan API
if (error) {
  return <ErrorAlert message="Gagal memuat data kategori" />
}
```

---

## 9. Kesesuaian dengan Requirements

- Hanya mencakup fitur yang disebut di `requirements.md` Phase 1.
- PWA, QR scanner, dashboard, penyusutan, laporan KIB, penghapusan aset, audit trail, Tauri: **tidak didesain di dokumen ini** untuk menjaga scope.
- Semua desain mendukung:
  - Implementasi step-by-step.
  - Penambahan fitur lanjutan di Phase 2 tanpa merombak struktur utama.

---

**Status**: Draft desain teknis Phase 1 – selaras dengan `requirements.md` yang realistis dan minimal.
