"use client"

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, Printer } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface LocationReportProps {
    locations: any[]
}

export function LocationReport({ locations }: LocationReportProps) {
    const locationData = locations
        .filter((l) => l.type === "ruangan")
        .map((loc) => ({
            name: loc.name,
            total: loc.assetCount,
        }))


    return (
        <>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Laporan Aset per Lokasi</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <FileDown className="mr-2 h-4 w-4" />
                            Excel
                        </Button>
                        <Button variant="outline" size="sm">
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={locationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="name"
                                stroke="var(--muted-foreground)"
                                fontSize={12}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    color: "var(--foreground)",
                                }}
                            />
                            <Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Lokasi</TableHead>
                            <TableHead className="text-right">Jumlah Aset</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locationData.map((loc) => (
                            <TableRow key={loc.name}>
                                <TableCell className="font-medium">{loc.name}</TableCell>
                                <TableCell className="text-right">{loc.total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </>
    )
}
