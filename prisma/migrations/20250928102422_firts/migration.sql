/*
  Warnings:

  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_userDetailId_fkey`;

-- AlterTable
ALTER TABLE `userdetails` MODIFY `address` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `road` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `images`;

-- CreateTable
CREATE TABLE `files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `diskType` ENUM('LOCAL', 'AWS', 'SHARED') NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `modifiedName` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userDetailId` INTEGER NULL,

    UNIQUE INDEX `files_userDetailId_key`(`userDetailId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_userDetailId_fkey` FOREIGN KEY (`userDetailId`) REFERENCES `userDetails`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
