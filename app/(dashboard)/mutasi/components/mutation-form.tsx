"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createMutationSchema, type CreateMutationInput } from "@/lib/validations/mutation"
import { createMutation } from "@/lib/actions/mutation-actions"

interface MutationFormProps {
    assets: any[]
    locations: any[]
}

export function MutationForm({ assets, locations }: MutationFormProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<CreateMutationInput>({
        resolver: zodResolver(createMutationSchema),
        defaultValues: {
            assetId: "",
            fromLocation: "",
            toLocation: "",
            date: "",
            requester: "",
            notes: "",
        }
    })

    const onSubmit = (data: CreateMutationInput) => {
        startTransition(async () => {
            const result = await createMutation(data)
            if (result.success) {
                toast.success("Mutasi berhasil dicatat")
                setOpen(false)
                form.reset()
            } else {
                toast.error(result.error || "Gagal mencatat mutasi")
            }
        })
    }

    const roomLocations = locations.filter((l) => l.type === "ruangan")

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
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="asset">Pilih Aset</Label>
                            <Select onValueChange={(value) => form.setValue("assetId", value)}>
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
                            {form.formState.errors.assetId && (
                                <p className="text-sm text-destructive">{form.formState.errors.assetId.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fromLoc">Dari Lokasi</Label>
                                <Select onValueChange={(value) => form.setValue("fromLocation", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Lokasi asal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roomLocations.map((loc) => (
                                            <SelectItem key={loc.id} value={loc.name}>
                                                {loc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.fromLocation && (
                                    <p className="text-sm text-destructive">{form.formState.errors.fromLocation.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="toLoc">Ke Lokasi</Label>
                                <Select onValueChange={(value) => form.setValue("toLocation", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Lokasi tujuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roomLocations.map((loc) => (
                                            <SelectItem key={loc.id} value={loc.name}>
                                                {loc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.toLocation && (
                                    <p className="text-sm text-destructive">{form.formState.errors.toLocation.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="requester">Pemohon</Label>
                            <Input 
                                id="requester" 
                                placeholder="Nama pemohon mutasi"
                                {...form.register("requester")}
                            />
                            {form.formState.errors.requester && (
                                <p className="text-sm text-destructive">{form.formState.errors.requester.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mutDate">Tanggal Mutasi</Label>
                            <Input 
                                id="mutDate" 
                                type="date"
                                {...form.register("date")}
                            />
                            {form.formState.errors.date && (
                                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Alasan Mutasi</Label>
                            <Textarea 
                                id="notes" 
                                placeholder="Masukkan alasan pemindahan aset"
                                {...form.register("notes")}
                            />
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
