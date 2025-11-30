import { useRef } from 'react'
import QRCode from 'react-qr-code'
import { Download, Printer, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { showSuccessToast, showErrorToast } from '@/libs/ui/toast'

interface QRCodeDisplayProps {
  kodeAset: string
  namaBarang: string
  kategori?: string
}

/**
 * QRCodeDisplay - Komponen untuk menampilkan QR code dengan opsi download dan cetak
 */
export function QRCodeDisplay({
  kodeAset,
  namaBarang,
  kategori,
}: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  // Download QR code as PNG
  const handleDownload = async () => {
    try {
      const svg = qrRef.current?.querySelector('svg')
      if (!svg) return

      // Convert SVG to canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const svgData = new XMLSerializer().serializeToString(svg)
      const img = new Image()

      img.onload = () => {
        canvas.width = 300
        canvas.height = 300
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 50, 50, 200, 200)

        // Add text
        ctx.fillStyle = 'black'
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(kodeAset, 150, 280)

        // Download
        const link = document.createElement('a')
        link.download = `QR-${kodeAset.replace(/\//g, '-')}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()

        showSuccessToast('QR Code berhasil didownload')
      }

      img.src =
        'data:image/svg+xml;base64,' +
        btoa(unescape(encodeURIComponent(svgData)))
    } catch {
      showErrorToast('Gagal mendownload QR Code')
    }
  }

  // Print QR code
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${kodeAset}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .qr-container {
              text-align: center;
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              padding: 24px;
              background: white;
            }
            .qr-code {
              margin-bottom: 16px;
            }
            .kode-aset {
              font-size: 18px;
              font-weight: bold;
              color: #111827;
              margin-bottom: 8px;
            }
            .nama-barang {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 4px;
            }
            .kategori {
              font-size: 12px;
              color: #9ca3af;
            }
            @media print {
              body { margin: 0; }
              .qr-container { border: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-code">
              ${qrRef.current?.innerHTML || ''}
            </div>
            <div class="kode-aset">${kodeAset}</div>
            <div class="nama-barang">${namaBarang}</div>
            ${kategori ? `<div class="kategori">${kategori}</div>` : ''}
          </div>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <QrCode className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
      </div>

      {/* QR Code Display */}
      <div className="flex flex-col items-center">
        <div ref={qrRef} className="bg-white p-4 rounded-lg border mb-4">
          <QRCode value={kodeAset} size={150} level="M" />
        </div>

        <p className="text-sm font-mono font-medium text-gray-700 mb-1">
          {kodeAset}
        </p>
        <p className="text-xs text-gray-500 mb-4">{namaBarang}</p>

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
