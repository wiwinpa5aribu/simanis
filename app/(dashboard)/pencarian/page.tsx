"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, FileDown, Filter, X } from "lucide-react"
import { assets, categories, statusOptions, conditionOptions, locations } from "@/lib/data"
import type { Asset } from "@/lib/data"

const quickFilters = [
  { label: "Semua Aset Aktif", status: "aktif", condition: "" },
  { label: "Perlu Maintenance", status: "maintenance", condition: "" },
  { label: "Kondisi Rusak", status: "", condition: "rusak" },
  { label: "Aset Tidak Aktif", status: "tidak-aktif", condition: "" },
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")
  const [showResults, setShowResults] = useState(false)

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      searchTerm === "" ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter
    const matchesLocation = locationFilter === "all" || asset.location === locationFilter
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter
    const matchesCondition = conditionFilter === "all" || asset.condition === conditionFilter

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus && matchesCondition
  })

  const handleQuickFilter = (filter: (typeof quickFilters)[0]) => {
    setStatusFilter(filter.status)
    setConditionFilter(filter.condition)
    setShowResults(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setLocationFilter("all")
    setStatusFilter("all")
    setConditionFilter("all")
    setShowResults(false)
  }

  const getStatusBadge = (status: Asset["status"]) => {
    const config = statusOptions.find((s) => s.value === status)
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      aktif: "default",
      "tidak-aktif": "outline",
      maintenance: "secondary",
      dihapuskan: "destructive",
    }
    return <Badge variant={variants[status]}>{config?.label}</Badge>
  }

  const getConditionBadge = (condition: Asset["condition"]) => {
    const config = conditionOptions.find((c) => c.value === condition)
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      baik: "default",
      cukup: "secondary",
      kurang: "outline",
      rusak: "destructive",
    }
    return <Badge variant={variants[condition]}>{config?.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pencarian Aset</h1>
        <p className="text-muted-foreground">Cari dan filter aset dengan berbagai kriteria</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <Button key={filter.label} variant="outline" size="sm" onClick={() => handleQuickFilter(filter)}>
            <Filter className="mr-2 h-3 w-3" />
            {filter.label}
          </Button>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Pencarian Lanjutan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">ID atau Nama Aset</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari aset..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Lokasi</SelectItem>
                  {locations
                    .filter((l) => l.type === "ruangan")
                    .map((loc) => (
                      <SelectItem key={loc.id} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kondisi</Label>
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua kondisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kondisi</SelectItem>
                  {conditionOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rentang Tanggal</Label>
              <Input type="date" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowResults(true)}>
              <Search className="mr-2 h-4 w-4" />
              Cari
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Hasil Pencarian ({filteredAssets.length} aset)</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
                <Button variant="outline" size="sm">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Aset</TableHead>
                  <TableHead>Nama Aset</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Harga</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono text-sm">{asset.id}</TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                      <TableCell>Rp {asset.purchasePrice.toLocaleString("id-ID")}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Tidak ada aset yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
