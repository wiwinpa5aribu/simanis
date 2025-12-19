"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import type { Mutation } from "@/types"

interface MutationStatsProps {
    mutations: Mutation[]
}

export function MutationStats({ mutations }: MutationStatsProps) {
    const pendingCount = mutations.filter((m) => m.status === "diproses").length
    const approvedCount = mutations.filter((m) => m.status === "selesai").length
    const rejectedCount = mutations.filter((m) => m.status === "dibatalkan").length

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-card border-border">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
                            <div className="text-sm text-muted-foreground">Menunggu Persetujuan</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-card border-border">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-success/10 p-3">
                            <CheckCircle className="h-6 w-6 text-success" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{approvedCount}</div>
                            <div className="text-sm text-muted-foreground">Disetujui</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-card border-border">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-destructive/10 p-3">
                            <XCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{rejectedCount}</div>
                            <div className="text-sm text-muted-foreground">Ditolak</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
