"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Filter } from "lucide-react"
import type { TAuditLog } from "@/lib/validations/audit"
import { AuditStats } from "./audit-stats"
import { AuditFilters } from "./audit-filters"
import { AuditTable } from "./audit-table"

interface AuditContentProps {
    initialLogs: TAuditLog[]
    users: any[]
}

export function AuditContent({ initialLogs, users }: AuditContentProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [userFilter, setUserFilter] = useState("all")
    const [actionFilter, setActionFilter] = useState("all")
    const [moduleFilter, setModuleFilter] = useState("all")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")

    const filteredLogs = initialLogs.filter((log) => {
        const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesUser = userFilter === "all" || log.user === userFilter
        const matchesAction = actionFilter === "all" || log.action === actionFilter
        const matchesModule = moduleFilter === "all" || log.module === moduleFilter
        return matchesSearch && matchesUser && matchesAction && matchesModule
    })

    const handleReset = () => {
        setSearchTerm("")
        setUserFilter("all")
        setActionFilter("all")
        setModuleFilter("all")
        setDateFrom("")
        setDateTo("")
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

            <AuditStats logs={initialLogs} />

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                        <Filter className="h-5 w-5" />
                        Filter Log
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AuditFilters
                        users={users}
                        searchTerm={searchTerm}

                        setSearchTerm={setSearchTerm}
                        userFilter={userFilter}
                        setUserFilter={setUserFilter}
                        actionFilter={actionFilter}
                        setActionFilter={setActionFilter}
                        moduleFilter={moduleFilter}
                        setModuleFilter={setModuleFilter}
                        dateFrom={dateFrom}
                        setDateFrom={setDateFrom}
                        dateTo={dateTo}
                        setDateTo={setDateTo}
                        onReset={handleReset}
                    />
                </CardContent>
            </Card>

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">Log Aktivitas ({filteredLogs.length} entri)</CardTitle>
                </CardHeader>
                <CardContent>
                    <AuditTable logs={filteredLogs} />
                </CardContent>
            </Card>
        </div>
    )
}
