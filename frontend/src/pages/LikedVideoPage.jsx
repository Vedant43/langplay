import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPlaylistById } from '../Components/redux/features/playlistSlice'

export const LikedVideosPage = () => {

    const dispatch = useDispatch()
    const { playlists, playlistsLoaded  } = useSelector(state => state.playlist)
  
    useEffect(() => { 
      if (!playlistsLoaded) return
      
      const doLikedVideosPlaylistExists = playlists.find(p => p.type === 'LIKED_VIDEO')
      
      if (doLikedVideosPlaylistExists) {
        dispatch(fetchPlaylistById)
        dispatch(setSelectedPlaylist(doLikedVideosPlaylistExists))
      } else {
        dispatch(createPlaylist({ playlistName:"Liked Videos", type:'LIKED_VIDEO' }))
      }
  
    }, [dispatch, playlists, playlistsLoaded])
    
    return (
        <div>
        
        </div>
    )
}