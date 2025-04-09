import axios from "axios"
import { prisma } from "../prisma"
import ApiError from "../utils/ApiError"
import { getLanguageEnum } from "../utils/language"

const BASE_URL = "https://www.googleapis.com/youtube/v3/search"

export const fetchYouTubeVideos = async (language: string, limit: number) => {
    try {
        const languageForQuery = getLanguageEnum(language)
        if(!languageForQuery) return

        const response = await axios.get(BASE_URL, {
            params: {
                part: "snippet",
                q: `Learn ${language} language as beginner`,
                type: "video",
                maxResults: limit,
                key: process.env.YOUTUBE_API_KEY,
            },
        })
        console.log("Api called for videos")
        return response.data.items.map((video: any) => ({
            sourceId: video.id.videoId,
            title: video.snippet.title,
            videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            thumbnailUrl: video.snippet.thumbnails.medium.url,
            description: video.snippet.description,
            language
        }))

    } catch (error) {
        console.log("Error fetching youtube videos ", error)
        return []
    }
}

// model Video {
//   id              Int               @id @default(autoincrement())
//   sourceId        String?
//   title           String            @unique
//   description     String?
//   videoUrl        String
//   thumbnailUrl    String
//   views           Int               @default(0)
//   isPublished     Boolean           @default(false) 
//   createdAt       DateTime          @default(now())
//   updatedAt       DateTime          @updatedAt
//   userId          Int?
//   videoPublicId   String?
//   language        Language          @default(ENGLISH)
//   source          VideoType         @default(USER_UPLOADED)
//   comments        Comment[]
//   Playlist_videos Playlist_videos[]
//   user            User?              @relation(fields: [userId], references: [id], onDelete: Cascade)
//   videoEngagement VideoEngagement[]
// }

export const fetchYouTubePlaylists = async ( language: string, maxResults = 3) => {
    try {
        const response = await axios.get(BASE_URL,{
            params:{
                key: process.env.YOUTUBE_API_KEY,
                q: `Beginner ${language} learning`, 
                part: "snippet",
                type: "playlist",
                maxResults,
            }
        })

        console.log("Api called for playlists")

        return response.data.items.map((item: any) => ({
            youtubePlaylistId: item.id.playlistId,
            name: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails.medium.url,
            language,
        }))
    } catch (error:any) {
        console.log("Error fetching playlists ", error.response)
        throw new ApiError(404,"Error fetching playlists", error)
    }
}

export const fetchYouTubePlaylistVideos = async (playlistId: string) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        playlistId,
        part: "snippet",
        maxResults: 10, 
      },
    });

    return response.data.items.map((item: any) => ({
      youtubeVideoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || "",
      publishedAt: item.snippet.publishedAt,
    }))
  } catch (error: any) {
    console.log(error)
    console.error("Error fetching playlist videos:", error.response?.data || error.message)
    return [];
  }
}

export const storePlaylistsInDB = async (language: string) => {
  const playlists = await fetchYouTubePlaylists(language)
  const result = []

  for (const playlist of playlists) {
    let playlistRecord = await prisma.playlist.findUnique({
      where: {
        youtubePlaylistId: playlist.youtubePlaylistId,
      },
    });

    if (!playlistRecord) {
      try {
        playlistRecord = await prisma.playlist.create({
          data: {
            youtubePlaylistId: playlist.youtubePlaylistId,
            name: playlist.name,
            language: playlist.language,
            thumbnailUrl: playlist.thumbnailUrl,
            type: "YOUTUBE",
          },
        });
      } catch (err) {
        console.error(`Failed to create playlist: ${playlist.youtubePlaylistId}`)
        continue;
      }
    }

    const playlistVideos = await fetchYouTubePlaylistVideos(playlist.youtubePlaylistId)

    await prisma.playlist.update({
      where: { 
        id: playlistRecord.id 
      },
      data: { 
        count: playlistVideos.length 
      },
    })

    for (const video of playlistVideos) {
      await prisma.playlist_videos.upsert({
        where: {
          playlistId_youtubeVideoId: {
            playlistId: playlistRecord.id,
            youtubeVideoId: video.youtubeVideoId,
          },
        },
        update: {},
        create: {
          playlistId: playlistRecord.id,
          youtubeVideoId: video.youtubeVideoId,
        },
      })
    }
    result.push({
      playlist: playlistRecord,
      videos: playlistVideos,
    })
  }

  return result
}

export const storeVideosInDb = async (language: string) => {

  const videos = await fetchYouTubeVideos(language, 3)
  for(const video of videos){
    const existingVideo = await prisma.video.findUnique({
      where:{
        sourceId: video.sourceId
      }
    })
    
    if(!existingVideo){
      try {
        await prisma.video.create({
          data:{
            sourceId: video.sourceId,
            title: video.title,
            description: video.description,
            videoUrl: `https://www.youtube.com/watch?v=${video.sourceId}`,
            thumbnailUrl: video.thumbnailUrl,
            language: video.language,
            source:"YOUTUBE",
              // optional: placeholders for data you'll fill later
            transcriptLang: "", // transcript in language to learn
            transcriptNative: "", // transcript in native language if needed
            quiz: undefined // or quiz: [] if it's a JSON array
          }
        })
      } catch (error) {
        console.log("Error in storing in db ", error)
      }
    }
  }

  return videos
}

// Flow For Beginner:
// Fetch Curated playlists from user uploaded and API
// Fetch videos, have 3 different sections