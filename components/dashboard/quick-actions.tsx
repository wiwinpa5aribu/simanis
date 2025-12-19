import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeftRight, ClipboardCheck, FileText } from "lucide-react"
import Link from "next/link"

const actions = [
  { title: "Tambah Aset", icon: Plus, href: "/aset", color: "bg-primary hover:bg-primary/90" },
  { title: "Catat Mutasi", icon: ArrowLeftRight, href: "/mutasi", color: "bg-secondary hover:bg-secondary/90" },
  { title: "Stock Opname", icon: ClipboardCheck, href: "/stock-opname", color: "bg-secondary hover:bg-secondary/90" },
  { title: "Buat Laporan", icon: FileText, href: "/laporan", color: "bg-secondary hover:bg-secondary/90" },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.title === "Tambah Aset" ? "default" : "secondary"}
            className="h-auto flex-col gap-2 py-4"
            asChild
          >
            <Link href={action.href}>
              <action.icon className="h-5 w-5" />
              <span className="text-xs">{action.title}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
