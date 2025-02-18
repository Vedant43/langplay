/*
  Warnings:

  - You are about to drop the column `playListId` on the `Playlist_videos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playlistId,videosId]` on the table `Playlist_videos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playlistId` to the `Playlist_videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Playlist_videos" DROP CONSTRAINT "Playlist_videos_playListId_fkey";

-- DropIndex
DROP INDEX "Playlist_videos_playListId_videosId_key";

-- AlterTable
ALTER TABLE "Playlist_videos" DROP COLUMN "playListId",
ADD COLUMN     "playlistId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_videos_playlistId_videosId_key" ON "Playlist_videos"("playlistId", "videosId");

-- AddForeignKey
ALTER TABLE "Playlist_videos" ADD CONSTRAINT "Playlist_videos_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
