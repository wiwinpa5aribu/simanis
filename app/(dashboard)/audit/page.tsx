"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, FileDown, Filter, Plus, Pencil, Trash2, Eye, RefreshCw } from "lucide-react"
import { auditLogs, users } from "@/lib/data"

const actionConfig = {
  CREATE: { label: "Tambah", icon: Plus, variant: "default" as const, color: "text-success" },
  UPDATE: { label: "Ubah", icon: Pencil, variant: "secondary" as const, color: "text-info" },
  DELETE: { label: "Hapus", icon: Trash2, variant: "destructive" as const, color: "text-destructive" },
  READ: { label: "Lihat", icon: Eye, variant: "outline" as const, color: "text-muted-foreground" },
}

const moduleOptions = ["Semua Modul", "Aset", "Lokasi", "Mutasi", "Status", "Stock Opname", "Laporan", "User"]

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = userFilter === "all" || log.user === userFilter
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesModule = moduleFilter === "all" || log.module === moduleFilter
    return matchesSearch && matchesUser && matchesAction && matchesModule
  })

  const stats = {
    total: auditLogs.length,
    create: auditLogs.filter((l) => l.action === "CREATE").length,
    update: auditLogs.filter((l) => l.action === "UPDATE").length,
    delete: auditLogs.filter((l) => l.action === "DELETE").length,
    read: auditLogs.filter((l) => l.action === "READ").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground">Pantau aktivitas pengguna dalam sistem</p>
        </div>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export Log
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Aktivitas</div>
            </div>
          </CardContent>
        </Card>
        {Object.entries(actionConfig).map(([key, config]) => {
          const Icon = config.icon
          const count = stats[key.toLowerCase() as keyof typeof stats] || 0
          return (
            <Card key={key} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{count}</div>
                    <div className="text-xs text-muted-foreground">{config.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5" />
            Filter Log
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                  {users.map((user) => (
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
                  {moduleOptions.slice(1).map((module) => (
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
                <Input type="date" className="flex-1" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                <Input type="date" className="flex-1" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setUserFilter("all")
                setActionFilter("all")
                setModuleFilter("all")
                setDateFrom("")
                setDateTo("")
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Log Aktivitas ({filteredLogs.length} entri)</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredLogs.map((log) => {
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
        </CardContent>
      </Card>
    </div>
  )
}
