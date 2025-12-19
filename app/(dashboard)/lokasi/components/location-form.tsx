"use client"

import { useState } from "react"
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
import { Plus } from "lucide-react"
import { Plus } from "lucide-react"

interface LocationFormProps {
    locations: any[]
}

export function LocationForm({ locations }: LocationFormProps) {

    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button onClick={() => setOpen(false)}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
