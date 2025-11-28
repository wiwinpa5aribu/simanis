/**
 * App Component - Root component aplikasi
 * Menangani routing dan layout utama aplikasi
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NetworkProvider } from './contexts/NetworkContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './routes/auth/LoginPage'
import { AssetsListPage } from './routes/assets/AssetsListPage'
import { AssetsFavoritesPage } from './routes/assets/AssetsFavoritesPage'
import { CategoriesPage } from './routes/categories/CategoriesPage'
import { LoansListPage } from './routes/loans/LoansListPage'
import { AssetCreatePage } from './routes/assets/AssetCreatePage'
import { AssetDetailPage } from './routes/assets/AssetDetailPage'
import { AssetEditPage } from './routes/assets/AssetEditPage'
import { QRCodePrintPage } from './routes/assets/QRCodePrintPage'
import { LoanCreatePage } from './routes/loans/LoanCreatePage'
import { LoanDetailPage } from './routes/loans/LoanDetailPage'
import InventoryListPage from './routes/inventory/InventoryListPage'
import InventoryScanPage from './routes/inventory/InventoryScanPage'
import DepreciationListPage from './routes/depreciation/DepreciationListPage'
import KIBGeneratePage from './routes/reports/KIBGeneratePage'
import AuditListPage from './routes/audit/AuditListPage'
import { UserActivityPage } from './routes/profile/UserActivityPage'
import { UsersListPage } from './routes/users/UsersListPage'
import { AdminRoute } from './components/layout/AdminRoute'
import DashboardPage from './routes/dashboard/DashboardPage'
import { logger } from './libs/utils/logger'

function App() {
  // Log saat aplikasi dimuat
  logger.info('App', 'Aplikasi SIMANIS dimuat')

  return (
    <ErrorBoundary>
      <NetworkProvider>
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
            <Route path="assets/:id/edit" element={<AssetEditPage />} />
            <Route path="assets/print-qr" element={<QRCodePrintPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="loans" element={<LoansListPage />} />
            <Route path="loans/new" element={<LoanCreatePage />} />
            <Route path="loans/:id" element={<LoanDetailPage />} />
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

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="users" element={<UsersListPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
      </NetworkProvider>
    </ErrorBoundary>
  )
}

export default App
