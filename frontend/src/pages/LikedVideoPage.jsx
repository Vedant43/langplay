import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const LikedVideoPage = () => {

    const dispatch = useDispatch()
    const { playlists, playlistsLoaded  } = useSelector(state => state.playlist)
  
    useEffect(() => { 
      if (!playlistsLoaded) return
      const doWatchLaterPlaylistExists = playlists.find(p => p.type === 'LIKED_VIDEO')
      if (doHistoryPlaylistExists) {
        dispatch(setSelectedPlaylist(doWatchLaterPlaylistExists))
      } else {
        dispatch(createPlaylist({ playlistName:"Liked Videos", type:'LIKED_VIDEO' }))
      }
  
    }, [dispatch, playlists])
    
    return (
        <div>
        
        </div>
    )
}