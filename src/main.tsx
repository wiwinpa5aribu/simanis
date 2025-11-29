/**
 * Main Entry Point - Titik masuk utama aplikasi SIMANIS
 * Menginisialisasi React, React Query, Router, dan Error Tracking
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.tsx'
import { logEnvironment } from './libs/utils/env'
import { logger } from './libs/utils/logger'
import { initSentry } from './libs/sentry'
import { ErrorBoundary } from './components/ErrorBoundary'

// Initialize Sentry for error tracking (production only)
initSentry()

// Log environment configuration (development only)
logEnvironment()

/**
 * Inisialisasi QueryClient untuk manajemen state server (TanStack Query)
 * QueryClient menangani caching, refetching, dan state management untuk data dari API
 *
 * Dilengkapi dengan Global Error Handler untuk logging otomatis
 */
const queryClient = new QueryClient({
  // Global Error Handler untuk Queries (GET)
  queryCache: new QueryCache({
    onError: (error, query) => {
      logger.error(
        'QueryClient',
        `Gagal mengambil data: ${JSON.stringify(query.queryKey)}`,
        error
      )
    },
  }),

  // Global Error Handler untuk Mutations (POST, PUT, DELETE)
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      logger.error(
        'QueryClient',
        `Gagal melakukan mutasi${mutation.options.mutationKey ? `: ${JSON.stringify(mutation.options.mutationKey)}` : ''}`,
        error
      )
    },
  }),

  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Nonaktifkan refetch otomatis saat window fokus
      retry: 1, // Coba ulang request gagal maksimal 1 kali
      staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
    },
    mutations: {
      retry: 0, // Tidak retry untuk mutations
    },
  },
})

// Log saat aplikasi mulai diinisialisasi
logger.info('Main', '🚀 Memulai aplikasi SIMANIS')

/**
 * Render aplikasi ke DOM
 * Struktur:
 * - StrictMode: Mode strict React untuk mendeteksi masalah
 * - QueryClientProvider: Provider untuk React Query
 * - BrowserRouter: Router untuk navigasi
 * - App: Komponen root aplikasi
 */
try {
  const rootElement = document.getElementById('root')

  if (!rootElement) {
    throw new Error('Root element tidak ditemukan')
  }

  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          {/* DevTools hanya muncul di development mode */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  )

  logger.success('Main', '✅ Aplikasi berhasil di-render')
} catch (error) {
  logger.error('Main', '❌ Gagal me-render aplikasi', error as Error)

  // Tampilkan error di halaman jika gagal render
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #EF4444;">Gagal Memuat Aplikasi</h1>
        <p style="color: #6B7280;">Terjadi kesalahan saat memuat aplikasi. Silakan refresh halaman.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3B82F6; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Refresh Halaman
        </button>
      </div>
    </div>
  `
}
