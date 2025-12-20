import { stockOpnameService } from "@/lib/services/stock-opname-service"
import { assetService } from "@/lib/services/asset-service"
import { locationService } from "@/lib/services/location-service"
import { StockOpnameContent } from "./components/stock-opname-content"

export default async function StockOpnamePage() {
  const stockOpnames = await stockOpnameService.getAll()
  const assets = await assetService.getAll()
  const locations = await locationService.getAll()

  return (
    <StockOpnameContent initialStockOpnames={stockOpnames} assets={assets} locations={locations} />
  )
}
