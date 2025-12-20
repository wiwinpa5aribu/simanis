export interface StockOpname {
  id: string
  date: string
  location: string
  status: "sedang-berlangsung" | "selesai"
  foundCount: number
  notFoundCount: number
  totalAssets: number
}
