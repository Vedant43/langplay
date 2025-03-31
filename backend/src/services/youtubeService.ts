import axios from "axios"
import { prisma } from "../prisma"
import {Language} from "@prisma/client"
import ApiError from "../utils/ApiError"
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search"

const getLanguageEnum = (lang: string): Language | null => {
    const languageMap: { [key: string]: Language } = {
        english: Language.ENGLISH,
        hindi: Language.HINDI,
        japanese: Language.JAPANESE,
        french: Language.FRENCH,
        spanish: Language.SPANISH,
        chinese: Language.CHINESE,
        german: Language.GERMAN,
    }

    return languageMap[lang.toLowerCase()] || null
}

export async function getVideosFromYouTube(language: string, limit = 5) {

    const langEnum = getLanguageEnum(language)
    if (!langEnum) throw new ApiError(400, "Invalid language")

    const cachedVideos = await prisma.video.findMany({
        where: { 
            source: "youtube", 
            language: langEnum 
        },
        orderBy: { 
            createdAt: "desc" 
        },
        take: limit,
    });

    if (cachedVideos.length > 0) {
        console.log("Returned cached videos")
        return cachedVideos
    }

    const { data } = await axios.get(YOUTUBE_API_URL, {
        params: {
            key: process.env.YOUTUBE_API_KEY,
            q: `learn ${language}`,
            part: "snippet",
            maxResults: limit,
            type: "video",
        },
    })

    console.log("data " , data)

    const youtubeVideos = data.items.map((v: any) => ({
        title: v.snippet.title,
        videoUrl: `https://www.youtube.com/watch?v=${v.id.videoId}`,
        thumbnailUrl: v.snippet.thumbnails.medium.url,
        views: 0,
        isPublished: true,
        source: "youtube",
        language: langEnum,
        createdAt: new Date(v.snippet.publishedAt),
    }))

    await prisma.video.createMany({
        data: youtubeVideos,
        skipDuplicates: true,
    })

    return youtubeVideos
}