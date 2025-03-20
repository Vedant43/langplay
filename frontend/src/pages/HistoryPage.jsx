import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPlaylist, setSelectedPlaylist } from '../Components/redux/features/playlistSlice'
import { Playlist } from '../Components/Playlist/Playlist'

export const HistoryPage = () => {

  const dispatch = useDispatch()
  const { playlists, playlistsLoaded, selectedPlaylist } = useSelector(state => state.playlist)

  useEffect(() => {

    if (!playlistsLoaded) return 
    console.log("Playlists ---------", playlists)
    const doHistoryPlaylistExists = playlists.find(p => p.type === 'HISTORY')
    console.log("Do history playlist exists", doHistoryPlaylistExists)
    if (doHistoryPlaylistExists) {
      console.log(doHistoryPlaylistExists)
      dispatch(setSelectedPlaylist(doHistoryPlaylistExists))
    } else {
      dispatch(createPlaylist({playlistName:"History", type:'HISTORY'}))
    }

    console.log("History playlist ------------")
    console.log(selectedPlaylist)
  }, [dispatch, playlists, selectedPlaylist])

  useEffect( () => {
    console.log("History-------", selectedPlaylist)
  }, [selectedPlaylist])

  return (
    <div>
       {selectedPlaylist && <Playlist playlistId={selectedPlaylist?.id}/>}
    </div>
  )
}