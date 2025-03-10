import React, { useEffect, useState } from 'react'
import { Container } from '../Components/container/Container'
import { PlaylistCard } from '../Components/Playlist/PlaylistCard'
import { PlaylistItem } from '../Components/Playlist/PlaylistItem'
import { useParams } from 'react-router-dom'
import { fetchPlaylistById,  } from '../Components/redux/features/playlistSlice'
import { setSelectedPlaylist } from '../Components/redux/features/playlistSlice'
import { useDispatch, useSelector } from 'react-redux'

export const Playlist = () => {

  const { playlists, selectedPlaylist, status } = useSelector((state) => state.playlist)
  const { channelName } = useSelector( (state) => state.auth)
  const { playlistId } = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    const existingPlaylist = playlists.find(p => p.id === Number(playlistId))

    if (existingPlaylist) {
        dispatch(setSelectedPlaylist(existingPlaylist))
    } else {
        dispatch(fetchPlaylistById(playlistId))
    }
  },[playlistId, playlists, dispatch])

  return (
    <Container 
      className='w-full grid h-[calc(100vh-4rem)] pt-6 grid-cols-10'
    >
      <div  
        className='h-1/2 m-2 bg-black rounded-xl col-span-5'
      >
        <PlaylistCard 
          name={selectedPlaylist?.playlist?.name}
          count={selectedPlaylist?.count}
          time={selectedPlaylist?.playlist?.createdAt}
        /> 
      </div>
      <div
        className='m-3 my-4 col-span-5'
      >
        {selectedPlaylist?.playlist?.videos?.length > 0 && 
          selectedPlaylist.playlist.videos.map((playlistItem, index) => (
            <div key={index}>
              <PlaylistItem 
                id={playlistItem.Video.id} 
                title={playlistItem.Video.title} 
                views={playlistItem.Video.views} 
                channelName={channelName} 
                createdAt={playlistItem.Video.createdAt} 
                thumbnailUrl={playlistItem.Video.thumbnailUrl} 
                videoUrl={playlistItem.Video.videoUrl} 
              />
            </div>
          ))
        }
      </div>
    </Container>
  )
}