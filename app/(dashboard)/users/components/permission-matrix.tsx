"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

const modules = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Registrasi Aset", key: "assets" },
    { name: "Master Lokasi", key: "locations" },
    { name: "Mutasi Aset", key: "mutations" },
    { name: "Status & Kondisi", key: "status" },
    { name: "Pencarian", key: "search" },
    { name: "Stock Opname", key: "stockopname" },
    { name: "Laporan", key: "reports" },
    { name: "Manajemen User", key: "users" },
    { name: "Audit Log", key: "audit" },
]

const permissions = {
    admin: modules.map((m) => m.key),
    manager: ["dashboard", "assets", "locations", "mutations", "status", "search", "stockopname", "reports"],
    staff: ["dashboard", "assets", "mutations", "search", "stockopname"],
    viewer: ["dashboard", "search", "reports"],
}

export function PermissionMatrix() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Modul</TableHead>
                    <TableHead className="text-center">Admin</TableHead>
                    <TableHead className="text-center">Manager</TableHead>
                    <TableHead className="text-center">Staff</TableHead>
                    <TableHead className="text-center">Viewer</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {modules.map((module) => (
                    <TableRow key={module.key}>
                        <TableCell className="font-medium">{module.name}</TableCell>
                        {(["admin", "manager", "staff", "viewer"] as const).map((role) => (
                            <TableCell key={role} className="text-center">
                                <Checkbox
                                    checked={permissions[role].includes(module.key)}
                                    disabled
                                    className="data-[state=checked]:bg-primary"
                                />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
