/**
 * UsefulLifeSettings - Daftar kategori dengan masa manfaat, edit inline
 * Validates: Requirements 4.1, 4.2
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit2, Save, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCategories } from '@/libs/api/categories'
import { updateCategoryUsefulLife } from '@/libs/api/depreciation'

export function UsefulLifeSettings() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<number>(0)

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const updateMutation = useMutation({
    mutationFn: ({ categoryId, value }: { categoryId: number; value: number }) =>
      updateCategoryUsefulLife(categoryId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Masa manfaat berhasil diperbarui')
      setEditingId(null)
    },
    onError: () => {
      toast.error('Gagal memperbarui masa manfaat')
    },
  })

  const handleEdit = (id: number, currentValue: number) => {
    setEditingId(id)
    setEditValue(currentValue)
  }

  const handleSave = (categoryId: number) => {
    if (editValue < 1 || editValue > 20) {
      toast.error('Masa manfaat harus antara 1-20 tahun')
      return
    }
    updateMutation.mutate({ categoryId, value: editValue })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue(0)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Masa Manfaat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Masa Manfaat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-red-500">
            Gagal memuat data kategori
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Masa Manfaat per Kategori</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategori</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="w-[150px]">Masa Manfaat (Tahun)</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-gray-600">
                  {category.description || '-'}
                </TableCell>
                <TableCell>
                  {editingId === category.id ? (
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={editValue}
                      onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                      className="w-20"
                      autoFocus
                    />
                  ) : (
                    <span className="font-semibold">
                      {category.defaultMasaManfaat ?? 5} tahun
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === category.id ? (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(category.id)}
                        disabled={updateMutation.isPending}
                      >
                        <Save className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        disabled={updateMutation.isPending}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEdit(category.id, category.defaultMasaManfaat ?? 5)
                      }
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
