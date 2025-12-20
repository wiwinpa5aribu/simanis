import { SummaryCards } from "@/components/dashboard/summary-cards"
import { AssetByStatusChart } from "@/components/dashboard/asset-by-status-chart"
import { AssetTrendChart } from "@/components/dashboard/asset-trend-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { prisma } from "@/lib/db"

export default async function DashboardPage() {
  // Fetch data for Asset By Status Chart
  const statusCounts = await prisma.asset.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  })

  const statusData = [
    {
      name: "Aktif",
      value: statusCounts.find((s) => s.status === "aktif")?._count.status || 0,
      color: "var(--chart-1)",
    },
    {
      name: "Maintenance",
      value: statusCounts.find((s) => s.status === "maintenance")?._count.status || 0,
      color: "var(--chart-3)",
    },
    {
      name: "Tidak Aktif",
      value: statusCounts.find((s) => s.status === "tidak_aktif")?._count.status || 0,
      color: "var(--chart-2)",
    },
    {
      name: "Dihapuskan",
      value: statusCounts.find((s) => s.status === "dihapuskan")?._count.status || 0,
      color: "var(--chart-4)",
    },
  ]

  // Fetch recent audit logs to map as activities
  const recentLogs = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  })

  type ActivityType = "registrasi" | "mutasi" | "status" | "opname"

  const activities = recentLogs.map((log: any) => {
    let type: ActivityType = "status"
    if (log.module === "Aset" && log.action === "CREATE") type = "registrasi"
    if (log.module === "Mutasi") type = "mutasi"
    if (log.module === "Stock Opname") type = "opname"

    return {
      id: log.id,
      title: log.module === "Aset" ? "Aktivitas Aset" : log.module,
      description: log.details,
      user: log.user,
      timestamp: log.timestamp,
      type: type,
    }
  })

  // Mock trend data for now (could be aggregated from Mutation/Asset createdAt in next step)
  const trendData = [
    { month: "Jan", total: 1050, baru: 45 },
    { month: "Feb", total: 1080, baru: 38 },
    { month: "Mar", total: 1120, baru: 52 },
    { month: "Apr", total: 1145, baru: 31 },
    { month: "Mei", total: 1180, baru: 42 },
    { month: "Jun", total: 1195, baru: 28 },
    { month: "Jul", total: 1210, baru: 35 },
    { month: "Agu", total: 1225, baru: 22 },
    { month: "Sep", total: 1235, baru: 18 },
    { month: "Okt", total: 1240, baru: 12 },
    { month: "Nov", total: 1245, baru: 15 },
    { month: "Des", total: statusData.reduce((acc, curr) => acc + curr.value, 0), baru: 8 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Sistem Manajemen Aset Sekolah</p>
      </div>

      <SummaryCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <AssetTrendChart data={trendData} />
        <AssetByStatusChart data={statusData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
        <QuickActions />
      </div>
    </div>
  )
}
