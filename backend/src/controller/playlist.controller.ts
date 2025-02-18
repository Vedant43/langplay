import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { AuthRequest } from "../utils/types"
import ApiResponse from "../utils/ApiResponse"
import ApiError from "../utils/ApiError"

const prisma = new PrismaClient()

export const createPlaylist = async (req: Request, res: Response) => {
    const { name } = req.body
    const userId = (req as AuthRequest).userId

    const playlistExists = await prisma.playlist.findFirst({
        where: {
            name,
            userId
        }
    })

    if(playlistExists){
        throw new ApiError(400, "Playlist already exists!")
    }

    const playlist = await prisma.playlist.create({
        data: {
            name,
            userId
        }
    })

    return new ApiResponse(200, "New playlist created", playlist).send(res)
}

export const saveVideoToPlaylist = async (req: Request, res: Response) => {
    // const { videoId, playlistId } = req.body
    const videoId = parseInt(req.body.videoId, 10)
    const playlistId = parseInt(req.body.playlistId, 10)

    const videoExists = await prisma.playlist_videos.findFirst({
        where: {
            videoId,
            playlistId
        }
    });

    if (videoExists) {
        throw new ApiError(400, "Video already exists in the playlist")
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
    
    await prisma.playlist_videos.delete({
        where: {
            playlistId_videoId: {
                playlistId: Number(playlistId),
                videoId: Number(videoId)
            }
        }
    })

    return new ApiResponse(200, "Video removed from playlist").send(res)
}