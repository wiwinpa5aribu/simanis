import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { locationService } from "@/lib/services/location-service"
import { LocationForm } from "./components/location-form"
import { LocationTree } from "./components/location-tree"
import { LocationSummary } from "./components/location-summary"

export default async function LocationPage() {
  const locations = await locationService.getAll()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Master Lokasi</h1>
          <p className="text-muted-foreground">Kelola hierarki lokasi aset</p>
        </div>
        <LocationForm locations={locations} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Struktur Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <LocationTree locations={locations} />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Ringkasan Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <LocationSummary locations={locations} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
