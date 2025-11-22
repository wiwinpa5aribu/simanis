# Panduan Testing Performa QR Scanner

## Tujuan
Memastikan waktu respons QR scan ≤ 2 detik pada perangkat modern.

## Optimasi yang Telah Dilakukan

### 1. Konfigurasi Scanner
- ✅ FPS ditingkatkan dari 10 ke 15 untuk deteksi lebih cepat
- ✅ QR box diperbesar dari 250x250 ke 300x300 untuk area deteksi lebih luas
- ✅ Aspect ratio 1.0 optimal untuk QR code
- ✅ Flip detection aktif untuk deteksi dari berbagai sudut

### 2. Optimasi API
- ✅ Stale time 30 detik untuk caching hasil
- ✅ Retry disabled untuk respons lebih cepat
- ✅ Timeout 30 detik di API client
- ✅ Performance monitoring terintegrasi

### 3. Monitoring Performa
- ✅ Tracking waktu scan hingga data diterima
- ✅ Tracking waktu API call
- ✅ Indikator visual di UI (hijau: ≤2s, kuning: >2s)
- ✅ Console logging untuk debugging

## Cara Testing

### A. Testing Manual di Browser Desktop

1. **Persiapan**
   ```bash
   npm run dev
   ```

2. **Akses Halaman Scan**
   - Buka http://localhost:5173/inventory/scan
   - Login jika diperlukan

3. **Test dengan QR Code**
   - Siapkan QR code aset (bisa generate online atau print)
   - Klik "Mulai Scan"
   - Izinkan akses kamera
   - Arahkan kamera ke QR code

4. **Perhatikan Indikator**
   - Lihat waktu respons yang muncul setelah scan
   - ✅ Hijau = ≤ 2000ms (optimal)
   - ⚠️ Kuning = > 2000ms (lambat)

5. **Cek Console**
   ```
   [Performance] Total scan to data: XXXms
   [Performance] API call time: XXXms
   ```

### B. Testing di Perangkat Mobile

1. **Setup Development Server**
   ```bash
   npm run dev -- --host
   ```

2. **Akses dari Mobile**
   - Cari IP address komputer: `ipconfig` (Windows) atau `ifconfig` (Mac/Linux)
   - Buka browser mobile: `http://[IP]:5173/inventory/scan`

3. **Test dengan Kamera Belakang**
   - Pilih kamera belakang jika ada opsi
   - Scan QR code
   - Perhatikan waktu respons

4. **Test Berbagai Kondisi**
   - Jarak dekat (10cm)
   - Jarak sedang (20cm)
   - Jarak jauh (30cm)
   - Pencahayaan terang
   - Pencahayaan redup

### C. Testing dengan Chrome DevTools

1. **Emulasi Mobile**
   - Buka DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M)
   - Pilih perangkat: Pixel 5, iPhone 12, dll

2. **Network Throttling**
   - Buka tab Network
   - Pilih throttling: Fast 3G, Slow 3G
   - Test scan dengan koneksi lambat

3. **Performance Profiling**
   - Buka tab Performance
   - Record saat melakukan scan
   - Analisis timeline untuk bottleneck

## Target Performa

### Breakdown Waktu (Target)
```
Total ≤ 2000ms
├── QR Detection: 200-500ms (tergantung kamera)
├── API Call: 500-1500ms (tergantung backend & network)
└── Rendering: 50-100ms
```

### Perangkat Modern (Referensi)
- **Desktop**: Chrome/Edge dengan webcam HD
- **Mobile**: Android 10+ atau iOS 14+ dengan kamera 12MP+
- **Network**: 4G/WiFi dengan latency < 100ms

## Troubleshooting

### Scan > 2 detik

#### 1. Cek Network
```bash
# Ping backend
ping api.simanis.local

# Cek latency di DevTools Network tab
```

#### 2. Cek Backend Performance
- Pastikan backend API `/assets/by-code/:code` responsif
- Cek database query optimization
- Monitor backend logs

#### 3. Cek Kamera
- Gunakan kamera dengan resolusi minimal 720p
- Pastikan fokus otomatis berfungsi
- Coba kamera berbeda jika tersedia

#### 4. Cek QR Code
- Pastikan QR code tidak rusak
- Ukuran minimal 3x3 cm
- Kontras tinggi (hitam di putih)
- Tidak ada refleksi atau bayangan

### Kamera Tidak Terdeteksi

1. **Cek Permission**
   - Chrome: Settings > Privacy > Camera
   - Firefox: Preferences > Privacy > Permissions

2. **Cek Browser Support**
   - Gunakan Chrome/Edge/Safari terbaru
   - HTTPS required (atau localhost untuk dev)

3. **Fallback ke Input Manual**
   - Klik tombol "Input Manual"
   - Ketik kode aset langsung

## Hasil Testing yang Diharapkan

### ✅ Pass Criteria
- [ ] 90% scan berhasil dalam ≤ 2 detik
- [ ] Fallback input manual berfungsi
- [ ] Indikator performa tampil dengan benar
- [ ] Console log menunjukkan timing detail
- [ ] Tidak ada error di console
- [ ] UI responsif selama proses scan

### ⚠️ Warning (Acceptable)
- Scan 2-3 detik pada koneksi 3G
- Scan 2-3 detik pada perangkat low-end
- Scan lambat pada pencahayaan sangat redup

### ❌ Fail Criteria
- Scan > 5 detik pada WiFi/4G
- Kamera crash atau freeze
- Error tidak ter-handle
- UI tidak responsif

## Optimasi Lanjutan (Jika Diperlukan)

### 1. Backend Optimization
```javascript
// Cache di backend
app.get('/assets/by-code/:code', cache('5 minutes'), async (req, res) => {
  // ... handler
});
```

### 2. Prefetch Assets
```typescript
// Prefetch daftar aset saat halaman load
useEffect(() => {
  queryClient.prefetchQuery(['assets']);
}, []);
```

### 3. Service Worker Caching
```javascript
// Cache API responses
workbox.routing.registerRoute(
  /\/api\/assets\//,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);
```

### 4. WebAssembly QR Scanner
```bash
# Alternatif library yang lebih cepat
npm install @zxing/browser
```

## Monitoring Production

### 1. Analytics
```typescript
// Track scan performance
analytics.track('qr_scan_performance', {
  scanTime: totalTime,
  apiTime: apiTime,
  deviceType: navigator.userAgent,
  success: true,
});
```

### 2. Error Tracking
```typescript
// Sentry atau similar
Sentry.captureMessage('Slow QR scan', {
  level: 'warning',
  extra: { scanTime, threshold: 2000 },
});
```

## Checklist Testing

- [ ] Test di Chrome desktop dengan webcam
- [ ] Test di Firefox desktop dengan webcam
- [ ] Test di Chrome Android dengan kamera belakang
- [ ] Test di Safari iOS dengan kamera belakang
- [ ] Test dengan network throttling (Fast 3G)
- [ ] Test dengan QR code berbagai ukuran
- [ ] Test dengan pencahayaan berbeda
- [ ] Test fallback input manual
- [ ] Verify console logs menunjukkan timing
- [ ] Verify UI indicator warna sesuai (hijau/kuning)
- [ ] Test dengan backend mock (fast response)
- [ ] Test dengan backend real (production-like)

## Dokumentasi Hasil

Setelah testing, dokumentasikan:
1. Perangkat yang digunakan
2. Browser & versi
3. Rata-rata waktu scan
4. Kondisi testing (network, lighting, dll)
5. Screenshot indikator performa
6. Issues yang ditemukan

---

**Status**: Optimasi selesai, siap untuk testing manual
**Target**: 90% scan ≤ 2 detik pada perangkat modern dengan koneksi baik
