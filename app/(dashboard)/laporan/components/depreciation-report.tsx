"use client"

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, Eye } from "lucide-react"
import { assetService } from "@/lib/services/asset-service"

export function DepreciationReport() {
    const assets = assetService.getAll()
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

    return (
        <>
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
        </>
    )
}
