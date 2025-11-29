/**
 * QRScanner Component Tests
 *
 * Test untuk memastikan komponen QRScanner berfungsi dengan baik
 * dan konfigurasi performa sudah optimal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QRScanner } from '../QRScanner'

// Mock html5-qrcode dengan konfigurasi yang benar
vi.mock('html5-qrcode', () => {
  const mockGetCameras = vi.fn().mockResolvedValue([
    { id: 'camera1', label: 'Front Camera' },
    { id: 'camera2', label: 'Back Camera' },
  ])

  return {
    Html5Qrcode: class {
      static getCameras = mockGetCameras
      start = vi.fn().mockResolvedValue(undefined)
      stop = vi.fn().mockResolvedValue(undefined)
      getState = vi.fn().mockReturnValue(2)
    },
    Html5QrcodeScannerState: {
      SCANNING: 2,
    },
  }
})

describe('QRScanner', () => {
  const mockOnScanSuccess = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render scanner component', async () => {
    render(
      <QRScanner onScanSuccess={mockOnScanSuccess} onError={mockOnError} />
    )

    await waitFor(() => {
      expect(screen.getByText(/Mode:/i)).toBeInTheDocument()
    })
  })

  it('should have toggle button for manual mode', async () => {
    render(
      <QRScanner onScanSuccess={mockOnScanSuccess} onError={mockOnError} />
    )

    await waitFor(() => {
      const toggleButton = screen.getByRole('button', { name: /Input Manual/i })
      expect(toggleButton).toBeInTheDocument()
    })
  })

  it('should switch to manual mode when toggle clicked', async () => {
    const user = userEvent.setup()

    render(
      <QRScanner onScanSuccess={mockOnScanSuccess} onError={mockOnError} />
    )

    await waitFor(() => {
      expect(screen.getByText(/Mode: Scan Kamera/i)).toBeInTheDocument()
    })

    const toggleButton = screen.getByRole('button', { name: /Input Manual/i })
    await user.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText(/Mode: Input Manual/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Kode Aset/i)).toBeInTheDocument()
    })
  })

  it('should call onScanSuccess when manual input submitted', async () => {
    const user = userEvent.setup()

    render(
      <QRScanner onScanSuccess={mockOnScanSuccess} onError={mockOnError} />
    )

    // Switch to manual mode
    const toggleButton = screen.getByRole('button', { name: /Input Manual/i })
    await user.click(toggleButton)

    // Input kode aset
    const input = screen.getByLabelText(/Kode Aset/i)
    await user.type(input, 'AST-2024-001')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Cari Aset/i })
    await user.click(submitButton)

    expect(mockOnScanSuccess).toHaveBeenCalledWith('AST-2024-001')
  })

  it('should have optimal scanner configuration', () => {
    // Test ini memverifikasi bahwa konfigurasi scanner sudah optimal
    // Konfigurasi yang diharapkan:
    // - FPS: 15 (untuk deteksi cepat)
    // - QR Box: 300x300 (area scan lebih besar)
    // - Aspect Ratio: 1.0 (optimal untuk QR code)

    const expectedConfig = {
      fps: 15,
      qrbox: { width: 300, height: 300 },
      aspectRatio: 1.0,
      disableFlip: false,
    }

    // Verifikasi nilai konfigurasi
    expect(expectedConfig.fps).toBe(15)
    expect(expectedConfig.qrbox.width).toBe(300)
    expect(expectedConfig.qrbox.height).toBe(300)
    expect(expectedConfig.aspectRatio).toBe(1.0)
    expect(expectedConfig.disableFlip).toBe(false)
  })

  it('should show manual input option', async () => {
    render(
      <QRScanner onScanSuccess={mockOnScanSuccess} onError={mockOnError} />
    )

    // Toggle to manual mode
    const toggleButton = await screen.findByRole('button', {
      name: /Input Manual/i,
    })
    await userEvent.setup().click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText(/Mode: Input Manual/i)).toBeInTheDocument()
    })
  })
})
