import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const WatchLater = () => {

    const dispatch = useDispatch()
    const { playlists, playlistsLoaded  } = useSelector(state => state.playlist)
  
    useEffect(() => {
  
      if (!playlistsLoaded) return 
  
      const doWatchLaterPlaylistExists = playlists.find(p => p.type === 'WATCH_LATER')
      if (doWatchLaterPlaylistExists) {
        dispatch(setSelectedPlaylist(doWatchLaterPlaylistExists))
      } else {
        dispatch(createPlaylist({playlistName:"Watch Later", type:'WATCH_LATER'}))
      }
  
    }, [dispatch, playlists])
    
    return (
        <div>
        
        </div>
    )
}