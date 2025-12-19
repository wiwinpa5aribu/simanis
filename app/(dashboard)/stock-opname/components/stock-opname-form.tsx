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
import { locations } from "@/lib/data"

export function StockOpnameForm() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button onClick={() => setOpen(false)}>Buat Sesi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
