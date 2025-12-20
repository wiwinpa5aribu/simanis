"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { createLocationSchema, type CreateLocationInput } from "@/lib/validations/location"
import { createLocation } from "@/lib/actions/location-actions"

interface LocationFormProps {
  locations: any[]
}

export function LocationForm({ locations }: LocationFormProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateLocationInput>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      name: "",
      type: undefined,
      parentId: undefined,
    },
  })

  const onSubmit = (data: CreateLocationInput) => {
    startTransition(async () => {
      const result = await createLocation(data)
      if (result.success) {
        toast.success("Lokasi berhasil ditambahkan")
        setOpen(false)
        form.reset()
      } else {
        toast.error(result.error || "Gagal menambahkan lokasi")
      }
    })
  }

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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="locName">Nama Lokasi</Label>
              <Input id="locName" placeholder="Masukkan nama lokasi" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="locType">Tipe Lokasi</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("type", value as "gedung" | "lantai" | "ruangan")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gedung">Gedung</SelectItem>
                  <SelectItem value="lantai">Lantai</SelectItem>
                  <SelectItem value="ruangan">Ruangan</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">Lokasi Induk (Opsional)</Label>
              <Select onValueChange={(value) => form.setValue("parentId", value)}>
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
