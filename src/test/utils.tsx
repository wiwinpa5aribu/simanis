/* eslint-disable react-refresh/only-export-components */
/**
 * Test Utilities
 *
 * Helper functions untuk testing React components
 */

import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Create a custom render function yang include providers
function AllTheProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retry untuk testing
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export specific items from testing-library (not using export *)
export {
  screen,
  fireEvent,
  waitFor as waitForElement,
  within,
  cleanup,
} from '@testing-library/react'
export { customRender as render }

// Helper untuk wait dengan timeout
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Helper untuk mock API response
export const mockApiResponse = <T,>(data: T, delay = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

// Helper untuk mock API error
export const mockApiError = (message: string, status = 500, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(
      () =>
        reject({
          response: {
            status,
            data: { error: { message } },
          },
        }),
      delay
    )
  })
}
