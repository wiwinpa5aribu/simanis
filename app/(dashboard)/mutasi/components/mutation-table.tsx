"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import type { Mutation } from "@/types"

const statusConfig = {
    pending: { label: "Menunggu", icon: Clock, variant: "secondary" as const },
    approved: { label: "Disetujui", icon: CheckCircle, variant: "default" as const },
    rejected: { label: "Ditolak", icon: XCircle, variant: "destructive" as const },
}

interface MutationTableProps {
    mutations: Mutation[]
}

export function MutationTable({ mutations }: MutationTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID Mutasi</TableHead>
                    <TableHead>Aset</TableHead>
                    <TableHead>Dari</TableHead>
                    <TableHead>Ke</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat Oleh</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mutations.map((mutation) => {
                    const status = statusConfig[mutation.status]
                    const StatusIcon = status.icon

                    return (
                        <TableRow key={mutation.id}>
                            <TableCell className="font-mono text-sm">{mutation.id}</TableCell>
                            <TableCell className="font-medium">{mutation.assetName}</TableCell>
                            <TableCell>{mutation.fromLocation}</TableCell>
                            <TableCell>{mutation.toLocation}</TableCell>
                            <TableCell>{mutation.date}</TableCell>
                            <TableCell>
                                <Badge variant={status.variant} className="gap-1">
                                    <StatusIcon className="h-3 w-3" />
                                    {status.label}
                                </Badge>
                            </TableCell>
                            <TableCell>{mutation.createdBy}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
