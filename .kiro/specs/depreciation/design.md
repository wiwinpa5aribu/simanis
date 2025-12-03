# Design Document - Halaman Penyusutan (Depreciation)

## Overview

Dokumen ini menjelaskan desain teknis untuk fitur penyusutan aset pada aplikasi SIMANIS. Fitur ini menghitung nilai penyusutan aset secara otomatis menggunakan metode garis lurus sesuai standar BMN (Barang Milik Negara).

### Tujuan
- Menghitung penyusutan aset secara otomatis setiap bulan
- Menampilkan dashboard ringkasan nilai penyusutan
- Menyediakan laporan penyusutan untuk keperluan keuangan
- Mendukung simulasi proyeksi nilai aset

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **State Management**: Zustand + TanStack Query
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Backend**: Fastify + Prisma ORM
- **Database**: MySQL 8.0
- **Job Scheduler**: BullMQ + Redis

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
├─────────────────────────────────────────────────────────────┤
│  Pages                    │  Components                      │
│  └── DepreciationPage     │  ├── DepreciationDashboard       │
│      ├── Dashboard Tab    │  ├── DepreciationTable           │
│      ├── List Tab         │  ├── DepreciationChart           │
│      ├── Settings Tab     │  ├── DepreciationDetailModal     │
│      └── Simulation Tab   │  └── SimulationForm              │
├─────────────────────────────────────────────────────────────┤
│  API Layer (libs/api/)    │  Validation (libs/validation/)   │
│  └── depreciation.ts      │  └── depreciationSchemas.ts      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Fastify)                         │
├─────────────────────────────────────────────────────────────┤
│  Controllers              │  Use Cases                       │
│  └── DepreciationCtrl     │  ├── GetDepreciationSummary      │
│                           │  ├── GetDepreciationList         │
│                           │  ├── CalculateDepreciation       │
│                           │  ├── GetAssetDepreciationHistory │
│                           │  ├── UpdateCategoryUsefulLife    │
│                           │  ├── GenerateDepreciationReport  │
│                           │  └── SimulateDepreciation        │
├─────────────────────────────────────────────────────────────┤
│  Repositories             │  Services                        │
│  └── DepreciationRepo     │  ├── DepreciationCalculator      │
│                           │  └── ReportGenerator             │
├─────────────────────────────────────────────────────────────┤
│  Jobs (BullMQ)                                               │
│  └── MonthlyDepreciationJob                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (MySQL)                          │
├─────────────────────────────────────────────────────────────┤
│  assets                   │  depreciation_entries            │
│  asset_categories         │                                  │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Frontend Components

#### 1. DepreciationPage (Main Page)
Halaman utama dengan tab navigation:
- **Dashboard Tab**: Ringkasan dan grafik
- **List Tab**: Daftar penyusutan per aset
- **Settings Tab**: Pengaturan masa manfaat kategori
- **Simulation Tab**: Simulasi proyeksi nilai

#### 2. DepreciationDashboard
Menampilkan:
- Summary cards: Total Nilai Perolehan, Total Akumulasi Penyusutan, Total Nilai Buku
- Line chart: Tren penyusutan 12 bulan terakhir
- Filter: Kategori, Tahun

#### 3. DepreciationTable
Tabel dengan kolom:
- Kode Aset, Nama, Nilai Perolehan, Masa Manfaat
- Penyusutan/Bulan, Akumulasi Penyusutan, Nilai Buku
- Badge "Habis Disusutkan" untuk nilai buku = 0
- Sortable columns
- Click row untuk detail

#### 4. DepreciationDetailModal
Modal menampilkan:
- Info aset
- Riwayat penyusutan bulanan (timeline)
- Grafik nilai buku over time

### API Interfaces

```typescript
// GET /api/depreciation/summary
interface DepreciationSummary {
  totalNilaiPerolehan: number
  totalAkumulasiPenyusutan: number
  totalNilaiBuku: number
  totalAssets: number
  fullyDepreciatedCount: number
}

// GET /api/depreciation/list
interface DepreciationListParams {
  categoryId?: number
  year?: number
  month?: number
  sortBy?: 'kodeAset' | 'namaBarang' | 'nilaiBuku' | 'akumulasiPenyusutan'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

interface DepreciationListItem {
  assetId: number
  kodeAset: string
  namaBarang: string
  categoryName: string
  nilaiPerolehan: number
  masaManfaatTahun: number
  penyusutanPerBulan: number
  akumulasiPenyusutan: number
  nilaiBuku: number
  isFullyDepreciated: boolean
}

// GET /api/depreciation/trend
interface DepreciationTrendParams {
  categoryId?: number
  months?: number // default 12
}

interface DepreciationTrendItem {
  month: string // "2025-01"
  totalPenyusutan: number
  totalNilaiBuku: number
}

// GET /api/depreciation/asset/:id/history
interface DepreciationHistoryItem {
  id: number
  tanggalHitung: Date
  nilaiPenyusutan: number
  nilaiBuku: number
  masaManfaatSnapshot: number
}

// POST /api/depreciation/calculate
interface CalculateDepreciationRequest {
  month: number // 1-12
  year: number
}

// PUT /api/categories/:id/useful-life
interface UpdateUsefulLifeRequest {
  defaultMasaManfaat: number
}

// POST /api/depreciation/simulate
interface SimulateDepreciationRequest {
  assetId?: number
  categoryId?: number
  periodMonths: number
}

interface SimulationResult {
  projections: {
    month: string
    nilaiBuku: number
    penyusutan: number
  }[]
  estimatedEndDate: string | null
}

// GET /api/depreciation/report
interface DepreciationReportParams {
  year: number
  month: number
  categoryId?: number
  format: 'excel' | 'pdf'
}
```

## Data Models

### Database Schema (Existing + Updates)

```sql
-- Existing: depreciation_entries
CREATE TABLE depreciation_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  asset_id INT NOT NULL,
  tanggal_hitung DATE NOT NULL,
  nilai_penyusutan DECIMAL(18,2) NOT NULL,
  nilai_buku DECIMAL(18,2) NOT NULL,
  masa_manfaat_tahun_snapshot INT NOT NULL,
  FOREIGN KEY (asset_id) REFERENCES assets(id)
);

-- Updated: asset_categories (added default_masa_manfaat)
ALTER TABLE asset_categories 
ADD COLUMN default_masa_manfaat INT NOT NULL DEFAULT 4;
```

### TypeScript Interfaces

```typescript
interface DepreciationEntry {
  id: number
  assetId: number
  tanggalHitung: Date
  nilaiPenyusutan: Decimal
  nilaiBuku: Decimal
  masaManfaatTahunSnapshot: number
  asset?: Asset
}

interface AssetWithDepreciation extends Asset {
  penyusutanPerBulan: number
  akumulasiPenyusutan: number
  nilaiBuku: number
  isFullyDepreciated: boolean
  lastDepreciationDate?: Date
}
```

### Depreciation Formula

```
Penyusutan Bulanan = Nilai Perolehan / (Masa Manfaat Tahun × 12)

Contoh:
- Nilai Perolehan: Rp 15.000.000
- Masa Manfaat: 4 tahun
- Penyusutan/Bulan = 15.000.000 / (4 × 12) = Rp 312.500

Nilai Buku = Nilai Perolehan - Akumulasi Penyusutan
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Summary Calculation Correctness
*For any* set of assets and depreciation entries, the summary totals (Total Nilai Perolehan, Total Akumulasi Penyusutan, Total Nilai Buku) must equal the sum of individual asset values.
**Validates: Requirements 1.1**

### Property 2: Category Filter Correctness
*For any* category filter selection, all assets displayed in the depreciation list must have a `categoryId` matching the selected category.
**Validates: Requirements 1.3**

### Property 3: Year Filter Correctness
*For any* year filter selection, all depreciation entries displayed must have `tanggalHitung` within the selected year.
**Validates: Requirements 1.4**

### Property 4: Depreciation List Data Completeness
*For any* asset in the depreciation list, the response must contain all required fields: kodeAset, namaBarang, nilaiPerolehan, masaManfaatTahun, penyusutanPerBulan, akumulasiPenyusutan, nilaiBuku.
**Validates: Requirements 2.1**

### Property 5: Sorting Correctness
*For any* sort column and direction, the depreciation list must be ordered correctly according to the specified column and direction.
**Validates: Requirements 2.3**

### Property 6: Fully Depreciated Badge
*For any* asset with nilaiBuku equal to 0, the `isFullyDepreciated` flag must be true.
**Validates: Requirements 2.4**

### Property 7: Depreciation Formula Correctness
*For any* asset with nilaiPerolehan and masaManfaatTahun, the calculated penyusutanPerBulan must equal `nilaiPerolehan / (masaManfaatTahun * 12)`.
**Validates: Requirements 3.2**

### Property 8: Depreciation Entry Creation
*For any* successful depreciation calculation, a new entry must be created with correct tanggalHitung, nilaiPenyusutan, and nilaiBuku values.
**Validates: Requirements 3.3**

### Property 9: Zero Book Value Skip
*For any* asset with nilaiBuku equal to 0, the depreciation calculation must not create a new entry for that asset.
**Validates: Requirements 3.4**

### Property 10: Category Default Useful Life
*For any* newly created asset, if masaManfaatTahun is not specified, it must inherit the defaultMasaManfaat from its category.
**Validates: Requirements 4.3**

### Property 11: Individual Useful Life Override
*For any* asset with a custom masaManfaatTahun, the depreciation calculation must use the asset's value, not the category default.
**Validates: Requirements 4.4**

### Property 12: Report Category Filter
*For any* depreciation report with category filter, all items in the report must belong to the selected category.
**Validates: Requirements 5.4**

### Property 13: Simulation Projection Correctness
*For any* simulation request, each projected month's nilaiBuku must equal the previous month's nilaiBuku minus penyusutanPerBulan, until reaching 0.
**Validates: Requirements 6.2**

### Property 14: Simulation End Date Estimation
*For any* asset simulation, the estimated end date must be the month when nilaiBuku first reaches 0.
**Validates: Requirements 6.3**

## Error Handling

```typescript
// Frontend
try {
  await calculateDepreciation({ month, year })
  showSuccessToast('Kalkulasi penyusutan berhasil')
} catch (error) {
  showErrorToast(error.message || 'Terjadi kesalahan')
}

// Backend Error Classes
class DepreciationAlreadyCalculatedError extends AppError {
  constructor(month: number, year: number) {
    super(`Penyusutan untuk ${month}/${year} sudah dihitung`, 409)
  }
}
```

## Testing Strategy

### Property-Based Testing (fast-check)

```typescript
import fc from 'fast-check'

// Property 7: Depreciation Formula Correctness
it('**Feature: depreciation, Property 7: Depreciation Formula Correctness**', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1000, max: 1000000000 }),
      fc.integer({ min: 1, max: 20 }),
      (nilaiPerolehan, masaManfaatTahun) => {
        const expected = nilaiPerolehan / (masaManfaatTahun * 12)
        const actual = calculateMonthlyDepreciation(nilaiPerolehan, masaManfaatTahun)
        return Math.abs(actual - expected) < 0.01
      }
    ),
    { numRuns: 100 }
  )
})
```

## Requirements Traceability Matrix

| Requirement | Design Component | Property Test |
|-------------|------------------|---------------|
| 1.1 Summary | DepreciationDashboard | Property 1 |
| 1.3 Category filter | FilterBar | Property 2 |
| 1.4 Year filter | FilterBar | Property 3 |
| 2.1 Table columns | DepreciationTable | Property 4 |
| 2.3 Sorting | DepreciationTable | Property 5 |
| 2.4 Badge habis | DepreciationTable | Property 6 |
| 3.2 Formula | DepreciationCalculator | Property 7 |
| 3.3 Entry creation | CalculateDepreciation | Property 8 |
| 3.4 Skip zero | CalculateDepreciation | Property 9 |
| 4.3 Default useful life | CreateAsset | Property 10 |
| 4.4 Individual override | CalculateDepreciation | Property 11 |
| 5.4 Report filter | ReportGenerator | Property 12 |
| 6.2 Simulation | SimulateDepreciation | Property 13 |
| 6.3 End date | SimulateDepreciation | Property 14 |