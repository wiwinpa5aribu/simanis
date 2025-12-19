"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SummaryStats } from "./components/summary-stats"
import { CategoryReport } from "./components/category-report"
import { LocationReport } from "./components/location-report"
import { MutationReport } from "./components/mutation-report"
import { DepreciationReport } from "./components/depreciation-report"

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laporan & Export</h1>
          <p className="text-muted-foreground">Generate dan unduh laporan aset</p>
        </div>
      </div>

      <SummaryStats />

      <Tabs defaultValue="category" className="space-y-4">
        <TabsList>
          <TabsTrigger value="category">Per Kategori</TabsTrigger>
          <TabsTrigger value="location">Per Lokasi</TabsTrigger>
          <TabsTrigger value="mutation">Mutasi</TabsTrigger>
          <TabsTrigger value="depreciation">Penyusutan</TabsTrigger>
        </TabsList>

        <TabsContent value="category">
          <Card className="bg-card border-border">
            <CategoryReport />
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card className="bg-card border-border">
            <LocationReport />
          </Card>
        </TabsContent>

        <TabsContent value="mutation">
          <Card className="bg-card border-border">
            <MutationReport />
          </Card>
        </TabsContent>

        <TabsContent value="depreciation">
          <Card className="bg-card border-border">
            <DepreciationReport />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
