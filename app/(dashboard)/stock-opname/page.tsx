"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Plus, ClipboardCheck, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react"
import { stockOpnames, locations, assets } from "@/lib/data"

export default function StockOpnamePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const activeSession = stockOpnames.find((s) => s.status === "sedang-berlangsung")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stock Opname</h1>
          <p className="text-muted-foreground">Verifikasi fisik aset terhadap data sistem</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Buat Sesi Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Sesi Stock Opname</DialogTitle>
              <DialogDescription>Tentukan lokasi dan tanggal untuk sesi stock opname baru</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Tanggal Pelaksanaan</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Lokasi</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter((l) => l.type === "gedung" || l.type === "ruangan")
                      .map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea placeholder="Catatan tambahan untuk sesi stock opname" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Buat Sesi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {activeSession && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Sesi Aktif: {activeSession.location}</CardTitle>
                  <p className="text-sm text-muted-foreground">Tanggal: {activeSession.date}</p>
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
                  {activeSession.foundCount + activeSession.notFoundCount} / {activeSession.totalAssets} aset
                </span>
              </div>
              <Progress
                value={((activeSession.foundCount + activeSession.notFoundCount) / activeSession.totalAssets) * 100}
                className="h-2"
              />
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{activeSession.foundCount}</div>
                  <div className="text-xs text-muted-foreground">Ditemukan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{activeSession.notFoundCount}</div>
                  <div className="text-xs text-muted-foreground">Tidak Ditemukan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {activeSession.totalAssets - activeSession.foundCount - activeSession.notFoundCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Belum Diverifikasi</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Verifikasi</TableHead>
                    <TableHead>ID Aset</TableHead>
                    <TableHead>Nama Aset</TableHead>
                    <TableHead>Lokasi Tercatat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.slice(0, 5).map((asset, index) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{asset.id}</TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>
                        {index < 3 ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Ditemukan
                          </Badge>
                        ) : index === 3 ? (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Tidak Ada
                          </Badge>
                        ) : (
                          <Badge variant="outline">Belum Verifikasi</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input placeholder="Catatan..." className="h-8 text-sm" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">
                  <XCircle className="mr-2 h-4 w-4" />
                  Tandai Tidak Ditemukan
                </Button>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Tandai Ditemukan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Riwayat Stock Opname</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Sesi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Total Aset</TableHead>
                    <TableHead>Ditemukan</TableHead>
                    <TableHead>Tidak Ditemukan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockOpnames.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-mono text-sm">{session.id}</TableCell>
                      <TableCell>{session.date}</TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell>{session.totalAssets}</TableCell>
                      <TableCell className="text-success">{session.foundCount}</TableCell>
                      <TableCell className="text-destructive">{session.notFoundCount}</TableCell>
                      <TableCell>
                        <Badge variant={session.status === "selesai" ? "secondary" : "default"}>
                          {session.status === "selesai" ? "Selesai" : "Berlangsung"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="mr-2 h-3 w-3" />
                          Lihat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <div className="space-y-4">
                {[
                  {
                    session: "SO-001",
                    asset: "AST-015",
                    name: "Printer HP LaserJet",
                    issue: "Tidak ditemukan di lokasi tercatat",
                    location: "Ruang TU",
                    date: "2024-12-01",
                  },
                  {
                    session: "SO-001",
                    asset: "AST-022",
                    name: "Kursi Lipat",
                    issue: "Tidak ditemukan di lokasi tercatat",
                    location: "Aula",
                    date: "2024-12-01",
                  },
                  {
                    session: "SO-003",
                    asset: "AST-045",
                    name: "Kipas Angin Berdiri",
                    issue: "Tidak ditemukan di lokasi tercatat",
                    location: "Ruang Kelas 3B",
                    date: "2024-12-18",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20"
                  >
                    <div className="rounded-lg bg-destructive/10 p-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">{item.asset}</span>
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                      <p className="text-sm text-destructive">{item.issue}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Lokasi: {item.location}</span>
                        <span>Sesi: {item.session}</span>
                        <span>Tanggal: {item.date}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Investigasi
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
