/**
 * Halaman Scan Inventarisasi
 *
 * Halaman untuk melakukan inventarisasi aset menggunakan QR scanner atau input manual.
 * Alur:
 * 1. Scan QR code atau input manual kode aset
 * 2. Fetch detail aset berdasarkan kode
 * 3. Tampilkan form inventarisasi (foto + catatan)
 * 4. Submit inventarisasi
 */

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { QRScanner } from "./components/QRScanner";
import { InventoryForm } from "./components/InventoryForm";
import { getAssetByCode } from "@/libs/api/assets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle, Clock } from "lucide-react";

export default function InventoryScanPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scanTime, setScanTime] = useState<number | null>(null);
  const scanStartTimeRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Query untuk fetch detail aset berdasarkan kode
  // Optimasi: staleTime 30s untuk menghindari fetch ulang jika scan kode yang sama
  const {
    data: asset,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["asset", "by-code", scannedCode],
    queryFn: async () => {
      // Mulai timer untuk mengukur waktu respons API
      const apiStartTime = performance.now();
      const result = await getAssetByCode(scannedCode!);
      const apiEndTime = performance.now();
      const apiTime = apiEndTime - apiStartTime;

      // Hitung total waktu dari scan hingga data diterima
      if (scanStartTimeRef.current) {
        const totalTime = apiEndTime - scanStartTimeRef.current;
        setScanTime(totalTime);
        console.log(`[Performance] Total scan to data: ${totalTime.toFixed(0)}ms`);
        console.log(`[Performance] API call time: ${apiTime.toFixed(0)}ms`);
      }

      return result;
    },
    enabled: !!scannedCode,
    retry: false,
    staleTime: 30000, // Cache selama 30 detik untuk performa lebih baik
  });

  const handleScanSuccess = (code: string) => {
    // Catat waktu mulai scan untuk pengukuran performa
    scanStartTimeRef.current = performance.now();
    setScannedCode(code);
    setShowSuccess(false);
    setScanTime(null);
  };

  const handleScanError = (errorMsg: string) => {
    console.error("Scan error:", errorMsg);
  };

  const handleInventorySuccess = () => {
    setShowSuccess(true);
    // Reset setelah 2 detik
    setTimeout(() => {
      setScannedCode(null);
      setShowSuccess(false);
    }, 2000);
  };

  const handleCancel = () => {
    setScannedCode(null);
    setShowSuccess(false);
    setScanTime(null);
    scanStartTimeRef.current = null;
  };

  const handleBack = () => {
    navigate("/inventory");
  };

  return (
    <div className="container max-w-2xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Scan Inventarisasi</h1>
          <p className="text-muted-foreground">
            Scan QR code atau input kode aset secara manual
          </p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Inventarisasi berhasil disimpan!
          </AlertDescription>
        </Alert>
      )}

      {/* QR Scanner */}
      {!scannedCode && !showSuccess && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Aset</CardTitle>
            <CardDescription>
              Gunakan kamera untuk scan QR code atau input kode aset secara
              manual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onError={handleScanError}
            />
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {scannedCode && isLoading && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Mencari aset...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {scannedCode && isError && (
        <Card>
          <CardContent className="py-6 space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Aset tidak ditemukan dengan kode: " + scannedCode}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Scan Ulang
              </Button>
              <Button onClick={() => refetch()} className="flex-1">
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Form */}
      {scannedCode && asset && !showSuccess && (
        <>
          {/* Performance Indicator - hanya tampil jika waktu scan tersedia */}
          {scanTime !== null && (
            <Alert
              className={
                scanTime <= 2000
                  ? "border-green-500 bg-green-50"
                  : "border-yellow-500 bg-yellow-50"
              }
            >
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">
                  Waktu respons: {scanTime.toFixed(0)}ms
                </span>
                {scanTime <= 2000 ? (
                  <span className="text-green-700 ml-2">✓ Performa optimal</span>
                ) : (
                  <span className="text-yellow-700 ml-2">
                    ⚠ Koneksi lambat
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Form Inventarisasi</CardTitle>
              <CardDescription>
                Lengkapi data inventarisasi untuk aset yang dipilih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryForm
                assetId={asset.id}
                assetCode={asset.kode_aset}
                assetName={asset.nama_barang}
                onSuccess={handleInventorySuccess}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
