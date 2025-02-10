import React from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const Video = () => {
  return (
    <div className="mt-14 flex justify-center bg-black text-white py-8">
      <div className="w-full max-w-3xl flex flex-col">
        <div className="w-full">
          <video className="w-full rounded-lg" width="400" controls autoPlay>
            <source src="https://example.com/video.mp4" type='video/mp4' />
          </video>
        </div>

        <div className="mt-4">
          <div className="text-xl font-bold">Javascript for beginners</div>
          <div className="flex justify-between mt-2">
            <div className="flex gap-4 items-center">
              <img className="w-9 h-9 rounded-full cursor-pointer" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3I8MHCoQwIr7JRNGJofutnnyXyD12S0aRBw&s" alt="" />
              <div className="flex flex-col">
                <div className="font-medium text-lg">User 1</div>
                <div className="text-sm text-gray-400">2024-01-20</div>
              </div>
              <div className="bg-white text-black px-4 py-2 rounded-full font-semibold cursor-pointer text-sm">Subscribe</div>
            </div>
            <div className="flex gap-4 bg-gray-600 p-2 rounded-full cursor-pointer items-center">
              <div className="flex gap-2 items-center">
                <ThumbUpIcon />
                <div>{}</div>
              </div>
              <div className="border-l border-white h-5"></div>
              <div className="flex gap-2 items-center">
                <ThumbDownIcon />
                <div>{}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-700 rounded-lg text-sm font-medium">
            <div>2025-01-25</div>
            <div>That's my first video of NeoTube</div>
          </div>

          <div className="mt-6">
            <div className="text-lg font-medium">2 comments</div>
            <div className="flex mt-3 gap-3">
              <img className="w-9 h-9 rounded-full" src="https://media.istockphoto.com/id/1087531642/vector/male-face-silhouette-or-icon-man-avatar-profile-unknown-or-anonymous-person-vector.jpg?s=612x612&w=0&k=20&c=FEppaMMfyIYV2HJ6Ty8tLmPL1GX6Tz9u9Y8SCRrkD-o=" alt="" />
              <div className="w-full">
                <input type="text" className="w-full p-2 border rounded-md text-black" placeholder='Add a comment' />
                <div className="flex justify-end gap-3 mt-2 text-sm font-medium">
                  <div className="cursor-pointer">Cancel</div>
                  <div className="cursor-pointer">Comment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs px-4">
        <div className="text-white">Video Suggestions</div>
      </div>
    </div>
  );
};

export default Video;