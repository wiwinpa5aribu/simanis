"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TAsset } from "@/lib/validations/asset"
import { AssetTable } from "./asset-table"
import { AssetFilters, AssetSearch } from "./asset-filters"

interface AssetContentProps {
    initialAssets: TAsset[]
    locations: any[]
}

export function AssetContent({ initialAssets, locations }: AssetContentProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredAssets = initialAssets.filter(
        (asset) =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <AssetFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} locations={locations} />


            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Daftar Aset</CardTitle>
                        <AssetSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </div>
                </CardHeader>
                <CardContent>
                    <AssetTable assets={filteredAssets} />
                </CardContent>
            </Card>
        </div>
    )
}
