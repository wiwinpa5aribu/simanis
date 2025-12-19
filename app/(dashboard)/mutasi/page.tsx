import { mutationService } from "@/lib/services/mutation-service"
import { assetService } from "@/lib/services/asset-service"
import { locationService } from "@/lib/services/location-service"
import { MutationContent } from "./components/mutation-content"

export default async function MutationPage() {
  const mutations = await mutationService.getAll()
  const assets = await assetService.getAll()
  const locations = await locationService.getAll()

  return <MutationContent initialMutations={mutations} assets={assets} locations={locations} />
}


