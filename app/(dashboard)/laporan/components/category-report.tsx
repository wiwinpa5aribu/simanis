"use client"

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, Printer } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { assets } from "@/lib/data"
import { categories } from "@/lib/constants"

const categoryData = categories.map((cat) => ({
    name: cat,
    total: assets.filter((a) => a.category === cat).length,
    value: assets.filter((a) => a.category === cat).reduce((sum, a) => sum + a.purchasePrice, 0),
}))

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function CategoryReport() {
    return (
        <>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Laporan Aset per Kategori</CardTitle>
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
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="var(--muted-foreground)"
                                    fontSize={12}
                                    width={100}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--card)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                        color: "var(--foreground)",
                                    }}
                                />
                                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kategori</TableHead>
                                <TableHead className="text-right">Jumlah</TableHead>
                                <TableHead className="text-right">Total Nilai</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categoryData.map((cat) => (
                                <TableRow key={cat.name}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-right">{cat.total}</TableCell>
                                    <TableCell className="text-right">Rp {cat.value.toLocaleString("id-ID")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </>
    )
}
