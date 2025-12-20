import { assetService } from "@/lib/services/asset-service"
import { locationService } from "@/lib/services/location-service"
import { AssetContent } from "./components/asset-content"

export default async function AssetPage() {
  const assetList = await assetService.getAll()
  const locations = await locationService.getAll()

  return <AssetContent initialAssets={assetList} locations={locations} />
}
