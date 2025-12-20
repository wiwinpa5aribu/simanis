import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SummaryStats } from "./components/summary-stats"
import { CategoryReport } from "./components/category-report"
import { LocationReport } from "./components/location-report"
import { MutationReport } from "./components/mutation-report"
import { DepreciationReport } from "./components/depreciation-report"
import { assetService } from "@/lib/services/asset-service"
import { locationService } from "@/lib/services/location-service"
import { mutationService } from "@/lib/services/mutation-service"

export default async function ReportPage() {
  const assets = await assetService.getAll()
  const locations = await locationService.getAll()
  const mutations = await mutationService.getAll()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laporan & Export</h1>
          <p className="text-muted-foreground">Generate dan unduh laporan aset</p>
        </div>
      </div>

      <SummaryStats assets={assets} />

      <Tabs defaultValue="category" className="space-y-4">
        <TabsList>
          <TabsTrigger value="category">Per Kategori</TabsTrigger>
          <TabsTrigger value="location">Per Lokasi</TabsTrigger>
          <TabsTrigger value="mutation">Mutasi</TabsTrigger>
          <TabsTrigger value="depreciation">Penyusutan</TabsTrigger>
        </TabsList>

        <TabsContent value="category">
          <Card className="bg-card border-border">
            <CategoryReport assets={assets} />
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card className="bg-card border-border">
            <LocationReport locations={locations} />
          </Card>
        </TabsContent>

        <TabsContent value="mutation">
          <Card className="bg-card border-border">
            <MutationReport mutations={mutations} />
          </Card>
        </TabsContent>

        <TabsContent value="depreciation">
          <Card className="bg-card border-border">
            <DepreciationReport assets={assets} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
