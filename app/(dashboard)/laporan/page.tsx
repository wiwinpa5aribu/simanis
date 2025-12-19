"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileDown, Printer, Eye, BarChart3, PieChart, TrendingDown } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { assets, categories, locations } from "@/lib/data"

const categoryData = categories.map((cat) => ({
  name: cat,
  total: assets.filter((a) => a.category === cat).length,
  value: assets.filter((a) => a.category === cat).reduce((sum, a) => sum + a.purchasePrice, 0),
}))

const locationData = locations
  .filter((l) => l.type === "ruangan")
  .map((loc) => ({
    name: loc.name,
    total: loc.assetCount,
  }))

const depreciationData = assets.map((asset) => {
  const purchaseYear = new Date(asset.purchaseDate).getFullYear()
  const currentYear = new Date().getFullYear()
  const age = currentYear - purchaseYear
  const depreciationRate = 0.1
  const currentValue = Math.max(asset.purchasePrice * Math.pow(1 - depreciationRate, age), 0)
  const depreciation = asset.purchasePrice - currentValue

  return {
    id: asset.id,
    name: asset.name,
    purchasePrice: asset.purchasePrice,
    purchaseDate: asset.purchaseDate,
    age,
    currentValue: Math.round(currentValue),
    depreciation: Math.round(depreciation),
  }
})

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export default function ReportPage() {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const totalAssetValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0)
  const totalCurrentValue = depreciationData.reduce((sum, d) => sum + d.currentValue, 0)
  const totalDepreciation = totalAssetValue - totalCurrentValue

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laporan & Export</h1>
          <p className="text-muted-foreground">Generate dan unduh laporan aset</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">Rp {(totalAssetValue / 1000000).toFixed(1)} Jt</div>
                <div className="text-sm text-muted-foreground">Total Nilai Perolehan</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <PieChart className="h-6 w-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  Rp {(totalCurrentValue / 1000000).toFixed(1)} Jt
                </div>
                <div className="text-sm text-muted-foreground">Nilai Buku Saat Ini</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-destructive/10 p-3">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  Rp {(totalDepreciation / 1000000).toFixed(1)} Jt
                </div>
                <div className="text-sm text-muted-foreground">Total Penyusutan</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="category" className="space-y-4">
        <TabsList>
          <TabsTrigger value="category">Per Kategori</TabsTrigger>
          <TabsTrigger value="location">Per Lokasi</TabsTrigger>
          <TabsTrigger value="mutation">Mutasi</TabsTrigger>
          <TabsTrigger value="depreciation">Penyusutan</TabsTrigger>
        </TabsList>

        <TabsContent value="category">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Laporan Aset per Kategori</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileDown className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead className="text-right">Total Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData.map((cat) => (
                      <TableRow key={cat.name}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell className="text-right">{cat.total}</TableCell>
                        <TableCell className="text-right">Rp {cat.value.toLocaleString("id-ID")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Laporan Aset per Lokasi</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileDown className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="name"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                    />
                    <Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lokasi</TableHead>
                    <TableHead className="text-right">Jumlah Aset</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationData.map((loc) => (
                    <TableRow key={loc.name}>
                      <TableCell className="font-medium">{loc.name}</TableCell>
                      <TableCell className="text-right">{loc.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mutation">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Laporan Mutasi</CardTitle>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Dari:</Label>
                    <Input
                      type="date"
                      className="w-40"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Sampai:</Label>
                    <Input type="date" className="w-40" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                  <Button variant="outline" size="sm">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>ID Aset</TableHead>
                    <TableHead>Nama Aset</TableHead>
                    <TableHead>Dari</TableHead>
                    <TableHead>Ke</TableHead>
                    <TableHead>Alasan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-12-15</TableCell>
                    <TableCell className="font-mono text-sm">AST-001</TableCell>
                    <TableCell>Komputer Desktop HP</TableCell>
                    <TableCell>Ruang TU</TableCell>
                    <TableCell>Lab Komputer 1</TableCell>
                    <TableCell>Penambahan fasilitas lab</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-12-14</TableCell>
                    <TableCell className="font-mono text-sm">AST-003</TableCell>
                    <TableCell>Meja Siswa Standar</TableCell>
                    <TableCell>Gudang</TableCell>
                    <TableCell>Ruang Kelas 2B</TableCell>
                    <TableCell>Kebutuhan kelas baru</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depreciation">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Laporan Penyusutan Aset</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileDown className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Metode: Garis Lurus | Tarif: 10% per tahun</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Aset</TableHead>
                    <TableHead>Nama Aset</TableHead>
                    <TableHead className="text-right">Harga Perolehan</TableHead>
                    <TableHead className="text-center">Umur (Tahun)</TableHead>
                    <TableHead className="text-right">Nilai Buku</TableHead>
                    <TableHead className="text-right">Akumulasi Penyusutan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depreciationData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">Rp {item.purchasePrice.toLocaleString("id-ID")}</TableCell>
                      <TableCell className="text-center">{item.age}</TableCell>
                      <TableCell className="text-right text-success">
                        Rp {item.currentValue.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        Rp {item.depreciation.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
