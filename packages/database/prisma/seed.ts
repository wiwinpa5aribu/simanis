import * as argon2 from 'argon2'
import { PrismaClient } from '../node_modules/.prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Seed Roles
  console.log('Creating roles...')
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'Kepsek' },
      update: {},
      create: { name: 'Kepsek' },
    }),
    prisma.role.upsert({
      where: { name: 'Wakasek Sarpras' },
      update: {},
      create: { name: 'Wakasek Sarpras' },
    }),
    prisma.role.upsert({
      where: { name: 'Bendahara BOS' },
      update: {},
      create: { name: 'Bendahara BOS' },
    }),
    prisma.role.upsert({
      where: { name: 'Operator' },
      update: {},
      create: { name: 'Operator' },
    }),
    prisma.role.upsert({
      where: { name: 'Guru' },
      update: {},
      create: { name: 'Guru' },
    }),
  ])
  console.log(`✅ Created ${roles.length} roles`)

  // 2. Seed Test Users (1 per role)
  console.log('Creating test users...')
  const hashedPassword = await argon2.hash('password123')

  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: 'kepsek' },
      update: {},
      create: {
        name: 'Kepala Sekolah',
        username: 'kepsek',
        email: 'kepsek@simanis.sch.id',
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { username: 'wakasek' },
      update: {},
      create: {
        name: 'Wakasek Sarpras',
        username: 'wakasek',
        email: 'wakasek@simanis.sch.id',
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { username: 'bendahara' },
      update: {},
      create: {
        name: 'Bendahara BOS',
        username: 'bendahara',
        email: 'bendahara@simanis.sch.id',
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { username: 'operator' },
      update: {},
      create: {
        name: 'Operator Sekolah',
        username: 'operator',
        email: 'operator@simanis.sch.id',
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { username: 'guru' },
      update: {},
      create: {
        name: 'Guru Matematika',
        username: 'guru',
        email: 'guru@simanis.sch.id',
        password: hashedPassword,
      },
    }),
  ])
  console.log(`✅ Created ${users.length} test users`)

  // 3. Assign roles to users
  console.log('Assigning roles to users...')
  await Promise.all([
    prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: users[0].id,
          roleId: roles[0].id,
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        roleId: roles[0].id,
      },
    }),
    prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: users[1].id,
          roleId: roles[1].id,
        },
      },
      update: {},
      create: {
        userId: users[1].id,
        roleId: roles[1].id,
      },
    }),
    prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: users[2].id,
          roleId: roles[2].id,
        },
      },
      update: {},
      create: {
        userId: users[2].id,
        roleId: roles[2].id,
      },
    }),
    prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: users[3].id,
          roleId: roles[3].id,
        },
      },
      update: {},
      create: {
        userId: users[3].id,
        roleId: roles[3].id,
      },
    }),
    prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: users[4].id,
          roleId: roles[4].id,
        },
      },
      update: {},
      create: {
        userId: users[4].id,
        roleId: roles[4].id,
      },
    }),
  ])
  console.log('✅ Assigned roles to users')

  // 4. Seed Asset Categories
  console.log('Creating asset categories...')
  const categories = await Promise.all([
    prisma.assetCategory.upsert({
      where: { name: 'Elektronik' },
      update: {},
      create: {
        name: 'Elektronik',
        description: 'Peralatan elektronik seperti laptop, proyektor, dll',
      },
    }),
    prisma.assetCategory.upsert({
      where: { name: 'Furniture' },
      update: {},
      create: {
        name: 'Furniture',
        description: 'Meja, kursi, lemari, dll',
      },
    }),
    prisma.assetCategory.upsert({
      where: { name: 'Kendaraan' },
      update: {},
      create: {
        name: 'Kendaraan',
        description: 'Kendaraan dinas sekolah',
      },
    }),
    prisma.assetCategory.upsert({
      where: { name: 'Alat Olahraga' },
      update: {},
      create: {
        name: 'Alat Olahraga',
        description: 'Peralatan untuk kegiatan olahraga',
      },
    }),
    prisma.assetCategory.upsert({
      where: { name: 'Buku' },
      update: {},
      create: {
        name: 'Buku',
        description: 'Buku perpustakaan dan referensi',
      },
    }),
  ])
  console.log(`✅ Created ${categories.length} asset categories`)

  // 5. Seed Location Hierarchy (Buildings, Floors, Rooms)
  console.log('Creating location hierarchy...')

  const gedungA = await prisma.building.upsert({
    where: { name: 'Gedung A' },
    update: {},
    create: { name: 'Gedung A' },
  })

  const lantai1 = await prisma.floor.upsert({
    where: {
      buildingId_levelNumber: {
        buildingId: gedungA.id,
        levelNumber: 1,
      },
    },
    update: {},
    create: {
      buildingId: gedungA.id,
      levelNumber: 1,
    },
  })

  const lantai2 = await prisma.floor.upsert({
    where: {
      buildingId_levelNumber: {
        buildingId: gedungA.id,
        levelNumber: 2,
      },
    },
    update: {},
    create: {
      buildingId: gedungA.id,
      levelNumber: 2,
    },
  })

  await Promise.all([
    prisma.room.upsert({
      where: {
        floorId_name: {
          floorId: lantai1.id,
          name: 'Ruang Kepala Sekolah',
        },
      },
      update: {},
      create: {
        floorId: lantai1.id,
        name: 'Ruang Kepala Sekolah',
        code: 'A1-KS',
      },
    }),
    prisma.room.upsert({
      where: {
        floorId_name: {
          floorId: lantai1.id,
          name: 'Ruang Guru',
        },
      },
      update: {},
      create: {
        floorId: lantai1.id,
        name: 'Ruang Guru',
        code: 'A1-RG',
      },
    }),
    prisma.room.upsert({
      where: {
        floorId_name: {
          floorId: lantai2.id,
          name: 'Lab Komputer',
        },
      },
      update: {},
      create: {
        floorId: lantai2.id,
        name: 'Lab Komputer',
        code: 'A2-LK',
      },
    }),
    prisma.room.upsert({
      where: {
        floorId_name: {
          floorId: lantai2.id,
          name: 'Perpustakaan',
        },
      },
      update: {},
      create: {
        floorId: lantai2.id,
        name: 'Perpustakaan',
        code: 'A2-PP',
      },
    }),
  ])
  console.log('✅ Created location hierarchy')

  console.log('')
  console.log('🎉 Seeding completed successfully!')
  console.log('')
  console.log('📝 Test Users (password: password123):')
  console.log('   - kepsek / password123')
  console.log('   - wakasek / password123')
  console.log('   - bendahara / password123')
  console.log('   - operator / password123')
  console.log('   - guru / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
