/**
 * Halaman Dashboard
 * 
 * Menampilkan statistik kunci dan aktivitas terbaru sistem SIMANIS
 */

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  HandCoins,
} from "lucide-react";
import { getDashboardStats, getRecentActivities } from "@/libs/api/dashboard";
import { StatCard } from "./components/StatCard";
import { RecentActivities } from "./components/RecentActivities";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logger } from "@/libs/utils/logger";

export default function DashboardPage() {
  useEffect(() => {
    logger.lifecycle("DashboardPage", "mount")
    return () => {
      logger.lifecycle("DashboardPage", "unmount")
    }
  }, [])

  // Fetch statistik
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });

  // Fetch aktivitas terbaru
  const {
    data: activities = [],
    isLoading: isLoadingActivities,
  } = useQuery({
    queryKey: ["dashboard", "activities"],
    queryFn: () => getRecentActivities(10),
  });

  useEffect(() => {
    if (!isLoadingStats && stats) {
      logger.info("DashboardPage", "Statistik dashboard dimuat", {
        totalAssets: stats.total_assets,
        activeLoans: stats.active_loans,
      })
    }
  }, [isLoadingStats, stats])

  useEffect(() => {
    if (!isLoadingActivities && activities) {
      logger.info("DashboardPage", "Aktivitas terbaru dimuat", {
        count: activities.length,
      })
    }
  }, [isLoadingActivities, activities])

  if (isErrorStats) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Gagal memuat data dashboard. Silakan coba lagi nanti.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Ringkasan sistem manajemen aset sekolah
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Aset"
          value={isLoadingStats ? "-" : stats?.total_assets || 0}
          icon={Package}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Kondisi Baik"
          value={
            isLoadingStats ? "-" : stats?.assets_by_condition?.Baik || 0
          }
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Rusak / Hilang"
          value={
            isLoadingStats
              ? "-"
              : (stats?.assets_by_condition?.["Rusak Ringan"] || 0) +
                (stats?.assets_by_condition?.["Rusak Berat"] || 0) +
                (stats?.assets_by_condition?.Hilang || 0)
          }
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
        <StatCard
          title="Peminjaman Aktif"
          value={isLoadingStats ? "-" : stats?.active_loans || 0}
          icon={HandCoins}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Kondisi Aset Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aset per Kondisi</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="text-center py-8 text-gray-500">
                Memuat data...
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Baik</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {stats?.assets_by_condition?.Baik || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">
                      Rusak Ringan
                    </span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {stats?.assets_by_condition?.["Rusak Ringan"] || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-gray-900">
                      Rusak Berat
                    </span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">
                    {stats?.assets_by_condition?.["Rusak Berat"] || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">Hilang</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {stats?.assets_by_condition?.Hilang || 0}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Kategori Aset</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="text-center py-8 text-gray-500">
                Memuat data...
              </div>
            ) : stats?.assets_by_category &&
              stats.assets_by_category.length > 0 ? (
              <div className="space-y-3">
                {stats.assets_by_category.slice(0, 5).map((category, idx) => (
                  <div
                    key={category.category_name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-900">
                        {category.category_name}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada data kategori
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <RecentActivities
        activities={activities}
        isLoading={isLoadingActivities}
      />
    </div>
  );
}
