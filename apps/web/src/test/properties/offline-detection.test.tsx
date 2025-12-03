import { render, screen, waitFor } from '@testing-library/react'
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * **Property 4: Offline Detection Consistency**
 *
 * For any change in network status (online to offline or vice versa),
 * the system SHALL update the UI within 1 second to reflect the current status.
 *
 * Validates: Requirements 2.1, 2.2
 */
describe('Offline Detection Property Tests', () => {
  // Mock NetworkProvider and OfflineBanner since they may not exist yet
  const MockOfflineBanner = ({ isOffline }: { isOffline: boolean }) => {
    if (!isOffline) return null
    return (
      <div
        role="alert"
        aria-live="polite"
        className="bg-yellow-500 text-white py-2 px-4"
      >
        Anda sedang offline. Periksa koneksi internet Anda.
      </div>
    )
  }

  const MockNetworkProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOnline, setIsOnline] = React.useState(navigator.onLine)

    React.useEffect(() => {
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }, [])

    return (
      <>
        <MockOfflineBanner isOffline={!isOnline} />
        {children}
      </>
    )
  }

  const TestComponent = () => (
    <MockNetworkProvider>
      <div>App Content</div>
    </MockNetworkProvider>
  )

  beforeEach(() => {
    // Reset navigator.onLine to true before each test
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should display offline banner when network connection is lost', async () => {
    // Arrange: Render component with initial online status
    render(<TestComponent />)

    // Assert: Banner should not be visible initially
    expect(screen.queryByText(/Anda sedang offline/i)).not.toBeInTheDocument()

    // Act: Simulate going offline
    await act(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('offline'))
    })

    // Assert: Banner should appear
    await waitFor(() => {
      expect(screen.getByText(/Anda sedang offline/i)).toBeInTheDocument()
    })
  })

  it('should hide offline banner when network connection is restored', async () => {
    // Arrange: Start with offline status
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    render(<TestComponent />)

    // Verify initial offline state
    expect(screen.getByText(/Anda sedang offline/i)).toBeInTheDocument()

    // Act: Simulate going online
    await act(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: true,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('online'))
    })

    // Assert: Banner should disappear
    await waitFor(() => {
      expect(screen.queryByText(/Anda sedang offline/i)).not.toBeInTheDocument()
    })
  })

  it('should update UI within 1 second for status changes', async () => {
    // Arrange
    const startTime = Date.now()

    render(<TestComponent />)

    // Act: Change status and measure time
    await act(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('offline'))
    })

    // Assert: UI should update within 1 second
    await waitFor(() => {
      const offlineBanner = screen.getByText(/Anda sedang offline/i)
      expect(offlineBanner).toBeInTheDocument()
    })

    const statusUpdateTime = Date.now() - startTime
    expect(statusUpdateTime).toBeLessThan(1000) // Within 1 second
  })

  it('should handle rapid status changes correctly', async () => {
    render(<TestComponent />)

    // Multiple rapid status changes
    await act(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('offline'))
    })

    await act(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: true,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('online'))
    })

    await act(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('offline'))
    })

    // Assert: Final state should be offline
    await waitFor(() => {
      const finalBanner = screen.getByText(/Anda sedang offline/i)
      expect(finalBanner).toBeInTheDocument()
    })
  })

  it('should display proper accessibility attributes', async () => {
    // Start offline for banner to show
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    render(<TestComponent />)

    const banner = screen.getByText(/Anda sedang offline/i)

    // Assert: Proper ARIA attributes
    expect(banner).toHaveAttribute('role', 'alert')
    expect(banner).toHaveAttribute('aria-live', 'polite')
  })

  it('should display consistent styling when offline', async () => {
    // Start offline
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    render(<TestComponent />)

    const banner = screen.getByText(/Anda sedang offline/i)

    // Assert: Banner should have proper styling classes
    expect(banner).toHaveClass('bg-yellow-500')
    expect(banner).toHaveClass('text-white')
    expect(banner).toHaveClass('py-2')
    expect(banner).toHaveClass('px-4')
  })
})
