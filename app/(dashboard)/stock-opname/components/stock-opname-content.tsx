"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle } from "lucide-react"
import type { TStockOpname } from "@/lib/validations/stock-opname"
import type { TAsset } from "@/lib/validations/asset"
import { StockOpnameForm } from "./stock-opname-form"
import { StockOpnameSessionCard } from "./stock-opname-session-card"
import { StockOpnameChecklist } from "./stock-opname-checklist"
import { StockOpnameHistory } from "./stock-opname-history"
import { StockOpnameMismatchReport } from "./stock-opname-mismatch-report"

interface StockOpnameContentProps {
    initialStockOpnames: TStockOpname[]
    assets: TAsset[]
    locations: any[]
}

export function StockOpnameContent({ initialStockOpnames, assets, locations }: StockOpnameContentProps) {

    const activeSession = initialStockOpnames.find((s) => s.status === "sedang-berlangsung")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Stock Opname</h1>
                    <p className="text-muted-foreground">Verifikasi fisik aset terhadap data sistem</p>
                </div>
                <StockOpnameForm locations={locations} />

            </div>

            {activeSession && <StockOpnameSessionCard session={activeSession} />}

            <Tabs defaultValue="checklist" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="checklist">Checklist Verifikasi</TabsTrigger>
                    <TabsTrigger value="history">Riwayat Sesi</TabsTrigger>
                    <TabsTrigger value="report">Laporan Diskrepansi</TabsTrigger>
                </TabsList>

                <TabsContent value="checklist">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Daftar Aset untuk Diverifikasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StockOpnameChecklist assets={assets} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Riwayat Stock Opname</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StockOpnameHistory sessions={initialStockOpnames} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="report">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <AlertTriangle className="h-5 w-5 text-warning" />
                                Laporan Diskrepansi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StockOpnameMismatchReport />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
