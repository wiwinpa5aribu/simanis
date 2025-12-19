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

export function UserForm() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah User Baru</DialogTitle>
                    <DialogDescription>Buat akun pengguna baru untuk mengakses sistem</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="userName">Nama Lengkap</Label>
                        <Input id="userName" placeholder="Masukkan nama lengkap" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="userEmail">Email</Label>
                        <Input id="userEmail" type="email" placeholder="email@sekolah.id" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="userPassword">Password</Label>
                        <Input id="userPassword" type="password" placeholder="Masukkan password" />
                    </div>
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Administrator</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
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
