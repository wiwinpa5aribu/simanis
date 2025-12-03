# Implementation Plan - Depreciation (Penyusutan)

## Overview

Implementasi fitur penyusutan aset sesuai dengan requirements dan design document. Tasks disusun secara incremental dengan fokus pada backend terlebih dahulu, kemudian frontend.

---

- [x] 1. Backend - Update Prisma Schema dan Repository
  - [x] 1.1 Update Prisma schema untuk depreciation_entries dan asset_categories
    - Tambah model DepreciationEntry (sudah ada)
    - Tambah field defaultMasaManfaat di AssetCategory
    - Generate Prisma client
    - _Requirements: 3.3, 4.1_
  - [x] 1.2 Implementasi DepreciationRepository
    - Create, findByAssetId, findByPeriod, getLatestByAssetId
    - Aggregation methods untuk summary
    - _Requirements: 1.1, 2.1, 2.2_

- [x] 2. Backend - Implementasi Depreciation Calculator Service



  - [x] 2.1 Buat DepreciationCalculatorService


    - calculateMonthlyDepreciation(nilaiPerolehan, masaManfaatTahun)
    - calculateBookValue(nilaiPerolehan, akumulasiPenyusutan)
    - _Requirements: 3.2_
  - [x]* 2.2 Write property test untuk formula penyusutan

    - **Property 7: Depreciation Formula Correctness**
    - **Validates: Requirements 3.2**

  - [ ]* 2.3 Write property test untuk zero book value skip
    - **Property 9: Zero Book Value Skip**
    - **Validates: Requirements 3.4**

- [x] 3. Backend - Implementasi Use Cases




  - [x] 3.1 Implementasi GetDepreciationSummaryUseCase

    - Total nilai perolehan, akumulasi penyusutan, nilai buku
    - Filter by category, year
    - _Requirements: 1.1, 1.3, 1.4_
  - [ ]* 3.2 Write property test untuk summary calculation
    - **Property 1: Summary Calculation Correctness**
    - **Validates: Requirements 1.1**

  - [x] 3.3 Implementasi GetDepreciationListUseCase

    - List aset dengan info penyusutan
    - Sorting, pagination, filter
    - _Requirements: 2.1, 2.3_
  - [ ]* 3.4 Write property test untuk list data completeness
    - **Property 4: Depreciation List Data Completeness**
    - **Validates: Requirements 2.1**
  - [ ]* 3.5 Write property test untuk sorting
    - **Property 5: Sorting Correctness**
    - **Validates: Requirements 2.3**

  - [x] 3.6 Implementasi GetDepreciationTrendUseCase

    - Data trend 12 bulan terakhir untuk chart
    - _Requirements: 1.2_
  - [x] 3.7 Implementasi GetAssetDepreciationHistoryUseCase


    - Riwayat penyusutan per aset
    - _Requirements: 2.2_

- [x] 4. Checkpoint - Pastikan semua backend tests passing



  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Backend - Implementasi Calculate Depreciation Use Case




  - [x] 5.1 Implementasi CalculateDepreciationUseCase

    - Kalkulasi penyusutan untuk semua aset aktif
    - Skip aset dengan nilai buku = 0
    - Create depreciation entries
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 5.2 Write property test untuk entry creation
    - **Property 8: Depreciation Entry Creation**
    - **Validates: Requirements 3.3**
  - [ ]* 5.3 Write property test untuk fully depreciated badge
    - **Property 6: Fully Depreciated Badge**
    - **Validates: Requirements 2.4**

- [x] 6. Backend - Implementasi Settings dan Simulation
  - [x] 6.1 Implementasi UpdateCategoryUsefulLifeUseCase
    - Update default masa manfaat kategori
    - _Requirements: 4.1, 4.2_
  - [x] 6.2 Implementasi SimulateDepreciationUseCase
    - Proyeksi nilai buku per bulan
    - Estimasi tanggal habis disusutkan
    - _Requirements: 6.1, 6.2, 6.3_
  - [x]* 6.3 Write property test untuk simulation projection
    - **Property 13: Simulation Projection Correctness**
    - **Validates: Requirements 6.2**
  - [x]* 6.4 Write property test untuk end date estimation
    - **Property 14: Simulation End Date Estimation**
    - **Validates: Requirements 6.3**

- [x] 7. Backend - Implementasi Report Generation
  - [x] 7.1 Implementasi GenerateDepreciationReportUseCase
    - Generate Excel report dengan ExcelJS
    - Filter by period, category
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x]* 7.2 Write property test untuk report category filter
    - **Property 12: Report Category Filter**
    - **Validates: Requirements 5.4**

- [x] 8. Backend - Implementasi API Routes
  - [x] 8.1 Buat depreciation.routes.ts
    - GET /depreciation/summary
    - GET /depreciation/list
    - GET /depreciation/trend
    - GET /depreciation/asset/:id/history
    - POST /depreciation/calculate
    - POST /depreciation/simulate
    - GET /depreciation/report
    - _Requirements: All_
  - [x] 8.2 Update categories.routes.ts
    - PUT /categories/:id/useful-life
    - _Requirements: 4.2_

- [x] 9. Checkpoint - Pastikan semua backend tests passing


  - Ensure all tests pass, ask the user if questions arise.



- [x] 10. Frontend - Update API Layer

  - [x] 10.1 Update libs/api/depreciation.ts

    - getDepreciationSummary, getDepreciationList, getDepreciationTrend
    - getAssetDepreciationHistory, calculateDepreciation
    - simulateDepreciation, getDepreciationReport
    - _Requirements: All_


  - [x] 10.2 Buat libs/validation/depreciationSchemas.ts




    - Zod schemas untuk form validation
    - _Requirements: All_



- [x] 11. Frontend - Implementasi Dashboard Components


  - [ ] 11.1 Buat DepreciationSummaryCards component
    - 3 cards: Nilai Perolehan, Akumulasi Penyusutan, Nilai Buku
    - Responsive layout
    - _Requirements: 1.1_
  - [ ] 11.2 Buat DepreciationChart component
    - Line chart dengan Recharts
    - Tren 12 bulan terakhir
    - _Requirements: 1.2_
  - [ ] 11.3 Buat DepreciationFilters component
    - Filter kategori dan tahun
    - _Requirements: 1.3, 1.4_
  - [ ]* 11.4 Write property test untuk category filter
    - **Property 2: Category Filter Correctness**
    - **Validates: Requirements 1.3**
  - [ ]* 11.5 Write property test untuk year filter
    - **Property 3: Year Filter Correctness**
    - **Validates: Requirements 1.4**

- [x] 12. Frontend - Implementasi List Components



  - [x] 12.1 Buat DepreciationTable component

    - Kolom sesuai requirements
    - Sortable headers
    - Badge "Habis Disusutkan"
    - _Requirements: 2.1, 2.3, 2.4_

  - [x] 12.2 Buat DepreciationDetailModal component

    - Info aset dan riwayat penyusutan
    - Timeline view
    - _Requirements: 2.2_

- [x] 13. Frontend - Implementasi Settings dan Simulation



  - [x] 13.1 Buat UsefulLifeSettings component

    - Daftar kategori dengan masa manfaat
    - Edit inline
    - _Requirements: 4.1, 4.2_


  - [x] 13.2 Buat SimulationForm component


    - Form pilih aset/kategori dan periode
    - _Requirements: 6.1_
  - [ ] 13.3 Buat SimulationResult component
    - Tabel dan grafik proyeksi
    - Estimasi tanggal habis
    - _Requirements: 6.2, 6.3_

- [ ] 14. Frontend - Update DepreciationListPage




  - [x] 14.1 Refactor DepreciationListPage dengan tab navigation

    - Dashboard, List, Settings, Simulation tabs
    - Integrate semua components
    - _Requirements: All_

  - [ ] 14.2 Implementasi responsive layout
    - Mobile card view untuk table
    - Collapsible filters
    - _Requirements: All_

- [ ] 15. Checkpoint - Pastikan semua tests passing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Backend - Implementasi Scheduled Job (Optional)
  - [ ]* 16.1 Buat MonthlyDepreciationJob dengan BullMQ
    - Schedule untuk tanggal 1 setiap bulan
    - Auto-calculate depreciation
    - _Requirements: 3.1, 3.5_

- [ ] 17. Final Checkpoint - Pastikan semua tests passing
  - Ensure all tests pass, ask the user if questions arise.
