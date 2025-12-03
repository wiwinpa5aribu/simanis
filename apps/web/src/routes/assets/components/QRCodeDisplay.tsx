import { Download, Printer, QrCode } from 'lucide-react'
import { useCallback, useRef } from 'react'
import QRCodeLib from 'react-qr-code'

// Handle both default and named export from react-qr-code
const QRCode =
  (QRCodeLib as unknown as { default?: typeof QRCodeLib }).default || QRCodeLib

import { Button } from '@/components/ui/button'
import { showErrorToast, showSuccessToast } from '@/libs/ui/toast'

interface QRCodeDisplayProps {
  kodeAset: string
  namaBarang: string
  kategori?: string
  /** Ukuran QR code dalam pixel (default: 150) */
  size?: number
  /** Tampilkan dalam mode compact untuk mobile */
  compact?: boolean
}

/**
 * QRCodeDisplay - Komponen untuk menampilkan QR code dengan opsi download dan cetak
 *
 * Features:
 * - Download QR code sebagai PNG dengan kode aset
 * - Cetak QR code dengan layout print-friendly
 * - Responsive design dengan mode compact untuk mobile
 */
export function QRCodeDisplay({
  kodeAset,
  namaBarang,
  kategori,
  size = 150,
  compact = false,
}: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  // Convert SVG to base64 for image processing
  const svgToBase64 = useCallback((svgElement: SVGElement): string => {
    const svgData = new XMLSerializer().serializeToString(svgElement)
    // Use encodeURIComponent for better Unicode support (replaces deprecated unescape)
    return (
      'data:image/svg+xml;base64,' +
      btoa(decodeURIComponent(encodeURIComponent(svgData)))
    )
  }, [])

  // Download QR code as PNG
  const handleDownload = useCallback(async () => {
    try {
      const svg = qrRef.current?.querySelector('svg')
      if (!svg) {
        showErrorToast('QR Code tidak ditemukan')
        return
      }

      // Convert SVG to canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        showErrorToast('Browser tidak mendukung canvas')
        return
      }

      const img = new Image()

      img.onload = () => {
        // Set canvas size with padding for text
        const padding = 50
        const qrSize = 200
        canvas.width = qrSize + padding * 2
        canvas.height = qrSize + padding * 2 + 40 // Extra space for text

        // White background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw QR code centered
        ctx.drawImage(img, padding, padding, qrSize, qrSize)

        // Add asset code text below QR
        ctx.fillStyle = '#111827'
        ctx.font = 'bold 16px Arial, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(kodeAset, canvas.width / 2, qrSize + padding + 30)

        // Create download link
        const link = document.createElement('a')
        link.download = `QR-${kodeAset.replace(/\//g, '-')}.png`
        link.href = canvas.toDataURL('image/png', 1.0)
        link.click()

        showSuccessToast('QR Code berhasil didownload')
      }

      img.onerror = () => {
        showErrorToast('Gagal memproses QR Code')
      }

      img.src = svgToBase64(svg)
    } catch {
      showErrorToast('Gagal mendownload QR Code')
    }
  }, [kodeAset, svgToBase64])

  // Print QR code with print-friendly layout
  const handlePrint = useCallback(() => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) {
      showErrorToast('QR Code tidak ditemukan')
      return
    }

    const svgHtml = new XMLSerializer().serializeToString(svg)

    // Create print-friendly HTML with @media print styles
    const printContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QR Code - ${kodeAset}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
              background: #f9fafb;
            }
            
            .qr-print-container {
              text-align: center;
              border: 2px solid #e5e7eb;
              border-radius: 16px;
              padding: 32px;
              background: white;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              max-width: 320px;
            }
            
            .qr-header {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .qr-code-wrapper {
              display: flex;
              justify-content: center;
              margin-bottom: 20px;
              padding: 16px;
              background: white;
              border-radius: 8px;
            }
            
            .qr-code-wrapper svg {
              width: 180px !important;
              height: 180px !important;
            }
            
            .kode-aset {
              font-size: 20px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 8px;
              font-family: 'Courier New', monospace;
              letter-spacing: 0.5px;
            }
            
            .nama-barang {
              font-size: 14px;
              color: #374151;
              margin-bottom: 4px;
              font-weight: 500;
            }
            
            .kategori {
              font-size: 12px;
              color: #6b7280;
              padding: 4px 12px;
              background: #f3f4f6;
              border-radius: 12px;
              display: inline-block;
              margin-top: 8px;
            }
            
            .print-footer {
              margin-top: 16px;
              padding-top: 12px;
              border-top: 1px dashed #e5e7eb;
              font-size: 10px;
              color: #9ca3af;
            }
            
            /* Print-specific styles */
            @media print {
              @page {
                size: auto;
                margin: 10mm;
              }
              
              body {
                background: white;
                padding: 0;
                min-height: auto;
              }
              
              .qr-print-container {
                border: 2px solid #000;
                box-shadow: none;
                page-break-inside: avoid;
              }
              
              .qr-code-wrapper svg {
                width: 150px !important;
                height: 150px !important;
              }
              
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-print-container">
            <div class="qr-header">Label Aset SIMANIS</div>
            <div class="qr-code-wrapper">
              ${svgHtml}
            </div>
            <div class="kode-aset">${kodeAset}</div>
            <div class="nama-barang">${namaBarang}</div>
            ${kategori ? `<div class="kategori">${kategori}</div>` : ''}
            <div class="print-footer">
              Scan QR untuk info aset
            </div>
          </div>
        </body>
      </html>
    `

    // Open print window
    const printWindow = window.open('', '_blank', 'width=400,height=600')
    if (printWindow) {
      printWindow.document.open()
      printWindow.document.write(printContent)
      printWindow.document.close()

      // Wait for content to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
        }, 250)
      }
    } else {
      showErrorToast('Popup diblokir. Izinkan popup untuk mencetak.')
    }
  }, [kodeAset, namaBarang, kategori])

  // Compact mode for mobile - smaller padding and inline buttons
  if (compact) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center gap-3">
          {/* QR Code - smaller in compact mode */}
          <div ref={qrRef} className="bg-white p-2 rounded border shrink-0">
            <QRCode value={kodeAset} size={80} level="M" />
          </div>

          {/* Info and Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <QrCode className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">QR Code</span>
            </div>
            <p className="text-xs font-mono text-gray-600 truncate mb-2">
              {kodeAset}
            </p>

            {/* Compact Action Buttons */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleDownload}
              >
                <Download className="w-3 h-3 mr-1" />
                PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handlePrint}
              >
                <Printer className="w-3 h-3 mr-1" />
                Cetak
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default full-size display
  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <QrCode className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
      </div>

      {/* QR Code Display */}
      <div className="flex flex-col items-center">
        <div ref={qrRef} className="bg-white p-4 rounded-lg border mb-4">
          <QRCode value={kodeAset} size={size} level="M" />
        </div>

        <p className="text-sm font-mono font-medium text-gray-700 mb-1">
          {kodeAset}
        </p>
        <p className="text-xs text-gray-500 mb-4 text-center line-clamp-2">
          {namaBarang}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-1" />
            Cetak
          </Button>
        </div>
      </div>
    </div>
  )
}
