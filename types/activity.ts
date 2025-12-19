export interface Activity {
    id: string
    type: "registrasi" | "mutasi" | "status" | "opname"
    title: string
    description: string
    timestamp: string
    user: string
}
