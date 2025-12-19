export interface Location {
    id: string
    name: string
    type: "gedung" | "lantai" | "ruangan"
    parentId: string | null
    assetCount: number
}
