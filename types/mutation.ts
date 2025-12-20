export interface Mutation {
  id: string
  assetId: string
  assetName: string
  fromLocation: string
  toLocation: string
  date: string
  notes: string
  status: "diproses" | "selesai" | "dibatalkan"
  requester: string
}
