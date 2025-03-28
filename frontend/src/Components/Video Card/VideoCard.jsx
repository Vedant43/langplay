import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getTimeAgo } from '../../utils/formattingTime'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPlaylistsIfNeeded, removeVideoFromPlaylist, addVideoToPlaylist } from '../redux/features/playlistSlice'
import PlaylistApi from '../../api/PlaylistApi'
import { IconButton } from '@mui/material'

export const VideoCard = ({ id, thumbnail, title, channelName, userProfilePicture, views, duration, createdAt}) => {

  const [ optionModal, setOptionModal ] = useState(false)
  const [ playlistModal, setPlaylistModal ] = useState(false)
  const [playlistToAddVideo, setPlaylistToAddVideo] = useState([]) 
  
  const dispatch = useDispatch()
  const { playlists, status, error, removeVideoStatus, playlistsLoaded } = useSelector((state) => state.playlist)

  const handleOptionModal = () => {
    console.log("Option button clicked")
    setOptionModal(!optionModal)
  }

  const selectUserCreatedPlaylists = useMemo(() => {
    return playlists.filter(playlist => playlist.type === "USER_CREATED")
  }, [playlists])

const openPlaylistModal = async (e) => {
    e.stopPropagation() 
    setPlaylistModal(true)
    try {
      await dispatch(fetchPlaylistsIfNeeded()).unwrap()

      const playlistsId = selectUserCreatedPlaylists.map((p) => p.id)
    
      const response = await PlaylistApi.isVideoInPlaylist(
        playlistsId,
        id
      )
      setPlaylistToAddVideo(response)
    }catch (error) {
      console.log(error) 
    }
  }

  const handleCheckedState = async (playlistId, videoId) => {
    try {
      if (playlistToAddVideo.includes(playlistId)) {
        setPlaylistToAddVideo((prevSelected) =>
          prevSelected.filter((id) => id !== playlistId)
        )
        await dispatch(removeVideoFromPlaylist({ playlistId, videoId })).unwrap() 

      } else {
        setPlaylistToAddVideo((prevSelected) => [...prevSelected, playlistId]) 
        await dispatch(addVideoToPlaylist({ playlistId, videoId })).unwrap() 
        console.log("Added")
      }
    } catch (error) {
      console.log(error) 
    }
  }

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
        className='flex justify-between'
      >
        <div className='flex'>
          <div>
            <img 
              src={userProfilePicture}
              className='w-10 h-10 rounded-full object-cover'
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
        <div 
          className='relative flex min-w-10'
        >  
          <IconButton
            onClick={handleOptionModal}
            style={{
              position: "absolute",
              top: -5,
              left: 15,
            }}
          >
            <MoreVertIcon />
          </IconButton>

          {optionModal && (
            <div
              className='absolute right-0 top-8 w-48 border rounded-lg bg-zinc-200'
            >
              <div 
                className='flex gap-2 m-2 cursor-pointer'
              >
                <PlaylistAddIcon />
                <div
                  onClick={(e) => {
                    openPlaylistModal(e)
                  }}
                >
                  Add to playlist
                </div>
                {playlistModal && (
                  <div 
                    className="w-full fixed h-full"
                  >
                    <div
                      className="fixed top-0 z-5 left-20 w-full h-full bg-black opacity-45"
                      onClick={(e) => {
                        e.stopPropagation() 
                        setPlaylistModal(false) 
                      }}
                    >
                    </div>

                    <div
                      className="z-30 max-w-80 mx-auto min-h-fit bg-white rounded-lg fixed"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div 
                        className="flex flex-col w-full mx-auto p-8 rounded-lg shadow-2xl border border-gray-200"
                      >
                        <div 
                          className="flex justify-between"
                        >
                          <div 
                            className=""
                          >
                            Save video to playlist
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation() 
                              setPlaylistModal(false) 
                              setOptionModal(false)
                              console.log("Close button clicked") 
                            }}
                          >
                            X
                          </div>
                        </div>

                        <div 
                          className="pt-2"
                        >
                          {selectUserCreatedPlaylists.length > 0 ? (
                            selectUserCreatedPlaylists.map((playlist, index) => (
                              <div 
                                key={index} 
                                className="flex gap-3"
                              >
                                <input
                                  id={index}
                                  type="checkbox"
                                  checked={playlistToAddVideo?.includes(
                                    playlist.id
                                  )}
                                  onChange={() => {
                                    handleCheckedState(
                                      playlist.id,
                                      id
                                    ) 
                                  }}
                                />
                                <span 
                                  className="lg:w-4/5"
                                >
                                  {playlist.name}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div>
                              Empty playlist
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  )
}