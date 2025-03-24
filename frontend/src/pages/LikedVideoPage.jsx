import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Playlist } from '../Components/Playlist/Playlist'
import { fetchPlaylistById } from '../Components/redux/features/playlistSlice'

export const LikedVideosPage = () => {

    const dispatch = useDispatch()
    const { playlists, playlistsLoaded, selectedPlaylist  } = useSelector(state => state.playlist)
  
    useEffect(() => { 
      if (!playlistsLoaded) return
      
      const doLikedVideosPlaylistExists = playlists.find(p => p.type === 'LIKED_VIDEO')
      
      if (doLikedVideosPlaylistExists) {
        console.log("111111111111111111")
        dispatch(fetchPlaylistById(doLikedVideosPlaylistExists.id))
        // dispatch(setSelectedPlaylist(doLikedVideosPlaylistExists))
      } else {
        dispatch(createPlaylist({ playlistName:"Liked Videos", type:'LIKED_VIDEO' }))
      }
  
    }, [dispatch, playlists, playlistsLoaded])
    
    return (
        <div>
         {selectedPlaylist && <Playlist playlistId={selectedPlaylist?.playlist.id}/>}
        </div>
    )
}