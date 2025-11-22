# Arsitektur Frontend SIMANIS

## 📁 Struktur Folder

Proyek ini mengikuti **Feature-Driven Architecture** dengan prinsip **Colocation** dan **LIFT**.

```
src/
├── routes/              # Feature pages (organized by domain)
│   ├── auth/           # Authentication pages
│   ├── assets/         # Asset management pages
│   ├── categories/     # Category management pages
│   ├── loans/          # Loan management pages
│   ├── inventory/      # Inventory pages with QR scanner
│   ├── dashboard/      # Dashboard & statistics
│   ├── depreciation/   # Asset depreciation pages
│   ├── reports/        # Report generation pages
│   ├── audit/          # Audit trail viewer
│   └── profile/        # User profile & activity
│
├── components/         # Shared/Reusable UI components
│   ├── table/         # DataTable component
│   ├── filters/       # FilterBar component
│   ├── uploads/       # FileUpload component
│   ├── layout/        # AppLayout, ProtectedRoute
│   ├── ui/            # Base UI components (shadcn-style)
│   └── dashboard/     # Dashboard-specific components
│
├── libs/              # Core libraries & utilities
│   ├── api/          # API client & endpoints
│   │   └── mock/     # Mock data for development
│   ├── auth/         # Authentication & permissions
│   ├── hooks/        # Custom React hooks
│   ├── store/        # Zustand stores (state management)
│   ├── ui/           # UI utilities (toast)
│   ├── utils/        # General utilities
│   └── validation/   # Zod schemas
│
├── constants/        # Application constants
├── styles/           # Global styles
└── test/             # Test setup & utilities
```

---

## 🎯 Prinsip Arsitektur

### 1. **Colocation (Kedekatan)**
> "Hal-hal yang berubah bersamaan, harus ditempatkan berdekatan."

Komponen yang spesifik untuk satu fitur ditempatkan di folder fitur tersebut:
```
routes/assets/
  ├── AssetsListPage.tsx
  ├── AssetCreatePage.tsx
  └── components/              # ✅ Komponen khusus assets
      ├── AssetBulkActions.tsx
      └── AssetActivityTimeline.tsx
```

### 2. **LIFT Principle**
- **L**ocating: Mudah menemukan kode (by feature)
- **I**dentifying: Nama file jelas (AssetsListPage, AssetCreatePage)
- **F**lat: Struktur tidak terlalu nested (max 2-3 level)
- **T**ry to be DRY: Tidak ada duplikasi struktur

### 3. **Feature Boundary**
Fitur A **TIDAK BOLEH** mengimpor file internal dari Fitur B secara langsung.

❌ **SALAH:**
```typescript
import { AssetBulkActions } from '@/routes/assets/components/AssetBulkActions'
```

✅ **BENAR:**
```typescript
import { AssetBulkActions } from '@/routes/assets/components'
```

### 4. **Unidirectional Data Flow**
```
Global (libs, components/ui)
  ↓
Features (routes/*)
  ↓
UI Components (components/*)
```

- `routes/` boleh mengimpor `components/` dan `libs/`
- `components/ui/` **TIDAK BOLEH** mengimpor `routes/` atau `libs/api/`
- `components/ui/` harus "buta" terhadap bisnis aplikasi

### 5. **Smart vs Dumb Components**

**Smart Components** (Container):
- Lokasi: `routes/*/`
- Tugas: Fetch data, business logic, state management
- Contoh: `AssetsListPage.tsx`, `DashboardPage.tsx`

**Dumb Components** (Presentational):
- Lokasi: `components/ui/`, `components/table/`
- Tugas: Hanya render props, tidak ada logic fetch
- Contoh: `DataTable.tsx`, `Button.tsx`, `Card.tsx`

---

## 📦 Barrel Files (index.ts)

Setiap folder komponen memiliki `index.ts` sebagai **Public API**:

```typescript
// routes/assets/components/index.ts
export { AssetBulkActions } from './AssetBulkActions'
export { AssetActivityTimeline } from './AssetActivityTimeline'

// Usage:
import { AssetBulkActions, AssetActivityTimeline } from './components'
```

**Keuntungan:**
- ✅ Enkapsulasi: Kontrol apa yang bisa diakses dari luar
- ✅ Refactoring: Ubah internal tanpa break import
- ✅ Cleaner imports: Lebih pendek dan rapi

---

## 🔧 Tech Stack

### Core
- **React 19** - UI library
- **TypeScript (Strict Mode)** - Type safety
- **Vite** - Build tool & dev server

### State Management
- **Zustand** - Client state (auth, filters, favorites)
- **TanStack Query v5** - Server state & caching

### Form & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Routing
- **React Router v7** - Client-side routing

### Styling
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Base UI components

### Testing
- **Vitest** - Unit testing
- **Testing Library** - Component testing

---

## 🎨 Code Style Guidelines

### TypeScript
```typescript
// ✅ BENAR: Strict typing
interface User {
  id: string
  name: string
  role: string
}

// ❌ SALAH: Menggunakan any
const user: any = { ... }
```

### Immutability
```typescript
// ✅ BENAR: Buat salinan baru
setFilters((prev) => ({ ...prev, search: value }))

// ❌ SALAH: Mutasi langsung
filters.search = value
```

### Return Early Pattern
```typescript
// ✅ BENAR: Guard clauses
if (isLoading) return <LoadingSpinner />
if (isError) return <ErrorAlert />
return <DataTable />

// ❌ SALAH: Nested if
if (!isLoading) {
  if (!isError) {
    return <DataTable />
  }
}
```

### Naming Conventions
- **Boolean:** `isLoading`, `hasError`, `shouldRender`
- **Event Handler:** `handleSubmit`, `handleClick`
- **Props:** `onClick`, `onSubmit`, `onChange`
- **Components:** `PascalCase` (AssetsListPage)
- **Functions:** `camelCase` (getAssets)
- **Constants:** `UPPER_SNAKE_CASE` (API_BASE_URL)

---

## 🔐 Permission System (RBAC)

### Roles
- `admin` - Full access
- `kepsek` - View-only + approve deletion
- `wakasek` - Manage assets, inventory, categories
- `bendahara` - View + reports + depreciation
- `operator` - Manage assets, loans, inventory
- `guru` - View only (limited)

### Usage
```typescript
import { usePermission } from '@/libs/hooks'

function AssetsListPage() {
  const { can } = usePermission()
  
  return (
    <>
      {can('manage_assets') && (
        <Button onClick={handleCreate}>Tambah Aset</Button>
      )}
    </>
  )
}
```

---

## 📝 Komentar Kode

**Aturan:** Komentar dalam **Bahasa Indonesia**

```typescript
// ✅ BENAR: Menjelaskan "mengapa"
// Kita menambah +1 di sini karena API backend menghitung indeks mulai dari 1, bukan 0
const adjustedIndex = index + 1

// ❌ SALAH: Menjelaskan "apa" (sudah jelas dari kode)
// Fungsi untuk menambah angka
function add(a: number, b: number) {
  return a + b
}
```

---

## 🚀 Development Workflow

### Setup
```bash
npm install
npm run dev  # Start dev server on port 5000
```

### Testing
```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once (CI mode)
npm run test:coverage # Generate coverage report
```

### Build
```bash
npm run build   # TypeScript check + Vite build
npm run preview # Preview production build
```

### Code Quality
```bash
npm run lint          # ESLint check
npm run format        # Format with Prettier
npm run format:check  # Check formatting
```

---

## 📚 Best Practices Checklist

- ✅ TypeScript strict mode aktif
- ✅ Zod validation untuk semua form
- ✅ Immutability (tidak mutasi state langsung)
- ✅ Return early pattern (guard clauses)
- ✅ Colocation (komponen dekat dengan yang pakai)
- ✅ Smart/Dumb component separation
- ✅ Barrel files (index.ts) untuk enkapsulasi
- ✅ Mobile-first responsive design
- ✅ Semantic HTML (button, nav, ul/li)
- ✅ ARIA labels untuk accessibility
- ✅ Komentar dalam Bahasa Indonesia

---

## 🔮 Future Plans

### Backend Integration
- Folder `backend/` akan dibuat untuk backend API
- Monorepo structure dengan shared types
- API contract validation

### Testing
- E2E testing dengan Playwright
- Visual regression testing
- Performance testing

### Deployment
- CI/CD pipeline dengan GitHub Actions
- Automated testing & linting
- Preview deployments untuk PR

---

**Last Updated:** 2025-01-22  
**Maintainer:** Frontend Team SIMANIS
