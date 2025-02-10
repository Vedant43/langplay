/*
  Warnings:

  - You are about to drop the column `channelName` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_channelName_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "channelName";
