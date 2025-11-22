/**
 * App Component - Root component aplikasi
 * Menangani routing dan layout utama aplikasi
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './routes/auth/LoginPage'
import { AssetsListPage } from './routes/assets/AssetsListPage'
import { AssetsFavoritesPage } from './routes/assets/AssetsFavoritesPage'
import { CategoriesPage } from './routes/categories/CategoriesPage'
import { LoansListPage } from './routes/loans/LoansListPage'
import { AssetCreatePage } from './routes/assets/AssetCreatePage'
import { AssetDetailPage } from './routes/assets/AssetDetailPage'
import { LoanCreatePage } from './routes/loans/LoanCreatePage'
import InventoryListPage from './routes/inventory/InventoryListPage'
import InventoryScanPage from './routes/inventory/InventoryScanPage'
import DepreciationListPage from './routes/depreciation/DepreciationListPage'
import KIBGeneratePage from './routes/reports/KIBGeneratePage'
import AuditListPage from './routes/audit/AuditListPage'
import { UserActivityPage } from './routes/profile/UserActivityPage'
import DashboardPage from './routes/dashboard/DashboardPage'
import { logger } from './libs/utils/logger'

function App() {
  // Log saat aplikasi dimuat
  logger.info('App', 'Aplikasi SIMANIS dimuat')

  return (
    <ErrorBoundary>
      <Routes>
        {/* Route Publik */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route Terproteksi (Butuh Login) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Redirect root ke /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<DashboardPage />} />

            <Route path="assets" element={<AssetsListPage />} />
            <Route path="assets/favorites" element={<AssetsFavoritesPage />} />
            <Route path="assets/new" element={<AssetCreatePage />} />
            <Route path="assets/:id" element={<AssetDetailPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="loans" element={<LoansListPage />} />
            <Route path="loans/new" element={<LoanCreatePage />} />
            <Route
              path="inventory"
              element={
                <ErrorBoundary>
                  <InventoryListPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="inventory/scan"
              element={
                <ErrorBoundary>
                  <InventoryScanPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="depreciation"
              element={
                <ErrorBoundary>
                  <DepreciationListPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="reports/kib"
              element={
                <ErrorBoundary>
                  <KIBGeneratePage />
                </ErrorBoundary>
              }
            />
            <Route
              path="audit"
              element={
                <ErrorBoundary>
                  <AuditListPage />
                </ErrorBoundary>
              }
            />
            <Route path="profile/activity" element={<UserActivityPage />} />
          </Route>
        </Route>
      </Routes>

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  )
}

export default App
