import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { recentActivities } from "@/lib/data"
import { Package, ArrowLeftRight, Activity, ClipboardCheck } from "lucide-react"

const typeIcons = {
  registrasi: Package,
  mutasi: ArrowLeftRight,
  status: Activity,
  opname: ClipboardCheck,
}

const typeBadges = {
  registrasi: { label: "Registrasi", variant: "default" as const },
  mutasi: { label: "Mutasi", variant: "secondary" as const },
  status: { label: "Status", variant: "outline" as const },
  opname: { label: "Opname", variant: "secondary" as const },
}

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity) => {
          const Icon = typeIcons[activity.type]
          const badge = typeBadges[activity.type]

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{activity.title}</span>
                  <Badge variant={badge.variant} className="text-xs">
                    {badge.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
