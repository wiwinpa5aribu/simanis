import { SummaryCards } from "@/components/dashboard/summary-cards"
import { AssetByStatusChart } from "@/components/dashboard/asset-by-status-chart"
import { AssetTrendChart } from "@/components/dashboard/asset-trend-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Sistem Manajemen Aset Sekolah</p>
      </div>

      <SummaryCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <AssetTrendChart />
        <AssetByStatusChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <QuickActions />
      </div>
    </div>
  )
}
