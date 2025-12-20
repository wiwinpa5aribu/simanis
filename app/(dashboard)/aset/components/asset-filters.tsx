"use client"

import { Search, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AssetForm } from "./asset-form"

interface AssetFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  locations?: any[]
}

export function AssetFilters({ searchTerm, setSearchTerm, locations }: AssetFiltersProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Registrasi Aset</h1>
        <p className="text-muted-foreground">Kelola data aset sekolah</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
        <AssetForm locations={locations || []} />
      </div>
    </div>
  )
}

export function AssetSearch({ searchTerm, setSearchTerm }: AssetFiltersProps) {
  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Cari aset..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
