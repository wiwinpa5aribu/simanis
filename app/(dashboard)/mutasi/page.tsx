"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mutationService } from "@/lib/services/mutation-service"
import { MutationForm } from "./components/mutation-form"
import { MutationStats } from "./components/mutation-stats"
import { MutationTable } from "./components/mutation-table"
import { MutationSearch } from "./components/mutation-search"

export default function MutationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const mutations = mutationService.getAll()

  const filteredMutations = mutations.filter((mutation) => {
    const matchesSearch =
      mutation.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mutation.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || mutation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mutasi Aset</h1>
          <p className="text-muted-foreground">Catat dan kelola perpindahan aset</p>
        </div>
        <MutationForm />
      </div>

      <MutationStats mutations={mutations} />

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-foreground">Riwayat Mutasi</CardTitle>
            <MutationSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
        </CardHeader>
        <CardContent>
          <MutationTable mutations={filteredMutations} />
        </CardContent>
      </Card>
    </div>
  )
}
