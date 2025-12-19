"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { categories } from "@/lib/constants"
import { locations as locationData } from "@/lib/data"

export function AssetForm() {
    const [open, setOpen] = useState(false)

    // In a real app, this would be a server action or API call
    const handleSubmit = () => {
        setOpen(false)
        // logic to add asset
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Aset
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tambah Aset Baru</DialogTitle>
                    <DialogDescription>Isi informasi aset yang akan didaftarkan ke sistem</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Aset</Label>
                            <Input id="name" placeholder="Masukkan nama aset" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="purchaseDate">Tanggal Pembelian</Label>
                            <Input id="purchaseDate" type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="purchasePrice">Harga Pembelian</Label>
                            <Input id="purchasePrice" type="number" placeholder="Rp 0" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Lokasi</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih lokasi" />
                            </SelectTrigger>
                            <SelectContent>
                                {locationData
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
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea id="description" placeholder="Masukkan deskripsi aset" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
