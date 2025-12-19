export interface User {
    id: string
    name: string
    email: string
    role: "admin" | "manager" | "staff" | "viewer"
    status: "aktif" | "tidak-aktif"
    avatar: string
}
