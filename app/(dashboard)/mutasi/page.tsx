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
import { Plus, FileDown, Printer, Search, CheckCircle, XCircle, Clock } from "lucide-react"
import { mutations, assets, locations } from "@/lib/data"

const statusConfig = {
  pending: { label: "Menunggu", icon: Clock, variant: "secondary" as const },
  approved: { label: "Disetujui", icon: CheckCircle, variant: "default" as const },
  rejected: { label: "Ditolak", icon: XCircle, variant: "destructive" as const },
}

export default function MutationPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredMutations = mutations.filter((mutation) => {
    const matchesSearch =
      mutation.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mutation.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || mutation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mutasi Aset</h1>
          <p className="text-muted-foreground">Catat dan kelola perpindahan aset</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Catat Mutasi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Catat Mutasi Baru</DialogTitle>
              <DialogDescription>Rekam perpindahan aset dari satu lokasi ke lokasi lain</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Pilih Aset</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih aset yang akan dipindahkan" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.id} - {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromLoc">Dari Lokasi</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Lokasi asal" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations
                        .filter((l) => l.type === "ruangan")
                        .map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toLoc">Ke Lokasi</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Lokasi tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations
                        .filter((l) => l.type === "ruangan")
                        .map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mutDate">Tanggal Mutasi</Label>
                <Input id="mutDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Alasan Mutasi</Label>
                <Textarea id="reason" placeholder="Masukkan alasan pemindahan aset" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {mutations.filter((m) => m.status === "pending").length}
                </div>
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
                <div className="text-2xl font-bold text-foreground">
                  {mutations.filter((m) => m.status === "approved").length}
                </div>
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
                <div className="text-2xl font-bold text-foreground">
                  {mutations.filter((m) => m.status === "rejected").length}
                </div>
                <div className="text-sm text-muted-foreground">Ditolak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-foreground">Riwayat Mutasi</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari mutasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <FileDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Mutasi</TableHead>
                <TableHead>Aset</TableHead>
                <TableHead>Dari</TableHead>
                <TableHead>Ke</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat Oleh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMutations.map((mutation) => {
                const status = statusConfig[mutation.status]
                const StatusIcon = status.icon

                return (
                  <TableRow key={mutation.id}>
                    <TableCell className="font-mono text-sm">{mutation.id}</TableCell>
                    <TableCell className="font-medium">{mutation.assetName}</TableCell>
                    <TableCell>{mutation.fromLocation}</TableCell>
                    <TableCell>{mutation.toLocation}</TableCell>
                    <TableCell>{mutation.date}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{mutation.createdBy}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
