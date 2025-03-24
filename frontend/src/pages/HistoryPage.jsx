import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPlaylist, setSelectedPlaylist, fetchPlaylistById } from '../Components/redux/features/playlistSlice'
import { Playlist } from '../Components/Playlist/Playlist'
import { use } from 'react'

export const HistoryPage = () => {

  const dispatch = useDispatch()
  const { playlists, playlistsLoaded, selectedPlaylist } = useSelector(state => state.playlist)

  useEffect(() => {

    if (!playlistsLoaded) return 

    const historyPlaylist = playlists.find(p => p.type === 'HISTORY')
    
    console.log("Do history playlist exists", historyPlaylist)

    if (historyPlaylist) {

      console.log(historyPlaylist.id)
      console.log("Before fetch playlist by id", historyPlaylist.id)

      dispatch(fetchPlaylistById(historyPlaylist.id))
      // selected playlists is set in here
      
    } else {
      dispatch(createPlaylist({playlistName:"History", type:'HISTORY'}))
      // Add fetchplaylist by id here
    }

    // console.log("History playlist ------------")
    // console.log(selectedPlaylist)
  }, [dispatch, playlists, playlistsLoaded])

  return (
    <div>
       {selectedPlaylist?.playlist?.id && <Playlist playlistId={selectedPlaylist?.playlist.id}/>}
    </div>
  )
}