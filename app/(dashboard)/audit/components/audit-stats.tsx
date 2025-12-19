"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import type { AuditLog } from "@/types"

const actionConfig = {
    CREATE: { label: "Tambah", icon: Plus, color: "text-success" },
    UPDATE: { label: "Ubah", icon: Pencil, color: "text-info" },
    DELETE: { label: "Hapus", icon: Trash2, color: "text-destructive" },
    READ: { label: "Lihat", icon: Eye, color: "text-muted-foreground" },
}

interface AuditStatsProps {
    logs: AuditLog[]
}

export function AuditStats({ logs }: AuditStatsProps) {
    const stats = {
        total: logs.length,
        create: logs.filter((l) => l.action === "CREATE").length,
        update: logs.filter((l) => l.action === "UPDATE").length,
        delete: logs.filter((l) => l.action === "DELETE").length,
        read: logs.filter((l) => l.action === "READ").length,
    }

    return (
        <div className="grid gap-4 md:grid-cols-5">
            <Card className="bg-card border-border">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                        <div className="text-sm text-muted-foreground">Total Aktivitas</div>
                    </div>
                </CardContent>
            </Card>
            {Object.entries(actionConfig).map(([key, config]) => {
                const Icon = config.icon
                const count = stats[key.toLowerCase() as keyof typeof stats] || 0
                return (
                    <Card key={key} className="bg-card border-border">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center gap-3">
                                <Icon className={`h-5 w-5 ${config.color}`} />
                                <div>
                                    <div className="text-2xl font-bold text-foreground">{count}</div>
                                    <div className="text-xs text-muted-foreground">{config.label}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
