export interface Mutation {
    id: string
    assetId: string
    assetName: string
    fromLocation: string
    toLocation: string
    date: string
    reason: string
    status: "pending" | "approved" | "rejected"
    createdBy: string
}
