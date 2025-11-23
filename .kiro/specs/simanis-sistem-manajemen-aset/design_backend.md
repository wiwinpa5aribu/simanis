# Design: SIMANIS Backend – Technical Design & Architecture

Dokumen ini menurunkan `requirements_backend.md` menjadi desain teknis yang siap diimplementasikan.

---

## 1. Architecture Overview

### 1.1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React PWA)                      │
│              http://localhost:5173 (dev)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ Authorization: Bearer <JWT>
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API Server                         │
│                (Fastify + TypeScript)                        │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐          │
│  │Presentation│→ │Application │→ │ Domain      │          │
│  │(REST API)  │  │(Use Cases) │  │(Entities)   │          │
│  └────────────┘  └────────────┘  └─────────────┘          │
│         │               │                │                  │
│         ▼               ▼                ▼                  │
│  ┌───────────────────────────────────────────────┐         │
│  │         Infrastructure Layer                   │         │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐      │         │
│  │  │PostgreSQL│ │  Redis   │ │   R2     │      │         │
│  │  │(Prisma)  │ │ (BullMQ) │ │(Storage) │      │         │
│  │  └──────────┘ └──────────┘ └──────────┘      │         │
│  └───────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 1.2. Layered Architecture

**Layer 1: Presentation (API Layer)**
- Controllers: Handle HTTP requests/responses
- Routes: Define API endpoints
- Middleware: Auth, CORS, error handling, logging

**Layer 2: Application (Business Orchestration)**
- Use Cases: Implement business workflows
- DTOs: Data transfer objects
- Validators: Zod schemas

**Layer 3: Domain (Core Business Logic)**
- Entities: Domain models (Asset, Loan, User, dll)
- Value Objects: Immutable domain values
- Repository Interfaces: Contracts untuk data access

**Layer 4: Infrastructure (Technical Implementation)**
- Database: Prisma repositories
- Storage: R2/S3 client
- Queue: BullMQ jobs
- External APIs: Future integrations

**Shared Layer (Cross-cutting)**
- Config: Environment variables
- Logger: Winston
- Errors: Custom error classes
- Utils: Helper functions

---

## 2. Project Structure (Detail)

```
backend/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── asset.entity.ts
│   │   │   ├── category.entity.ts
│   │   │   ├── loan.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   ├── mutation.entity.ts
│   │   │   ├── inventory.entity.ts
│   │   │   └── depreciation.entity.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── kode-aset.vo.ts
│   │   │   ├── kondisi.vo.ts
│   │   │   ├── sumber-dana.vo.ts
│   │   │   └── loan-status.vo.ts
│   │   │
│   │   └── repositories/           # Interfaces only
│   │       ├── asset.repository.ts
│   │       ├── category.repository.ts
│   │       ├── loan.repository.ts
│   │       ├── user.repository.ts
│   │       └── audit.repository.ts
│   │
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── assets/
│   │   │   │   ├── create-asset.use-case.ts
│   │   │   │   ├── get-assets.use-case.ts
│   │   │   │   ├── get-asset-by-id.use-case.ts
│   │   │   │   ├── update-asset.use-case.ts
│   │   │   │   └── delete-asset.use-case.ts
│   │   │   │
│   │   │   ├── mutations/
│   │   │   │   ├── create-mutation.use-case.ts
│   │   │   │   └── get-mutations.use-case.ts
│   │   │   │
│   │   │   ├── loans/
│   │   │   │   ├── create-loan.use-case.ts
│   │   │   │   ├── return-loan.use-case.ts
│   │   │   │   └── get-loans.use-case.ts
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── create-inventory.use-case.ts
│   │   │   │   └── get-inventory.use-case.ts
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── login.use-case.ts
│   │   │   │   └── get-current-user.use-case.ts
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── get-stats.use-case.ts
│   │   │       └── get-activities.use-case.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── asset.dto.ts
│   │   │   ├── loan.dto.ts
│   │   │   ├── mutation.dto.ts
│   │   │   ├── inventory.dto.ts
│   │   │   ├── auth.dto.ts
│   │   │   └── pagination.dto.ts
│   │   │
│   │   └── validators/
│   │       ├── asset.validators.ts
│   │       ├── loan.validators.ts
│   │       ├── mutation.validators.ts
│   │       ├── inventory.validators.ts
│   │       ├── auth.validators.ts
│   │       └── common.validators.ts
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   ├── migrations/
│   │   │   │   └── seed.ts
│   │   │   │
│   │   │   └── repositories/      # Implementations
│   │   │       ├── asset.repository.impl.ts
│   │   │       ├── category.repository.impl.ts
│   │   │       ├── loan.repository.impl.ts
│   │   │       ├── user.repository.impl.ts
│   │   │       └── audit.repository.impl.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── storage.interface.ts
│   │   │   ├── r2-storage.service.ts
│   │   │   └── local-storage.service.ts    # For dev
│   │   │
│   │   ├── queue/
│   │   │   ├── queue.service.ts
│   │   │   └── jobs/
│   │   │       ├── depreciation.job.ts
│   │   │       └── kib-report.job.ts
│   │   │
│   │   └── crypto/
│   │       ├── password.service.ts         # Argon2
│   │       └── jwt.service.ts
│   │
│   ├── presentation/
│   │   ├── controllers/
│   │   │   ├── asset.controller.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── loan.controller.ts
│   │   │   ├── mutation.controller.ts
│   │   │   ├── inventory.controller.ts
│   │   │   ├── depreciation.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   ├── audit.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── upload.controller.ts
│   │   │   └── auth.controller.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   ├── error-handler.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   └── rate-limit.middleware.ts
│   │   │
│   │   └── routes/
│   │       ├── asset.routes.ts
│   │       ├── category.routes.ts
│   │       ├── loan.routes.ts
│   │       ├── mutation.routes.ts
│   │       ├── inventory.routes.ts
│   │       ├── depreciation.routes.ts
│   │       ├── report.routes.ts
│   │       ├── audit.routes.ts
│   │       ├── dashboard.routes.ts
│   │       ├── upload.routes.ts
│   │       ├── auth.routes.ts
│   │       └── index.ts                   # Route aggregator
│   │
│   ├── shared/
│   │   ├── config/
│   │   │   └── index.ts                   # Env vars loader
│   │   │
│   │   ├── logger/
│   │   │   └── winston.logger.ts
│   │   │
│   │   ├── errors/
│   │   │   ├── app-error.ts              # Base error
│   │   │   ├── validation-error.ts
│   │   │   ├── not-found-error.ts
│   │   │   ├── unauthorized-error.ts
│   │   │   ├── forbidden-error.ts
│   │   │   └── conflict-error.ts
│   │   │
│   │   └── utils/
│   │       ├── date.utils.ts
│   │       ├── qr-code.utils.ts
│   │       ├── pagination.utils.ts
│   │       └── response.utils.ts
│   │
│   └── main.ts                            # App entry point
│
├── prisma/
│   ├── schema.prisma                      # Main schema
│   ├── migrations/
│   └── seed.ts
│
├── tests/                                  # Future
│   ├── unit/
│   └── integration/
│
├── .env.example
├── .env                                    # Git ignored
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
├── docker-compose.yml                      # PostgreSQL + Redis
└── README.md
```

---

## 3. Database Design (Prisma Schema)

### 3.1. Prisma Schema (`prisma/schema.prisma`)

```prisma
// Prisma schema untuk SIMANIS
// Berdasarkan database_schema.md

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // atau "mysql"
  url      = env("DATABASE_URL")
}

// ============= USER & RBAC =============

model User {
  id         Int      @id @default(autoincrement())
  name       String   @db.VarChar(120)
  email      String?  @unique @db.VarChar(190)
  username   String   @unique @db.VarChar(64)
  password   String   @db.VarChar(255) // Argon2 hash
  createdAt  DateTime @default(now()) @map("created_at")
  
  // Relations
  roles              UserRole[]
  createdAssets      Asset[]            @relation("AssetCreator")
  requestedLoans     Loan[]             @relation("LoanRequester")
  inventoryChecks    InventoryCheck[]
  uploadedDocuments  AssetDocument[]
  deletedAssets      AssetDeletion[]
  auditLogs          AuditLog[]
  
  @@map("users")
}

model Role {
  id    Int    @id @default(autoincrement())
  name  String @unique @db.VarChar(64)
  
  users UserRole[]
  
  @@map("roles")
}

model UserRole {
  userId Int  @map("user_id")
  roleId Int  @map("role_id")
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  
  @@id([userId, roleId])
  @@map("user_roles")
}

// ============= ASSET MANAGEMENT =============

model AssetCategory {
  id          Int     @id @default(autoincrement())
  name        String  @unique @db.VarChar(64)
  description String? @db.Text
  
  assets Asset[]
  
  @@map("asset_categories")
}

model Building {
  id    Int    @id @default(autoincrement())
  name  String @unique @db.VarChar(80)
  
  floors Floor[]
  
  @@map("buildings")
}

model Floor {
  id          Int @id @default(autoincrement())
  buildingId  Int @map("building_id")
  levelNumber Int @map("level_number")
  
  building Building @relation(fields: [buildingId], references: [id], onDelete: Cascade)
  rooms    Room[]
  
  @@unique([buildingId, levelNumber])
  @@map("floors")
}

model Room {
  id      Int     @id @default(autoincrement())
  floorId Int     @map("floor_id")
  name    String  @db.VarChar(80)
  code    String? @db.VarChar(32)
  
  floor              Floor            @relation(fields: [floorId], references: [id], onDelete: Cascade)
  mutationsTo        AssetMutation[]  @relation("MutationToRoom")
  mutationsFrom      AssetMutation[]  @relation("MutationFromRoom")
  
  @@unique([floorId, name])
  @@map("rooms")
}

model Asset {
  id                 Int       @id @default(autoincrement())
  kodeAset           String    @unique @map("kode_aset") @db.VarChar(50)
  namaBarang         String    @map("nama_barang") @db.VarChar(160)
  merk               String?   @db.VarChar(120)
  spesifikasi        String?   @db.Text
  tahunPerolehan     DateTime? @map("tahun_perolehan") @db.Date
  harga              Decimal   @db.Decimal(18, 2)
  sumberDana         String    @map("sumber_dana") @db.VarChar(16)
  kondisi            String    @db.VarChar(20)
  fotoUrl            String?   @map("foto_url") @db.Text
  qrCode             String    @unique @map("qr_code") @db.VarChar(128)
  tanggalPencatatan  DateTime  @default(now()) @map("tanggal_pencatatan")
  createdBy          Int?      @map("created_by")
  categoryId         Int?      @map("category_id")
  masaManfaatTahun   Int       @default(0) @map("masa_manfaat_tahun")
  isDeleted          Boolean   @default(false) @map("is_deleted")
  deletedAt          DateTime? @map("deleted_at")
  
  // OPTIONAL: Denormalisasi untuk performance
  currentRoomId      Int?      @map("current_room_id")
  
  creator            User?              @relation("AssetCreator", fields: [createdBy], references: [id], onDelete: SetNull)
  category           AssetCategory?     @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  mutations          AssetMutation[]
  loanItems          LoanItem[]
  inventoryChecks    InventoryCheck[]
  depreciationEntries DepreciationEntry[]
  documents          AssetDocument[]
  deletion           AssetDeletion?
  
  @@map("assets")
}

model AssetMutation {
  id         Int      @id @default(autoincrement())
  assetId    Int      @map("asset_id")
  fromRoomId Int?     @map("from_room_id")
  toRoomId   Int      @map("to_room_id")
  mutatedAt  DateTime @default(now()) @map("mutated_at")
  note       String?  @db.Text
  
  asset    Asset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  fromRoom Room? @relation("MutationFromRoom", fields: [fromRoomId], references: [id], onDelete: SetNull)
  toRoom   Room  @relation("MutationToRoom", fields: [toRoomId], references: [id], onDelete: Restrict)
  
  @@index([assetId, mutatedAt(sort: Desc)])
  @@map("asset_mutations")
}

// ============= LOANS =============

model Loan {
  id              Int       @id @default(autoincrement())
  requestedBy     Int       @map("requested_by")
  tanggalPinjam   DateTime  @map("tanggal_pinjam")
  tanggalKembali  DateTime? @map("tanggal_kembali")
  tujuanPinjam    String?   @map("tujuan_pinjam") @db.Text
  status          String    @db.VarChar(16)
  catatan         String?   @db.Text
  
  requester User       @relation("LoanRequester", fields: [requestedBy], references: [id], onDelete: SetNull)
  items     LoanItem[]
  
  @@index([status, tanggalPinjam])
  @@map("loans")
}

model LoanItem {
  loanId          Int     @map("loan_id")
  assetId         Int     @map("asset_id")
  conditionBefore String? @map("condition_before") @db.VarChar(20)
  conditionAfter  String? @map("condition_after") @db.VarChar(20)
  
  loan  Loan  @relation(fields: [loanId], references: [id], onDelete: Cascade)
  asset Asset @relation(fields: [assetId], references: [id], onDelete: Restrict)
  
  @@id([loanId, assetId])
  @@index([assetId])
  @@map("loan_items")
}

// ============= INVENTORY & DEPRECIATION =============

model InventoryCheck {
  id             Int      @id @default(autoincrement())
  assetId        Int      @map("asset_id")
  checkedBy      Int      @map("checked_by")
  checkedAt      DateTime @default(now()) @map("checked_at")
  photoUrl       String?  @map("photo_url") @db.Text
  qrCodeScanned  String?  @map("qr_code_scanned") @db.VarChar(128)
  note           String?  @db.Text
  
  asset   Asset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  checker User  @relation(fields: [checkedBy], references: [id], onDelete: SetNull)
  
  @@index([assetId, checkedAt(sort: Desc)])
  @@map("inventory_checks")
}

model DepreciationEntry {
  id                      Int      @id @default(autoincrement())
  assetId                 Int      @map("asset_id")
  tanggalHitung           DateTime @map("tanggal_hitung") @db.Date
  nilaiPenyusutan         Decimal  @map("nilai_penyusutan") @db.Decimal(18, 2)
  nilaiBuku               Decimal  @map("nilai_buku") @db.Decimal(18, 2)
  masaManfaatTahunSnapshot Int     @map("masa_manfaat_tahun_snapshot")
  
  asset Asset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  
  @@unique([assetId, tanggalHitung])
  @@index([assetId, tanggalHitung(sort: Desc)])
  @@map("depreciation_entries")
}

// ============= DOCUMENTS & DELETION =============

model AssetDocument {
  id         Int      @id @default(autoincrement())
  assetId    Int      @map("asset_id")
  docType    String   @map("doc_type") @db.VarChar(32)
  fileUrl    String   @map("file_url") @db.Text
  uploadedBy Int?     @map("uploaded_by")
  uploadedAt DateTime @default(now()) @map("uploaded_at")
  
  asset    Asset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  uploader User? @relation(fields: [uploadedBy], references: [id], onDelete: SetNull)
  
  @@index([assetId, docType])
  @@map("asset_documents")
}

model AssetDeletion {
  id           Int      @id @default(autoincrement())
  assetId      Int      @unique @map("asset_id")
  baDocumentId Int?     @map("ba_document_id")
  deletedBy    Int?     @map("deleted_by")
  deletedAt    DateTime @default(now()) @map("deleted_at")
  
  // OPTIONAL: Approval workflow fields
  approvalStatus String?   @map("approval_status") @db.VarChar(20) // PENDING, APPROVED, REJECTED
  approvedBy     Int?      @map("approved_by")
  approvedAt     DateTime? @map("approved_at")
  
  asset   Asset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  deleter User? @relation(fields: [deletedBy], references: [id], onDelete: SetNull)
  
  @@map("asset_deletions")
}

// ============= AUDIT TRAIL =============

model AuditLog {
  id           Int      @id @default(autoincrement())
  entityType   String   @map("entity_type") @db.VarChar(64)
  entityId     Int      @map("entity_id")
  userId       Int?     @map("user_id")
  action       String   @db.VarChar(16)
  timestamp    DateTime @default(now())
  fieldChanged Json     @map("field_changed")
  
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([entityType, entityId])
  @@map("audit_logs")
}
```

### 3.2. Database Migrations Strategy

```bash
# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database (roles, sample data)
npx prisma db seed
```

---

## 4. API Routing Design

### 4.1. Route Structure (`src/presentation/routes/index.ts`)

```typescript
// Aggregator untuk semua routes
import { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes';
import assetRoutes from './asset.routes';
import categoryRoutes from './category.routes';
import loanRoutes from './loan.routes';
import mutationRoutes from './mutation.routes';
import inventoryRoutes from './inventory.routes';
import depreciationRoutes from './depreciation.routes';
import reportRoutes from './report.routes';
import auditRoutes from './audit.routes';
import dashboardRoutes from './dashboard.routes';
import uploadRoutes from './upload.routes';

export default async function routes(app: FastifyInstance) {
  // Public routes (no auth)
  app.register(authRoutes, { prefix: '/api/auth' });
  
  // Protected routes
  app.register(assetRoutes, { prefix: '/api/assets' });
  app.register(categoryRoutes, { prefix: '/api/categories' });
  app.register(loanRoutes, { prefix: '/api/loans' });
  app.register(mutationRoutes, { prefix: '/api/mutations' });
  app.register(inventoryRoutes, { prefix: '/api/inventory' });
  app.register(depreciationRoutes, { prefix: '/api/depreciations' });
  app.register(reportRoutes, { prefix: '/api/reports' });
  app.register(auditRoutes, { prefix: '/api/audit-logs' });
  app.register(dashboardRoutes, { prefix: '/api/dashboard' });
  app.register(uploadRoutes, { prefix: '/api/upload' });
}
```

### 4.2. Example Route File (`asset.routes.ts`)

```typescript
import { FastifyInstance } from 'fastify';
import { AssetController } from '../controllers/asset.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

export default async function assetRoutes(app: FastifyInstance) {
  const controller = new AssetController();
  
  // Apply auth middleware to all routes
  app.addHook('onRequest', authMiddleware);
  
  // GET /api/assets - List assets dengan pagination & filter
  app.get('/', {
    preHandler: [rbacMiddleware(['Operator', 'Wakasek Sarpras', 'Bendahara BOS', 'Kepsek', 'Guru'])],
    handler: controller.getAssets.bind(controller)
  });
  
  // GET /api/assets/:id - Get asset by ID
  app.get('/:id', {
    preHandler: [rbacMiddleware(['Operator', 'Wakasek Sarpras', 'Bendahara BOS', 'Kepsek', 'Guru'])],
    handler: controller.getAssetById.bind(controller)
  });
  
  // POST /api/assets - Create asset
  app.post('/', {
    preHandler: [rbacMiddleware(['Operator', 'Wakasek Sarpras'])],
    handler: controller.createAsset.bind(controller)
  });
  
  // PUT /api/assets/:id - Update asset
  app.put('/:id', {
    preHandler: [rbacMiddleware(['Operator', 'Wakasek Sarpras'])],
    handler: controller.updateAsset.bind(controller)
  });
  
  // DELETE /api/assets/:id - Soft delete
  app.delete('/:id', {
    preHandler: [rbacMiddleware(['Wakasek Sarpras', 'Kepsek'])],
    handler: controller.deleteAsset.bind(controller)
  });
  
  // POST /api/assets/:id/mutations - Create mutation
  app.post('/:id/mutations', {
    preHandler: [rbacMiddleware(['Operator', 'Wakasek Sarpras'])],
    handler: controller.createMutation.bind(controller)
  });
  
  // GET /api/assets/:id/mutations - Get mutation history
  app.get('/:id/mutations', {
    preHandler: [rbacMiddleware(['Operator', 'Wakasek Sarpras', 'Kepsek'])],
    handler: controller.getMutations.bind(controller)
  });
  
  // POST /api/assets/bulk-update-condition - Bulk update (Phase 3)
  app.post('/bulk-update-condition', {
    preHandler: [rbacMiddleware(['Wakasek Sarpras'])],
    handler: controller.bulkUpdateCondition.bind(controller)
  });
}
```

---

## 5. Middleware Stack

### 5.1. Authentication Middleware (`auth.middleware.ts`)

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTService } from '../../infrastructure/crypto/jwt.service';
import { UnauthorizedError } from '../../shared/errors/unauthorized-error';
import { logger } from '../../shared/logger/winston.logger';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token tidak ditemukan');
    }
    
    const token = authHeader.substring(7);
    const jwtService = new JWTService();
    const payload = await jwtService.verify(token);
    
    // Attach user info ke request
    request.user = {
      id: payload.userId,
      username: payload.username,
      role: payload.role
    };
    
    logger.debug('User authenticated', { userId: payload.userId });
  } catch (error) {
    logger.warn('Authentication failed', { error: error.message });
    throw new UnauthorizedError('Token tidak valid atau expired');
  }
}
```

### 5.2. RBAC Middleware (`rbac.middleware.ts`)

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenError } from '../../shared/errors/forbidden-error';

export function rbacMiddleware(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenError(
        `Akses ditolak. Role yang diizinkan: ${allowedRoles.join(', ')}`
      );
    }
  };
}
```

### 5.3. Global Error Handler (`error-handler.middleware.ts`)

```typescript
import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../../shared/errors/app-error';
import { ValidationError } from '../../shared/errors/validation-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { UnauthorizedError } from '../../shared/errors/unauthorized-error';
import { ForbiddenError } from '../../shared/errors/forbidden-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { logger } from '../../shared/logger/winston.logger';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error dengan context
  const errorContext = {
    path: request.url,
    method: request.method,
    userId: request.user?.id,
    ip: request.ip,
    userAgent: request.headers['user-agent']
  };
  
  // Expected errors (business logic)
  if (error instanceof ValidationError) {
    logger.warn('Validation error', { ...errorContext, error: error.message });
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details
      }
    });
  }
  
  if (error instanceof UnauthorizedError) {
    logger.warn('Unauthorized', { ...errorContext, error: error.message });
    return reply.status(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message
      }
    });
  }
  
  if (error instanceof ForbiddenError) {
    logger.warn('Forbidden', { ...errorContext, error: error.message });
    return reply.status(403).send({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: error.message
      }
    });
  }
  
  if (error instanceof NotFoundError) {
    logger.warn('Not found', { ...errorContext, error: error.message });
    return reply.status(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message
      }
    });
  }
  
  if (error instanceof ConflictError) {
    logger.warn('Conflict', { ...errorContext, error: error.message });
    return reply.status(409).send({
      success: false,
      error: {
        code: 'CONFLICT',
        message: error.message
      }
    });
  }
  
  // Unexpected errors (bugs)
  logger.error('Unexpected error', {
    ...errorContext,
    error: error.message,
    stack: error.stack
  });
  
  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Terjadi kesalahan pada server'
    }
  });
}
```

### 5.4. Request Logger Middleware (`logger.middleware.ts`)

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../../shared/logger/winston.logger';

export async function loggerMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const start = Date.now();
  
  reply.addHook('onSend', async () => {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      userId: request.user?.id,
      ip: request.ip
    });
  });
}
```

---

## 6. Use Case Implementation Pattern

### 6.1. Example: CreateAssetUseCase

```typescript
// src/application/use-cases/assets/create-asset.use-case.ts

import { AssetRepository } from '../../../domain/repositories/asset.repository';
import { AuditRepository } from '../../../domain/repositories/audit.repository';
import { CreateAssetDTO } from '../../dto/asset.dto';
import { Asset } from '../../../domain/entities/asset.entity';
import { ValidationError } from '../../../shared/errors/validation-error';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { QRCodeUtils } from '../../../shared/utils/qr-code.utils';
import { logger } from '../../../shared/logger/winston.logger';

export class CreateAssetUseCase {
  constructor(
    private assetRepository: AssetRepository,
    private auditRepository: AuditRepository
  ) {}
  
  async execute(data: CreateAssetDTO, userId: number): Promise<Asset> {
    logger.info('Creating asset', { kodeAset: data.kodeAset, userId });
    
    // 1. Defensive: Validate kode_aset uniqueness
    const existing = await this.assetRepository.findByKodeAset(data.kodeAset);
    if (existing) {
      throw new ConflictError(`Kode aset ${data.kodeAset} sudah digunakan`);
    }
    
    // 2. Generate QR code
    const qrCode = QRCodeUtils.generate(data.kodeAset);
    
    // 3. Create asset entity
    const asset = await this.assetRepository.create({
      ...data,
      qrCode,
      createdBy: userId,
      tanggalPencatatan: new Date()
    });
    
    // 4. Create audit log
    await this.auditRepository.create({
      entityType: 'Asset',
      entityId: asset.id,
      userId,
      action: 'CREATE',
      timestamp: new Date(),
      fieldChanged: data
    });
    
    logger.info('Asset created', { assetId: asset.id, kodeAset: asset.kodeAset });
    
    return asset;
  }
}
```

### 6.2. Controller Implementation

```typescript
// src/presentation/controllers/asset.controller.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateAssetUseCase } from '../../application/use-cases/assets/create-asset.use-case';
import { AssetRepositoryImpl } from '../../infrastructure/database/repositories/asset.repository.impl';
import { AuditRepositoryImpl } from '../../infrastructure/database/repositories/audit.repository.impl';
import { createAssetSchema } from '../../application/validators/asset.validators';
import { ValidationError } from '../../shared/errors/validation-error';

export class AssetController {
  async createAsset(request: FastifyRequest, reply: FastifyReply) {
    // 1. Validate input dengan Zod
    const validationResult = createAssetSchema.safeParse(request.body);
    if (!validationResult.success) {
      throw new ValidationError(
        'Data aset tidak valid',
        validationResult.error.flatten().fieldErrors
      );
    }
    
    // 2. Execute use case
    const assetRepo = new AssetRepositoryImpl();
    const auditRepo = new AuditRepositoryImpl();
    const useCase = new CreateAssetUseCase(assetRepo, auditRepo);
    
    const asset = await useCase.execute(
      validationResult.data,
      request.user!.id
    );
    
    // 3. Return response
    return reply.status(201).send({
      success: true,
      data: asset
    });
  }
  
  // ... other methods
}
```

---

## 7. Background Jobs Design (BullMQ)

### 7.1. Queue Service Setup

```typescript
// src/infrastructure/queue/queue.service.ts

import { Queue, Worker, Job } from 'bullmq';
import { config } from '../../shared/config';
import { logger } from '../../shared/logger/winston.logger';

export class QueueService {
  private queues: Map<string, Queue> = new Map();
  
  getQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        connection: {
          host: config.redis.host,
          port: config.redis.port
        }
      });
      this.queues.set(name, queue);
    }
    return this.queues.get(name)!;
  }
  
  async addJob(queueName: string, jobName: string, data: any, options?: any) {
    const queue = this.getQueue(queueName);
    const job = await queue.add(jobName, data, options);
    logger.info('Job added to queue', { 
      queueName, 
      jobName, 
      jobId: job.id 
    });
    return job;
  }
}
```

### 7.2. Depreciation Job

```typescript
// src/infrastructure/queue/jobs/depreciation.job.ts

import { Worker, Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../../shared/logger/winston.logger';

const prisma = new PrismaClient();

export function createDepreciationWorker() {
  const worker = new Worker(
    'depreciation',
    async (job: Job) => {
      logger.info('Processing depreciation job', { jobId: job.id });
      
      const targetDate = new Date();
      targetDate.setDate(1); // First day of current month
      
      // Idempotency check
      const existingCount = await prisma.depreciationEntry.count({
        where: { tanggalHitung: targetDate }
      });
      
      if (existingCount > 0) {
        logger.warn('Depreciation already calculated for this month', { 
          targetDate 
        });
        return { skipped: true, reason: 'Already calculated' };
      }
      
      // Get eligible assets
      const assets = await prisma.asset.findMany({
        where: {
          masaManfaatTahun: { gt: 0 },
          isDeleted: false
        }
      });
      
      let successCount = 0;
      let failCount = 0;
      
      for (const asset of assets) {
        try {
          // Calculate monthly depreciation
          const monthlyDepreciation = 
            asset.harga.toNumber() / (asset.masaManfaatTahun * 12);
          
          // Get last nilai buku
          const lastEntry = await prisma.depreciationEntry.findFirst({
            where: { assetId: asset.id },
            orderBy: { tanggalHitung: 'desc' }
          });
          
          const lastNilaiBuku = lastEntry 
            ? lastEntry.nilaiBuku.toNumber() 
            : asset.harga.toNumber();
          
          const newNilaiBuku = Math.max(0, lastNilaiBuku - monthlyDepreciation);
          
          // Create entry
          await prisma.depreciationEntry.create({
            data: {
              assetId: asset.id,
              tanggalHitung: targetDate,
              nilaiPenyusutan: monthlyDepreciation,
              nilaiBuku: newNilaiBuku,
              masaManfaatTahunSnapshot: asset.masaManfaatTahun
            }
          });
          
          successCount++;
        } catch (error) {
          logger.error('Failed to calculate depreciation for asset', {
            assetId: asset.id,
            error: error.message
          });
          failCount++;
        }
      }
      
      logger.info('Depreciation job completed', { 
        successCount, 
        failCount,
        targetDate
      });
      
      return { successCount, failCount };
    },
    {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    }
  );
  
  worker.on('completed', (job) => {
    logger.info('Job completed', { jobId: job.id, result: job.returnvalue });
  });
  
  worker.on('failed', (job, error) => {
    logger.error('Job failed', { 
      jobId: job?.id, 
      error: error.message 
    });
  });
  
  return worker;
}
```

### 7.3. Scheduler Setup

```typescript
// src/main.ts (excerpt)

import { QueueService } from './infrastructure/queue/queue.service';
import { createDepreciationWorker } from './infrastructure/queue/jobs/depreciation.job';

// Setup scheduler
const queueService = new QueueService();

// Add monthly depreciation job (runs at 00:00 on 1st of every month)
await queueService.addJob(
  'depreciation',
  'monthly-calculation',
  {},
  {
    repeat: {
      pattern: '0 0 1 * *' // Cron expression
    }
  }
);

// Start worker
createDepreciationWorker();
```

---

## 8. File Storage Design

### 8.1. Storage Interface

```typescript
// src/infrastructure/storage/storage.interface.ts

export interface IStorageService {
  upload(file: Buffer, fileName: string, contentType: string): Promise<string>;
  delete(fileUrl: string): Promise<void>;
  getSignedUrl(fileUrl: string): Promise<string>;
}
```

### 8.2. R2 Storage Implementation

```typescript
// src/infrastructure/storage/r2-storage.service.ts

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { IStorageService } from './storage.interface';
import { config } from '../../shared/config';
import { logger } from '../../shared/logger/winston.logger';

export class R2StorageService implements IStorageService {
  private client: S3Client;
  
  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: config.r2.endpoint,
      credentials: {
        accessKeyId: config.r2.accessKeyId,
        secretAccessKey: config.r2.secretAccessKey
      }
    });
  }
  
  async upload(
    file: Buffer, 
    fileName: string, 
    contentType: string
  ): Promise<string> {
    const key = `uploads/${Date.now()}-${fileName}`;
    
    try {
      await this.client.send(new PutObjectCommand({
        Bucket: config.r2.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType
      }));
      
      const publicUrl = `${config.r2.publicUrl}/${key}`;
      logger.info('File uploaded to R2', { fileName, publicUrl });
      
      return publicUrl;
    } catch (error) {
      logger.error('Failed to upload file to R2', { 
        fileName, 
        error: error.message 
      });
      throw new Error('Gagal mengunggah file');
    }
  }
  
  async delete(fileUrl: string): Promise<void> {
    const key = fileUrl.replace(config.r2.publicUrl + '/', '');
    
    try {
      await this.client.send(new DeleteObjectCommand({
        Bucket: config.r2.bucketName,
        Key: key
      }));
      logger.info('File deleted from R2', { fileUrl });
    } catch (error) {
      logger.error('Failed to delete file from R2', { 
        fileUrl, 
        error: error.message 
      });
      throw new Error('Gagal menghapus file');
    }
  }
  
  async getSignedUrl(fileUrl: string): Promise<string> {
    // For R2 public bucket, just return the URL
    return fileUrl;
  }
}
```

---

## 9. Configuration Management

### 9.1. Config Loader (`shared/config/index.ts`)

```typescript
import { z } from 'zod';

// Validate environment variables dengan Zod
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  
  DATABASE_URL: z.string(),
  
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  
  R2_ENDPOINT: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  R2_PUBLIC_URL: z.string(),
  
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  
  database: {
    url: env.DATABASE_URL
  },
  
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN
  },
  
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
  },
  
  r2: {
    endpoint: env.R2_ENDPOINT,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    bucketName: env.R2_BUCKET_NAME,
    publicUrl: env.R2_PUBLIC_URL
  },
  
  cors: {
    origin: env.CORS_ORIGIN
  },
  
  logging: {
    level: env.LOG_LEVEL
  }
} as const;
```

---

## 10. Main Application Entry Point

### 10.1. `src/main.ts`

```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { config } from './shared/config';
import { logger } from './shared/logger/winston.logger';
import routes from './presentation/routes';
import { errorHandler } from './presentation/middleware/error-handler.middleware';
import { loggerMiddleware } from './presentation/middleware/logger.middleware';
import { createDepreciationWorker } from './infrastructure/queue/jobs/depreciation.job';
import { QueueService } from './infrastructure/queue/queue.service';

async function bootstrap() {
  const app = Fastify({
    logger: false // Use Winston instead
  });
  
  // Plugins
  await app.register(cors, {
    origin: config.cors.origin,
    credentials: true
  });
  
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  });
  
  // Global middleware
  app.addHook('onRequest', loggerMiddleware);
  
  // Routes
  await app.register(routes);
  
  // Error handler
  app.setErrorHandler(errorHandler);
  
  // Health check
  app.get('/health', async () => ({ status: 'ok' }));
  
  // Start server
  await app.listen({ 
    port: config.port, 
    host: '0.0.0.0' 
  });
  
  logger.info(`Server started on port ${config.port}`);
  
  // Start background workers
  createDepreciationWorker();
  logger.info('Background workers started');
  
  // Setup scheduled jobs
  const queueService = new QueueService();
  await queueService.addJob(
    'depreciation',
    'monthly-calculation',
    {},
    {
      repeat: { pattern: '0 0 1 * *' }
    }
  );
  logger.info('Scheduled jobs configured');
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', { error: error.message, stack: error.stack });
  process.exit(1);
});
```

---

## 11. Development Setup

### 11.1. Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: simanis-postgres
    environment:
      POSTGRES_USER: simanis
      POSTGRES_PASSWORD: simanis123
      POSTGRES_DB: simanis_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    container_name: simanis-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 11.2. Package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

---

## 12. Testing Strategy (Future)

### 12.1. Unit Tests

```typescript
// tests/unit/use-cases/create-asset.use-case.spec.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateAssetUseCase } from '../../../src/application/use-cases/assets/create-asset.use-case';

describe('CreateAssetUseCase', () => {
  let useCase: CreateAssetUseCase;
  let mockAssetRepo: any;
  let mockAuditRepo: any;
  
  beforeEach(() => {
    mockAssetRepo = {
      findByKodeAset: vi.fn(),
      create: vi.fn()
    };
    mockAuditRepo = {
      create: vi.fn()
    };
    useCase = new CreateAssetUseCase(mockAssetRepo, mockAuditRepo);
  });
  
  it('should create asset with QR code', async () => {
    mockAssetRepo.findByKodeAset.mockResolvedValue(null);
    mockAssetRepo.create.mockResolvedValue({ 
      id: 1, 
      kodeAset: 'SCH/KD/EL/0001',
      qrCode: 'abc123'
    });
    
    const result = await useCase.execute({
      kodeAset: 'SCH/KD/EL/0001',
      namaBarang: 'Laptop'
      // ...
    }, 1);
    
    expect(result.qrCode).toBeDefined();
    expect(mockAuditRepo.create).toHaveBeenCalled();
  });
  
  it('should throw ConflictError if kode_aset exists', async () => {
    mockAssetRepo.findByKodeAset.mockResolvedValue({ id: 1 });
    
    await expect(
      useCase.execute({ kodeAset: 'SCH/KD/EL/0001' }, 1)
    ).rejects.toThrow('sudah digunakan');
  });
});
```

---

## 13. Deployment Considerations

### 13.1. Environment Variables Checklist

Production `.env`:
```bash
NODE_ENV=production
PORT=3000

DATABASE_URL="postgresql://user:pass@db-host:5432/simanis"

JWT_SECRET="change-this-to-very-strong-secret-min-32-chars"
JWT_EXPIRES_IN=7d

REDIS_HOST=redis-host
REDIS_PORT=6379

R2_ENDPOINT="https://..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="simanis-production"
R2_PUBLIC_URL="https://..."

CORS_ORIGIN="https://simanis.sekolah.sch.id"

LOG_LEVEL=info
```

### 13.2. Build & Deploy Steps

```bash
# 1. Build TypeScript
npm run build

# 2. Run migrations
npx prisma migrate deploy

# 3. Generate Prisma Client
npx prisma generate

# 4. Start server
npm start
```

---

## 14. Monitoring & Observability

### 14.1. Winston Logger Configuration

```typescript
// src/shared/logger/winston.logger.ts

import winston from 'winston';
import { config } from '../config';

export const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'simanis-backend' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Console logging untuk development
if (config.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}
```

---

## 15. Security Checklist

- [x] **CORS configured** untuk frontend origin only
- [x] **JWT authentication** di semua protected routes
- [x] **RBAC enforcement** di backend (tidak hanya UI)
- [x] **Input validation** dengan Zod di semua endpoints
- [x] **Password hashing** dengan Argon2
- [x] **SQL injection prevention** (Prisma auto-escape)
- [x] **File upload validation** (MIME type, size)
- [x] **Rate limiting** di login endpoint (optional)
- [x] **Error messages** tidak expose internal details
- [x] **Environment variables** untuk semua secrets

---

## 16. Performance Optimization

- [x] **Database indexes** sesuai `database_schema.md`
- [x] **Server-side pagination** di semua list endpoints
- [x] **Connection pooling** (Prisma default)
- [x] **Background jobs** untuk long-running tasks
- [x] **Denormalisasi selective** (current_room_id) untuk performa
- [x] **Caching** dengan Redis untuk frequently accessed data (optional)

---

**Status:** Design Backend – Comprehensive & Ready for Implementation  
**Next Step:** Tunggu konfirmasi untuk lanjut ke `tasks_backend.md`  
**Penulis:** Backend Developer  
**Tanggal:** 2025-01-22
