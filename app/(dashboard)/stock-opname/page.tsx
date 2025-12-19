"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle } from "lucide-react"
import { stockOpnameService } from "@/lib/services/stock-opname-service"
import { assetService } from "@/lib/services/asset-service"
import { StockOpnameForm } from "./components/stock-opname-form"
import { StockOpnameSessionCard } from "./components/stock-opname-session-card"
import { StockOpnameChecklist } from "./components/stock-opname-checklist"
import { StockOpnameHistory } from "./components/stock-opname-history"
import { StockOpnameMismatchReport } from "./components/stock-opname-mismatch-report"

export default function StockOpnamePage() {
  const stockOpnames = stockOpnameService.getAll()
  const assets = assetService.getAll()
  const activeSession = stockOpnames.find((s) => s.status === "sedang-berlangsung")


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stock Opname</h1>
          <p className="text-muted-foreground">Verifikasi fisik aset terhadap data sistem</p>
        </div>
        <StockOpnameForm />
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
              <StockOpnameHistory sessions={stockOpnames} />
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
