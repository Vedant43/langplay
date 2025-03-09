import React from 'react'

export const PlaylistItem = () => {
  return (
    <div 
        className='flex gap-3 border border-solid border-zinc-300 rounded-md'
    >
      <div
        className='flex'
      >  
        <img 
            src='https://images.unsplash.com/photo-1740857116465-99177c130dad?q=80&w=2039&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            className='object-cover rounded-md h-24 w-56'
        />
      </div>

      <div
        className='flex flex-col justify-evenly'
      >
        <div
            className='text-base'
        >
            title
        </div>

        <div 
            className='flex gap-2 text-gray-500 text-sm'
        >
            <span 
                className='text-gray-500'
            >
                x views
            </span>
            <span>
                &#8226;
            </span>
            <span>
                x years ago
            </span>
        </div>

        <div
            className='text-sm'
        >
            channel name
        </div>
      </div>

    </div>
  )
}