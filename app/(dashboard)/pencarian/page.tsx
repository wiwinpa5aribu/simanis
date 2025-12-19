import { assetService } from "@/lib/services/asset-service"
import { locationService } from "@/lib/services/location-service"
import { SearchContent } from "./components/search-content"

export default async function SearchPage() {
  const assets = await assetService.getAll()
  const locations = await locationService.getAll()

  return <SearchContent initialAssets={assets} locations={locations} />
}

