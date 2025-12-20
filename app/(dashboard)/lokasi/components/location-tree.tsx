"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Layers, DoorOpen, ChevronRight, Pencil } from "lucide-react"
import type { Location } from "@/types"

interface LocationTreeProps {
  locations: Location[]
}

export function LocationTree({ locations }: LocationTreeProps) {
  const buildings = locations.filter((l) => l.type === "gedung")

  const getChildren = (parentId: string) => {
    return locations.filter((l) => l.parentId === parentId)
  }

  return (
    <div className="space-y-2">
      {buildings.map((building) => {
        const floors = getChildren(building.id)
        return (
          <div key={building.id} className="space-y-1">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-medium flex-1">{building.name}</span>
              <Badge variant="secondary">{building.assetCount} aset</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            {floors.map((floor) => {
              const rooms = getChildren(floor.id)
              return (
                <div key={floor.id} className="ml-6 space-y-1">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{floor.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {floor.assetCount}
                    </Badge>
                  </div>
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="ml-6 flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <DoorOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-sm">{room.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {room.assetCount}
                      </Badge>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
