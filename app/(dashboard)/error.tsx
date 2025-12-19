"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[80vh] items-center justify-center p-6">
            <Card className="max-w-md border-destructive/50">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Terjadi Kesalahan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <p className="text-muted-foreground">
                        Sistem mengalami kendala saat memuat data. Mohon maaf atas ketidaknyamanannya.
                    </p>
                    <div className="rounded-md bg-muted p-3 text-left">
                        <p className="text-xs font-mono break-all">{error.message || "Unknown error"}</p>
                    </div>
                    <Button onClick={() => reset()} className="w-full">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Coba Lagi
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
