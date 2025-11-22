# Komponen Inventarisasi

## QRScanner

Komponen untuk scan QR code aset menggunakan kamera perangkat.

### Optimasi Performa

Komponen ini telah dioptimasi untuk memastikan waktu respons ≤ 2 detik pada perangkat modern:

#### 1. Konfigurasi Scanner Optimal
- **FPS: 15** - Meningkat dari 10 untuk deteksi lebih cepat
- **QR Box: 300x300px** - Area scan lebih besar untuk deteksi lebih mudah
- **Aspect Ratio: 1.0** - Optimal untuk QR code persegi
- **Disable Flip: false** - Aktifkan deteksi dari berbagai sudut

#### 2. Optimasi API Call
- **Stale Time: 30s** - Cache hasil untuk menghindari fetch ulang
- **Retry: false** - Tidak retry otomatis untuk respons lebih cepat
- **Performance Monitoring** - Tracking waktu scan hingga data diterima

#### 3. Pengukuran Performa
Sistem secara otomatis mengukur:
- Waktu dari scan QR hingga data aset diterima
- Waktu API call ke backend
- Menampilkan indikator performa di UI

#### 4. Target Performa
- **Scan Detection**: < 500ms (tergantung kualitas kamera)
- **API Response**: < 1500ms (tergantung koneksi & backend)
- **Total Time**: ≤ 2000ms (2 detik)

### Cara Penggunaan

```tsx
import { QRScanner } from './components/QRScanner';

function MyComponent() {
  const handleScanSuccess = (code: string) => {
    console.log('Scanned code:', code);
  };

  return (
    <QRScanner 
      onScanSuccess={handleScanSuccess}
      onError={(error) => console.error(error)}
    />
  );
}
```

### Fallback Mode

Jika kamera tidak tersedia atau izin ditolak, komponen otomatis menyediakan:
- Input manual kode aset
- Validasi input
- UI yang konsisten dengan mode scan

### Tips Performa

1. **Gunakan kamera belakang** - Biasanya lebih cepat dan akurat
2. **Pencahayaan cukup** - Deteksi lebih cepat dengan cahaya baik
3. **Jarak optimal** - 10-30cm dari QR code
4. **QR code jelas** - Hindari QR code rusak atau kotor

### Troubleshooting

#### Scan lambat (> 2 detik)
- Periksa koneksi internet
- Pastikan backend API responsif
- Cek kualitas kamera perangkat
- Pastikan QR code tidak rusak

#### Kamera tidak terdeteksi
- Periksa izin browser untuk akses kamera
- Pastikan tidak ada aplikasi lain yang menggunakan kamera
- Gunakan fallback input manual

#### Error Permission Denied
- Aktifkan izin kamera di pengaturan browser
- Reload halaman setelah mengaktifkan izin
- Gunakan fallback input manual sebagai alternatif

## InventoryForm

Komponen form untuk input data inventarisasi (foto + catatan).

### Fitur
- Upload foto dengan validasi ukuran (≤5MB)
- Progress bar upload
- Preview foto sebelum upload
- Validasi dengan Zod schema
- Error handling yang jelas

### Cara Penggunaan

```tsx
import { InventoryForm } from './components/InventoryForm';

function MyComponent() {
  return (
    <InventoryForm
      assetId={123}
      assetCode="AST-2024-001"
      assetName="Laptop Dell"
      onSuccess={() => console.log('Success')}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```
