import React from 'react'
import { useParams } from 'react-router-dom'
import { Playlist } from '../Components/Playlist/Playlist'

export const PlaylistPage = () => {
    const { playlistId } = useParams()
    
    return (
        <div>
            <Playlist playlistId={playlistId}/>
        </div>
    )
}