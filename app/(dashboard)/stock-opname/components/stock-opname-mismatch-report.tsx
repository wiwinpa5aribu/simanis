"use client"

import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

const mismatchData = [
  {
    session: "SO-001",
    asset: "AST-015",
    name: "Printer HP LaserJet",
    issue: "Tidak ditemukan di lokasi tercatat",
    location: "Ruang TU",
    date: "2024-12-01",
  },
  {
    session: "SO-001",
    asset: "AST-022",
    name: "Kursi Lipat",
    issue: "Tidak ditemukan di lokasi tercatat",
    location: "Aula",
    date: "2024-12-01",
  },
  {
    session: "SO-003",
    asset: "AST-045",
    name: "Kipas Angin Berdiri",
    issue: "Tidak ditemukan di lokasi tercatat",
    location: "Ruang Kelas 3B",
    date: "2024-12-18",
  },
]

export function StockOpnameMismatchReport() {
  return (
    <div className="space-y-4">
      {mismatchData.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20"
        >
          <div className="rounded-lg bg-destructive/10 p-2">
            <XCircle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{item.asset}</span>
              <span className="font-medium text-foreground">{item.name}</span>
            </div>
            <p className="text-sm text-destructive">{item.issue}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Lokasi: {item.location}</span>
              <span>Sesi: {item.session}</span>
              <span>Tanggal: {item.date}</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Investigasi
          </Button>
        </div>
      ))}
    </div>
  )
}
