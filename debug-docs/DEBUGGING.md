# 🐛 Panduan Debugging SIMANIS

Dokumen ini menjelaskan cara melakukan debugging dan troubleshooting pada aplikasi SIMANIS.

## 📋 Daftar Isi

1. [Sistem Logging](#sistem-logging)
2. [Error Handling](#error-handling)
3. [Debugging Tools](#debugging-tools)
4. [Common Issues](#common-issues)

---

## 🔍 Sistem Logging

Aplikasi SIMANIS dilengkapi dengan sistem logging terpusat yang memudahkan debugging.

### Lokasi File Logger

```
src/utils/logger.ts
```

### Cara Menggunakan Logger

```typescript
import { logger } from '../utils/logger'

// Log informasi
logger.info('ComponentName', 'Pesan informasi', { data: 'optional' })

// Log sukses
logger.success('ComponentName', 'Operasi berhasil', { result: data })

// Log warning
logger.warning('ComponentName', 'Peringatan', { details: info })

// Log error
logger.error('ComponentName', 'Terjadi error', error, { additionalData })

// Log API call
logger.api('GET', '/api/assets', { params: { page: 1 } })

// Log API response
logger.apiResponse('GET', '/api/assets', 200, responseData)
```

### Format Log

Setiap log akan menampilkan:
- ⏰ **Timestamp**: Waktu kejadian dengan milidetik
- 📦 **Component**: Nama component/module yang melakukan log
- 🎯 **Level**: Info, Success, Warning, Error
- 📝 **Message**: Pesan deskriptif
- 📊 **Data**: Data tambahan (opsional)

### Contoh Output Log

```
[14:23:45.123] [Assets API] ✅ Berhasil mengambil 25 aset
[14:23:46.456] [API] 🌐 GET /assets
[14:23:47.789] [API Response] ✅ GET /assets - Status: 200
```

---

## 🛡️ Error Handling

### Error Boundary

Aplikasi menggunakan Error Boundary untuk menangkap error di component tree.

**Lokasi**: `src/components/ErrorBoundary.tsx`

**Fitur**:
- Menangkap error di seluruh component tree
- Menampilkan fallback UI yang user-friendly
- Log error dengan detail lengkap
- Tombol "Coba Lagi" dan "Kembali ke Beranda"

### Try-Catch di API Calls

Semua API calls dibungkus dengan try-catch:

```typescript
export const getAssets = async (): Promise<Asset[]> => {
  try {
    logger.info('Assets API', 'Mengambil daftar aset')
    const response = await api.get<Asset[]>('/assets')
    logger.success('Assets API', `Berhasil mengambil ${response.data.length} aset`)
    return response.data
  } catch (error: any) {
    logger.error('Assets API', 'Gagal mengambil daftar aset', error)
    throw new Error(error.response?.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}
```

### HTTP Status Code Handling

API client menangani berbagai status code:

- **401 Unauthorized**: Auto logout dan redirect ke login
- **403 Forbidden**: Log warning akses ditolak
- **404 Not Found**: Log data tidak ditemukan
- **500 Server Error**: Log error server
- **Network Error**: Log error koneksi

---

## 🔧 Debugging Tools

### 1. Browser DevTools Console

Buka console browser (F12) untuk melihat semua log:

```
Ctrl + Shift + J (Windows/Linux)
Cmd + Option + J (Mac)
```

### 2. React DevTools

Install extension React DevTools untuk inspect component state:

- [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### 3. Network Tab

Monitor semua API calls di Network tab browser:

1. Buka DevTools (F12)
2. Pilih tab "Network"
3. Filter by "XHR" atau "Fetch"
4. Klik request untuk melihat detail

### 4. Redux DevTools (Jika menggunakan Redux)

Untuk monitoring state management:

- [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

---

## 🚨 Common Issues

### Issue 1: API Call Gagal

**Gejala**: Error "Network Error" atau "Failed to fetch"

**Debugging**:
1. Cek console untuk log error detail
2. Cek Network tab untuk melihat request yang gagal
3. Verifikasi URL API di `.env` file
4. Pastikan backend server berjalan

**Solusi**:
```bash
# Cek environment variable
echo $VITE_API_URL

# Pastikan backend berjalan
curl http://localhost:3000/health
```

### Issue 2: Token Expired

**Gejala**: Auto logout tiba-tiba

**Debugging**:
1. Cek console untuk log "Unauthorized"
2. Cek localStorage untuk token
3. Verifikasi token expiry time

**Solusi**:
```javascript
// Di console browser
localStorage.getItem('auth_token')
```

### Issue 3: Component Tidak Render

**Gejala**: Halaman kosong atau error boundary muncul

**Debugging**:
1. Cek console untuk error message
2. Cek React DevTools untuk component tree
3. Cek log lifecycle component

**Solusi**:
- Pastikan semua props dikirim dengan benar
- Cek conditional rendering
- Verifikasi data tidak null/undefined

### Issue 4: Data Tidak Muncul

**Gejala**: Loading selesai tapi data kosong

**Debugging**:
1. Cek console untuk log API response
2. Cek Network tab untuk response data
3. Verifikasi data structure

**Solusi**:
```typescript
// Tambahkan log di component
useEffect(() => {
  logger.info('ComponentName', 'Data received', { data })
}, [data])
```

---

## 📊 Monitoring Performance

### Log Performance

```typescript
const startTime = performance.now()

// Operasi yang ingin diukur
await fetchData()

const duration = performance.now() - startTime
logger.performance('ComponentName', 'Fetch data', duration)
```

### React Profiler

Gunakan React Profiler untuk mengukur render performance:

```typescript
import { Profiler } from 'react'

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

---

## 🎯 Best Practices

1. **Selalu gunakan logger** untuk operasi penting
2. **Tambahkan try-catch** di semua async functions
3. **Log dengan konteks** yang jelas (component name, operation)
4. **Jangan log data sensitif** (password, token)
5. **Gunakan level log yang tepat** (info, warning, error)
6. **Tambahkan error boundary** di component yang kompleks
7. **Monitor Network tab** saat development
8. **Test error scenarios** (network error, 404, 500)

---

## 📞 Bantuan Lebih Lanjut

Jika masih mengalami masalah:

1. Cek log di console dengan detail
2. Screenshot error message
3. Catat langkah-langkah untuk reproduce error
4. Hubungi tim development dengan informasi di atas

---

**Terakhir diupdate**: November 2024
