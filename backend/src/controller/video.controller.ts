import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary} from 'cloudinary'
import { uploadImageOnCloudinary, uploadVideoOnCloudinary } from "../utils/cloudinary";
import { AuthRequest } from "../utils/types";
import { Language, Prisma, PrismaClient } from "@prisma/client";
import axios from 'axios'
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { prisma } from "../prisma"
import { getUserUploadedVideos } from "../services/videoService";
import { storePlaylistsInDB } from "../services/youtubeService";
import { getLanguageEnum } from "../utils/language";
import { storeVideosInDb } from "../services/youtubeService";
import { generateQuizAndTranscript } from "../utils/websocketClient";

interface MulterFileFields {
    video: Express.Multer.File[]
    thumbnail: Express.Multer.File[]
}

export const uploadVideo = async (req: Request, res: Response) => {
    const authReq = req as AuthRequest
    const { title,description, language } = authReq.body as { title: string; description: string; language:Language  }
    const { userId } = authReq
    const files = req.files as MulterFileFields | undefined

    const videoFilePath = files?.video?.[0]?.path || null
    const thumbnailFilePath = files?.thumbnail?.[0]?.path || null

    const isTitleExist = await prisma.video.findUnique({
        where:{
            title
        }
    })

    if(isTitleExist) {
        throw new ApiError(409, "Title already exists!")
    }

    let videoResponse
    if(videoFilePath){
        const response = await uploadVideoOnCloudinary(videoFilePath, userId)
        videoResponse = response
    } 
    else{
        throw new ApiError(400,'Video file is required')
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
            videoUrl: videoResponse?.secure_url,
            videoPublicId: videoResponse?.public_id,
            thumbnailUrl: thumbnailUrl || '',
            language,
            userId
        }
    })

    return new ApiResponse(200, "Video uploaded successfully").send(res)
}

const inProgressVideos = new Set<number>();

export const getVideoById = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.id, 10);
    if (isNaN(videoId)) throw new ApiError(400, "Invalid video ID");
  
    const video = await prisma.video.findUnique({
      where: { 
        id: videoId 
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            subscribers: true,
            subscribedTo: true
          }
        },
        comments: {
          select: {
            id: true,
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
    });
  
    if (!video) throw new ApiError(404, "Video not found");
  
    // If either quiz or transcript missing, trigger WebSocket process
    // if (!video.quiz || !video.transcriptLang) {
    //   console.log("Starting FastAPI WebSocket job...");
    //   generateQuizAndTranscript(video.id, video.videoUrl);
    // }

    const transcriptExists = !!video.transcriptLang;
    const quizExists = !!video.quiz;

    // If either quiz or transcript is missing, and not already in progress
    if ((!transcriptExists || !quizExists) && !inProgressVideos.has(videoId)) {
        console.log("📡 Triggering FastAPI WebSocket for video:", videoId);
        inProgressVideos.add(videoId);  // Mark video as being processed

        try {
            await generateQuizAndTranscript(video.id, video.videoUrl);
            console.log("Quiz and Transcript generated successfully!");
        } catch (err) {
            console.error("Error generating quiz and transcript:", err);
        } finally {
            inProgressVideos.delete(videoId); // Remove from in-progress set after processing
        }
    } else {
        console.log("Transcript/quiz already present or generation in progress");
    }
  
    return new ApiResponse(200, "Video fetched successfully", video).send(res);
};

export const increaseViewCount = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.id, 10)
    if (isNaN(videoId)) throw new ApiError(400, "Invalid video ID")

    await prisma.video.update({
        where: { 
            id: videoId 
        },
        data: { 
            views: { 
                increment: 1 
            } 
        }
    })

    return new ApiResponse(200, "View count increased...").send(res)
}

export const deleteVideoById = async (req: Request, res: Response) => {
    // need to make sure if user is owner
    const videoId = parseInt(req.params.id, 10)
    const userId = (req as AuthRequest).userId

    console.log(videoId)
    await prisma.video.delete({
        where: {
            id: videoId,
            userId
        }
    })

    return new ApiResponse(200, "Video is deleted!!").send(res)
}

export const getVideosByUser = async (req: Request, res: Response) => {
    // const userId = parseInt(req.params.userId, 10)
    const userId = (req as AuthRequest).userId
    
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
            videoEngagement: true,
        }
    })

    return new ApiResponse(200, "Videos fetched successfully", videos).send(res)
}

export const getLikedVideos = async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).userId
    
    const engagementById = await prisma.videoEngagement.findMany({
        where:{
            userId,
            engagementType: 'LIKE'
        },
    })

    const likedVideoIds = engagementById.map(videoEngagement => videoEngagement.videoId)

    const likedVideos = await prisma.video.findMany({
        where: {
            id: { 
                in: likedVideoIds
            }
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

    return new ApiResponse(200, "Fetched liked videos...", likedVideos).send(res)      
}

// export const getYoutubeVideos = async (req: Request, res: Response) => {
//     const { language } = req.query

//     if(!language) throw new ApiError(400, "Language is required")
// }

// export const getAllUserUploadedVideos = async (req: Request, res: Response) => {
//     const videos = await prisma.video.findMany({
//         select:{
//             id: true,
//             title: true,
//             description: true,
//             videoUrl: true,
//             videoPublicId: true,
//             thumbnailUrl: true,
//             userId: true,
//             views: true,
//             createdAt: true,
//             user: {
//                 select: {
//                     id: true,
//                     username: true,
//                     profilePicture: true,
//                     channelName: true
//                 }
//             }
//         }
//     })

//     return new ApiResponse(200, "Fetched all videos...", videos).send(res)
// }

export const getHomeFeed = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).userId
        const homeFeed = await getBeginnerHomeFeed(userId)
        return new ApiResponse(200, "Fetched homefeed", homeFeed).send(res)
    } catch (error) {
        console.log("error in fetching home feed ", error)
        throw new ApiError(400, "Error in fetching home feed", error)
    }
}

export const likeVideo = async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.id, 10)
    const userId = (req as AuthRequest).userId

    const existingEngagement = await prisma.videoEngagement.findUnique({
        where: { 
            videoId_userId: { 
                videoId, userId 
            }}
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
        
            return new ApiResponse(200, "Removed like", { liked:false, likeCount: await getLikeCount(videoId)}).send(res)
        } 

        // if video is disliked
        const videoEngagement = await prisma.videoEngagement.update({
            where: { 
                videoId_userId: { 
                    videoId, 
                    userId 
                }},
            data: { 
                engagementType: "LIKE" 
            },
        })

        return new ApiResponse(200, "Liked", { videoEngagement, liked: true, likeCount: await getLikeCount(videoId)}).send(res)
    }

    const videoEngagement = await prisma.videoEngagement.create({
        data:{
            videoId, 
            userId,
            engagementType: 'LIKE'
        }
    })

    return new ApiResponse(
        200, 
        "Liked", 
        { 
            videoEngagement,
            liked: true, 
            likeCount: await getLikeCount(videoId)
        })
        .send(res)
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

            return new ApiResponse(200, "Removed dislike", { disliked: false, dislikeCount: await getDislikeCount(videoId)}).send(res)
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

        return new ApiResponse(200, "Disliked", { disliked: true, dislikeCount: await getDislikeCount(videoId)}).send(res)
    }

    await prisma.videoEngagement.create({
        data:{
            userId,
            videoId,
            engagementType: 'DISLIKE'
        }
    })

    return new ApiResponse(200, "Disliked", { disliked: true, dislikeCount: await getDislikeCount(videoId)}).send(res)
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

const getBeginnerHomeFeed = async (userId: number) => {
    
    const user = await prisma.user.findUnique({
      where: { 
        id: userId 
      },
      select: { 
        languageToLearn: true, 
        languageSkillLevel: true 
      },
    })

    if (!user || !user.languageToLearn) throw new ApiError(400,"Invalid user data")
    if (user.languageSkillLevel !== "Beginner") return []

    const language = getLanguageEnum(user.languageToLearn) 
    if (!language) return

    let storedPlaylists: any[] = []

    const youtubePlaylists = await prisma.playlist.findMany({
      where: { 
        language, 
        type: "YOUTUBE"
      },
      take:3,
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    })

    const uploadedPlaylists = await prisma.playlist.findMany({
        where: { 
          language, 
          type: "USER_CREATED"
        },
        take:3
    })

    storedPlaylists = storedPlaylists.concat(uploadedPlaylists, youtubePlaylists)

    if (youtubePlaylists.length === 0) {
      const fetchedYoutubePlaylists = await storePlaylistsInDB(user.languageToLearn)
      storedPlaylists = storedPlaylists.concat(fetchedYoutubePlaylists)
      console.log("YT api called")
    }

    let storedVideos: any[] = []

    const youtubeVideos = await prisma.video.findMany({
        where:{
            source: "YOUTUBE",
            language: user.languageToLearn
        },
        take: 3
    })

    const userUploadedVideos = await getUserUploadedVideos(user.languageToLearn, 3)
    
    storedVideos = storedVideos.concat(userUploadedVideos, youtubeVideos)

    if(youtubeVideos.length === 0){
        const fetchedYoutubeVideos = await storeVideosInDb(user.languageToLearn)
        console.log("YT api called")
        storedVideos = storedVideos.concat(fetchedYoutubeVideos)
    }
  
    return { storedPlaylists, storedVideos }
}
  