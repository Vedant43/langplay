import React from 'react'
import { Link } from 'react-router-dom'

export const VideoCard = ({thumbnail, title, channelName, views, duration}) => {
  return (
    <div className=''>
      <div 
        className='w-full rounded'
      >
        <Link>
          <img 
            src={thumbnail} 
            className='w-full h-48 object-cover' 
          />
        </Link>
        <p>
          {duration}
        </p>
      </div>

      <div>
        <h3 className=''>
          {title}
        </h3>
        <p className=''>
          {channelName}
        </p>
        <p>
          {views}
        </p>
      </div>
      
    </div>
  )
}