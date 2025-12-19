"use client"

import { useState } from "react"
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileDown } from "lucide-react"
import type { TMutation } from "@/lib/validations/mutation"

interface MutationReportProps {
    mutations: TMutation[]
}

export function MutationReport({ mutations }: MutationReportProps) {
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")



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
                        {mutations.length > 0 ? (
                            mutations.map((mut) => (
                                <TableRow key={mut.id}>
                                    <TableCell>{mut.date}</TableCell>
                                    <TableCell className="font-mono text-sm">{mut.assetId}</TableCell>
                                    <TableCell>{mut.assetName}</TableCell>
                                    <TableCell>{mut.fromLocation}</TableCell>
                                    <TableCell>{mut.toLocation}</TableCell>
                                    <TableCell>{mut.reason}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Tidak ada data mutasi
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </CardContent>
        </>
    )
}
