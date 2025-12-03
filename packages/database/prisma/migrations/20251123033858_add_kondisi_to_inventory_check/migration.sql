/*
  Warnings:

  - Added the required column `kondisi` to the `inventory_checks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventory_checks` ADD COLUMN `kondisi` VARCHAR(20) NOT NULL;
