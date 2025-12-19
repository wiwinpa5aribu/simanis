"use client"

import { useState } from "react"
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileDown } from "lucide-react"
import { mutationService } from "@/lib/services/mutation-service"

export function MutationReport() {
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const mutations = mutationService.getAll()


    return (
        <>
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
        </>
    )
}
