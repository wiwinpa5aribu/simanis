import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Package,
  MapPin,
  ArrowLeftRight,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { prisma } from "@/lib/db"

export async function SummaryCards() {
  const assetCount = await prisma.asset.count()
  const locationCount = await prisma.location.count()
  const mutationCount = await prisma.mutation.count()
  const stockOpnameCount = await prisma.stockOpnameSession.count({
    where: { status: "sedang_berlangsung" },
  })

  const summaryData = [
    {
      title: "Total Aset",
      value: assetCount.toLocaleString(),
      change: "+0%",
      trend: "neutral",
      icon: Package,
      description: "total terdaftar",
    },
    {
      title: "Lokasi Aktif",
      value: locationCount.toLocaleString(),
      change: "+0",
      trend: "neutral",
      icon: MapPin,
      description: "titik lokasi",
    },
    {
      title: "Mutasi Bulan Ini",
      value: mutationCount.toLocaleString(),
      change: "+0%",
      trend: "neutral",
      icon: ArrowLeftRight,
      description: "total mutasi",
    },
    {
      title: "Stock Opname Aktif",
      value: stockOpnameCount.toLocaleString(),
      change: "0",
      trend: "neutral",
      icon: ClipboardCheck,
      description: "sesi berjalan",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item) => (
        <Card key={item.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{item.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {item.trend === "up" && <TrendingUp className="h-3 w-3 text-success" />}
              {item.trend === "down" && <TrendingDown className="h-3 w-3 text-destructive" />}
              <span
                className={`text-xs ${item.trend === "up" ? "text-success" : item.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}
              >
                {item.change}
              </span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
