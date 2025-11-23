# Implementation Tasks: SIMANIS Backend – Step-by-Step Task List

Dokumen ini menurunkan `requirements_backend.md` dan `design_backend.md` menjadi task list yang terukur dan dapat dieksekusi bertahap.

**Repository Target:** `d:\simanis\simanis\backend\`

**Prinsip Implementasi:**
- Bertahap per phase (Phase 1 → Phase 2 → Phase 3)
- Setiap task kecil dan measurable
- Commit bertahap ke repository
- Testing manual setiap fitur selesai

---

## Progress Overview

| Phase | Focus | Status | Progress |
|-------|-------|--------|----------|
| **Setup** | Project initialization | ✅ Complete | 10/10 |
| **Phase 1** | Core API (support Frontend Phase 1) | 🔄 In Progress | 16/25 |
| **Phase 2** | Advanced Features | ⏳ Pending | 0/20 |
| **Phase 3** | Enhancements & Polish | ⏳ Pending | 0/12 |

**Total: 26/67 tasks (39%)**

---

## Setup Phase (Week 0: Project Initialization)

### 1) Environment & Dependencies

- [x] 1.1 Initialize Node.js project
  - [x] `cd backend && npm init -y`
  - [x] Setup `package.json` dengan name, version, description
  - [x] Add `"type": "module"` untuk ES modules (optional, atau pakai CommonJS)









- [x] 1.2 Install core dependencies
  ```bash
  npm install fastify @fastify/cors @fastify/jwt @fastify/multipart
  npm install @prisma/client bullmq ioredis
  npm install zod argon2 winston
  npm install qrcode exceljs pdfkit
  npm install @aws-sdk/client-s3
  ```

- [x] 1.3 Install dev dependencies
  ```bash
  npm install -D typescript @types/node tsx
  npm install -D prisma
  npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  npm install -D prettier
  npm install -D vitest @vitest/ui (future testing)
  ```

- [x] 1.4 Setup TypeScript
  - [x] Create `tsconfig.json`
    ```json
    {
      "compilerOptions": {
        "target": "ES2022",
        "module": "commonjs",
        "rootDir": "./src",
        "outDir": "./dist",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "dist"]
    }
    ```

- [x] 1.5 Setup ESLint & Prettier
  - [x] Create `.eslintrc.js`
  - [x] Create `.prettierrc`
  - [x] Add scripts ke `package.json`

- [x] 1.6 Create folder structure
  ```bash
  mkdir -p src/{domain,application,infrastructure,presentation,shared}
  mkdir -p src/domain/{entities,value-objects,repositories}
  mkdir -p src/application/{use-cases,dto,validators}
  mkdir -p src/infrastructure/{database,storage,queue,crypto}
  mkdir -p src/presentation/{controllers,middleware,routes}
  mkdir -p src/shared/{config,logger,errors,utils}
  mkdir -p prisma
  mkdir -p tests/{unit,integration}
  mkdir -p logs
  ```

- [x] 1.7 Environment variables
  - [x] Create `.env.example`
  - [x] Create `.env` (gitignored)
  - [x] Implement `src/shared/config/index.ts` dengan Zod validation

- [x] 1.8 Setup Docker Compose
  - [x] SKIPPED (using Laragon MySQL instead)
  - [x] Database: simanis_dev created in Laragon

- [x] 1.9 Setup Git
  - [x] Create `.gitignore`
  - [x] Initial commit: "chore(backend): initial backend setup with Prisma and config"

- [x] 1.10 Create README.md
  - [x] Installation instructions
  - [x] Development setup
  - [x] Environment variables documentation

---

## Phase 1 Backend: Core API (Week 1-2)

**Tujuan:** Mendukung Frontend Phase 1 (Auth, Categories, Assets, Mutations, Loans)

### 2) Database Setup

- [x] 2.1 Create Prisma schema
  - [x] Copy complete schema dari `design_backend.md` ke `prisma/schema.prisma`
  - [x] Sesuaikan `datasource db` (MySQL)

- [x] 2.2 Run first migration
  - [x] `npx prisma migrate dev --name init`
  - [x] Verify migration berhasil

- [x] 2.3 Generate Prisma Client
  - [x] `npx prisma generate`

- [x] 2.4 Create seed file
  - [x] `prisma/seed.ts`
  - [x] Seed roles: Kepsek, Wakasek Sarpras, Bendahara BOS, Operator, Guru
  - [x] Seed test users (1 per role)
  - [x] Seed sample categories (Elektronik, Furniture, dll)
  - [x] Run: `npx prisma db seed`

### 3) Shared Layer (Foundation)

- [x] 3.1 Config loader
  - [x] Implement `src/shared/config/index.ts`
  - [x] Validate env vars dengan Zod
  - [x] Export config object

- [x] 3.2 Logger setup
  - [x] Implement `src/shared/logger/winston.logger.ts`
  - [x] Configure Winston (JSON format, file + console transports)
  - [x] Test logging di berbagai level

- [x] 3.3 Custom error classes
  - [x] `src/shared/errors/app-error.ts` (base)
  - [x] `src/shared/errors/validation-error.ts`
  - [x] `src/shared/errors/not-found-error.ts`
  - [x] `src/shared/errors/unauthorized-error.ts`
  - [x] `src/shared/errors/forbidden-error.ts`
  - [x] `src/shared/errors/conflict-error.ts`

- [x] 3.4 Utility functions
  - [x] `src/shared/utils/qr-code.utils.ts` (generate QR code string)
  - [x] `src/shared/utils/pagination.utils.ts` (pagination helpers)
  - [x] `src/shared/utils/response.utils.ts` (standard response format)

### 4) Infrastructure Layer - Core Services

- [x] 4.1 Crypto services
  - [x] `src/infrastructure/crypto/password.service.ts`
    - Implement hash (Argon2)
    - Implement verify
  - [x] `src/infrastructure/crypto/jwt.service.ts`
    - Implement sign
    - Implement verify

- [x] 4.2 Database repositories (implementations)
  - [x] `src/infrastructure/database/repositories/user.repository.impl.ts`
  - [x] `src/infrastructure/database/repositories/category.repository.impl.ts`
  - [x] `src/infrastructure/database/repositories/asset.repository.impl.ts`
  - [x] `src/infrastructure/database/repositories/loan.repository.impl.ts`
  - [x] `src/infrastructure/database/repositories/audit.repository.impl.ts`

### 5) Domain Layer

- [x] 5.1 Repository interfaces
  - [x] `src/domain/repositories/user.repository.ts`
  - [x] `src/domain/repositories/category.repository.ts`
  - [x] `src/domain/repositories/asset.repository.ts`
  - [x] `src/domain/repositories/loan.repository.ts`
  - [x] `src/domain/repositories/audit.repository.ts`

- [ ] 5.2 Entities (optional, bisa langsung pakai Prisma types)
  - [ ] `src/domain/entities/user.entity.ts`
  - [ ] `src/domain/entities/asset.entity.ts`
  - [ ] Atau: Use Prisma-generated types directly

- [ ] 5.3 Value Objects (optional, untuk validasi domain)
  - [ ] `src/domain/value-objects/kondisi.vo.ts`
  - [ ] `src/domain/value-objects/sumber-dana.vo.ts`

### 6) Application Layer - Validators

- [x] 6.1 Zod schemas
  - [x] `src/application/validators/auth.validators.ts`
    - loginSchema
  - [x] `src/application/validators/asset.validators.ts`
    - createAssetSchema
    - updateAssetSchema
  - [x] `src/application/validators/category.validators.ts`
    - createCategorySchema
    - updateCategorySchema
  - [x] `src/application/validators/loan.validators.ts`
    - createLoanSchema
    - returnLoanSchema
  - [x] `src/application/validators/mutation.validators.ts`
    - createMutationSchema
  - [x] `src/application/validators/common.validators.ts`
    - paginationSchema

### 7) Application Layer - DTOs

- [x] 7.1 DTO types
  - [x] `src/application/dto/auth.dto.ts`
  - [x] `src/application/dto/asset.dto.ts`
  - [x] `src/application/dto/category.dto.ts`
  - [x] `src/application/dto/loan.dto.ts`
  - [x] `src/application/dto/mutation.dto.ts`
  - [x] `src/application/dto/pagination.dto.ts`

### 8) Application Layer - Use Cases (Phase 1)

- [x] 8.1 Auth use cases
  - [x] `src/application/use-cases/auth/login.use-case.ts`
  - [x] `src/application/use-cases/auth/get-current-user.use-case.ts`

- [x] 8.2 Category use cases
  - [x] `src/application/use-cases/categories/get-categories.use-case.ts`
  - [x] `src/application/use-cases/categories/create-category.use-case.ts`
  - [ ] `src/application/use-cases/categories/update-category.use-case.ts`
  - [ ] `src/application/use-cases/categories/delete-category.use-case.ts`

- [/] 8.3 Asset use cases
  - [x] `src/application/use-cases/assets/get-assets.use-case.ts` (with pagination)
  - [ ] `src/application/use-cases/assets/get-asset-by-id.use-case.ts`
  - [x] `src/application/use-cases/assets/create-asset.use-case.ts`
  - [ ] `src/application/use-cases/assets/update-asset.use-case.ts`
  - [ ] `src/application/use-cases/assets/delete-asset.use-case.ts` (soft delete)

- [ ] 8.4 Mutation use cases
  - [ ] `src/application/use-cases/mutations/create-mutation.use-case.ts`
  - [ ] `src/application/use-cases/mutations/get-mutations.use-case.ts`

- [/] 8.5 Loan use cases
  - [ ] `src/application/use-cases/loans/get-loans.use-case.ts`
  - [ ] `src/application/use-cases/loans/get-loan-by-id.use-case.ts`
  - [x] `src/application/use-cases/loans/create-loan.use-case.ts`
  - [x] `src/application/use-cases/loans/return-loan.use-case.ts`

### 9) Presentation Layer - Middleware

- [ ] 9.1 Core middleware
  - [ ] `src/presentation/middleware/auth.middleware.ts`
  - [ ] `src/presentation/middleware/rbac.middleware.ts`
  - [ ] `src/presentation/middleware/error-handler.middleware.ts`
  - [ ] `src/presentation/middleware/logger.middleware.ts`

### 10) Presentation Layer - Controllers (Phase 1)

- [ ] 10.1 Auth controller
  - [ ] `src/presentation/controllers/auth.controller.ts`
    - POST /api/auth/login
    - GET /api/auth/me

- [ ] 10.2 Category controller
  - [ ] `src/presentation/controllers/category.controller.ts`
    - GET /api/categories
    - POST /api/categories
    - PUT /api/categories/:id
    - DELETE /api/categories/:id

- [ ] 10.3 Asset controller
  - [ ] `src/presentation/controllers/asset.controller.ts`
    - GET /api/assets
    - GET /api/assets/:id
    - POST /api/assets
    - PUT /api/assets/:id
    - DELETE /api/assets/:id

- [ ] 10.4 Mutation controller
  - [ ] `src/presentation/controllers/mutation.controller.ts`
    - POST /api/assets/:id/mutations
    - GET /api/assets/:id/mutations

- [ ] 10.5 Loan controller
  - [ ] `src/presentation/controllers/loan.controller.ts`
    - GET /api/loans
    - GET /api/loans/:id
    - POST /api/loans
    - PATCH /api/loans/:id/return

### 11) Presentation Layer - Routes (Phase 1)

- [ ] 11.1 Individual routes
  - [ ] `src/presentation/routes/auth.routes.ts`
  - [ ] `src/presentation/routes/category.routes.ts`
  - [ ] `src/presentation/routes/asset.routes.ts`
  - [ ] `src/presentation/routes/mutation.routes.ts`
  - [ ] `src/presentation/routes/loan.routes.ts`

- [ ] 11.2 Route aggregator
  - [ ] `src/presentation/routes/index.ts`
  - [ ] Register semua routes dengan prefix

### 12) Main Application Entry

- [ ] 12.1 Create main.ts
  - [ ] `src/main.ts`
  - [ ] Initialize Fastify
  - [ ] Register plugins (CORS, multipart)
  - [ ] Register middleware
  - [ ] Register routes
  - [ ] Setup error handler
  - [ ] Start server

- [ ] 12.2 Add npm scripts
  ```json
  {
    "scripts": {
      "dev": "tsx watch src/main.ts",
      "build": "tsc",
      "start": "node dist/main.js",
      "prisma:generate": "prisma generate",
      "prisma:migrate": "prisma migrate dev",
      "prisma:seed": "tsx prisma/seed.ts",
      "prisma:studio": "prisma studio"
    }
  }
  ```

### 13) Phase 1 Testing & Verification

- [ ] 13.1 Manual testing - Auth
  - [ ] Test POST /api/auth/login dengan valid credentials
  - [ ] Test POST /api/auth/login dengan invalid credentials
  - [ ] Test GET /api/auth/me dengan valid token
  - [ ] Test GET /api/auth/me dengan invalid/missing token

- [ ] 13.2 Manual testing - Categories
  - [ ] Test GET /api/categories
  - [ ] Test POST /api/categories (create)
  - [ ] Test PUT /api/categories/:id (update)
  - [ ] Test DELETE /api/categories/:id

- [ ] 13.3 Manual testing - Assets
  - [ ] Test POST /api/assets (create dengan QR generation)
  - [ ] Test GET /api/assets (list dengan pagination)
  - [ ] Test GET /api/assets/:id
  - [ ] Test PUT /api/assets/:id
  - [ ] Test duplicate kode_aset (should return 409)
  - [ ] Verify audit log created

- [ ] 13.4 Manual testing - Mutations
  - [ ] Test POST /api/assets/:id/mutations
  - [ ] Test GET /api/assets/:id/mutations (history)
  - [ ] Test mutasi saat asset dipinjam (should return 400)

- [ ] 13.5 Manual testing - Loans
  - [ ] Test POST /api/loans (create)
  - [ ] Test GET /api/loans (list)
  - [ ] Test PATCH /api/loans/:id/return
  - [ ] Verify status calculation (Dikembalikan, Rusak, Terlambat)

- [ ] 13.6 Integration testing dengan Frontend Phase 1
  - [ ] Frontend dapat login dan get current user
  - [ ] Frontend dapat CRUD categories
  - [ ] Frontend dapat CRUD assets
  - [ ] Frontend dapat create mutations
  - [ ] Frontend dapat create & return loans

- [ ] 13.7 Commit Phase 1
  - [ ] Commit: "feat(phase-1): implement core API endpoints"
  - [ ] Push ke repository

---

## Phase 2 Backend: Advanced Features (Week 3-4)

**Tujuan:** Mendukung Frontend Phase 2 (Inventory, Dashboard, Depreciation, Reports, Audit Trail)

### 14) File Upload Implementation

- [ ] 14.1 Storage service
  - [ ] Create `src/infrastructure/storage/storage.interface.ts`
  - [ ] Implement `src/infrastructure/storage/r2-storage.service.ts`
  - [ ] Implement `src/infrastructure/storage/local-storage.service.ts` (dev fallback)

- [ ] 14.2 Upload controller
  - [ ] `src/presentation/controllers/upload.controller.ts`
    - POST /api/upload/asset-photo
    - POST /api/upload/inventory-photo
    - POST /api/upload/document (BA)

- [ ] 14.3 Upload routes
  - [ ] `src/presentation/routes/upload.routes.ts`
  - [ ] Validation: file type, size

- [ ] 14.4 Testing
  - [ ] Test upload image (< 5MB)
  - [ ] Test upload rejection (> 5MB)
  - [ ] Test upload rejection (invalid MIME type)
  - [ ] Verify file accessible via returned URL

### 15) Inventory Implementation

- [ ] 15.1 Repository
  - [ ] `src/infrastructure/database/repositories/inventory.repository.impl.ts`

- [ ] 15.2 Validators & DTOs
  - [ ] `src/application/validators/inventory.validators.ts`
  - [ ] `src/application/dto/inventory.dto.ts`

- [ ] 15.3 Use cases
  - [ ] `src/application/use-cases/inventory/create-inventory.use-case.ts`
  - [ ] `src/application/use-cases/inventory/get-inventory.use-case.ts`

- [ ] 15.4 Controller & routes
  - [ ] `src/presentation/controllers/inventory.controller.ts`
  - [ ] `src/presentation/routes/inventory.routes.ts`
    - POST /api/inventory
    - GET /api/inventory (with filters: from, to, page, pageSize)

- [ ] 15.5 Testing
  - [ ] Test create inventory dengan QR code valid
  - [ ] Test create inventory dengan QR code invalid
  - [ ] Test get inventory dengan filters

### 16) Dashboard APIs

- [ ] 16.1 Use cases
  - [ ] `src/application/use-cases/dashboard/get-stats.use-case.ts`
    - Total assets
    - Assets by category
    - Assets by condition
    - Active loans
  - [ ] `src/application/use-cases/dashboard/get-activities.use-case.ts`
    - Recent activities (from audit logs + loans)

- [ ] 16.2 Controller & routes
  - [ ] `src/presentation/controllers/dashboard.controller.ts`
  - [ ] `src/presentation/routes/dashboard.routes.ts`
    - GET /api/dashboard/stats
    - GET /api/dashboard/activities?limit=10

- [ ] 16.3 Testing
  - [ ] Test GET /api/dashboard/stats
  - [ ] Test GET /api/dashboard/activities
  - [ ] Verify response structure

### 17) Background Jobs Setup

- [ ] 17.1 Queue service
  - [ ] `src/infrastructure/queue/queue.service.ts`
  - [ ] Initialize BullMQ dengan Redis connection

- [ ] 17.2 Depreciation job
  - [ ] `src/infrastructure/queue/jobs/depreciation.job.ts`
  - [ ] Implement worker
  - [ ] Implement scheduler (cron: 0 0 1 * *)
  - [ ] Add idempotency check (UNIQUE constraint)

- [ ] 17.3 Integrate ke main.ts
  - [ ] Start depreciation worker
  - [ ] Setup scheduled job

- [ ] 17.4 Manual trigger endpoint (testing)
  - [ ] POST /api/depreciations/calculate (admin only)

### 18) Depreciation View

- [ ] 18.1 Repository
  - [ ] `src/infrastructure/database/repositories/depreciation.repository.impl.ts`

- [ ] 18.2 Use cases
  - [ ] `src/application/use-cases/depreciation/get-depreciations.use-case.ts`
    - With filters: assetId, month, year, page, pageSize

- [ ] 18.3 Controller & routes
  - [ ] `src/presentation/controllers/depreciation.controller.ts`
  - [ ] `src/presentation/routes/depreciation.routes.ts`
    - GET /api/depreciations

- [ ] 18.4 Testing
  - [ ] Run depreciation job manually
  - [ ] Verify entries created di database
  - [ ] Test GET /api/depreciations dengan filters
  - [ ] Test pagination

### 19) Report Generation (KIB)

- [ ] 19.1 KIB report job
  - [ ] `src/infrastructure/queue/jobs/kib-report.job.ts`
  - [ ] Generate Excel dengan `exceljs`
  - [ ] Generate PDF dengan `pdfkit` (optional)
  - [ ] Upload report file ke R2
  - [ ] Return download URL

- [ ] 19.2 Use cases
  - [ ] `src/application/use-cases/reports/generate-kib.use-case.ts`
  - [ ] `src/application/use-cases/reports/get-report-status.use-case.ts`

- [ ] 19.3 Controller & routes
  - [ ] `src/presentation/controllers/report.controller.ts`
  - [ ] `src/presentation/routes/report.routes.ts`
    - POST /api/reports/kib (create job)
    - GET /api/reports/kib/:jobId/status
    - GET /api/reports/kib/:jobId/download

- [ ] 19.4 Testing
  - [ ] Test POST /api/reports/kib dengan filters
  - [ ] Test polling status
  - [ ] Test download Excel file
  - [ ] Verify Excel content correct

### 20) Audit Trail Viewer

- [ ] 20.1 Use cases
  - [ ] `src/application/use-cases/audit/get-audit-logs.use-case.ts`
    - Filters: entity_type, entity_id, user_id, from, to
    - Pagination

- [ ] 20.2 Controller & routes
  - [ ] `src/presentation/controllers/audit.controller.ts`
  - [ ] `src/presentation/routes/audit.routes.ts`
    - GET /api/audit-logs

- [ ] 20.3 Testing
  - [ ] Test GET /api/audit-logs tanpa filter
  - [ ] Test GET /api/audit-logs dengan filters
  - [ ] Test pagination
  - [ ] Verify field_changed JSON returned correctly

### 21) Phase 2 Integration Testing

- [ ] 21.1 Test dengan Frontend Phase 2
  - [ ] Frontend dapat upload foto aset
  - [ ] Frontend dapat create inventory check
  - [ ] Frontend dapat view dashboard stats
  - [ ] Frontend dapat view depreciation list
  - [ ] Frontend dapat generate & download KIB report
  - [ ] Frontend dapat view audit trail

- [ ] 21.2 Performance testing
  - [ ] Test pagination dengan dataset besar (1000+ records)
  - [ ] Test report generation dengan banyak aset
  - [ ] Monitor response times

- [ ] 21.3 Commit Phase 2
  - [ ] Commit: "feat(phase-2): implement advanced features"
  - [ ] Push ke repository

---

## Phase 3 Backend: Enhancements & Polish (Week 5-6)

**Tujuan:** Optimizations, bulk actions, optional features

### 22) Bulk Actions Endpoints

- [ ] 22.1 Use cases
  - [ ] `src/application/use-cases/assets/bulk-update-condition.use-case.ts`
  - [ ] `src/application/use-cases/assets/bulk-mutate.use-case.ts`

- [ ] 22.2 Add routes
  - [ ] POST /api/assets/bulk-update-condition
  - [ ] POST /api/assets/bulk-mutate

- [ ] 22.3 Testing
  - [ ] Test bulk update 10 assets
  - [ ] Test partial success (some fail)
  - [ ] Verify audit logs created untuk setiap success

### 23) User Favorites API (Optional)

- [ ] 23.1 Database migration
  - [ ] Add `user_favorites` table (user_id, asset_id)

- [ ] 23.2 Use cases
  - [ ] `src/application/use-cases/favorites/add-favorite.use-case.ts`
  - [ ] `src/application/use-cases/favorites/remove-favorite.use-case.ts`
  - [ ] `src/application/use-cases/favorites/get-favorites.use-case.ts`

- [ ] 23.3 Routes
  - [ ] POST /api/users/me/favorites/:assetId
  - [ ] DELETE /api/users/me/favorites/:assetId
  - [ ] GET /api/users/me/favorites

### 24) Report Presets API (Optional)

- [ ] 24.1 Database migration
  - [ ] Add `report_presets` table

- [ ] 24.2 Use cases
  - [ ] Create, Update, Delete, Get presets

- [ ] 24.3 Routes
  - [ ] CRUD /api/users/me/presets

### 25) Asset Deletion Workflow (Optional)

- [ ] 25.1 Use cases
  - [ ] `src/application/use-cases/assets/request-deletion.use-case.ts`
  - [ ] `src/application/use-cases/assets/approve-deletion.use-case.ts`

- [ ] 25.2 Routes
  - [ ] POST /api/assets/:id/request-deletion (upload BA)
  - [ ] PATCH /api/assets/:id/approve-deletion (Kepsek only)

### 26) Performance Optimization

- [ ] 26.1 Database indexes review
  - [ ] Verify indexes sesuai `database_schema.md`
  - [ ] Add missing indexes jika ada slow queries

- [ ] 26.2 Query optimization
  - [ ] Review N+1 query problems
  - [ ] Use Prisma `include` strategically

- [ ] 26.3 Caching (optional)
  - [ ] Cache categories list di Redis (ttl: 1 hour)
  - [ ] Cache dashboard stats (ttl: 5 minutes)

### 27) Security Hardening

- [ ] 27.1 Rate limiting
  - [ ] Add rate limit ke login endpoint (5 attempts per 15 min)
  - [ ] Install `@fastify/rate-limit`

- [ ] 27.2 Security headers
  - [ ] Install helmet.js equivalent untuk Fastify
  - [ ] Configure security headers

- [ ] 27.3 Input sanitization review
  - [ ] Review all Zod schemas
  - [ ] Ensure no XSS vectors

### 28) Error Handling Polish

- [ ] 28.1 Improve error messages
  - [ ] Ensure all errors dalam Bahasa Indonesia
  - [ ] Consistent error codes

- [ ] 28.2 Error logging enhancement
  - [ ] Add request ID ke semua logs
  - [ ] Add user context ke error logs

### 29) Documentation

- [ ] 29.1 API documentation
  - [ ] Setup Swagger/OpenAPI (optional tapi recommended)
  - [ ] Document all endpoints

- [ ] 29.2 Code comments
  - [ ] Add Bahasa Indonesia comments di business logic kompleks
  - [ ] JSDoc untuk public methods

- [ ] 29.3 Update README
  - [ ] Complete setup instructions
  - [ ] API endpoint list
  - [ ] Environment variables documentation

### 30) Testing & Quality

- [ ] 30.1 Unit tests (optional tapi recommended)
  - [ ] Test critical use cases (CreateAsset, CreateLoan, dll)
  - [ ] Setup Vitest
  - [ ] Aim for >60% coverage on use cases

- [ ] 30.2 Integration tests (optional)
  - [ ] Test API endpoints end-to-end
  - [ ] Use test database

- [ ] 30.3 Code review checklist
  - [ ] No `any` types
  - [ ] All errors properly handled
  - [ ] All business rules implemented
  - [ ] RBAC enforced di backend

### 31) Deployment Preparation

- [ ] 31.1 Production build
  - [ ] Test `npm run build`
  - [ ] Test running `npm start` dari dist/

- [ ] 31.2 Environment checklist
  - [ ] Create production `.env.example`
  - [ ] Document required env vars

- [ ] 31.3 Database migration strategy
  - [ ] Document migration commands untuk production
  - [ ] Test rollback migrations

### 32) Final Integration Testing

- [ ] 32.1 End-to-end testing
  - [ ] Test semua user journeys dengan Frontend
  - [ ] Test RBAC permissions

- [ ] 32.2 Performance testing
  - [ ] Load test critical endpoints
  - [ ] Monitor memory usage

- [ ] 32.3 Security testing
  - [ ] Test authentication bypass attempts
  - [ ] Test unauthorized access attempts
  - [ ] Test SQL injection vectors (should be blocked by Prisma)

### 33) Final Commit & Documentation

- [ ] 33.1 Commit Phase 3
  - [ ] Commit: "feat(phase-3): enhancements and polish"

- [ ] 33.2 Create CHANGELOG.md
  - [ ] Document all implemented features
  - [ ] Version 1.0.0

- [ ] 33.3 Final README update
  - [ ] Complete feature list
  - [ ] Deployment guide

---

## Maintenance & Future Enhancements

### Post-Launch Tasks (Future)

- [ ] Monitoring setup
  - [ ] Setup log aggregation (optional)
  - [ ] Setup error tracking (Sentry optional)

- [ ] Backup strategy
  - [ ] PostgreSQL automated backups
  - [ ] R2 file backups

- [ ] Performance monitoring
  - [ ] Track slow queries
  - [ ] Monitor API response times

- [ ] Feature enhancements
  - [ ] Real-time notifications (WebSockets) jika diperlukan
  - [ ] Export to other formats (CSV, dll)
  - [ ] Advanced reporting features

---

## Development Workflow Best Practices

### Branching Strategy

```bash
# Feature development
git checkout -b feat/auth-implementation
# ... work ...
git commit -m "feat(auth): implement login use case"
git push origin feat/auth-implementation

# After review/testing
git checkout main
git merge feat/auth-implementation
```

### Commit Message Convention

```
feat(scope): description       # New feature
fix(scope): description        # Bug fix
chore(scope): description      # Maintenance
docs(scope): description       # Documentation
refactor(scope): description   # Code refactoring
test(scope): description       # Tests
```

### Testing Checklist per Feature

Setiap fitur selesai:
1. ✅ Manual testing endpoint via Postman/Thunder Client
2. ✅ Verify database changes correct
3. ✅ Check logs untuk errors
4. ✅ Test with Frontend jika applicable
5. ✅ Commit dengan descriptive message

---

## Timeline Summary

| Week | Phase | Focus | Deliverables |
|------|-------|-------|--------------|
| Week 0 | Setup | Project init | Project structure, Database setup |
| Week 1 | Phase 1A | Auth + Categories | Login, Categories CRUD |
| Week 2 | Phase 1B | Assets + Loans | Assets CRUD, Mutations, Loans CRUD |
| Week 3 | Phase 2A | Upload + Inventory | File upload, Inventory, Dashboard |
| Week 4 | Phase 2B | Jobs + Reports | Depreciation, KIB, Audit Trail |
| Week 5 | Phase 3A | Bulk + Optional | Bulk actions, Favorites, Presets |
| Week 6 | Phase 3B | Polish | Optimization, Testing, Documentation |

**Total Estimated Time:** 6-7 weeks untuk backend lengkap

---

## Success Criteria

Backend dianggap **SELESAI** jika:

### Fungsional
- [x] Semua 10 Use Cases terimplementasi
- [x] Frontend Phase 1 dapat beroperasi 100%
- [x] Frontend Phase 2 dapat beroperasi 90%+ (inventory, dashboard, reports)
- [x] Frontend Phase 3 dapat menggunakan bulk actions
- [x] RBAC enforced di backend untuk semua endpoints

### Non-Fungsional
- [x] Response time < 500ms untuk 95% requests
- [x] Tidak ada unhandled exceptions
- [x] Logs terstruktur dan informatif
- [x] Environment-based configuration

### Code Quality
- [x] TypeScript strict mode, no `any`
- [x] Folder structure konsisten
- [x] Komentar Bahasa Indonesia di business logic
- [x] README lengkap

---

**Status:** Task List Backend – Ready for Implementation  
**Repository:** `d:\simanis\simanis\backend\`  
**Start Date:** TBD  
**Estimated Completion:** 6-7 weeks
