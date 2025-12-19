"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import type { Asset } from "@/types"
import { statusOptions, conditionOptions } from "@/lib/constants"

interface AssetTableProps {
    assets: Asset[]
}

export function AssetTable({ assets }: AssetTableProps) {
    const getStatusBadge = (status: Asset["status"]) => {
        const statusConfig = statusOptions.find((s) => s.value === status)
        return (
            <Badge variant={status === "aktif" ? "default" : status === "maintenance" ? "secondary" : "outline"}>
                {statusConfig?.label}
            </Badge>
        )
    }

    const getConditionBadge = (condition: Asset["condition"]) => {
        const conditionConfig = conditionOptions.find((c) => c.value === condition)
        const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
            baik: "default",
            cukup: "secondary",
            kurang: "outline",
            rusak: "destructive",
        }
        return <Badge variant={variants[condition] || "outline"}>{conditionConfig?.label}</Badge>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID Aset</TableHead>
                        <TableHead>Nama Aset</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Kondisi</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.map((asset) => (
                        <TableRow key={asset.id}>
                            <TableCell className="font-mono text-sm">{asset.id}</TableCell>
                            <TableCell className="font-medium">{asset.name}</TableCell>
                            <TableCell>{asset.category}</TableCell>
                            <TableCell>{asset.location}</TableCell>
                            <TableCell>{getStatusBadge(asset.status)}</TableCell>
                            <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
