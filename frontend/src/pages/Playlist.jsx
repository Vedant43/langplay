import React from 'react'
import { Container } from '../Components/container/Container'
import { PlaylistCard } from '../Components/Playlist/PlaylistCard'
import { PlaylistItem } from '../Components/Playlist/PlaylistItem'
export const Playlist = () => {
  return (
    <Container className='w-full grid h-[calc(100vh-4rem)] pt-6 grid-cols-10'>
      <div 
        className='h-1/2 m-2 bg-black rounded-xl col-span-5'
      >
        <PlaylistCard />
      </div>
      <div
        className='m-3 my-4 col-span-5'
      >
        <PlaylistItem />
      </div>
    </Container>
  )
}