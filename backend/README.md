# Backend SIMANIS

## 📋 Status: Belum Diimplementasi

Folder ini disiapkan untuk pengembangan backend API SIMANIS di masa depan.

---

## 🎯 Rencana Backend

### Tech Stack (Rencana)
- **Node.js + Express** atau **NestJS**
- **TypeScript**
- **PostgreSQL** atau **MySQL**
- **Prisma ORM**
- **JWT Authentication**

### API Endpoints (Rencana)

#### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

#### Assets
- `GET /api/assets` - Get all assets (with pagination & filters)
- `GET /api/assets/:id` - Get asset by ID
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/assets/code/:code` - Get asset by code (for QR scanner)
- `POST /api/assets/:id/photo` - Upload asset photo

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Loans
- `GET /api/loans` - Get all loans
- `POST /api/loans` - Create loan
- `POST /api/loans/:id/return` - Mark loan as returned

#### Inventory
- `GET /api/inventory` - Get inventory records
- `POST /api/inventory` - Create inventory record

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get recent activities

#### Reports
- `POST /api/reports/kib` - Generate KIB report
- `GET /api/reports/:id/download` - Download report

#### Audit
- `GET /api/audit-logs` - Get audit logs (with filters)

#### Depreciation
- `GET /api/depreciations` - Get depreciation records

---

## 📁 Struktur Folder (Rencana)

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── repositories/   # Database access
│   ├── models/         # Data models (Prisma)
│   ├── middlewares/    # Auth, validation, etc.
│   ├── routes/         # API routes
│   ├── utils/          # Utilities
│   └── config/         # Configuration
├── prisma/
│   └── schema.prisma   # Database schema
├── tests/              # Unit & integration tests
├── package.json
└── tsconfig.json
```

---

## 🔐 Security Considerations

- JWT token dengan expiry
- Password hashing (bcrypt)
- Input validation (Zod)
- SQL injection prevention (Prisma)
- CORS configuration
- Rate limiting
- File upload validation

---

## 📝 Database Schema (Rencana)

### Users
- id, username, email, password, name, role, created_at, updated_at

### Assets
- id, kode_aset, nama_barang, category_id, kondisi, merk, spesifikasi, tahun_perolehan, harga, sumber_dana, photo_url, created_at, updated_at

### Categories
- id, name, created_at, updated_at

### Loans
- id, asset_id, borrower_name, loan_date, return_date, status, notes, created_at, updated_at

### Inventory
- id, asset_id, photo_url, note, created_by, created_at, updated_at

### Audit Logs
- id, entity_type, entity_id, user_id, action, timestamp, field_changed, old_values, new_values

### Depreciations
- id, asset_id, calculation_date, depreciation_value, book_value, created_at

---

## 🚀 Getting Started (Nanti)

```bash
# Install dependencies
cd backend
npm install

# Setup database
npx prisma migrate dev

# Run development server
npm run dev

# Run tests
npm test
```

---

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com/)

---

**Status:** 🔴 Not Started  
**Priority:** High  
**Estimated Time:** 4-6 weeks
