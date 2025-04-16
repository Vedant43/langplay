import React from 'react'
import { getTimeAgo } from '../../utils/formattingTime'

export const PlaylistCard = ( {name, thumbnail, count, time, id} ) => {
  // key={key} id={playlist.id} name={playlist.name}  time={playlist.createdAt}
  console.log(" ", id, " ", name, " ", time, " ", thumbnail, " ", count, " ")
  return (
    <div
      className="relative cursor-pointer h-56 w-full rounded-2xl bg-slate-400 overflow-hidden"
      style={{
        backgroundImage: thumbnail ? `url(${thumbnail})` : 'linear-gradient(to right, #4b6cb7, #182848)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Bottom Blur */}
      <div
        className="absolute inset-x-0 bottom-0 p-4 h-20"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
          backdropFilter: 'blur(8px)', // Blur effect
        }}
      > 
        <div className="text-white flex justify-between h-full">
          <div className="flex flex-col justify-between overflow-hidden pr-2 flex-1">
            <h2 className="text-base font-semibold truncate">{name || 'Untitled Playlist'}</h2>
            <p className="text-xs opacity-80">{getTimeAgo(time)}</p>
          </div>
          <div className="flex items-end self-end whitespace-nowrap">
            <p className="text-xs">{count} {count === 1 ? "video" : "videos"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}