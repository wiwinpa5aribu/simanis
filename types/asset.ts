export interface Asset {
    id: string
    name: string
    category: string
    location: string
    status: "aktif" | "tidak-aktif" | "maintenance" | "dihapuskan"
    condition: "baik" | "cukup" | "kurang" | "rusak"
    purchaseDate: string
    purchasePrice: number
    description: string
}
