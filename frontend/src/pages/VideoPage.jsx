import React, { useEffect, useState, useMemo, useRef } from "react" 
import VideoApi from "../api/VideoApi" 
import toast from "react-hot-toast" 
import { useParams } from "react-router-dom" 
import { PulseLoader } from "react-spinners" 
import ThumbUpIcon from "@mui/icons-material/ThumbUp" 
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt" 
import ThumbDownIcon from "@mui/icons-material/ThumbDown" 
import GroupAddIcon from "@mui/icons-material/GroupAdd" 
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt" 
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd" 
import { Container } from "../Components/container/Container" 
import { VideoCard } from "../Components/Video Card/VideoCard" 
import { addVideoToPlaylist, createPlaylist, removeVideoFromPlaylist, fetchPlaylistsIfNeeded, 
} from "../Components/redux/features/playlistSlice" 
import { useDispatch, useSelector } from "react-redux" 
import { VideoListCard } from "../Components/Video Card/VideoListCard" 
import PlaylistApi from "../api/PlaylistApi" 
import UserApi from "../api/UserApi" 
import avatar from "../assets/default-avatar.jpg" 

export const VideoPage = () => {
  const videoRef = useRef(null) 
  const viewUpdatedRef = useRef(false) 
  const [content, setContent] = useState("") 
  const [countComment, setCountComment] = useState(0) 
  const [playlistModal, setPlaylistModal] = useState(false) 
  const [playlistName, setPlaylistName] = useState("")  
  const [isLoading, setIsLoading] = useState(false) 
  const [isLiked, setIsLiked] = useState(false) 
  const [isDisliked, setIsDisliked] = useState(false) 
  const [countLikes, setCountLikes] = useState(0) 
  const [countDislikes, setCountDislikes] = useState(0) 
  const [playlistToAddVideo, setPlaylistToAddVideo] = useState([]) 
  const [videoData, setVideoData] = useState({
    id: null,
    title: "",
    description: "",
    videoUrl: "",
    views: "",
    videoEngagement: [
      {
        videoId: "",
        userId: "",
        engagementType: "",
      },
    ],
    createdAt: "",
    updatedAt: "",
    user: {
      id: "",
      profilePicture: "",
      username: "",
      channelName: "",
    },
    comments: [
      {
        id: "",
        content: "",
        createdAt: "",
        user: {
          id: "",
          username: "",
          profilePicture: "",
        },
      },
    ],
    thumbnailUrl: "",
    isPublished: "",
    videoPublicId: "",
  }) 
  const [ isOwnChannel, setIsOwnChannel ] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false) 
  const [subscriberCount, setSubscriberCount] = useState(0) 
  
  const { videoId } = useParams()
  const dispatch = useDispatch()

  const { username, profilePicture, id, authStatus } = useSelector((state) => state.auth)
  const { playlists, status, error, removeVideoStatus, playlistsLoaded } = useSelector((state) => state.playlist)

  useEffect(() => {
    VideoApi.fetchVideo(videoId).then((data) => {
      
      setVideoData(data)

      const likes = data.videoEngagement?.filter((e) => e.engagementType === "LIKE").length || 0
      const dislikes = data.videoEngagement?.filter((e) => e.engagementType === "DISLIKE").length || 0
      const comments = data.comments?.length || 0

      setCountLikes(likes) 
      setCountDislikes(dislikes) 
      setCountComment(comments) 

      if (id) {
        const hasUserSubscribed = data.user?.subscribers?.find((s) => s.subscriberId) 
        if (hasUserSubscribed) setIsSubscribed(true) 

        const likeStatus = data.videoEngagement?.find((e) => 
          Number(e.userId) == Number(id) && e.engagementType === "LIKE"
        ) 

        const disLikeStatus = data.videoEngagement?.find( (e) =>
            Number(e.userId) == Number(id) && e.engagementType === "DISLIKE"
        ) 

        likeStatus ? setIsLiked(true) : setIsLiked(false) 
        disLikeStatus ? setIsDisliked(true) : setIsDisliked(false) 
      } else{
        setIsLiked(false)
        setIsDisliked(false)
        setIsSubscribed(false)
      }

      const playlistNames = playlists.map( p => p.type === 'USER_CREATED')

      setIsOwnChannel(id === data.user?.id) 
      setSubscriberCount(data.user?.subscribers.length)
    }) 
  }, [videoId, id, authStatus]) 

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (video.currentTime >= 10 && !viewUpdatedRef.current) {
         
        VideoApi.increaseViewCount(videoId)
          .then(() => {
            viewUpdatedRef.current = true
          })
          .catch(error => console.log(error))

        if (!playlistsLoaded) return

        const historyVideosPlaylist = playlists.find(p => p.type === 'HISTORY')
        // console.log(historyVideosPlaylist)
          // console.log(historyVideosPlaylist.videos[0].Video.id)
          // console.log(videoId)
          // console.log(historyVideosPlaylist.videos[0].Video.id)
        
        const historyPlaylistId = historyVideosPlaylist ? historyVideosPlaylist.id : null

        if(!historyPlaylistId) {
          console.log("Not once but twicw")
          dispatch(createPlaylist( {playlistName:"History", type:'HISTORY'} ))
        } else{
          const ifVideoExistInPlaylist = historyVideosPlaylist.videos.find(v => v.Video.id === videoId)
          
          if(!ifVideoExistInPlaylist) {
            dispatch(addVideoToPlaylist( {playlistId: historyPlaylistId, videoId} ))
          }
        }
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate) 

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate) 
    }
  }, [videoId, playlists, playlistsLoaded])

  const handleCommentPost = () => {
    if (content === "") {
      setIsLoading(false) 
      toast.error("Comment cant be empty") 
      return 
    }

    setIsLoading(true) 

    VideoApi.postComment(videoId, { content })
      .then((response) => {
        console.log(response) 

        setVideoData((prevData) => ({
          ...prevData,
          comments: [
            ...prevData.comments,
            {
              ...response,
              user: {
                id,
                profilePicture,
                username,
              },
            },
          ],
        })) 
        setContent("") 
        setIsLoading(false) 
        setCountComment((prev) => prev + 1) 
      })
      .catch((error) => console.log(error)) 
  } 

  const handleLikeDislike = (e) => {
    const id = e.currentTarget.id

    const apiCall =
      id === "like"
        ? VideoApi.likeVideo(videoId)
        : VideoApi.dislikeVideo(videoId)

    apiCall.then((response) => {
      console.log(response) 
      if (id === "like") {

        const likedVideosPlaylist = playlists.find((p) => p.type === "LIKED_VIDEO")
        const likedVideosPlaylistId = likedVideosPlaylist ? likedVideosPlaylist.id : null
  
        if (!likedVideosPlaylistId) {
          dispatch(createPlaylist({ playlistName: "Liked Videos", type: "LIKED_VIDEO" }))
        }

        if (isDisliked) {
          setIsDisliked(response.disliked)
          setCountDislikes( (prev) => prev - 1 )
        }

        setIsLiked(response.liked)
        setCountLikes(response.likeCount)
        dispatch(addVideoToPlaylist( {playlistId:likedVideosPlaylistId, videoId} ))

      } else {

        if (isLiked) {
          setIsLiked(response.isLiked)
          setCountLikes((prev) => prev - 1)
          dispatch(removeVideoFromPlaylist( {likedVideosPlaylistId, videoId} ))
        }

        setIsDisliked(response.disliked)
        setCountDislikes(response.dislikeCount)

      }

      // console.log(videoData.videoEngagement)
    })
  }

  const selectUserCreatedPlaylists = useMemo(() => {
    return playlists.filter(playlist => playlist.type === "USER_CREATED")
  }, [playlists])

  const openPlaylistModal = async (e) => {
    e.stopPropagation() 
    setPlaylistModal(true) 
    try {
      await dispatch(fetchPlaylistsIfNeeded()).unwrap() 

      // const playlistsId = playlists.map((p) => p.id) 

      // const response = await PlaylistApi.isVideoInPlaylist(
      //   playlistsId,
      //   videoId
      // ) 

      // setPlaylistToAddVideo(response) 

      const playlistsId = selectUserCreatedPlaylists.map((p) => p.id)
    
    const response = await PlaylistApi.isVideoInPlaylist(
      playlistsId,
      videoId
    )
    setPlaylistToAddVideo(response)
    } catch (error) {
      console.log(error) 
    }
  }

  const createNewPlaylist = () => {
    dispatch(createPlaylist({ playlistName })) 
    setPlaylistName("") 
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
      }
    } catch (error) {
      console.log(error) 
    }
  }

  const handleSubscribe = (channelId) => {
    if (channelId===id) return
    UserApi.subscribe(channelId)
      .then((response) => {
        setSubscriberCount((prev) => {
          if (isSubscribed) {
            setIsSubscribed(false)
            return prev - 1
          } else {
            setIsSubscribed(true)
            return prev + 1
          }
        }) 
      })
      .catch((error) => {
        console.log(error) 
      }) 
  } 

  const videoDataList = [
    {
      title: "Exploring Mountain Landscapes",
      channelName: "Nature Explorers",
      thumbnailUrl: "/api/placeholder/320/180?text=Video+1",
      views: 45678,
      duration: "3:59",
      createdAt: "2025-02-14T12:44:12.299Z",
    },
    {
      title: "Future of Technology: AI Insights",
      channelName: "Tech Horizons",
      thumbnailUrl: "/api/placeholder/320/180?text=Video+2",
      views: 123456,
      duration: "5:22",
      createdAt: "2025-01-20T10:30:45.123Z",
    },
    {
      title: "Culinary Secrets: Gourmet Cooking",
      channelName: "Gourmet Kitchen",
      thumbnailUrl: "/api/placeholder/320/180?text=Video+3",
      views: 789012,
      duration: "2:45",
      createdAt: "2025-03-01T15:15:30.456Z",
    },
    {
      title: "Travel Diaries: Hidden Gems",
      channelName: "World Wanderers",
      thumbnailUrl: "/api/placeholder/320/180?text=Video+4",
      views: 234567,
      duration: "4:12",
      createdAt: "2025-02-28T08:55:22.789Z",
    },
    {
      title: "Fitness Challenge: Transform Your Body",
      channelName: "Fitness Revolution",
      thumbnailUrl: "/api/placeholder/320/180?text=Video+5",
      views: 567890,
      duration: "6:01",
      createdAt: "2025-02-10T18:20:11.234Z",
    },
  ] 

  return (
    <Container className="pt-4 relative w-full px-4 bg-slat h-screen lg:grid grid-cols-5 gap-5">
      {/* left section */}
      <div className="py-2 h-full lg:col-span-3">
        {/* video */}
        <div className="py-2 h-2/12 w-full flex">
          <video
            src={videoData.videoUrl || null}
            ref={videoRef}
            className="bg-black w-full h-full border-1 border-gray-200 rounded-lg"
            controls
            // onTimeUpdate={handleTimeUpdate}
            autoPlay
            muted
          />
        </div>

        {/* video details */}
        <div className="py-2 w-full flex-col border-solid border border-zinc-200 rounded-lg p-2 mt-2">
          <div className="lg:flex lg:justify-between">
            <span className="font-semibold lg:w-3/5 w-full">
              {videoData.title}
            </span>

            {/* like and save section */}
            <div className="flex lg:gap-4 justify-between pt-3 lg:pt-0 h-8">
              <div className="flex gap-2 lg:border-solid border lg:border-zinc-200 rounded p-1">
                <div className="flex justify-center gap-1">
                  <div
                    className="cursor-pointer"
                    id={"like"}
                    onClick={handleLikeDislike}
                  >
                    {isLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                  </div>
                  <span className="text-gray-2">{countLikes}</span>
                </div>
                <div className="flex justify-center gap-1">
                  <div
                    className="cursor-pointer"
                    id={"dislike"}
                    onClick={handleLikeDislike}
                  >
                    {isDisliked ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
                  </div>
                  <span className="text-gray-2">{countDislikes}</span>
                </div>
              </div>

              <div className="flex justify-center items-center text-sm gap-1 lg:border-solid lg:border lg:border-zinc-200 rounded cursor-pointer p-2">
                <div
                  onClick={(e) => openPlaylistModal(e)} // Move onClick here
                  className="flex items-center gap-1"
                >
                  <PlaylistAddIcon />
                  <span className="text-gray-2">Save</span>
                </div>
                {/* add scrolling */}
                {playlistModal && (
                  <div className="w-full fixed h-full">
                    <div
                      className="fixed top-0 z-5 left-20 w-full h-full bg-black opacity-45"
                      onClick={(e) => {
                        e.stopPropagation() 
                        setPlaylistModal(false) 
                      }}
                    ></div>

                    <div
                      className="z-30 max-w-80 mx-auto min-h-fit bg-white rounded-lg fixed"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="flex flex-col w-full mx-auto p-8 rounded-lg shadow-2xl border border-gray-200">
                        <div className="flex justify-between">
                          <div className="">Save video to playlist</div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation() 
                              setPlaylistModal(false) 
                              console.log("Close button clicked") 
                            }}
                          >
                            X
                          </div>
                        </div>

                        <div className="pt-2">
                          {selectUserCreatedPlaylists.length > 0 ? (
                            selectUserCreatedPlaylists.map((playlist, index) => (
                              <div key={index} className="flex gap-3">
                                <input
                                  id={index}
                                  type="checkbox"
                                  checked={playlistToAddVideo?.includes(
                                    playlist.id
                                  )}
                                  onChange={() => {
                                    handleCheckedState(
                                      playlist.id,
                                      videoData.id
                                    ) 
                                  }}
                                />
                                <span className="lg:w-4/5">
                                  {playlist.name}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div>Empty playlist</div>
                          )}

                          <div className="flex flex-col gap-2">
                            <label className="pt-2">Name</label>
                            <input
                              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary  transition duration-150 ease-in-out"
                              value={playlistName}
                              onChange={(e) => {
                                setPlaylistName(e.target.value) 
                              }}
                            />
                            {/* {isLoading ? <PulseLoader /> :  */}
                            <button
                              onClick={() => createNewPlaylist()}
                              className="bg-primary hover:bg-h-primary h-10 outline-none text-white cursor-pointer font-semibold py-2 px-4 rounded-md transition duration-200 shadow-md"
                            >
                              Create New Playlist
                            </button>
                            {/* } */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* views and when created section */}
          <div className="flex gap-1 pt-6 lg:pt-2 text-sm text-zinc-600">
            <span>{videoData.views} views</span>
            <span>&#x2022 </span>
            <span>{videoData.createdAt}</span>
          </div>

          {/* user detail */}
          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              <div>
                <img
                  className="w-12 h-12 rounded-full"
                  src={videoData.user.profilePicture || profilePicture}
                  alt="profile picture"
                />
              </div>
              <div className="flex flex-col gap-">
                <div className="font-semibold text-sm">
                  {videoData.user.username}
                </div>
                {/* handle subscriber */}
                <div className="text-gray-2 text-sm">
                  {subscriberCount} subscriber{subscriberCount > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div
              className={`flex items-center justify-center gap-2 w-32 cursor-pointer lg:border-solid lg:border h-12 rounded-full p-1 transition-all duration-300 
              ${!isOwnChannel
                ? (`${
                    isSubscribed
                      ? "text-slate-800 bg-white lg:border-zinc-400 hover:bg-gray-100 hover:scale-105"
                      : "text-white bg-primary lg:border-zinc-200 hover:bg-primary-dark hover:scale-105"
                    }`)
                : `bg-[#cccccc] cursor-not-allowed`
               } `}
              onClick={() => handleSubscribe(videoData.user.id)}
            >
              <GroupAddIcon />
              <span
                className={`text-sm 
                  ${isOwnChannel 
                    ? `text-slate-800` : 
                    `${
                      isSubscribed ? "text-slate-800" : "text-white"
                    }`}
                  `}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-2 mt-6 border-solid border border-zinc-200 rounded-lg">
          <h3>Comments {countComment}</h3>

          {/* add comment section */}
          <div className="w-full flex items-center justify-between gap-2 mt-3">
            <textarea
              id="content"
              value={content}
              className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-primary "
              placeholder="Add Comment here..."
              onChange={(e) => setContent(e.target.value)}
            />

            {isLoading ? (
              <PulseLoader color="#616494" />
            ) : (
              <button
                onClick={handleCommentPost}
                className="bg-primary hover:bg-h-primary h-10 outline-none text-white cursor-pointer font-semibold py-2 px-4 rounded-full transition duration-200 shadow-md"
              >
                Post
              </button>
            )}
          </div>

          {/* listing comments */}
          {videoData.comments.map((comment, index) => (
            <div
              key={index}
              className="flex gap-4 mt-4 pt-2 px-2 border border-solid min-h-24 rounded-lg border-zinc-200 "
            >
              <div>
                <img
                  src={comment.user.profilePicture ?? avatar}
                  className="w-12 h-12 object-cover rounded-full"
                  alt="Profile picture"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <div className="font-bold text-sm">
                    @{comment.user.username}
                  </div>
                  <div className="text-xs">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div>{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* right section - video listing */}
      {/* <div className='lg:col-span-2'>

        {videoDataList.map((videoData, index) => (
          <VideoListCard 
            key={index}
            // key={videoData.id}
            thumbnailUrl={videoData.thumbnailUrl} 
            title={videoData.title}
            views={videoData.views} 
            duration={videoData.duration} 
            channelName={videoData.channelName}
            createdAt={videoData.createdAt}
          />
      ))}
      </div> */}
    </Container>
  ) 
} 

// i think no need of this in handlelike
// if (response.videoEngagement) {
//   setVideoData( (prevData) => ({
//     ...prevData,
//     videoEngagement:[
//       ...prevData.videoEngagement,
//       response.videoEngagement
//     ]
//   })
// )
// }
