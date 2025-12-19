"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Building2, Layers, DoorOpen, ChevronRight, Pencil } from "lucide-react"
import { locations } from "@/lib/data"

const typeIcons = {
  gedung: Building2,
  lantai: Layers,
  ruangan: DoorOpen,
}

const typeLabels = {
  gedung: "Gedung",
  lantai: "Lantai",
  ruangan: "Ruangan",
}

export default function LocationPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const buildings = locations.filter((l) => l.type === "gedung")

  const getChildren = (parentId: string) => {
    return locations.filter((l) => l.parentId === parentId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Master Lokasi</h1>
          <p className="text-muted-foreground">Kelola hierarki lokasi aset</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Lokasi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Lokasi Baru</DialogTitle>
              <DialogDescription>Buat lokasi baru untuk penempatan aset</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="locName">Nama Lokasi</Label>
                <Input id="locName" placeholder="Masukkan nama lokasi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locType">Tipe Lokasi</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gedung">Gedung</SelectItem>
                    <SelectItem value="lantai">Lantai</SelectItem>
                    <SelectItem value="ruangan">Ruangan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent">Lokasi Induk (Opsional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lokasi induk" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter((l) => l.type !== "ruangan")
                      .map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Struktur Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {buildings.map((building) => {
                const floors = getChildren(building.id)
                return (
                  <div key={building.id} className="space-y-1">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-medium flex-1">{building.name}</span>
                      <Badge variant="secondary">{building.assetCount} aset</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                    {floors.map((floor) => {
                      const rooms = getChildren(floor.id)
                      return (
                        <div key={floor.id} className="ml-6 space-y-1">
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1">{floor.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {floor.assetCount}
                            </Badge>
                          </div>
                          {rooms.map((room) => (
                            <div
                              key={room.id}
                              className="ml-6 flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                            >
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              <DoorOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="flex-1 text-sm">{room.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {room.assetCount}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Ringkasan Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(typeLabels).map(([type, label]) => {
                const Icon = typeIcons[type as keyof typeof typeIcons]
                const count = locations.filter((l) => l.type === type).length
                const totalAssets = locations.filter((l) => l.type === type).reduce((sum, l) => sum + l.assetCount, 0)

                return (
                  <div key={type} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{label}</div>
                      <div className="text-sm text-muted-foreground">
                        {count} lokasi • {totalAssets} aset
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
