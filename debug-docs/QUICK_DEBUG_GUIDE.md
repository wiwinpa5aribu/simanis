# 🚀 Quick Debug Guide - SIMANIS

## 📋 Checklist Debugging

### Saat Terjadi Error:

1. ✅ **Buka Console Browser** (F12 atau Ctrl+Shift+J)
2. ✅ **Lihat Log Error** - Cari log dengan icon ❌
3. ✅ **Catat Informasi**:
   - Timestamp
   - Component name
   - Error message
   - Stack trace

### Contoh Log Error:

```
[14:23:45.123] [Assets API] ❌ Gagal mengambil daftar aset
  Error Details: {
    message: "Network Error",
    stack: "...",
    ...
  }
```

## 🔍 Lokasi File Penting

```
src/
├── constants/index.ts       # Semua constants (error messages, routes, dll)
├── utils/logger.ts          # Sistem logging
├── components/
│   └── ErrorBoundary.tsx    # Error boundary component
└── libs/api/
    ├── client.ts            # API client dengan interceptor
    ├── auth.ts              # API autentikasi
    ├── assets.ts            # API aset
    ├── categories.ts        # API kategori
    ├── loans.ts             # API peminjaman
    └── dashboard.ts         # API dashboard
```

## 🎯 Jenis Log

| Icon | Level | Warna | Kegunaan |
|------|-------|-------|----------|
| ℹ️ | Info | Biru | Informasi umum |
| ✅ | Success | Hijau | Operasi berhasil |
| ⚠️ | Warning | Kuning | Peringatan |
| ❌ | Error | Merah | Error/kesalahan |
| 🌐 | API | Ungu | Request API |

## 💡 Tips Debugging

### 1. Network Error
```
Cek:
- Koneksi internet
- Backend server running
- URL API di .env
```

### 2. 401 Unauthorized
```
Cek:
- Token expired
- Login ulang
- localStorage.getItem('auth_token')
```

### 3. Data Tidak Muncul
```
Cek:
- Console log API response
- Network tab di DevTools
- Data structure
```

### 4. Component Error
```
Cek:
- Console log error message
- React DevTools
- Props yang dikirim
```

## 🛠️ Tools

1. **Browser Console** (F12)
   - Lihat semua log
   - Filter by level
   - Search log

2. **Network Tab**
   - Monitor API calls
   - Lihat request/response
   - Check status code

3. **React DevTools**
   - Inspect component
   - Lihat props & state
   - Component tree

## 📞 Quick Commands

```bash
# Lihat log di console
# Buka browser console (F12)

# Filter log by component
# Ketik di console: logger.info('ComponentName', 'message')

# Clear console
# Ctrl + L atau ketik: clear()
```

## 🎨 Contoh Penggunaan Logger

```typescript
import { logger } from '../utils/logger'

// Info
logger.info('MyComponent', 'Memulai proses')

// Success
logger.success('MyComponent', 'Proses selesai', { result: data })

// Warning
logger.warning('MyComponent', 'Perhatian!', { details })

// Error
logger.error('MyComponent', 'Terjadi error', error, { additionalData })

// API
logger.api('GET', '/api/assets', { params })
```

## ✅ Checklist Sebelum Report Bug

- [ ] Screenshot error di console
- [ ] Catat langkah-langkah reproduce
- [ ] Cek Network tab untuk API calls
- [ ] Catat timestamp error
- [ ] Catat component yang error
- [ ] Copy error message lengkap

## 📚 Dokumentasi Lengkap

- **DEBUGGING.md** - Panduan lengkap debugging
- **CHANGELOG_DEBUGGING.md** - Detail semua perubahan
- **SUMMARY_IMPROVEMENTS.md** - Ringkasan peningkatan

---

**Need Help?** Buka `DEBUGGING.md` untuk panduan lengkap! 📖
