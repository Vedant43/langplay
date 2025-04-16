import { prisma } from "../prisma"
import { getLanguageEnum } from "../utils/language";
import ApiError from "../utils/ApiError";

export const getUserUploadedVideos = async (language: string, limit: number) => {
    const languageEnum = getLanguageEnum(language)
    if (!languageEnum) throw new ApiError(400, "Invalid language")

    return await prisma.video.findMany({
        where: { 
            language: languageEnum, 
            source: "USER_UPLOADED" 
        },
        take: limit,
        select: {
            id: true,
            title: true,
            videoUrl: true,
            thumbnailUrl: true,
            views: true,
            createdAt: true,
            source: true,
            user: {
                select: { 
                    id: true, 
                    username: true, 
                    profilePicture: true 
                }
            }
        }
    })    

}