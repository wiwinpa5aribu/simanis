import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, PieChart, TrendingDown } from "lucide-react"
import type { TAsset } from "@/lib/validations/asset"

interface SummaryStatsProps {
  assets: TAsset[]
}

export function SummaryStats({ assets }: SummaryStatsProps) {
  const depreciationData = assets.map((asset) => {
    const purchaseYear = new Date(asset.purchaseDate).getFullYear()
    const currentYear = new Date().getFullYear()
    const age = currentYear - purchaseYear
    const depreciationRate = 0.1
    const currentValue = Math.max(asset.purchasePrice * Math.pow(1 - depreciationRate, age), 0)
    return { purchasePrice: asset.purchasePrice, currentValue: Math.round(currentValue) }
  })

  const totalAssetValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0)
  const totalCurrentValue = depreciationData.reduce((sum, d) => sum + d.currentValue, 0)
  const totalDepreciation = totalAssetValue - totalCurrentValue

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                Rp {(totalAssetValue / 1000000).toFixed(1)} Jt
              </div>
              <div className="text-sm text-muted-foreground">Total Nilai Perolehan</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-success/10 p-3">
              <PieChart className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                Rp {(totalCurrentValue / 1000000).toFixed(1)} Jt
              </div>
              <div className="text-sm text-muted-foreground">Nilai Buku Saat Ini</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-destructive/10 p-3">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                Rp {(totalDepreciation / 1000000).toFixed(1)} Jt
              </div>
              <div className="text-sm text-muted-foreground">Total Penyusutan</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
