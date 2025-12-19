"use client"

import { Building2, Layers, DoorOpen } from "lucide-react"
import type { Location } from "@/types"

const typeIcons = {
    gedung: Building2,
    lantai: Layers,
    ruangan: DoorOpen,
}

const typeLabels = {
    gedung: "Gedung",
    lantai: "Lantai",
    ruangan: "Ruangan",
}

interface LocationSummaryProps {
    locations: Location[]
}

export function LocationSummary({ locations }: LocationSummaryProps) {
    return (
        <div className="space-y-4">
            {Object.entries(typeLabels).map(([type, label]) => {
                const Icon = typeIcons[type as keyof typeof typeIcons]
                const count = locations.filter((l) => l.type === type).length
                const totalAssets = locations.filter((l) => l.type === type).reduce((sum, l) => sum + l.assetCount, 0)

                return (
                    <div key={type} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
                        <div className="rounded-lg bg-primary/10 p-3">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-foreground">{label}</div>
                            <div className="text-sm text-muted-foreground">
                                {count} lokasi • {totalAssets} aset
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
