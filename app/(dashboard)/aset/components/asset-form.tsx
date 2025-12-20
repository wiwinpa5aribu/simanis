"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { categories } from "@/lib/constants"
import { createAssetSchema, type CreateAssetInput } from "@/lib/validations/asset"
import { createAsset } from "@/lib/actions/asset-actions"

interface AssetFormProps {
  locations: any[]
}

export function AssetForm({ locations }: AssetFormProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateAssetInput>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      name: "",
      category: "",
      location: "",
      purchaseDate: "",
      purchasePrice: 0,
      description: "",
    },
  })

  const onSubmit = (data: CreateAssetInput) => {
    startTransition(async () => {
      const result = await createAsset(data)
      if (result.success) {
        toast.success("Aset berhasil ditambahkan")
        setOpen(false)
        form.reset()
      } else {
        toast.error(result.error || "Gagal menambahkan aset")
      }
    })
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Aset</Label>
                <Input id="name" placeholder="Masukkan nama aset" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select onValueChange={(value) => form.setValue("category", value)}>
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
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Tanggal Pembelian</Label>
                <Input id="purchaseDate" type="date" {...form.register("purchaseDate")} />
                {form.formState.errors.purchaseDate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.purchaseDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Harga Pembelian</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  placeholder="Rp 0"
                  {...form.register("purchasePrice")}
                />
                {form.formState.errors.purchasePrice && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.purchasePrice.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Select onValueChange={(value) => form.setValue("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lokasi" />
                </SelectTrigger>
                <SelectContent>
                  {locations
                    .filter((l) => l.type === "ruangan")
                    .map((loc) => (
                      <SelectItem key={loc.id} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {form.formState.errors.location && (
                <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi aset"
                {...form.register("description")}
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
