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

interface MutationFormProps {
    assets: any[]
    locations: any[]
}

export function MutationForm({ assets, locations }: MutationFormProps) {

    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button onClick={() => setOpen(false)}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
