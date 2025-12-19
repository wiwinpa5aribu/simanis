"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { assetService } from "@/lib/services/asset-service"
import type { TAsset } from "@/lib/validations/asset"
import { AssetTable } from "./components/asset-table"
import { AssetFilters, AssetSearch } from "./components/asset-filters"

export default function AssetPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [assetList] = useState<TAsset[]>(() => assetService.getAll())

  const filteredAssets = assetList.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <AssetFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
