/**
 * Mock Data untuk Dashboard
 * Data simulasi sesuai dengan struktur database simanis_dev
 */

import type { DashboardStats, RecentActivity } from '../dashboard'

export const mockDashboardStats: DashboardStats = {
  total_assets: 156,
  assets_by_condition: {
    Baik: 120,
    'Rusak Ringan': 22,
    'Rusak Berat': 8,
    Hilang: 6,
  },
  assets_by_category: [
    { category_name: 'Elektronik', count: 45 },
    { category_name: 'Furniture', count: 38 },
    { category_name: 'Buku', count: 32 },
    { category_name: 'Alat Olahraga', count: 25 },
    { category_name: 'Kendaraan', count: 16 },
  ],
  active_loans: 12,
  // Nilai aset untuk KIB
  total_value: 2850000000, // 2.85 Miliar
  depreciated_value: 712500000, // 712.5 Juta (25% penyusutan)
  // Ringkasan inventarisasi
  pending_inventory: 3,
  last_inventory_date: '2024-11-15',
}

export const mockRecentActivities: RecentActivity[] = [
  {
    id: 1,
    type: 'asset',
    title: 'Aset Baru Ditambahkan',
    description: 'Laptop ASUS VivoBook ditambahkan ke inventaris',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    link: '/assets/1',
  },
  {
    id: 2,
    type: 'loan',
    title: 'Peminjaman Baru',
    description: 'Proyektor Epson dipinjam oleh Guru Matematika',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: '/loans/1',
  },
  {
    id: 3,
    type: 'mutation',
    title: 'Mutasi Aset',
    description: 'Meja Guru dipindahkan dari Ruang 101 ke Ruang 205',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 4,
    type: 'inventory',
    title: 'Inventarisasi Selesai',
    description: 'Opname Gedung A Lantai 1 telah selesai dilakukan',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: '/inventory/1',
  },
  {
    id: 5,
    type: 'loan',
    title: 'Pengembalian Aset',
    description: 'Speaker Portable dikembalikan oleh OSIS',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
]
