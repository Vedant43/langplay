import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { AuthRequest } from "../utils/types"
import ApiResponse from "../utils/ApiResponse"
import ApiError from "../utils/ApiError"

const prisma = new PrismaClient()
// type      PlaylistType?     @default(USER_CREATED)
//   createdAt DateTime          @default(now())
//   updatedAt DateTime          @updatedAt
//   userId    Int
//   user      User              @relation(fields: [userId], references: [id], onDelete: Cascade)
//   videos    Playlist_videos[]
export const getPlaylistsByUserId = async (req: Request, res: Response) => {
    const { userId } = (req as AuthRequest)
    
    const playlists = await prisma.playlist.findMany({
        where: {
            userId: userId
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            type: true,
            videos: {
                take: 1,  
                select: {
                    Video: {
                        select: {
                            id: true,
                            thumbnailUrl: true
                        }
                    }
                }
            }
        }
    })

    return new ApiResponse(200, "Fetched playlists successfully", playlists).send(res)
}

export const getPlaylistById = async (req: Request, res: Response) => {

    const playlistId = parseInt(req.params.playlistId, 10)

    if (isNaN(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id")
    }

    const playlist = await prisma.playlist.findUnique({
        where: { 
            id: playlistId 
        },
        include: {
            videos: {
                include: {
                    Video: true
                }
            }
        }
    })

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return new ApiResponse(200, "Fetched Playlist successfully", {
        count: playlist?.videos.length, 
        playlist
    }).send(res)
}

export const isVideoInPlaylist = async (req: Request, res: Response) => {
    const { playlistId } = req.body
    const videoId = parseInt(req.body.videoId)
    
    // playlistId is array
    const isVideoInPlaylist = await prisma.playlist_videos.findMany({
        where:{
            videoId,
            playlistId: {
                in: playlistId
            }
        }
    })
    const videoInPlaylistByUser = isVideoInPlaylist.map( (playlist) => playlist.playlistId)

    return new ApiResponse(200, "Checked if video is in playlist!!", videoInPlaylistByUser).send(res)
}

export const createPlaylist = async (req: Request, res: Response) => {
    const { name } = req.body
    const { type } = req.body
    const userId = (req as AuthRequest).userId

    const playlistExists = await prisma.playlist.findFirst({
        where: {
            name,
            userId,
            type
        }
    })

    if(playlistExists){
        throw new ApiError(400, "Playlist already exists!")
    }

    const playlist = await prisma.playlist.create({
        data: {
            name,
            userId,
            type
        }
    })

    return new ApiResponse(200, "New playlist created", playlist).send(res)
}

export const saveVideoToPlaylist = async (req: Request, res: Response) => {
    console.log("Req.body in save video to playlist----------", req.body)
    const videoId = parseInt(req.body.videoId, 10)
    const playlistId = parseInt(req.body.playlistId, 10)

    const videoExists = await prisma.playlist_videos.findFirst({
        where: {
            videoId,
            playlistId
        }
    })

    if (videoExists) {
        await prisma.playlist_videos.delete({
            where: {
                playlistId_videoId: {
                    playlistId: Number(playlistId),
                    videoId: Number(videoId)
                }
            }
        })

        return new ApiResponse(200, "Video removed from the playlist").send(res)
    }

    await prisma.playlist_videos.create({
        data:{
            videoId,
            playlistId
        }
    })

    return new ApiResponse(200, "Video added to playlist").send(res)
}

export const removeVideoFromPlaylist = async (req: Request, res: Response) => {
    const { playlistId, videoId } = req.params

    const videoExists = await prisma.playlist_videos.findFirst({
        where: {
            playlistId: Number(playlistId),
            videoId: Number(videoId)
        }
    })

    if (!videoExists) {
        throw new ApiError(404, "Video not found in the playlist")
    }

    return new ApiResponse(200, "Video removed from playlist").send(res)
}