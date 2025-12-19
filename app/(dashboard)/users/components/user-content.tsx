"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCog, Shield, Search } from "lucide-react"
import type { TUser } from "@/lib/validations/user"
import { UserTable } from "./user-table"
import { UserForm } from "./user-form"
import { PermissionMatrix } from "./permission-matrix"

interface UserContentProps {
    initialUsers: TUser[]
}

export function UserContent({ initialUsers }: UserContentProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredUsers = initialUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Manajemen User</h1>
                    <p className="text-muted-foreground">Kelola pengguna dan hak akses sistem</p>
                </div>
                <UserForm />
            </div>

            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users" className="gap-2">
                        <UserCog className="h-4 w-4" />
                        Daftar User
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Matriks Hak Akses
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-foreground">Daftar Pengguna</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari user..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <UserTable users={filteredUsers} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="permissions">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Matriks Hak Akses per Role</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PermissionMatrix />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
