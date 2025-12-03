import type { LoanItem } from '../../../libs/validation/loanSchemas'

interface LoanItemsTableProps {
  items: LoanItem[]
}

export function LoanItemsTable({ items }: LoanItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada aset dalam peminjaman ini
      </div>
    )
  }

  const getConditionBadge = (condition: string) => {
    const styles: Record<string, string> = {
      Baik: 'bg-green-100 text-green-800',
      'Rusak Ringan': 'bg-yellow-100 text-yellow-800',
      'Rusak Berat': 'bg-orange-100 text-orange-800',
      Hilang: 'bg-red-100 text-red-800',
    }
    return styles[condition] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kode Aset
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Barang
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Merk
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kondisi Sebelum
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kondisi Sesudah
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.assetId} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.asset?.kodeAset ?? '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {item.asset?.namaBarang ?? '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {item.asset?.merk ?? '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadge(item.conditionBefore ?? 'Baik')}`}
                >
                  {item.conditionBefore ?? '-'}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {item.conditionAfter ? (
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadge(item.conditionAfter)}`}
                  >
                    {item.conditionAfter}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
