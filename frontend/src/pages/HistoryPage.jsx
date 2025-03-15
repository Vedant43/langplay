import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPlaylist, setSelectedPlaylist } from '../Components/redux/features/playlistSlice'
// import

export const HistoryPage = () => {

  const dispatch = useDispatch()
  const { playlists, playlistsLoaded  } = useSelector(state => state.playlist)

  useEffect(() => {

    if (!playlistsLoaded) return 

    const doHistoryPlaylistExists = playlists.find(p => p.type === 'HISTORY')
    if (doHistoryPlaylistExists) {
      dispatch(setSelectedPlaylist(doHistoryPlaylistExists))
    } else {
      dispatch(createPlaylist({playlistName:"History", type:'HISTORY'}))
    }

  }, [dispatch, playlists])
  

  return (
    <div>
      playlistId, 
    {/* //   <Playlist /> */}
    </div>
  )
}