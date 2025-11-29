/**
 * Komponen QRScanner
 *
 * Menggunakan html5-qrcode untuk scan QR code melalui kamera.
 * Fitur:
 * - Akses kamera belakang (jika tersedia)
 * - Fallback ke input manual jika izin kamera ditolak
 * - Error handling yang jelas
 *
 * Props:
 * - onScanSuccess: callback saat QR berhasil di-scan (menerima kode aset)
 * - onError: callback saat terjadi error
 */

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { logger } from '@/libs/utils/logger'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, CameraOff, Keyboard } from 'lucide-react'

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  onError?: (error: string) => void
}

export function QRScanner({ onScanSuccess, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualMode, setManualMode] = useState(false)
  const [manualInput, setManualInput] = useState('')
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerElementId = 'qr-reader'

  // Inisialisasi scanner dan dapatkan daftar kamera
  useEffect(() => {
    const initScanner = async () => {
      try {
        // Dapatkan daftar kamera
        const devices = await Html5Qrcode.getCameras()

        if (devices && devices.length > 0) {
          setCameras(devices.map((d) => ({ id: d.id, label: d.label })))

          // Pilih kamera belakang jika tersedia (biasanya mengandung kata "back" atau "rear")
          const backCamera = devices.find(
            (d) =>
              d.label.toLowerCase().includes('back') ||
              d.label.toLowerCase().includes('rear')
          )

          setSelectedCamera(backCamera?.id || devices[0].id)
        } else {
          setError('Tidak ada kamera yang tersedia')
          setManualMode(true)
        }
      } catch (err) {
        logger.error('QRScanner', 'Error getting cameras', err)
        setError('Gagal mengakses kamera. Silakan gunakan input manual.')
        setManualMode(true)
        if (onError) onError('Gagal mengakses kamera')
      }
    }

    initScanner()

    // Cleanup saat unmount
    return () => {
      if (
        scannerRef.current &&
        scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
      ) {
        scannerRef.current
          .stop()
          .catch((err) =>
            logger.error('QRScanner', 'Error stopping scanner on cleanup', err)
          )
      }
    }
  }, [onError])

  const startScanning = async () => {
    if (!selectedCamera) {
      setError('Tidak ada kamera yang dipilih')
      return
    }

    try {
      setError(null)

      // Inisialisasi scanner jika belum ada
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerElementId)
      }

      // Mulai scanning dengan konfigurasi optimal untuk performa
      // FPS 15 memberikan keseimbangan antara kecepatan deteksi dan performa
      // QR box lebih besar untuk deteksi lebih cepat
      await scannerRef.current.start(
        selectedCamera,
        {
          fps: 15, // Frame per second - ditingkatkan untuk deteksi lebih cepat
          qrbox: { width: 300, height: 300 }, // Area scan lebih besar untuk deteksi lebih mudah
          aspectRatio: 1.0, // Rasio aspek persegi untuk QR code
          disableFlip: false, // Aktifkan flip untuk deteksi dari berbagai sudut
        },
        (decodedText) => {
          // Callback saat QR berhasil di-scan
          // Langsung panggil callback tanpa delay untuk respons cepat
          onScanSuccess(decodedText)
          stopScanning()
        },
        () => {
          // Error saat scanning (biasanya "No QR code found")
          // Kita abaikan error ini karena normal saat tidak ada QR di frame
        }
      )

      setIsScanning(true)
    } catch (err) {
      logger.error('QRScanner', 'Error starting scanner', err)
      const errorMsg =
        err instanceof Error ? err.message : 'Gagal memulai scanner'
      setError(errorMsg)
      if (onError) onError(errorMsg)

      // Jika gagal, tawarkan mode manual
      if (errorMsg.includes('Permission') || errorMsg.includes('NotAllowed')) {
        setError(
          'Izin kamera ditolak. Silakan gunakan input manual atau aktifkan izin kamera di pengaturan browser.'
        )
        setManualMode(true)
      }
    }
  }

  const stopScanning = async () => {
    if (
      scannerRef.current &&
      scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      try {
        await scannerRef.current.stop()
        setIsScanning(false)
      } catch (err) {
        logger.error('QRScanner', 'Error stopping scanner', err)
      }
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim())
      setManualInput('')
    }
  }

  const toggleMode = () => {
    if (isScanning) {
      stopScanning()
    }
    setManualMode(!manualMode)
    setError(null)
  }

  return (
    <div className="space-y-4">
      {/* Toggle Mode Button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {manualMode ? 'Mode: Input Manual' : 'Mode: Scan Kamera'}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={toggleMode}>
          {manualMode ? (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Gunakan Kamera
            </>
          ) : (
            <>
              <Keyboard className="mr-2 h-4 w-4" />
              Input Manual
            </>
          )}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Scanner Mode */}
      {!manualMode && (
        <div className="space-y-4">
          {/* Pilih Kamera (jika ada lebih dari 1) */}
          {cameras.length > 1 && !isScanning && (
            <div className="space-y-2">
              <Label htmlFor="camera-select">Pilih Kamera</Label>
              <select
                id="camera-select"
                className="w-full p-2 border rounded-md"
                value={selectedCamera || ''}
                onChange={(e) => setSelectedCamera(e.target.value)}
              >
                {cameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Scanner Container */}
          <div className="relative">
            <div
              id={scannerElementId}
              className="w-full rounded-md overflow-hidden border"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2">
            {!isScanning ? (
              <Button
                type="button"
                onClick={startScanning}
                className="w-full"
                disabled={!selectedCamera}
              >
                <Camera className="mr-2 h-4 w-4" />
                Mulai Scan
              </Button>
            ) : (
              <Button
                type="button"
                variant="destructive"
                onClick={stopScanning}
                className="w-full"
              >
                <CameraOff className="mr-2 h-4 w-4" />
                Hentikan Scan
              </Button>
            )}
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-800">
              <strong>Cara scan:</strong> Arahkan kamera ke QR code aset dan
              pastikan QR code berada di dalam kotak scan. Hasil akan muncul
              otomatis saat QR code terdeteksi.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Manual Input Mode */}
      {manualMode && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manual-code">Kode Aset</Label>
            <Input
              id="manual-code"
              type="text"
              placeholder="Contoh: AST-2024-001"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Masukkan kode aset yang tertera pada label atau stiker aset
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!manualInput.trim()}
          >
            <Keyboard className="mr-2 h-4 w-4" />
            Cari Aset
          </Button>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-800">
              <strong>Tips:</strong> Gunakan input manual jika:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Kamera tidak tersedia atau tidak berfungsi</li>
                <li>QR code rusak atau tidak terbaca</li>
                <li>Lebih cepat mengetik kode secara langsung</li>
              </ul>
            </AlertDescription>
          </Alert>
        </form>
      )}
    </div>
  )
}
