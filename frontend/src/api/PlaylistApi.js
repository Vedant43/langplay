import { apiClient } from "./client"

const createPlaylist = async ( name ) => {
    const response = await apiClient.post( "/playlist/create-playlist",  {name}  )
    return response.data.data
}

const fetchPlaylistsByUser = async () => {
    const response = await apiClient.get("/playlist/playlist")
    console.log(response)
    return response.data.data
}

const isVideoInPlaylist = async ( playlistId, videoId ) => {
    const response = await apiClient.post("/playlist/is-video-in-playlist", {playlistId, videoId})
    return response.data.data
}

const addVideoToPlaylist = async ( playlistId, videoId ) => {
    const response = await apiClient.post("/playlist/save-video-to-playlist", {playlistId, videoId})
    return response.data.data
}

const fetchPlaylistById = async ( playlistId ) => {
    const response = await apiClient.get(`/playlist/playlist/${playlistId}`)
    return response.data.data
}

export default { 
    createPlaylist, 
    fetchPlaylistsByUser, 
    addVideoToPlaylist, 
    isVideoInPlaylist, 
    fetchPlaylistById 
}