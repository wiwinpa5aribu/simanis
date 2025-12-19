-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'manager', 'staff', 'viewer') NOT NULL DEFAULT 'viewer',
    `status` ENUM('aktif', 'tidak_aktif') NOT NULL DEFAULT 'aktif',
    `avatar` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('gedung', 'lantai', 'ruangan') NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `assetCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assets` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `status` ENUM('aktif', 'tidak_aktif', 'maintenance', 'dihapuskan') NOT NULL DEFAULT 'aktif',
    `location` VARCHAR(191) NOT NULL,
    `purchaseDate` VARCHAR(191) NOT NULL,
    `purchasePrice` DOUBLE NOT NULL,
    `condition` ENUM('baik', 'cukup', 'kurang', 'rusak') NOT NULL DEFAULT 'baik',
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mutations` (
    `id` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `assetName` VARCHAR(191) NOT NULL,
    `fromLocation` VARCHAR(191) NOT NULL,
    `toLocation` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `status` ENUM('diproses', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'selesai',
    `requester` VARCHAR(191) NOT NULL,
    `notes` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audits` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `status` ENUM('selesai', 'draft', 'berlangsung') NOT NULL DEFAULT 'draft',
    `itemsCount` INTEGER NOT NULL,
    `auditor` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
