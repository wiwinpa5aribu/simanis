"use client"

import { Search, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const moduleOptions = ["Aset", "Lokasi", "Mutasi", "Status", "Stock Opname", "Laporan", "User"]

interface AuditFiltersProps {
  users: any[]
  searchTerm: string

  setSearchTerm: (v: string) => void
  userFilter: string
  setUserFilter: (v: string) => void
  actionFilter: string
  setActionFilter: (v: string) => void
  moduleFilter: string
  setModuleFilter: (v: string) => void
  dateFrom: string
  setDateFrom: (v: string) => void
  dateTo: string
  setDateTo: (v: string) => void
  onReset: () => void
}

export function AuditFilters({
  users,
  searchTerm,
  setSearchTerm,
  userFilter,
  setUserFilter,
  actionFilter,
  setActionFilter,
  moduleFilter,
  setModuleFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onReset,
}: AuditFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-2">
        <Label>Cari</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari dalam log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>User</Label>
        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Semua user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua User</SelectItem>
            {users.map((user: any) => (
              <SelectItem key={user.id} value={user.name}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Aksi</Label>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Semua aksi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Aksi</SelectItem>
            <SelectItem value="CREATE">Tambah</SelectItem>
            <SelectItem value="UPDATE">Ubah</SelectItem>
            <SelectItem value="DELETE">Hapus</SelectItem>
            <SelectItem value="READ">Lihat</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Modul</Label>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Semua modul" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Modul</SelectItem>
            {moduleOptions.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Rentang Tanggal</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            className="flex-1"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            className="flex-1"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>
      <div className="col-span-full flex justify-end">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Filter
        </Button>
      </div>
    </div>
  )
}
