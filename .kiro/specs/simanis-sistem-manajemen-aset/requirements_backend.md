# Requirements: SIMANIS Backend – API Server untuk PWA Sistem Manajemen Aset Sekolah

## 1. Tujuan Utama Backend

Membangun **REST API backend** yang:

- Menyediakan **semua endpoint** yang dibutuhkan frontend Phase 1, Phase 2, dan Phase 3
- Mengimplementasikan **10 Use Cases utama** dari `usecase_userstories.md` dengan logika bisnis yang benar
- Menjaga **konsistensi data** sesuai domain model dan database schema
- Menerapkan **best practices** untuk maintainability, debugging, dan error handling
- **Realistic & maintainable** untuk tim kecil sekolah SMA

---

## 2. Referensi Dokumen

### Dokumen Research (Foundation)
- `research-docs/model_domain.md` – Domain entities, relasi, business rules
- `research-docs/usecase_userstories.md` – 10 Use Cases (UC1-UC10)
- `research-docs/ubiquitous_language_dictionary.md` – Terminologi standar
- `research-docs/database_schema.md` – Struktur database lengkap
- `research-docs/algorithm_datastructure.md` – Algoritma bisnis & kompleksitas
- `research-docs/tech_stack.md` – Tech stack awal

### Dokumen Frontend (Integration Target)
- `.kiro/specs/simanis-sistem-manajemen-aset/requirements.md` (Phase 1)
- `.kiro/specs/simanis-sistem-manajemen-aset/requirements-phase-2.md` (Phase 2)
- `.kiro/specs/simanis-sistem-manajemen-aset/requirements-phase-3.md` (Phase 3)

### Best Practices
- `.kiro/specs/simanis-sistem-manajemen-aset/Best_Practices.md` – Defensive coding, logging, error handling

---

## 3. Tech Stack Backend (Final & Realistic)

```yaml
Core Framework:
  - Fastify (faster alternative ke Express) + TypeScript
  - Node.js 18 LTS atau 20 LTS

Database:
  - PostgreSQL 14+ (RECOMMENDED) atau MySQL 8.0+
  - Prisma ORM (type-safe, auto-migration)

Authentication:
  - JWT (JSON Web Tokens)
  - Argon2 untuk password hashing

Validation:
  - Zod (runtime validation, shared dengan frontend)

Background Jobs:
  - BullMQ + Redis (untuk penyusutan bulanan, report generation)

File Storage:
  - Cloudflare R2 (S3-compatible, cost-effective)
  - Alternatif: Local storage untuk development

Logging:
  - Winston (structured logging, JSON format)

Testing (Future):
  - Vitest (unit tests)
  - Supertest (API integration tests)

DevOps:
  - Docker + Docker Compose (development environment)
  - Environment Variables (.env)
```

**Rationale:** Semua pilihan ini berdasarkan analisis realistic – tidak over-engineering, maintainable untuk tim kecil.

---

## 4. Lingkup Fungsional Backend

### 4.1. Use Case Coverage (Berdasarkan `usecase_userstories.md`)

Backend harus mengimplementasikan **10 Use Cases** utama:

| Use Case | Priority | Frontend Dependency | Backend Complexity |
|----------|----------|--------------------|--------------------|
| UC1: Registrasi Aset | ✅ Must | Phase 1 Complete | Medium (QR generation) |
| UC2: Mutasi Lokasi | ✅ Must | Phase 1 Complete | Low |
| UC3: Peminjaman Aset | ✅ Must | Phase 1 Complete | Medium (status workflow) |
| UC4: Inventarisasi | ✅ Must | Phase 2 Complete | Medium (file upload) |
| UC5: Penyusutan Bulanan | ✅ Must | Phase 2 Waiting | High (scheduled job) |
| UC6: Laporan KIB | ✅ Must | Phase 2 Waiting | High (report generation) |
| UC7: Penghapusan Aset | 🟡 Should | Not yet | Medium (approval workflow) |
| UC8: Kelola Kategori | ✅ Must | Phase 1 Complete | Low (CRUD) |
| UC9: Kelola User & RBAC | ✅ Must | Phase 1 Partial | Medium (role management) |
| UC10: Audit Trail | ✅ Must | Phase 2 Waiting | Low (query logs) |

### 4.2. Fitur Tambahan untuk Frontend Phase 2 & 3

**Phase 2 Support:**
- Dashboard statistics API (total aset, per kategori, per kondisi, active loans)
- Recent activities API (5-10 latest events)
- File upload endpoints (foto aset, foto inventarisasi, dokumen BA)

**Phase 3 Support:**
- Bulk actions endpoints (bulk update kondisi, bulk mutasi)
- User favorites API (optional, fallback ke localStorage di frontend)
- Report presets API (optional, fallback ke localStorage di frontend)

---

## 5. Requirements Fungsional Rinci per Use Case

### UC1: Registrasi Aset (US-REG-1 [Must])

**Endpoint:**
```
POST /api/assets
```

**Request Body:**
```json
{
  "kode_aset": "SCH/KD/EL/0001",
  "nama_barang": "Laptop HP Pavilion",
  "merk": "HP",
  "spesifikasi": "Intel i5, 8GB RAM",
  "tahun_perolehan": "2024-01-15",
  "harga": 7500000,
  "sumber_dana": "BOS",
  "kondisi": "Baik",
  "category_id": 1,
  "masa_manfaat_tahun": 4,
  "foto_url": "https://r2.../assets/photo.jpg" // optional
}
```

**Business Logic:**
1. ✅ Validasi `kode_aset` format `SCH/KD/KAT/NOURUT` (Zod schema)
2. ✅ Validasi `kode_aset` unique (database constraint)
3. ✅ Validasi `sumber_dana` enum: BOS, APBD, Hibah
4. ✅ Validasi `kondisi` enum: Baik, Rusak Ringan, Rusak Berat, Hilang
5. ✅ Generate QR code otomatis (unique string/UUID)
6. ✅ Set `tanggal_pencatatan` = now()
7. ✅ Set `created_by` = current user ID
8. ✅ Create audit log (action: CREATE, entity_type: Asset)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "kode_aset": "SCH/KD/EL/0001",
    "qr_code": "a3f2c1...",
    // ... semua fields
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**Error Responses:**
- 400: Validasi gagal (format kode salah, enum tidak valid)
- 409: `kode_aset` duplikat
- 500: Internal server error

**Acceptance Criteria:**
- Given valid asset data, When POST, Then asset created dengan QR code auto-generated
- Given duplicate `kode_aset`, When POST, Then return 409 error
- Given invalid enum value, When POST, Then return 400 dengan pesan jelas

---

### UC2: Mutasi Lokasi Aset (US-MUT-1 [Must])

**Endpoint:**
```
POST /api/assets/:id/mutations
GET /api/assets/:id/mutations (riwayat)
```

**Request Body:**
```json
{
  "to_room_id": 5,
  "note": "Dipindahkan ke Lab Komputer untuk perbaikan"
}
```

**Business Logic:**
1. ✅ Validasi asset exists
2. ✅ Validasi room exists (foreign key constraint)
3. ✅ Check asset tidak sedang dipinjam (status Dipinjam di `loans`)
4. ✅ Get `from_room_id` dari mutasi terakhir (atau NULL jika first mutation)
5. ✅ Create mutation record dengan `mutated_at` = now()
6. ✅ OPTIONAL: Denormalisasi – update `assets.current_room_id` (performance optimization)
7. ✅ Create audit log

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "asset_id": 1,
    "from_room_id": 3,
    "to_room_id": 5,
    "mutated_at": "2024-01-15T14:30:00Z",
    "note": "..."
  }
}
```

**Error Responses:**
- 400: Asset sedang dipinjam (tidak bisa dimutasi)
- 404: Asset atau Room tidak ditemukan

**Acceptance Criteria:**
- Given valid room dan asset tersedia, When mutasi, Then record created
- Given asset dipinjam, When mutasi, Then return 400 error

---

### UC3: Peminjaman Aset (US-PJM-1/2/3)

**Endpoints:**
```
POST /api/loans (create peminjaman)
PATCH /api/loans/:id/return (tandai dikembalikan)
GET /api/loans (list)
GET /api/loans/:id (detail)
```

**Create Loan Request:**
```json
{
  "requested_by": 5, // user_id (Guru)
  "asset_ids": [1, 2, 3],
  "tujuan_pinjam": "Presentasi kelas XI IPA",
  "tanggal_pinjam": "2024-01-16T08:00:00Z"
}
```

**Business Logic:**
1. ✅ Validasi semua `asset_ids` exists dan tersedia (tidak sedang dipinjam)
2. ✅ Validasi kondisi aset bukan Hilang atau Rusak Berat
3. ✅ Create loan record dengan status = "Dipinjam"
4. ✅ Create `loan_items` untuk setiap asset dengan `condition_before`
5. ✅ Create audit log

**Return Loan Request:**
```json
{
  "kondisi_akhir": {
    "1": "Baik",
    "2": "Rusak Ringan",
    "3": "Baik"
  },
  "catatan": "Proyektor kabel HDMI rusak"
}
```

**Business Logic (Return):**
1. ✅ Set `tanggal_kembali` = now()
2. ✅ Update `loan_items.condition_after`
3. ✅ Determine status:
   - Jika ada kondisi Rusak → status = "Rusak"
   - Jika lewat due date (jika ada) → status = "Terlambat"
   - Else → status = "Dikembalikan"
4. ✅ Update `assets.kondisi` jika ada yang rusak
5. ✅ Create audit log

**Acceptance Criteria:**
- Given asset tersedia, When create loan, Then status = Dipinjam
- Given return rusak, When return, Then status = Rusak dan kondisi aset updated
- Given return terlambat, When return, Then status = Terlambat

---

### UC4: Inventarisasi Periodik (US-INV-1)

**Endpoints:**
```
POST /api/inventory (create)
GET /api/inventory (list dengan filter)
GET /api/inventory/:id (detail)
```

**Create Request:**
```json
{
  "asset_id": 1,
  "qr_code_scanned": "a3f2c1...",
  "photo_url": "https://r2.../inventory/photo.jpg",
  "note": "Kondisi baik, tidak ada kerusakan"
}
```

**Business Logic:**
1. ✅ Validasi `qr_code_scanned` match dengan asset.qr_code (atau cari by kode_aset)
2. ✅ Set `checked_by` = current user
3. ✅ Set `checked_at` = now()
4. ✅ Create inventory check record
5. ✅ Create audit log

**List dengan Filter:**
```
GET /api/inventory?from=2024-01-01&to=2024-01-31&page=1&pageSize=20
```

**Acceptance Criteria:**
- Given valid QR code, When create, Then inventory record created
- Given invalid QR, When create, Then return 400 error
- Given date range filter, When GET, Then return filtered results

---

### UC5: Penyusutan Bulanan Otomatis (US-PST-1 [Must])

**Endpoints:**
```
GET /api/depreciations (view only)
POST /api/depreciations/calculate (manual trigger untuk testing)
```

**Background Job (BullMQ):**
- **Scheduler:** Cron job setiap akhir bulan (e.g., `0 0 1 * *`)
- **Queue:** `depreciation-monthly`

**Business Logic (Scheduled):**
1. ✅ Get all assets where `masa_manfaat_tahun > 0` AND `is_deleted = FALSE`
2. ✅ For each asset:
   - Calculate: `monthly_depreciation = harga / (masa_manfaat_tahun * 12)`
   - Get last `nilai_buku` from `depreciation_entries` (or use `harga` if first time)
   - Calculate: `new_nilai_buku = max(0, last_nilai_buku - monthly_depreciation)`
   - Insert `depreciation_entry` dengan `tanggal_hitung` = end of current month
3. ✅ Idempotency: Check duplicate `(asset_id, tanggal_hitung)` via UNIQUE constraint
4. ✅ Error handling: Log errors tapi tidak stop scheduler jika 1 asset gagal
5. ✅ Create audit log per calculation

**GET Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "asset_id": 1,
      "asset_name": "Laptop HP",
      "tanggal_hitung": "2024-01-31",
      "nilai_penyusutan": 156250.00,
      "nilai_buku": 7343750.00,
      "masa_manfaat_tahun_snapshot": 4
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "total": 50 }
}
```

**Acceptance Criteria:**
- Given akhir bulan, When scheduler runs, Then depreciation calculated untuk semua eligible assets
- Given duplicate calculation, When run again, Then prevented by UNIQUE constraint
- Given filter by month/year, When GET, Then return correct entries

---

### UC6: Generate Laporan KIB (US-KIB-1 [Must])

**Endpoints:**
```
POST /api/reports/kib (request generation)
GET /api/reports/kib/:jobId/status (check job status)
GET /api/reports/kib/:jobId/download (download file)
```

**Request:**
```json
{
  "filters": {
    "category_id": 1, // optional
    "room_id": 5, // optional
    "kondisi": "Baik", // optional
    "from": "2024-01-01", // optional
    "to": "2024-12-31" // optional
  },
  "format": "excel" // or "pdf"
}
```

**Business Logic:**
1. ✅ Validate filters
2. ✅ Create background job (BullMQ) untuk generate report
3. ✅ Return `job_id` immediately
4. ✅ Worker process:
   - Query assets dengan joins (category, location via latest mutation, depreciation latest)
   - Generate Excel (exceljs) atau PDF (pdfkit)
   - Upload file ke R2 storage
   - Update job status = "completed" dengan `download_url`
5. ✅ Frontend polls `/status` endpoint untuk check progress

**Response (Immediate):**
```json
{
  "success": true,
  "data": {
    "job_id": "kib-2024-01-15-abc123",
    "status": "processing"
  }
}
```

**Download Response:**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="KIB_2024-01-15.xlsx"
```

**Acceptance Criteria:**
- Given valid filters, When POST, Then job created dan return job_id
- Given job_id, When check status, Then return current status
- Given completed job, When download, Then return Excel/PDF file

---

### UC8: Kelola Kategori Aset (CRUD Sederhana)

**Endpoints:**
```
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
```

**Simple CRUD, validasi:**
- Name required & unique
- Cannot delete category dengan assets masih attached (foreign key constraint)

---

### UC9: Kelola User & RBAC (US-RBAC-1)

**Endpoints:**
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

GET /api/users
POST /api/users (create user + assign role)
PUT /api/users/:id
DELETE /api/users/:id

GET /api/roles (list available roles)
```

**Login Request:**
```json
{
  "username": "operator1",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Ahmad Operator",
      "username": "operator1",
      "role": "Operator"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Business Logic:**
1. ✅ Hash password dengan Argon2 (tidak simpan plaintext)
2. ✅ Generate JWT token dengan payload: `{ userId, role, exp }`
3. ✅ Token expiry: 7 days (configurable)
4. ✅ Middleware: Verify JWT di semua protected routes
5. ✅ RBAC permissions di backend (tidak hanya UI):
   - Kepsek: full read, approve deletions
   - Wakasek Sarpras: full CRUD assets, locations, reports
   - Bendahara BOS: read depreciation, reports
   - Operator: CRUD assets, mutations, loans, inventory
   - Guru: create loans only

**Acceptance Criteria:**
- Given valid credentials, When login, Then return token
- Given invalid credentials, When login, Then return 401
- Given invalid token, When access protected route, Then return 401

---

### UC10: Audit Trail Viewer (US-AUD-1)

**Endpoints:**
```
GET /api/audit-logs?entity_type=Asset&entity_id=1&user_id=5&from=...&to=...&page=1&pageSize=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "entity_type": "Asset",
      "entity_id": 1,
      "user_id": 3,
      "user_name": "Ahmad Operator",
      "action": "UPDATE",
      "timestamp": "2024-01-15T10:30:00Z",
      "field_changed": {
        "kondisi": { "from": "Baik", "to": "Rusak Ringan" }
      }
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "total": 150 }
}
```

**Business Logic:**
1. ✅ Support filtering by entity_type, entity_id, user_id, time range
2. ✅ Server-side pagination (default pageSize: 20, max: 100)
3. ✅ Sort by timestamp DESC (newest first)
4. ✅ Join dengan `users` untuk get user name
5. ✅ Return `field_changed` JSON as-is (frontend yang parse)

---

## 6. Fitur Tambahan untuk Frontend Phase 2 & 3

### 6.1. Dashboard Statistics API

**Endpoint:**
```
GET /api/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_assets": 150,
    "assets_by_category": [
      { "category_name": "Elektronik", "count": 45 },
      { "category_name": "Furniture", "count": 30 }
    ],
    "assets_by_condition": [
      { "condition": "Baik", "count": 120 },
      { "condition": "Rusak Ringan", "count": 25 }
    ],
    "active_loans": 12
  }
}
```

### 6.2. Recent Activities API

**Endpoint:**
```
GET /api/dashboard/activities?limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "asset_created",
      "entity_id": 5,
      "entity_name": "Laptop Dell",
      "user_name": "Ahmad",
      "timestamp": "2024-01-15T10:00:00Z",
      "description": "Aset baru didaftarkan"
    },
    {
      "id": 2,
      "type": "loan_created",
      "entity_id": 3,
      "user_name": "Budi Guru",
      "timestamp": "2024-01-15T09:30:00Z",
      "description": "Peminjaman proyektor"
    }
  ]
}
```

### 6.3. File Upload Endpoints

**Endpoint:**
```
POST /api/upload/asset-photo
POST /api/upload/inventory-photo
POST /api/upload/document (untuk BA)
```

**Request:** `multipart/form-data`

**Business Logic:**
1. ✅ Validate file type (image/jpeg, image/png, image/webp, application/pdf untuk BA)
2. ✅ Validate file size (max 5MB)
3. ✅ Upload ke Cloudflare R2 (atau local storage untuk dev)
4. ✅ Return public URL

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://r2-public-url.../uploads/asset-photo-123.jpg"
  }
}
```

### 6.4. Bulk Actions Endpoints (Phase 3)

**Endpoints:**
```
POST /api/assets/bulk-update-condition
POST /api/assets/bulk-mutate
```

**Bulk Update Condition Request:**
```json
{
  "asset_ids": [1, 2, 3, 4, 5],
  "kondisi": "Rusak Ringan"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "updated": 4,
    "failed": 1,
    "errors": [
      { "asset_id": 3, "error": "Asset sedang dipinjam" }
    ]
  }
}
```

**Business Logic:**
- Wrap in transaction jika possible (atau partial success dengan detailed errors)
- Create audit log untuk setiap successful update

---

## 7. Non-Functional Requirements

### 7.1. Performance

- **Response Time:**
  - Simple CRUD (GET/POST kategori, aset list): < 200ms (p95)
  - Complex queries (dashboard stats, audit logs): < 500ms (p95)
  - Report generation: Async (background job), status check < 100ms

- **Pagination:**
  - All list endpoints MUST support server-side pagination
  - Default pageSize: 20, max: 100

- **Database Indexes:**
  - Required indexes sesuai `database_schema.md`:
    - `assets(kode_aset)` UNIQUE
    - `assets(qr_code)` UNIQUE
    - `asset_mutations(asset_id, mutated_at DESC)` untuk lokasi aktif
    - `loans(status, tanggal_pinjam)`
    - `audit_logs(entity_type, entity_id)`

### 7.2. Security

- **Authentication:**
  - JWT dengan expiry 7 days
  - Refresh token (optional untuk future enhancement)
  - Password hashed dengan Argon2

- **Authorization:**
  - Role-based access control (RBAC) di backend
  - Semua endpoints validated by role permissions
  - Tidak hanya mengandalkan frontend UI hiding

- **Input Validation:**
  - Semua request body validated dengan Zod schemas
  - Sanitize input untuk prevent SQL injection (Prisma auto-escape)
  - Prevent XSS di file upload (validate MIME type)

- **CORS:**
  - Allow frontend origin (configurable via env)
  - Credentials: true untuk cookies jika digunakan

- **Rate Limiting:**
  - Login endpoint: Max 5 attempts per 15 minutes per IP
  - API endpoints: 100 requests per minute per user (optional)

### 7.3. Reliability

- **Error Handling:**
  - Global error handler (catch all unhandled exceptions)
  - Structured error responses:
    ```json
    {
      "success": false,
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Kode aset sudah digunakan",
        "details": { "field": "kode_aset" }
      }
    }
    ```

- **Logging:**
  - Level: DEBUG, INFO, WARN, ERROR
  - Format: JSON structured logs
  - Context: Always include userId, requestId, timestamp
  - Rotate logs daily (max 7 days retention untuk development)

- **Database Transactions:**
  - Use transaction untuk multi-step operations (e.g., create loan + loan_items)
  - Rollback on error

### 7.4. Maintainability

- **Code Quality:**
  - TypeScript strict mode enabled
  - ESLint + Prettier configured
  - No `any` types (use `unknown` dan type narrowing)

- **Folder Structure:**
  - Feature-based / Domain-based (lihat section 8)
  - Consistent naming conventions
  - Separated concerns (domain, application, infrastructure, presentation)

- **Documentation:**
  - API documentation (Swagger/OpenAPI) – optional tapi recommended
  - README di root backend folder dengan setup instructions
  - Comments dalam Bahasa Indonesia di business logic yang kompleks

### 7.5. Scalability (Future-Proof)

- **Database:**
  - Use connection pooling (Prisma default)
  - Prepare untuk read replicas jika diperlukan (not now)

- **Caching:**
  - Redis untuk session storage (jika pakai session-based auth)
  - Redis untuk BullMQ job queue
  - Optional: Cache frequently accessed data (kategori list, roles)

- **Horizontal Scaling:**
  - Stateless API (semua state di database atau Redis)
  - Background jobs di separate worker process

---

## 8. Struktur Folder Backend (Feature-Based)

```
backend/
├── src/
│   ├── domain/                    # Pure business logic, domain models
│   │   ├── entities/
│   │   │   ├── asset.entity.ts
│   │   │   ├── loan.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   └── ...
│   │   ├── value-objects/
│   │   │   ├── kode-aset.vo.ts
│   │   │   ├── kondisi-aset.vo.ts
│   │   │   └── ...
│   │   └── repositories/          # Repository interfaces (contracts)
│   │       ├── asset.repository.ts
│   │       ├── loan.repository.ts
│   │       └── ...
│   │
│   ├── application/               # Use cases, application services
│   │   ├── use-cases/
│   │   │   ├── create-asset.use-case.ts
│   │   │   ├── mutate-asset.use-case.ts
│   │   │   ├── create-loan.use-case.ts
│   │   │   └── ...
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── asset.dto.ts
│   │   │   ├── loan.dto.ts
│   │   │   └── ...
│   │   └── validators/            # Zod schemas
│   │       ├── asset.validators.ts
│   │       ├── loan.validators.ts
│   │       └── ...
│   │
│   ├── infrastructure/            # Technical implementations
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   └── repositories/     # Prisma repository implementations
│   │   │       ├── asset.repository.impl.ts
│   │   │       └── ...
│   │   ├── storage/
│   │   │   └── r2-storage.service.ts
│   │   ├── queue/
│   │   │   ├── bull-queue.service.ts
│   │   │   └── jobs/
│   │   │       ├── depreciation.job.ts
│   │   │       ├── kib-report.job.ts
│   │   │       └── ...
│   │   └── external/              # External APIs (future)
│   │
│   ├── presentation/              # API layer (HTTP)
│   │   ├── controllers/
│   │   │   ├── asset.controller.ts
│   │   │   ├── loan.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error-handler.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   └── rbac.middleware.ts
│   │   └── routes/
│   │       ├── asset.routes.ts
│   │       ├── loan.routes.ts
│   │       └── index.ts
│   │
│   ├── shared/                    # Shared utilities
│   │   ├── config/
│   │   │   └── index.ts           # Environment variables config
│   │   ├── logger/
│   │   │   └── winston.logger.ts
│   │   ├── errors/
│   │   │   ├── app-error.ts
│   │   │   ├── validation-error.ts
│   │   │   └── ...
│   │   └── utils/
│   │       ├── date.utils.ts
│   │       ├── qr-code.utils.ts
│   │       └── ...
│   │
│   └── main.ts                    # Application entry point
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                    # Database seeding
│
├── tests/                         # Tests (future)
│   ├── unit/
│   └── integration/
│
├── .env.example                   # Template environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── docker-compose.yml             # PostgreSQL + Redis untuk development
└── README.md
```

**Prinsip:**
- `domain/` = Business logic, tidak tahu apa-apa tentang HTTP/database
- `application/` = Orchestrates use cases, data flow
- `infrastructure/` = Technical details (database, file storage, queues)
- `presentation/` = HTTP API layer
- `shared/` = Cross-cutting concerns (config, logger, errors)

---

## 9. API Response Format Standard

### Success Response:
```json
{
  "success": true,
  "data": { /* actual data */ },
  "pagination": { /* if applicable */ }
}
```

### Error Response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Kode aset harus mengikuti format SCH/KD/KAT/NOURUT",
    "details": { "field": "kode_aset", "value": "invalid" }
  }
}
```

### Error Codes (Standard):
- `VALIDATION_ERROR` – Input validation failed (400)
- `UNAUTHORIZED` – Invalid or missing token (401)
- `FORBIDDEN` – No permission for this action (403)
- `NOT_FOUND` – Resource tidak ditemukan (404)
- `CONFLICT` – Duplicate resource (409)
- `INTERNAL_ERROR` – Server error (500)

---

## 10. Environment Variables (.env)

```bash
# Application
NODE_ENV=development # development | production
PORT=3000
API_BASE_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/simanis"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN=7d

# Redis (untuk BullMQ)
REDIS_URL="redis://localhost:6379"

# Cloudflare R2 Storage
R2_ENDPOINT="https://..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="simanis-assets"
R2_PUBLIC_URL="https://..."

# CORS
CORS_ORIGIN="http://localhost:5173" # Frontend dev URL

# Logging
LOG_LEVEL=info # debug | info | warn | error
LOG_FILE_PATH=./logs

# Rate Limiting (optional)
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

---

## 11. Integration dengan Frontend

### 11.1. Frontend Phase 1 (Complete)

Backend HARUS menyediakan:
- ✅ `POST /api/auth/login`, `GET /api/auth/me`
- ✅ `GET/POST/PUT/DELETE /api/categories`
- ✅ `GET/POST/GET:id /api/assets`
- ✅ `POST /api/assets/:id/mutations`, `GET /api/assets/:id/mutations`
- ✅ `GET/POST /api/loans`, `PATCH /api/loans/:id/return`

### 11.2. Frontend Phase 2 (Partially Complete)

Backend HARUS menyediakan:
- ✅ `POST /api/upload/asset-photo`, `/inventory-photo`
- ✅ `GET/POST /api/inventory`
- ⏳ `GET /api/dashboard/stats`, `/activities` (WAITING)
- ⏳ `GET /api/depreciations` (WAITING)
- ⏳ `POST /api/reports/kib`, `GET /:id/status`, `GET /:id/download` (WAITING)
- ⏳ `GET /api/audit-logs` (WAITING)

### 11.3. Frontend Phase 3 (Complete)

Backend SHOULD menyediakan (optional enhancements):
- 🟡 `POST /api/assets/bulk-update-condition`, `/bulk-mutate`
- 🟡 `POST/DELETE /api/users/me/favorites` (atau pakai localStorage di frontend)
- 🟡 `GET/POST/DELETE /api/users/me/presets` (atau pakai localStorage di frontend)

---

## 12. Best Practices Implementation Checklist

Berdasarkan `Best_Practices.md`:

### ✅ Must Implement:
- [x] **Defensive Coding:**
  - Validasi semua input di boundary (controller) dengan Zod
  - Null/undefined checks sebelum use
  - TypeScript strict mode

- [x] **Error Handling:**
  - Global error handler middleware
  - Bedakan expected vs unexpected errors
  - Custom error classes (ValidationError, NotFoundError, etc.)

- [x] **Logging:**
  - Winston dengan structured JSON logs
  - Level DEBUG, INFO, WARN, ERROR
  - Context-rich logs (userId, requestId, timestamp)

- [x] **Environment Variables:**
  - All config dari .env
  - Single source of truth di `shared/config/`
  - Never hardcode credentials

- [x] **Separation of Concerns:**
  - Repository pattern untuk data access
  - Domain layer pure business logic
  - Clear layering: domain → application → infrastructure → presentation

### 🟡 Should Implement (Phase 2):
- [ ] API documentation (Swagger)
- [ ] Unit tests untuk business logic
- [ ] Integration tests untuk API endpoints

### ⏸️ Future Enhancement:
- [ ] Distributed tracing (Sentry)
- [ ] Advanced monitoring (Prometheus + Grafana)
- [ ] Comprehensive test coverage (>80%)

---

## 13. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Database performance degradation** saat data banyak | High | Server-side pagination, proper indexes, query optimization |
| **Report generation timeout** untuk laporan besar | Medium | Background jobs (BullMQ), streaming response, atau batch generation |
| **File storage penuh** (jika local storage) | Medium | Implement file size limits, periodic cleanup, atau migrate ke cloud storage early |
| **Concurrent mutations** causing race conditions | Medium | Database transactions, optimistic locking dengan `version` field |
| **Background job failures** (penyusutan) | High | Retry mechanism di BullMQ, idempotency checks, error logging |
| **Security vulnerabilities** (SQL injection, XSS) | High | Use ORM (Prisma), validate file MIME types, sanitize inputs |

---

## 14. Success Criteria

Backend dianggap **sukses** jika:

### Fungsional:
- ✅ Semua 10 Use Cases terimplementasi dengan benar
- ✅ Frontend Phase 1 dapat beroperasi 100% (login, CRUD aset, kategori, loans)
- ✅ Frontend Phase 2 dapat beroperasi minimal 80% (inventory, dashboard stats waiting backend)
- ✅ Validasi input mencegah data corrupt di database
- ✅ Business rules enforced (mutasi saat dipinjam = error, kode_aset unique, dll)

### Non-Fungsional:
- ✅ Response time < 500ms untuk 95% requests
- ✅ Tidak ada unhandled exceptions crash server
- ✅ Logs terstruktur memudahkan debugging
- ✅ API dapat di-deploy ke staging/production tanpa perubahan code (hanya env vars)

### Code Quality:
- ✅ TypeScript strict, no `any` types
- ✅ Folder structure konsisten sesuai design
- ✅ Komentar Bahasa Indonesia di business logic kompleks
- ✅ Mudah di-maintain oleh developer lain (clear separation of concerns)

---

## 15. Development Workflow

### Phase-Based Implementation:

**Phase 1 Backend (Week 1-2): Core API untuk Frontend Phase 1**
- Setup project, folder structure, database
- Auth (login, JWT)
- Kategori CRUD
- Aset CRUD (basic, tanpa QR generation dulu)
- Mutations
- Loans CRUD

**Phase 2 Backend (Week 3-4): Advanced Features**
- QR code generation
- File upload (R2 integration)
- Inventory API
- Dashboard stats API
- Background jobs setup (BullMQ + Redis)
- Penyusutan scheduler
- Laporan KIB generation

**Phase 3 Backend (Week 5-6): Enhancements & Polish**
- Audit Trail viewer
- Bulk actions
- Optional: Favorites API, Presets API
- Performance optimization
- Testing & bug fixes

---

## 16. Dependencies & Prerequisites

### Required Tools:
- Node.js 18 LTS atau 20 LTS
- PostgreSQL 14+ (atau MySQL 8.0+)
- Redis 6+ (untuk BullMQ)
- Cloudflare R2 account (atau AWS S3 alternative)

### Required NPM Packages:
```json
{
  "dependencies": {
    "fastify": "^4.x",
    "@fastify/cors": "^8.x",
    "@fastify/jwt": "^7.x",
    "@fastify/multipart": "^8.x",
    "@prisma/client": "^5.x",
    "bullmq": "^4.x",
    "ioredis": "^5.x",
    "zod": "^3.x",
    "argon2": "^0.31.x",
    "winston": "^3.x",
    "qrcode": "^1.x",
    "exceljs": "^4.x",
    "pdfkit": "^0.14.x",
    "@aws-sdk/client-s3": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "prisma": "^5.x",
    "@types/node": "^20.x",
    "tsx": "^4.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

---

## 17. Referensi Final

### Dokumen yang Harus Dibaca Ulang saat Implementasi:
1. `research-docs/database_schema.md` – Untuk Prisma schema
2. `research-docs/algorithm_datastructure.md` – Untuk business logic algorithms
3. `research-docs/ubiquitous_language_dictionary.md` – Untuk consistent naming
4. `.kiro/specs/simanis-sistem-manajemen-aset/Best_Practices.md` – Untuk coding standards

### External Resources:
- Fastify Documentation: https://fastify.dev
- Prisma Documentation: https://www.prisma.io/docs
- BullMQ Documentation: https://docs.bullmq.io
- Zod Documentation: https://zod.dev

---

**Status:** Requirements Backend – Comprehensive & Ready for Design Phase  
**Next Step:** Tunggu konfirmasi untuk lanjut ke `design_backend.md`  
**Penulis:** Backend Developer (dengan bantuan AI analysis)  
**Tanggal:** 2025-01-22
