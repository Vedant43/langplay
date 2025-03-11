/*
  Warnings:

  - You are about to drop the column `videosId` on the `Playlist_videos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playlistId,videoId]` on the table `Playlist_videos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoId` to the `Playlist_videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChannelEngagement" DROP CONSTRAINT "ChannelEngagement_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelEngagement" DROP CONSTRAINT "ChannelEngagement_subscriberId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_videoId_fkey";

-- DropForeignKey
ALTER TABLE "CommentEngagement" DROP CONSTRAINT "CommentEngagement_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentEngagement" DROP CONSTRAINT "CommentEngagement_userId_fkey";

-- DropForeignKey
ALTER TABLE "Community" DROP CONSTRAINT "Community_userId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityLikes" DROP CONSTRAINT "CommunityLikes_communityId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityLikes" DROP CONSTRAINT "CommunityLikes_userId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_userId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist_videos" DROP CONSTRAINT "Playlist_videos_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist_videos" DROP CONSTRAINT "Playlist_videos_videosId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";

-- DropForeignKey
ALTER TABLE "VideoEngagement" DROP CONSTRAINT "VideoEngagement_userId_fkey";

-- DropForeignKey
ALTER TABLE "VideoEngagement" DROP CONSTRAINT "VideoEngagement_videoId_fkey";

-- DropIndex
DROP INDEX "Playlist_videos_playlistId_videosId_key";

-- AlterTable
ALTER TABLE "Playlist_videos" DROP COLUMN "videosId",
ADD COLUMN     "videoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "channelName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_videos_playlistId_videoId_key" ON "Playlist_videos"("playlistId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_channelName_key" ON "User"("channelName");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoEngagement" ADD CONSTRAINT "VideoEngagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoEngagement" ADD CONSTRAINT "VideoEngagement_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist_videos" ADD CONSTRAINT "Playlist_videos_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist_videos" ADD CONSTRAINT "Playlist_videos_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityLikes" ADD CONSTRAINT "CommunityLikes_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityLikes" ADD CONSTRAINT "CommunityLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentEngagement" ADD CONSTRAINT "CommentEngagement_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentEngagement" ADD CONSTRAINT "CommentEngagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelEngagement" ADD CONSTRAINT "ChannelEngagement_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelEngagement" ADD CONSTRAINT "ChannelEngagement_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
