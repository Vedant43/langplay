import React from 'react'

export const PlaylistCard = ( {name, count, time} ) => {
  return (
    <div
      className="relative cursor-pointer h-full w-full rounded-2xl overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1740857116465-99177c130dad?q=80&w=2039&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Bottom Blur */}
      <div
        className="absolute inset-x-0 bottom-0 p-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
          backdropFilter: 'blur(8px)', // Blur effect
        }}
      >
        <div className="text-white flex justify-between">
          <div>  
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-sm">{time}</p>
          </div>
          <div>
            <p className="text-sm">{count} {count > 1 ? "videos" : "video"} </p>
          </div>
        </div>
      </div>
    </div>
  )
}