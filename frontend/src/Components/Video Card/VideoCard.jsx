import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns';

export const VideoCard = ({ id, thumbnail, title, channelName, userProfilePicture, views, duration, createdAt}) => {
  return (
    <div className=''>
      <Link
        to={`/video/${id}`}
      >
        <div 
          className='w-full rounded'
        >
          <img 
            src={thumbnail} 
            className='w-full h-48 object-cover' 
          />
          <p>
            {duration}
          </p>
        </div>
      </Link>
      <div 
        className='flex'
      >
        <div>
          <img 
            src={userProfilePicture}
            className='w-10 h-10 rounded-full'
          />
        </div>
        <div>
        <h3 
          className='text-base'
        >
          {title}
        </h3>
        <div
         className='flex flex-col text-gray-1'
        >
          <p className=''>
            {channelName}
          </p>
          <div className='flex gap-2'>
            <p>
              {views} views
            </p>
            <span>&#x2022;</span>
            <p>{getTimeAgo(createdAt)}</p>
          </div>
        </div>
        </div>
      </div>
      
    </div>
  )
}

const getTimeAgo = (createdAt) => {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
}