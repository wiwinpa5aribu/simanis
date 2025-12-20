"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createUserSchema, type CreateUserInput } from "@/lib/validations/user"
import { createUser } from "@/lib/actions/user-actions"

export function UserForm() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: undefined,
        }
    })

    const onSubmit = (data: CreateUserInput) => {
        startTransition(async () => {
            const result = await createUser(data)
            if (result.success) {
                toast.success("User berhasil ditambahkan")
                setOpen(false)
                form.reset()
            } else {
                toast.error(result.error || "Gagal menambahkan user")
            }
        })
    }

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
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Nama Lengkap</Label>
                            <Input 
                                id="userName" 
                                placeholder="Masukkan nama lengkap"
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userEmail">Email</Label>
                            <Input 
                                id="userEmail" 
                                type="email" 
                                placeholder="email@sekolah.id"
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userPassword">Password</Label>
                            <Input 
                                id="userPassword" 
                                type="password" 
                                placeholder="Masukkan password"
                                {...form.register("password")}
                            />
                            {form.formState.errors.password && (
                                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select onValueChange={(value) => form.setValue("role", value as "admin" | "manager" | "staff" | "viewer")}>
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
                            {form.formState.errors.role && (
                                <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
