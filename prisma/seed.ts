import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Cleanup existing data
  await prisma.auditLog.deleteMany()
  await prisma.stockOpnameSession.deleteMany()
  await prisma.mutation.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.location.deleteMany()
  await prisma.user.deleteMany()
  console.log("🧹 Cleaned existing data")

  // Create Users
  await prisma.user.createMany({
    data: [
      {
        id: "USR-001",
        name: "Ahmad Fauzi",
        email: "ahmad@sekolah.edu",
        role: "admin",
        status: "aktif",
        avatar: "/admin-avatar.png",
      },
      {
        id: "USR-002",
        name: "Siti Rahayu",
        email: "siti@sekolah.edu",
        role: "manager",
        status: "aktif",
        avatar: "/female-avatar-professional.jpg",
      },
      {
        id: "USR-003",
        name: "Budi Santoso",
        email: "budi@sekolah.edu",
        role: "staff",
        status: "aktif",
        avatar: "/male-avatar-casual.jpg",
      },
    ],
  })
  console.log("✅ Users seeded")

  // Create Locations
  await prisma.location.createMany({
    data: [
      { id: "LOC-001", name: "Gedung A", type: "gedung", parentId: null, assetCount: 45 },
      { id: "LOC-002", name: "Gedung B", type: "gedung", parentId: null, assetCount: 32 },
      {
        id: "LOC-003",
        name: "Lantai 1 - Gedung A",
        type: "lantai",
        parentId: "LOC-001",
        assetCount: 20,
      },
      { id: "LOC-004", name: "Ruang Guru", type: "ruangan", parentId: "LOC-003", assetCount: 15 },
    ],
  })
  console.log("✅ Locations seeded")

  // Create Assets
  await prisma.asset.createMany({
    data: [
      {
        id: "AST-001",
        name: "Laptop ASUS ROG",
        category: "Elektronik",
        status: "aktif",
        location: "Ruang Guru",
        purchaseDate: "2023-01-15",
        purchasePrice: 15000000,
        condition: "baik",
        description: "Laptop untuk keperluan administratif guru.",
      },
      {
        id: "AST-002",
        name: "Proyektor Epson",
        category: "Elektronik",
        status: "aktif",
        location: "Ruang Kelas 1A",
        purchaseDate: "2022-08-20",
        purchasePrice: 8500000,
        condition: "baik",
        description: "Proyektor untuk presentasi kelas.",
      },
      {
        id: "AST-003",
        name: "Meja Kerja",
        category: "Furnitur",
        status: "aktif",
        location: "Ruang Guru",
        purchaseDate: "2021-03-10",
        purchasePrice: 2500000,
        condition: "cukup",
        description: "Meja kerja standar kantor.",
      },
    ],
  })
  console.log("✅ Assets seeded")

  // Create Mutations
  await prisma.mutation.createMany({
    data: [
      {
        id: "MUT-001",
        assetId: "AST-001",
        assetName: "Laptop ASUS ROG",
        fromLocation: "Gudang",
        toLocation: "Ruang Guru",
        date: "2024-01-10",
        status: "selesai",
        requester: "Ahmad Fauzi",
        notes: "Pemindahan untuk keperluan admin baru.",
      },
    ],
  })
  console.log("✅ Mutations seeded")

  // Create Stock Opname Sessions
  await prisma.stockOpnameSession.createMany({
    data: [
      {
        id: "SO-001",
        date: "2024-12-01",
        location: "Gedung A",
        status: "selesai",
        foundCount: 40,
        notFoundCount: 5,
        totalAssets: 45,
      },
      {
        id: "SO-002",
        date: "2024-12-19",
        location: "Gedung B",
        status: "sedang_berlangsung",
        foundCount: 10,
        notFoundCount: 0,
        totalAssets: 32,
      },
    ],
  })
  console.log("✅ Stock Opname Sessions seeded")

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        id: "LOG-001",
        timestamp: "2024-12-19 10:00:00",
        user: "Ahmad Fauzi",
        action: "UPDATE",
        module: "Aset",
        details: "Mengubah status Laptop AST-001 menjadi Maintenance",
      },
      {
        id: "LOG-002",
        timestamp: "2024-12-19 11:30:00",
        user: "Siti Rahayu",
        action: "CREATE",
        module: "Mutasi",
        details: "Membuat mutasi baru MUT-001",
      },
    ],
  })
  console.log("✅ Audit Logs seeded")

  console.log("🎉 Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
