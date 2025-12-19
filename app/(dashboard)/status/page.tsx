import { assetService } from "@/lib/services/asset-service"
import { StatusContent } from "./components/status-content"

export default async function StatusPage() {
  const assets = await assetService.getAll()

  return <StatusContent initialAssets={assets} />
}

