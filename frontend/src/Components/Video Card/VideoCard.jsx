import React, { useState } from 'react';
import { getTimeAgo } from '../../utils/formattingTime';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlaylistsIfNeeded, removeVideoFromPlaylist, addVideoToPlaylist } from '../redux/features/playlistSlice';
import PlaylistApi from '../../api/PlaylistApi';
import { IconButton } from '@mui/material';
import { Eye, Clock } from 'lucide-react';

export const VideoCard = ({ 
  id, 
  thumbnail, 
  title, 
  channelName, 
  source,
  userProfilePicture, 
  views, 
  duration, 
  createdAt
}) => {
  const [optionModal, setOptionModal] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [playlistToAddVideo, setPlaylistToAddVideo] = useState([]);

  const dispatch = useDispatch();
  // Fixed selector to use "playlists" instead of "playlist"
  const { playlists } = useSelector((state) => state.playlist);
  
  const handleOptionModal = () => {
    setOptionModal(!optionModal);
  };

  const openPlaylistModal = async (e) => {
    e.stopPropagation();
    setPlaylistModal(true);
    try {
      await dispatch(fetchPlaylistsIfNeeded()).unwrap();
      const playlistsId = playlists.map((p) => p.id);
      const response = await PlaylistApi.isVideoInPlaylist(playlistsId, id);
      setPlaylistToAddVideo(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckedState = async (playlistId, videoId) => {
    try {
      if (playlistToAddVideo.includes(playlistId)) {
        setPlaylistToAddVideo((prevSelected) =>
          prevSelected.filter((id) => id !== playlistId)
        );
        await dispatch(removeVideoFromPlaylist({ playlistId, videoId })).unwrap();
      } else {
        setPlaylistToAddVideo((prevSelected) => [...prevSelected, playlistId]);
        await dispatch(addVideoToPlaylist({ playlistId, videoId })).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formattedTimeAgo = getTimeAgo(createdAt)?.replace('about ', '');

  return (
    <div className="flex flex-col relative">
      <div className="absolute top-2 right-2 z-10">
        <IconButton
          onClick={openPlaylistModal}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '4px',
          }}
        >
          <BookmarkBorderIcon style={{ color: 'white', fontSize: '18px' }} />
        </IconButton>

        {playlistModal && (
          <div className="w-full fixed h-full z-30">
            <div
              className="fixed top-0 left-0 w-full h-full bg-black opacity-45"
              onClick={(e) => {
                e.stopPropagation();
                setPlaylistModal(false);
                setOptionModal(false);
              }}
            >
            </div>
            <div
              className="z-40 max-w-80 mx-auto min-h-fit bg-white rounded-lg fixed p-6"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Save video to playlist</span>
                <span
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaylistModal(false);
                    setOptionModal(false);
                  }}
                >
                  ✕
                </span>
              </div>
              <div className="space-y-2">
                {playlists && playlists.length > 0 ? (
                  playlists.filter(playlist => playlist.type === "USER_CREATED").map((playlist, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        checked={playlistToAddVideo?.includes(playlist.id)}
                        onChange={() => {
                          handleCheckedState(playlist.id, id);
                        }}
                      />
                      <span>{playlist.name}</span>
                    </div>
                  ))
                ) : (
                  <div>No playlists found</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="w-full rounded overflow-hidden shadow-sm hover:shadow-md transition relative"
        onClick={() => (window.location.href = `/video/${id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="relative">
          <img src={thumbnail} className="w-full h-48 object-cover" alt={title} />
          <div className="absolute bottom-2 right-1 bg-black text-white text-xs px-1 py-0.5 rounded">
            {duration}
          </div>
        </div>

        <div className="p-2">
          <h3 className="text-base font-semibold truncate text-gray-800">{title}</h3>
          {channelName && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{channelName}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-1 ml-1 pr-1">
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>{formattedTimeAgo}</span>
        </div>
        <div className="flex items-center">
          <Eye size={14} className="mr-1" />
          <span>{views} views</span>
        </div>  
      </div>
    </div>
  );
};