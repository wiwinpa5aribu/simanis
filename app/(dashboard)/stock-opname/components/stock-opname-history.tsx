"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import type { StockOpname } from "@/types"

interface StockOpnameHistoryProps {
  sessions: StockOpname[]
}

export function StockOpnameHistory({ sessions }: StockOpnameHistoryProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Sesi</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Lokasi</TableHead>
          <TableHead>Total Aset</TableHead>
          <TableHead>Ditemukan</TableHead>
          <TableHead>Tidak Ditemukan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="font-mono text-sm">{session.id}</TableCell>
            <TableCell>{session.date}</TableCell>
            <TableCell>{session.location}</TableCell>
            <TableCell>{session.totalAssets}</TableCell>
            <TableCell className="text-success">{session.foundCount}</TableCell>
            <TableCell className="text-destructive">{session.notFoundCount}</TableCell>
            <TableCell>
              <Badge variant={session.status === "selesai" ? "secondary" : "default"}>
                {session.status === "selesai" ? "Selesai" : "Berlangsung"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <FileText className="mr-2 h-3 w-3" />
                Lihat
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
