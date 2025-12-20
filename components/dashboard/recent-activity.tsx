import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ArrowLeftRight, Activity, ClipboardCheck, LucideIcon } from "lucide-react"

interface ActivityItem {
  id: string
  title: string
  description: string
  user: string
  timestamp: string
  type: "registrasi" | "mutasi" | "status" | "opname"
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

const typeIcons: Record<string, LucideIcon> = {
  registrasi: Package,
  mutasi: ArrowLeftRight,
  status: Activity,
  opname: ClipboardCheck,
}

const typeBadges: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  registrasi: { label: "Registrasi", variant: "default" },
  mutasi: { label: "Mutasi", variant: "secondary" },
  status: { label: "Status", variant: "outline" },
  opname: { label: "Opname", variant: "secondary" },
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type] || Activity
          const badge = typeBadges[activity.type] || { label: "Lainnya", variant: "outline" }

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
