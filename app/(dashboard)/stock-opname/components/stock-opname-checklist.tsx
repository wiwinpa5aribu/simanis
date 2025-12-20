"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle } from "lucide-react"
import type { Asset } from "@/types"

interface StockOpnameChecklistProps {
  assets: Asset[]
}

export function StockOpnameChecklist({ assets }: StockOpnameChecklistProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Verifikasi</TableHead>
            <TableHead>ID Aset</TableHead>
            <TableHead>Nama Aset</TableHead>
            <TableHead>Lokasi Tercatat</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Catatan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.slice(0, 5).map((asset, index) => (
            <TableRow key={asset.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-mono text-sm">{asset.id}</TableCell>
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell>{asset.location}</TableCell>
              <TableCell>
                {index < 3 ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Ditemukan
                  </Badge>
                ) : index === 3 ? (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Tidak Ada
                  </Badge>
                ) : (
                  <Badge variant="outline">Belum Verifikasi</Badge>
                )}
              </TableCell>
              <TableCell>
                <Input placeholder="Catatan..." className="h-8 text-sm" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline">
          <XCircle className="mr-2 h-4 w-4" />
          Tandai Tidak Ditemukan
        </Button>
        <Button>
          <CheckCircle className="mr-2 h-4 w-4" />
          Tandai Ditemukan
        </Button>
      </div>
    </>
  )
}
