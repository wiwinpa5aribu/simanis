"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ClipboardCheck } from "lucide-react"
import type { StockOpname } from "@/types"

interface StockOpnameSessionCardProps {
    session: StockOpname
}

export function StockOpnameSessionCard({ session }: StockOpnameSessionCardProps) {
    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <ClipboardCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-foreground">Sesi Aktif: {session.location}</CardTitle>
                            <p className="text-sm text-muted-foreground">Tanggal: {session.date}</p>
                        </div>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">Sedang Berlangsung</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress Verifikasi</span>
                        <span className="font-medium text-foreground">
                            {session.foundCount + session.notFoundCount} / {session.totalAssets} aset
                        </span>
                    </div>
                    <Progress
                        value={((session.foundCount + session.notFoundCount) / session.totalAssets) * 100}
                        className="h-2"
                    />
                    <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-success">{session.foundCount}</div>
                            <div className="text-xs text-muted-foreground">Ditemukan</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-destructive">{session.notFoundCount}</div>
                            <div className="text-xs text-muted-foreground">Tidak Ditemukan</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-muted-foreground">
                                {session.totalAssets - session.foundCount - session.notFoundCount}
                            </div>
                            <div className="text-xs text-muted-foreground">Belum Diverifikasi</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
