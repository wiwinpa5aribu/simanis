# API Requirements - SIMANIS Backend

Dokumentasi lengkap endpoint API yang dibutuhkan oleh frontend SIMANIS.

## 📋 Base Configuration

- **Base URL**: `http://localhost:3000/api`
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json`
- **Timeout**: 30 seconds

## 🔐 Authentication

### POST /auth/login
Login user dan dapatkan JWT token.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "name": "string",
    "role": "admin" | "operator" | "guru" | "kepsek" | "wakasek" | "bendahara"
  },
  "token": "string"
}
```

**Errors:**
- 401: Invalid credentials
- 400: Validation error

---

## 📊 Dashboard

### GET /dashboard/stats
Mendapatkan statistik dashboard.

**Response (200):**
```json
{
  "total_assets": 150,
  "assets_by_condition": {
    "Baik": 120,
    "Rusak Ringan": 20,
    "Rusak Berat": 8,
    "Hilang": 2
  },
  "assets_by_category": [
    {
      "category_name": "Komputer & Laptop",
      "count": 45
    }
  ],
  "active_loans": 12
}
```

### GET /dashboard/activities
Mendapatkan aktivitas terbaru.

**Query Params:**
- `limit` (optional): number, default 10

**Response (200):**
```json
[
  {
    "id": 1,
    "type": "asset" | "mutation" | "loan" | "inventory",
    "title": "string",
    "description": "string",
    "timestamp": "ISO8601 string",
    "link": "string (optional)"
  }
]
```

---

## 📦 Assets

### GET /assets
Mendapatkan daftar aset dengan pagination dan filter.

**Query Params:**
- `page` (optional): number, default 1
- `pageSize` (optional): number, default 20
- `search` (optional): string
- `category_id` (optional): number
- `kondisi` (optional): "Baik" | "Rusak Ringan" | "Rusak Berat" | "Hilang"
- `lokasi_id` (optional): number

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "kode_aset": "SCH/KD/KOMP/001",
      "nama_barang": "string",
      "merk": "string",
      "spesifikasi": "string",
      "tahun_perolehan": "string",
      "harga": 12000000,
      "sumber_dana": "BOS" | "APBD" | "Hibah",
      "kondisi": "Baik" | "Rusak Ringan" | "Rusak Berat" | "Hilang",
      "foto": "string (URL, optional)",
      "qr_code": "string",
      "kategori_id": 1,
      "kategori_nama": "string",
      "lokasi_id": 1,
      "lokasi_path": "Gedung A / Lantai 2 / Lab Komputer",
      "tanggal_pencatatan": "ISO8601 string",
      "created_by": 1,
      "created_by_name": "string"
    }
  ],
  "total": 150,
  "page": 1,
  "pageSize": 20
}
```

### GET /assets/:id
Mendapatkan detail aset.

**Response (200):**
```json
{
  "id": 1,
  "kode_aset": "SCH/KD/KOMP/001",
  "nama_barang": "string",
  "merk": "string",
  "spesifikasi": "string",
  "tahun_perolehan": "string",
  "harga": 12000000,
  "sumber_dana": "BOS" | "APBD" | "Hibah",
  "kondisi": "Baik" | "Rusak Ringan" | "Rusak Berat" | "Hilang",
  "foto": "string (URL, optional)",
  "qr_code": "string",
  "kategori": {
    "id": 1,
    "nama": "string",
    "kode": "string"
  },
  "lokasi": {
    "id": 1,
    "gedung": "string",
    "lantai": "string",
    "ruangan": "string"
  },
  "tanggal_pencatatan": "ISO8601 string",
  "created_by": {
    "id": 1,
    "name": "string"
  },
  "riwayat_mutasi": [],
  "riwayat_peminjaman": []
}
```

### GET /assets/by-code/:code
Mendapatkan aset berdasarkan kode (untuk QR scanner).

**Response (200):** Same as GET /assets/:id

**Errors:**
- 404: Asset not found

### POST /assets
Membuat aset baru.

**Request:**
```json
{
  "kode_aset": "string (unique)",
  "nama_barang": "string",
  "merk": "string (optional)",
  "spesifikasi": "string (optional)",
  "tahun_perolehan": "string",
  "harga": 12000000,
  "sumber_dana": "BOS" | "APBD" | "Hibah",
  "kondisi": "Baik" | "Rusak Ringan" | "Rusak Berat" | "Hilang",
  "kategori_id": 1,
  "lokasi_id": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "kode_aset": "string",
  "qr_code": "string (auto-generated)",
  ...
}
```

**Errors:**
- 400: Validation error
- 409: Duplicate kode_aset

### PUT /assets/:id
Update aset.

**Request:** Same as POST (all fields optional)

**Response (200):** Updated asset object

### DELETE /assets/:id
Soft delete aset (set status dihapus).

**Response (204):** No content

---

## 📂 Categories

### GET /categories
Mendapatkan semua kategori.

**Response (200):**
```json
[
  {
    "id": 1,
    "nama": "Komputer & Laptop",
    "kode": "KOMP",
    "deskripsi": "string (optional)"
  }
]
```

### POST /categories
Membuat kategori baru.

**Request:**
```json
{
  "nama": "string",
  "kode": "string (unique)",
  "deskripsi": "string (optional)"
}
```

**Response (201):** Created category object

---

## 📍 Locations

### GET /locations
Mendapatkan semua lokasi.

**Response (200):**
```json
[
  {
    "id": 1,
    "gedung": "Gedung A",
    "lantai": "Lantai 2",
    "ruangan": "Lab Komputer"
  }
]
```

---

## 🔄 Mutations (Mutasi Lokasi)

### POST /mutations
Membuat mutasi lokasi aset.

**Request:**
```json
{
  "asset_id": 1,
  "lokasi_tujuan_id": 2,
  "tanggal_mutasi": "ISO8601 string",
  "keterangan": "string (optional)"
}
```

**Response (201):**
```json
{
  "id": 1,
  "asset_id": 1,
  "lokasi_asal_id": 1,
  "lokasi_tujuan_id": 2,
  "tanggal_mutasi": "ISO8601 string",
  "keterangan": "string",
  "created_by": 1
}
```

---

## 📋 Loans (Peminjaman)

### GET /loans
Mendapatkan daftar peminjaman.

**Query Params:**
- `page`, `pageSize`, `search`
- `status` (optional): "Dipinjam" | "Dikembalikan" | "Terlambat" | "Rusak"

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "asset_id": 1,
      "asset_name": "string",
      "peminjam_id": 1,
      "peminjam_name": "string",
      "tanggal_pinjam": "ISO8601 string",
      "tanggal_kembali": "ISO8601 string (optional)",
      "tanggal_jatuh_tempo": "ISO8601 string",
      "tujuan_pinjam": "string",
      "status": "Dipinjam" | "Dikembalikan" | "Terlambat" | "Rusak",
      "catatan": "string (optional)"
    }
  ],
  "total": 50,
  "page": 1,
  "pageSize": 20
}
```

### POST /loans
Membuat peminjaman baru.

**Request:**
```json
{
  "asset_id": 1,
  "peminjam_id": 1,
  "tanggal_pinjam": "ISO8601 string",
  "tanggal_jatuh_tempo": "ISO8601 string",
  "tujuan_pinjam": "string"
}
```

**Response (201):** Created loan object

### PUT /loans/:id/return
Mengembalikan aset.

**Request:**
```json
{
  "tanggal_kembali": "ISO8601 string",
  "kondisi": "Baik" | "Rusak Ringan" | "Rusak Berat",
  "catatan": "string (optional)"
}
```

**Response (200):** Updated loan object

---

## 📦 Inventory (Inventarisasi)

### GET /inventory
Mendapatkan daftar inventarisasi.

**Query Params:**
- `page`, `pageSize`
- `from` (optional): date string (YYYY-MM-DD)
- `to` (optional): date string (YYYY-MM-DD)
- `search` (optional): string

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "asset_id": 1,
      "asset_code": "string",
      "asset_name": "string",
      "photo_url": "string (optional)",
      "note": "string (optional)",
      "created_by": 1,
      "created_by_name": "string",
      "created_at": "ISO8601 string"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### POST /inventory
Membuat entri inventarisasi.

**Request (multipart/form-data):**
```
asset_id: number
photo: File (optional, max 5MB)
note: string (optional, max 500 chars)
```

**Response (201):** Created inventory record

---

## 💰 Depreciation (Penyusutan)

### GET /depreciation
Mendapatkan daftar penyusutan.

**Query Params:**
- `page`, `pageSize`
- `asset_id` (optional): number
- `category_id` (optional): number
- `bulan` (optional): number (1-12)
- `tahun` (optional): number

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "asset_id": 1,
      "asset_name": "string",
      "tanggal_hitung": "ISO8601 string",
      "nilai_penyusutan": 200000,
      "nilai_buku": 11800000,
      "masa_manfaat": 4
    }
  ],
  "total": 150,
  "page": 1,
  "pageSize": 20
}
```

---

## 📄 Reports

### POST /reports/kib
Generate laporan KIB.

**Request:**
```json
{
  "category_id": 1 (optional),
  "room_id": 1 (optional),
  "condition": "Baik" (optional),
  "from_date": "YYYY-MM-DD" (optional),
  "to_date": "YYYY-MM-DD" (optional)
}
```

**Response (200):**
```json
{
  "report_id": "string",
  "status": "processing" | "completed" | "failed",
  "download_url": "string (when completed)"
}
```

### GET /reports/:id/download
Download laporan yang sudah di-generate.

**Response (200):** File (Excel/PDF)

---

## 🔍 Audit Trail

### GET /audit
Mendapatkan audit logs.

**Query Params:**
- `page`, `pageSize`
- `user_id` (optional): number
- `action` (optional): "CREATE" | "UPDATE" | "DELETE"
- `table_name` (optional): string
- `from` (optional): date string
- `to` (optional): date string

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "string",
      "action": "CREATE" | "UPDATE" | "DELETE",
      "table_name": "assets",
      "record_id": 1,
      "field_changed": {
        "kondisi": {
          "old": "Baik",
          "new": "Rusak Ringan"
        }
      },
      "timestamp": "ISO8601 string"
    }
  ],
  "total": 500,
  "page": 1,
  "pageSize": 20
}
```

---

## 🚨 Error Responses

Semua error mengikuti format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {} (optional)
  }
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate data)
- 500: Internal Server Error

---

## 📝 Notes

1. **Authentication**: Semua endpoint (kecuali /auth/login) memerlukan Bearer token di header
2. **Pagination**: Default page=1, pageSize=20, max pageSize=100
3. **Date Format**: ISO8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
4. **File Upload**: Gunakan multipart/form-data, max 5MB
5. **QR Code**: Auto-generated saat create asset
6. **Soft Delete**: Asset tidak benar-benar dihapus, hanya status berubah

---

**Last Updated**: 2025-11-19
**Version**: 1.0.0
