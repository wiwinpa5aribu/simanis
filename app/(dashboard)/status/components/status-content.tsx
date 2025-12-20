"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { RefreshCw, History, CheckCircle, AlertTriangle, XCircle, Wrench } from "lucide-react"
import { statusOptions, conditionOptions } from "@/lib/constants"
import type { TAsset } from "@/lib/validations/asset"

const statusIcons = {
  aktif: CheckCircle,
  tidak_aktif: XCircle,
  maintenance: Wrench,
  dihapuskan: AlertTriangle,
}

interface StatusContentProps {
  initialAssets: TAsset[]
}

export function StatusContent({ initialAssets }: StatusContentProps) {
  const [selectedAsset, setSelectedAsset] = useState<TAsset | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [conditionFilter, setConditionFilter] = useState<string>("all")

  const filteredAssets = initialAssets.filter((asset) => {
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter
    const matchesCondition = conditionFilter === "all" || asset.condition === conditionFilter
    return matchesStatus && matchesCondition
  })

  const getStatusBadge = (status: TAsset["status"]) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || CheckCircle
    const config = statusOptions.find((s) => s.value === status)
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      aktif: "default",
      tidak_aktif: "outline",
      maintenance: "secondary",
      dihapuskan: "destructive",
    }
    return (
      <Badge variant={variants[status] || "default"} className="gap-1">
        <Icon className="h-3 w-3" />
        {config?.label || status}
      </Badge>
    )
  }

  const getConditionBadge = (condition: TAsset["condition"]) => {
    const config = conditionOptions.find((c) => c.value === condition)
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      baik: "default",
      cukup: "secondary",
      kurang: "outline",
      rusak: "destructive",
    }
    return <Badge variant={variants[condition] || "default"}>{config?.label || condition}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Status & Kondisi Aset</h1>
          <p className="text-muted-foreground">Kelola status dan kondisi aset</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {statusOptions.map((status) => {
          const Icon = statusIcons[status.value as keyof typeof statusIcons] || CheckCircle
          const count = initialAssets.filter((a) => a.status === status.value).length

          return (
            <Card key={status.value} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{count}</div>
                    <div className="text-sm text-muted-foreground">{status.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="update">Update Status</TabsTrigger>
          <TabsTrigger value="history">Riwayat Perubahan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-foreground">Daftar Aset</CardTitle>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={conditionFilter} onValueChange={setConditionFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kondisi</SelectItem>
                      {conditionOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Aset</TableHead>
                    <TableHead>Nama Aset</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono text-sm">{asset.id}</TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAsset(asset)}
                            >
                              <RefreshCw className="mr-2 h-3 w-3" />
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Status & Kondisi</DialogTitle>
                              <DialogDescription>
                                Perbarui status dan kondisi untuk {selectedAsset?.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label>Status Baru</Label>
                                <Select defaultValue={selectedAsset?.status}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statusOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Kondisi Baru</Label>
                                <Select defaultValue={selectedAsset?.condition}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih kondisi" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {conditionOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Catatan</Label>
                                <Textarea placeholder="Masukkan catatan perubahan" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsUpdateDialogOpen(false)}
                              >
                                Batal
                              </Button>
                              <Button onClick={() => setIsUpdateDialogOpen(false)}>Simpan</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="update">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Form Update Status & Kondisi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pilih Aset</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih aset" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialAssets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.id} - {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status Baru</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kondisi Baru</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea placeholder="Masukkan catatan perubahan status/kondisi" />
              </div>
              <Button>Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <History className="h-5 w-5" />
                Riwayat Perubahan Status & Kondisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    asset: "AC Daikin 2 PK",
                    oldStatus: "Aktif",
                    newStatus: "Maintenance",
                    date: "2024-12-18",
                    user: "Budi Santoso",
                    note: "Unit tidak dingin, perlu perbaikan",
                  },
                  {
                    asset: "Laptop Lenovo ThinkPad",
                    oldStatus: "Aktif",
                    newStatus: "Tidak Aktif",
                    date: "2024-12-15",
                    user: "Ahmad Subari",
                    note: "Kerusakan hardware permanen",
                  },
                  {
                    asset: "Meja Siswa Standar",
                    oldStatus: "Baik",
                    newStatus: "Cukup",
                    date: "2024-12-10",
                    user: "Siti Nurhaliza",
                    note: "Permukaan mulai aus",
                  },
                ].map((history, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="rounded-lg bg-secondary p-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{history.asset}</span>
                        <Badge variant="outline">{history.oldStatus}</Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="secondary">{history.newStatus}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{history.note}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{history.user}</span>
                        <span>•</span>
                        <span>{history.date}</span>
                      </div>
                    </div>
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
