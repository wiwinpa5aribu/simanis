import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, MapPin, ArrowLeftRight, ClipboardCheck, TrendingUp, TrendingDown } from "lucide-react"

const summaryData = [
  {
    title: "Total Aset",
    value: "1,248",
    change: "+12%",
    trend: "up",
    icon: Package,
    description: "dari bulan lalu",
  },
  {
    title: "Lokasi Aktif",
    value: "45",
    change: "+3",
    trend: "up",
    icon: MapPin,
    description: "lokasi baru",
  },
  {
    title: "Mutasi Bulan Ini",
    value: "28",
    change: "-5%",
    trend: "down",
    icon: ArrowLeftRight,
    description: "dari bulan lalu",
  },
  {
    title: "Stock Opname Pending",
    value: "3",
    change: "2",
    trend: "neutral",
    icon: ClipboardCheck,
    description: "menunggu verifikasi",
  },
]

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item) => (
        <Card key={item.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
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
