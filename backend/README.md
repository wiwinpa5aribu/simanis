# SIMANIS Backend

Backend API server untuk SIMANIS (Sistem Manajemen Aset Sekolah) menggunakan Node.js, TypeScript, Fastify, dan Prisma ORM.

## Tech Stack

- **Runtime:** Node.js 18+ / 20+
- **Language:** TypeScript
- **Framework:** Fastify
- **Database:** MySQL 8.0 (Laragon)
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JWT
- **Password Hashing:** Argon2
- **Logging:** Winston
- **Background Jobs:** BullMQ + Redis (future)
- **File Storage:** Cloudflare R2 (future)

## Prerequisites

- Node.js 18 LTS atau 20 LTS
- Laragon (MySQL 8.0)
- npm atau yarn

## Installation

### 1. Clone repository

```bash
cd d:\simanis\backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
# Copy .env.example ke .env
copy .env.example .env

# Edit .env dan sesuaikan nilai-nilainya
# Minimal yang perlu diubah:
# - JWT_SECRET (generate random string min 32 karakter)
# - DATABASE_URL (sesuai dengan Laragon MySQL)
```

### 4. Start Laragon MySQL

- Buka Laragon
- Start MySQL service
- Verify MySQL running di port 3306

### 5. Setup database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database dengan sample data
npx prisma db seed
```

## Development

### Start development server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server dengan hot reload
npm run build        # Build untuk production
npm start            # Start production server
npm run lint         # Run ESLint
npm run format       # Format code dengan Prettier

# Prisma commands
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run prisma:seed      # Seed database
```

## Project Structure

```
backend/
├── src/
│   ├── domain/              # Domain layer (business logic)
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── repositories/
│   │
│   ├── application/         # Application layer (use cases)
│   │   ├── use-cases/
│   │   ├── dto/
│   │   └── validators/
│   │
│   ├── infrastructure/      # Infrastructure layer (technical)
│   │   ├── database/
│   │   ├── storage/
│   │   ├── queue/
│   │   └── crypto/
│   │
│   ├── presentation/        # Presentation layer (API)
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   │
│   ├── shared/              # Shared utilities
│   │   ├── config/
│   │   ├── logger/
│   │   ├── errors/
│   │   └── utils/
│   │
│   └── main.ts              # Application entry point
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Migration files
│   └── seed.ts              # Database seeding
│
├── tests/                   # Tests (future)
├── logs/                    # Application logs
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
├── tsconfig.json            # TypeScript config
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Assets
- `GET /api/assets` - List assets (with pagination & filters)
- `GET /api/assets/:id` - Get asset detail
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset (soft delete)

### Mutations
- `POST /api/assets/:id/mutations` - Create asset mutation
- `GET /api/assets/:id/mutations` - Get mutation history

### Loans
- `GET /api/loans` - List loans
- `GET /api/loans/:id` - Get loan detail
- `POST /api/loans` - Create loan
- `PATCH /api/loans/:id/return` - Return loan

### Dashboard (Future)
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/activities` - Recent activities

### Inventory (Future)
- `POST /api/inventory` - Create inventory check
- `GET /api/inventory` - List inventory checks

### Depreciation (Future)
- `GET /api/depreciations` - List depreciation entries

### Reports (Future)
- `POST /api/reports/kib` - Generate KIB report
- `GET /api/reports/kib/:jobId/status` - Check report status
- `GET /api/reports/kib/:jobId/download` - Download report

### Audit Trail (Future)
- `GET /api/audit-logs` - List audit logs

## Environment Variables

See `.env.example` for all available environment variables.

**Required:**
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secret key untuk JWT (min 32 characters)

**Optional:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Frontend URL untuk CORS
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

## Database Schema

Database menggunakan 15 tables:
- `users`, `roles`, `user_roles` - User management & RBAC
- `asset_categories` - Asset categories
- `buildings`, `floors`, `rooms` - Location hierarchy
- `assets` - Main assets table
- `asset_mutations` - Asset location changes
- `loans`, `loan_items` - Loan management
- `inventory_checks` - Inventory records
- `depreciation_entries` - Monthly depreciation
- `asset_documents` - Document attachments
- `asset_deletions` - Deletion records
- `audit_logs` - Audit trail

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- No `any` types
- Follow ESLint rules
- Format with Prettier before commit

### Naming Conventions
- Files: kebab-case (e.g., `user.repository.ts`)
- Classes: PascalCase (e.g., `UserRepository`)
- Functions: camelCase (e.g., `getUserById`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### Commit Messages
Follow conventional commits:
```
feat(scope): description    # New feature
fix(scope): description     # Bug fix
chore(scope): description   # Maintenance
docs(scope): description    # Documentation
```

## Troubleshooting

### Prisma Client not found
```bash
npx prisma generate
```

### Database connection error
- Check Laragon MySQL is running
- Verify `DATABASE_URL` in `.env`
- Test connection: `npx prisma studio`

### Port already in use
- Change `PORT` in `.env`
- Or kill process using port 3000

## License

MIT

## Contact

Backend Developer Team - SIMANIS Project
