"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import type { AuditLog } from "@/types"

const actionConfig = {
    CREATE: { label: "Tambah", icon: Plus, variant: "default" as const },
    UPDATE: { label: "Ubah", icon: Pencil, variant: "secondary" as const },
    DELETE: { label: "Hapus", icon: Trash2, variant: "destructive" as const },
    READ: { label: "Lihat", icon: Eye, variant: "outline" as const },
}

interface AuditTableProps {
    logs: AuditLog[]
}

export function AuditTable({ logs }: AuditTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-44">Waktu</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="w-28">Aksi</TableHead>
                    <TableHead className="w-32">Modul</TableHead>
                    <TableHead>Detail</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {logs.map((log) => {
                    const action = actionConfig[log.action as keyof typeof actionConfig]
                    const ActionIcon = action.icon

                    return (
                        <TableRow key={log.id}>
                            <TableCell className="font-mono text-sm text-muted-foreground">{log.timestamp}</TableCell>
                            <TableCell className="font-medium">{log.user}</TableCell>
                            <TableCell>
                                <Badge variant={action.variant} className="gap-1">
                                    <ActionIcon className="h-3 w-3" />
                                    {action.label}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{log.module}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{log.details}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
