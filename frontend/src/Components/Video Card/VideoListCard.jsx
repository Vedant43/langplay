import React from 'react'
import { Eye, Clock } from 'lucide-react';

export const VideoListCard = ({ thumbnailUrl, title, views, createdAt, duration, channelName }) => {
  return (
    <div className="flex mt-4 hover:bg-gray-100 rounded-lg border-solid border-zinc-100 cursor-pointer transition-colors">
      <div className="w-40 h-24 mr-3 flex-shrink-0">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-sm font-semibold line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-xs text-gray-600 mb-1">
            {channelName}
          </p>
        </div>
        <div className="flex items-center text-xs text-gray-500 space-x-2">
          <div className="flex items-center">
            <Eye size={14} className="mr-1" />
            <span>{views} views</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}