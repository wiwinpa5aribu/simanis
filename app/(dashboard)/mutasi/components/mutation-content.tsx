"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TMutation } from "@/lib/validations/mutation"
import { MutationForm } from "./mutation-form"
import { MutationStats } from "./mutation-stats"
import { MutationTable } from "./mutation-table"
import { MutationSearch } from "./mutation-search"

interface MutationContentProps {
    initialMutations: TMutation[]
    assets: any[]
    locations: any[]
}

export function MutationContent({ initialMutations, assets, locations }: MutationContentProps) {

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const filteredMutations = initialMutations.filter((mutation) => {
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
                <MutationForm assets={assets} locations={locations} />

            </div>

            <MutationStats mutations={initialMutations} />

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
