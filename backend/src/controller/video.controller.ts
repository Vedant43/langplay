import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary} from 'cloudinary'
import { uploadImageOnCloudinary, uploadVideoOnCloudinary } from "../utils/cloudinary";
import { AuthRequest } from "../utils/types";
import { Prisma, PrismaClient } from "@prisma/client";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

interface MulterFileFields {
    video: Express.Multer.File[]
    thumbnail: Express.Multer.File[]
}

const prisma = new PrismaClient();

export const uploadVideo = async (req: Request, res: Response) => {
    
    const authReq = req as AuthRequest
    const { title,description } = authReq.body as { title: string; description: string }
    const { userId } = authReq;
    const files = req.files as MulterFileFields | undefined

    const videoFilePath = files?.video?.[0]?.path || null
    const thumbnailFilePath = files?.thumbnail?.[0]?.path || null

    let videoResponse
    if(videoFilePath){
        const response = await uploadVideoOnCloudinary(videoFilePath, userId)
        videoResponse = response
    }

    let thumbnailUrl
    if(thumbnailFilePath){
        const response = await uploadImageOnCloudinary(thumbnailFilePath, userId)
        thumbnailUrl = response.secure_url
    }

    // const [videoResponse, thumbnailResponse] = await Promise.all([
    //     videoFilePath ? uploadVideoOnCloudinary(videoFilePath, userId) : null,
    //     thumbnailFilePath ? uploadImageOnCloudinary(thumbnailFilePath, userId) : null
    // ]);

    const video = await prisma.video.create({
        data: {
            title,
            description,
            videoUrl: videoResponse?.secure_url || '',
            videoPublicId: videoResponse?.public_id || '',
            thumbnailUrl: thumbnailUrl || '',
            userId
        }
    })

    return new ApiResponse(200, "Video uploaded successfully").send(res)
}

export const getVideoById = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.id, 10)
    if (isNaN(videoId)) throw new ApiError(400, "Invalid video ID");

    // update video view counts
    const video = await prisma.video.findUnique({
        where: {    
            id: videoId
        },
        include: {
            user: {
                select:{
                    id: true,
                    username: true,
                    profilePicture:true,
                    // include subscribers
                }
            },
            comments: {
                select:{
                    id:true,
                    content: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profilePicture: true
                        }
                    }
                }
            },
            videoEngagement: true,
        }
    })

    if(!video) throw new ApiError(404, "Video not found")

    return new ApiResponse(200, "Video fetched successfully", video).send(res)
}

export const deleteVideoById = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.id, 10)

    await prisma.video.delete({
        where: {
            id: videoId
        }
    })

    return new ApiResponse(200, "Video is deleted!!").send(res)
}

export const getVideosByUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10)
    // const userId = (req as AuthRequest).userId

    // need to check if user wants his own videos or other user's videos
    const videos = await prisma.video.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            title: true,
            description: true,
            videoUrl: true,
            videoPublicId: true,
            thumbnailUrl: true,
            userId: true,
            views: true,
            createdAt: true,
        }
    })

    return new ApiResponse(200, "Videos fetched successfully", videos).send(res)
}

export const getAllVideos = async (req: Request, res: Response) => {

}

export const likeVideo = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.id, 10)
    const userId = (req as AuthRequest).userId

    const existingEngagement = await prisma.videoEngagement.findUnique({
        where: { videoId_userId: { videoId, userId }}
    })

    if(existingEngagement){
        // If video is already liked then need to remove like
        if(existingEngagement.engagementType === 'LIKE'){
            await prisma.videoEngagement.delete({
                where: { 
                    videoId_userId: { 
                        videoId, userId 
                    }}
            })
        
            return new ApiResponse(200, "Removed like", { liked:false, likeCount: await getLikeCount(videoId)})
        } 

        // if video is disliked
        await prisma.videoEngagement.update({
            where: { 
                videoId_userId: { 
                    videoId, 
                    userId 
                }},
            data: { 
                engagementType: "LIKE" 
            },
        })

        return new ApiResponse(200, "Liked", { liked: true, likeCount: await getLikeCount(videoId)})
    }

    await prisma.videoEngagement.create({
        data:{
            videoId, 
            userId,
            engagementType: 'LIKE'
        }
    })

    return new ApiResponse(200, "Liked", { liked: true, likeCount: await getLikeCount(videoId)})
}

export const dislikeVideo = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.id, 10)
    const userId = (req as AuthRequest).userId

    const existingEngagement = await prisma.videoEngagement.findUnique({
        where: {
            videoId_userId: {
                videoId,
                userId
            }
        }
    })

    if(existingEngagement){

        if(existingEngagement.engagementType === 'DISLIKE'){
            await prisma.videoEngagement.delete({
                where: {
                    videoId_userId: {
                        videoId,
                        userId
                    }
                }  
            })

            return new ApiResponse(200, "Removed dislike", { disliked: false, dislikeCount: await getDislikeCount(videoId)})
        }

        await prisma.videoEngagement.update({
            where: {
                videoId_userId: {
                    userId,
                    videoId
                }
            },
            data:{
                engagementType: 'DISLIKE'
            }
        })

        return new ApiResponse(200, "Disliked", { disliked: true, likeCount: await getDislikeCount(videoId)})
    }

    await prisma.videoEngagement.create({
        data:{
            userId,
            videoId,
            engagementType: 'DISLIKE'
        }
    })

    return new ApiResponse(200, "Disliked", { disliked: true, likeCount: await getDislikeCount(videoId)})
}

export const addComment = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId, 10)
    const { content } = req.body
    const userId = (req as unknown as AuthRequest).userId

    const comment = await prisma.comment.create({
        data:{
            content,
            videoId,
            userId,
        }
    })

    return new ApiResponse(200, "Comment added successfully", comment).send(res)
}

export const deleteCommentById = async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.commentId, 10)
    const userId = parseInt(req.params.userId, 10)

    await prisma.comment.delete({
        where: {
          id: commentId,
          userId
        },
    })

    return new ApiResponse(200, "Comment deleted successfully").send(res)
}
// req: AuthRequest<{ title: string; description: string }>
// export interface AuthRequest<T = any> extends Request {
//     userId: string,
//     username: string,
//     body: T
// }

const getLikeCount = async (videoId: number) => {
    return await prisma.videoEngagement.count({
        where:{
            videoId, 
            engagementType: 'LIKE'
        }
    })
}

const getDislikeCount = async (videoId: number) => {
    return await prisma.videoEngagement.count({
        where: {
            videoId,
            engagementType: 'DISLIKE'
        }
    })
}