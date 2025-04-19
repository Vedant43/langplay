import React, { useEffect, useState, useMemo, useRef } from "react" 
import VideoApi from "../api/VideoApi" 
import toast from "react-hot-toast" 
import { useNavigate, useParams } from "react-router-dom" 
import { PulseLoader } from "react-spinners" 
import ThumbUpIcon from "@mui/icons-material/ThumbUp" 
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt" 
import ThumbDownIcon from "@mui/icons-material/ThumbDown" 
import GroupAddIcon from "@mui/icons-material/GroupAdd" 
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt" 
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd" 
import WatchLaterIcon from "@mui/icons-material/WatchLater"
import TextSnippetIcon from "@mui/icons-material/TextSnippet"
import YouTubeIcon from "@mui/icons-material/YouTube"
import { Container } from "../Components/container/Container" 
import { VideoCard } from "../Components/Video Card/VideoCard" 
import { addVideoToPlaylist, createPlaylist, removeVideoFromPlaylist, fetchPlaylistsIfNeeded, 
} from "../Components/redux/features/playlistSlice" 
import { useDispatch, useSelector } from "react-redux" 
import { VideoListCard } from "../Components/Video Card/VideoListCard" 
import { Transcript } from "../Components/Transcript"
import PlaylistApi from "../api/PlaylistApi" 
import UserApi from "../api/UserApi" 
import avatar from "../assets/default-avatar.jpg" 
import { getTimeAgo } from "../utils/formattingTime"
import { Link } from "react-router-dom"
import { Quiz } from "./QuizPage"

const normalizeQuizData = (quizObj) => {
  const result = [];
  if (!quizObj || typeof quizObj !== "object") return result;
  if (quizObj.comprehension) {
      quizObj.comprehension.forEach((q) =>
          result.push({ type: "comprehension", ...q })
      );
  }
  if (quizObj.meaning_question && quizObj.meaning_options) {
      result.push({
          type: "meaning",
          question: quizObj.meaning_question,
          options: quizObj.meaning_options,
          answer: quizObj.meaning_answer,
      });
  }
  if (quizObj.fill_blank) {
      result.push({
          type: "fill_blank",
          question: quizObj.fill_blank,
          options: [],
          answer: quizObj.fill_blank_answer,
      });
  }
  return result
};

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
    source: "USER_UPLOADED", // Default to USER_UPLOADED, will be updated from API
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
    quizGenerated: false,
    quiz: [],
  }) 
  const [ isOwnChannel, setIsOwnChannel ] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false) 
  const [subscriberCount, setSubscriberCount] = useState(0)
  // const [showQuiz, setShowQuiz] = useState(false) 
  const [activeTab, setActiveTab] = useState("quiz")

  // useEffect(() => {
  //   if (!videoId) return; 
  //   const ws = new WebSocket("ws://localhost:8000/ws");
  
  //   console.log("Starting FastAPI WebSocket job...");
  
  //   ws.onopen = () => {
  //     console.log("Connected to FastAPI WebSocket");
  //     ws.send(JSON.stringify({ event: "start_generation", videoId }));
  //   };
  
  //   ws.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     console.log("Message from FastAPI:", message);
  
  //     if (message.event === "quiz_ready" || message.event === "transcript_ready") {
  //       toast.success(`${message.event === "quiz_ready" ? "Quiz" : "Transcript"} is ready!`);
  //       VideoApi.fetchVideo(videoId)
  //         .then((updatedData) => {
  //           setVideoData(updatedData);
  //         });
  //     }
  //   };
  
  //   return () => {
  //     ws.close();
  //   };
  // }, [videoId])
  
  useEffect(() => {
    if (
      (activeTab === "quiz" || activeTab === "transcript") &&
      (!videoData.quizGenerated || !videoData.transcriptLang)
    ) {
      toast.loading("Generating content... Please wait.");
      VideoApi.fetchVideo(videoId)
        .then((updatedData) => {
          setVideoData(updatedData);
          toast.dismiss();
    
          const quizReady = updatedData.quiz && Object.keys(updatedData.quiz).length > 0;
          const transcriptReady = !!updatedData.transcriptLang;
    
          if (!quizReady || !transcriptReady) {
            toast.error("Some content couldn't be generated.");
          }
        });
    }
  }, [activeTab]);  
  
  const { videoId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { username, profilePicture, id, authStatus } = useSelector((state) => state.auth)
  const { playlists, status, error, removeVideoStatus, playlistsLoaded } = useSelector((state) => state.playlist)

  // Check if video is from YouTube
  const isYouTubeVideo = videoData.source === "YOUTUBE"

  useEffect(() => {
    VideoApi.fetchVideo(videoId).then((data) => {
      // Ensure user object exists for YouTube videos to prevent null errors
      if (data.source === "YOUTUBE" && (!data.user || Object.keys(data.user).length === 0)) {
        data.user = {
          id: "youtube",
          profilePicture: "",  // Will use fallback in render
          username: data.channelName || "YouTube Channel",
          channelName: data.channelName || "YouTube Channel",
          subscribers: []
        }
      }
      
      setVideoData(data)

      const likes = data.videoEngagement?.filter((e) => e.engagementType === "LIKE").length || 0
      const dislikes = data.videoEngagement?.filter((e) => e.engagementType === "DISLIKE").length || 0
      const comments = data.comments?.length || 0

      setCountLikes(likes) 
      setCountDislikes(dislikes) 
      setCountComment(comments) 

      if (id && data.source !== "YOUTUBE") {
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
      // Safe check for subscribers existence before accessing length
      setSubscriberCount(data.user?.subscribers?.length || 0)
    })
    .catch(error => {
      console.error("Error fetching video data:", error)
      toast.error("Error loading video data")
    })
  }, [videoId, id, authStatus]) 

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      // Only increment view count for USER_UPLOADED videos, not for YOUTUBE videos
      if (video.currentTime >= 10 && !viewUpdatedRef.current && videoData.source === "USER_UPLOADED") {
         
        VideoApi.increaseViewCount(videoId)
          .then(() => {
            viewUpdatedRef.current = true
          })
          .catch(error => console.log(error))

        if (!playlistsLoaded) return

        const historyVideosPlaylist = playlists.find(p => p.type === 'HISTORY')
        
        const historyPlaylistId = historyVideosPlaylist ? historyVideosPlaylist.id : null

        if(id){
          if(!historyPlaylistId) {
            console.log("Not once but twicw")
            dispatch(createPlaylist( {playlistName:"History", type:'HISTORY'} ))
          } else{
            const ifVideoExistInPlaylist = historyVideosPlaylist.videos?.find(v => v.Video.id === videoId)
            
            if(!ifVideoExistInPlaylist) {
              dispatch(addVideoToPlaylist( {playlistId: historyPlaylistId, videoId} ))
            }
          }
        }
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate) 

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate) 
    }
  }, [videoId, playlists, playlistsLoaded, videoData.source])

  const handleCommentPost = () => {
    // Don't allow commenting on YouTube videos
    if (isYouTubeVideo) {
      toast.error("Comments are not available for YouTube videos")
      return
    }

    if (!id) {
      toast.error("Sign in required")
      navigate(`/signin?redirect=/video/${videoId}`)
    }

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
    // Don't allow liking/disliking YouTube videos
    if (isYouTubeVideo) {
      toast.error("Interactions are not available for YouTube videos")
      return
    }

    if (!id) {
      navigate(`/signin?redirect=/video/${videoId}`)
    }

    const engagementId = e.currentTarget.id

    const apiCall =
    engagementId === "like"
        ? VideoApi.likeVideo(videoId)
        : VideoApi.dislikeVideo(videoId)

    apiCall.then((response) => {
      console.log(response) 
      if (engagementId === "like") {

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
    })
  }

  const selectUserCreatedPlaylists = useMemo(() => {
    return playlists.filter(playlist => playlist.type === "USER_CREATED")
  }, [playlists])

  const createNewPlaylist = () => {
    dispatch(createPlaylist({ playlistName })) 
    setPlaylistName("") 
  }

  const openPlaylistModal = async (e) => {
    e.stopPropagation() 
    
    if (!id) {
      navigate(`/signin?redirect=/video/${videoId}`)
    }

    setPlaylistModal(true) 
    try {
      await dispatch(fetchPlaylistsIfNeeded()).unwrap() 

      const playlistsId = selectUserCreatedPlaylists.map((p) => p.id)
    
      const response = await PlaylistApi.isVideoInPlaylist(
        playlistsId,
        videoId
      )
      setPlaylistToAddVideo(response)
    }catch (error) {
      console.log(error) 
    }
  }

  const handleWatchLater = () => {
    if (!id) {
      navigate(`/signin?redirect=/video/${videoId}`)
      return
    }

    const watchLaterPlaylist = playlists.find(p => p.type === 'WATCH_LATER')
    const watchLaterPlaylistId = watchLaterPlaylist ? watchLaterPlaylist.id : null

    if (!watchLaterPlaylistId) {
      dispatch(createPlaylist({ playlistName: "Watch Later", type: "WATCH_LATER" }))
        .then(() => {
          const newWatchLaterPlaylist = playlists.find(p => p.type === 'WATCH_LATER')
          if (newWatchLaterPlaylist) {
            dispatch(addVideoToPlaylist({ playlistId: newWatchLaterPlaylist.id, videoId }))
            toast.success("Added to Watch Later")
          }
        })
    } else {
      dispatch(addVideoToPlaylist({ playlistId: watchLaterPlaylistId, videoId }))
      toast.success("Added to Watch Later")
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
      }
    } catch (error) {
      console.log(error) 
    }
  }

  const handleSubscribe = (channelId) => {
    // Don't allow subscribing for YouTube videos
    if (isYouTubeVideo) {
      toast.error("Subscription not available for YouTube channels")
      return
    }

    if (!id) {
      navigate(`/signin?redirect=/video/${videoId}`)
    }

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

  return (
    <Container className="pt-4 relative w-full px-4 h-screen lg:grid grid-cols-5 gap-5">
      {/* left section */}
      <div className="py-2 h-full lg:col-span-3">
        {/* video */}
        <div className="py-2 h-2/12 w-full flex">
          {!isYouTubeVideo 
            ?  <video
                src={videoData.videoUrl || null}
                ref={videoRef}
                className="bg-black w-full h-full border-1 border-gray-200 rounded-lg"
                controls
                autoPlay
                muted
              />
            : <iframe className="w-full h-96" src="https://www.youtube.com/embed/Ff5FUoo2YZA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"   allowfullscreen>
              
              </iframe>

        }
          
        </div>

        {/* YouTube indicator badge if applicable */}
        {isYouTubeVideo && (
          <div className="flex items-center gap-1 my-2 px-3 py-1 bg-red-100 text-red-800 rounded-full w-fit">
            <YouTubeIcon fontSize="small" />
            <span className="text-sm font-medium">YouTube Content (Limited Interaction)</span>
          </div>
        )}

        {/* video details */}
        <div className="py-2 w-full flex-col border-solid border border-zinc-200 rounded-lg p-2 mt-2">
          <div className="lg:flex lg:justify-between">
            <span className="font-semibold lg:w-3/5 w-full">
              {videoData.title}
            </span>

            {/* like and save section - different for YouTube vs User videos */}
            <div className="flex lg:gap-4 justify-between pt-3 lg:pt-0 h-8">
              {!isYouTubeVideo ? (
                // For User Uploaded videos - full interaction
                <>
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
                      onClick={(e) => openPlaylistModal(e)}
                      className="flex items-center gap-1"
                    >
                      <PlaylistAddIcon />
                      <span className="text-gray-2">Save</span>
                    </div>
                  </div>
                </>
              ) : (
                // For YouTube videos - limited interaction
                <>
                  <div className="flex justify-center items-center text-sm gap-1 lg:border-solid lg:border lg:border-zinc-200 rounded cursor-pointer p-2">
                    <div
                      onClick={(e) => openPlaylistModal(e)}
                      className="flex items-center gap-1"
                    >
                      <PlaylistAddIcon />
                      <span className="text-gray-2">Add to Playlist</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* views and when created section */}
          <div className="flex gap-1 pt-6 lg:pt-2 text-sm text-zinc-600">
            {isYouTubeVideo 
              ? <>
                </>
              : <>
                  <span>{videoData.views} views</span>
                  <span>&#x2022; </span>
                </>
            }
            
            <span>{getTimeAgo(videoData.createdAt)}</span>
          </div>

          {/* user detail */}
          <div 
            className="flex justify-between pt-4"
          >
            <Link 
              to={isYouTubeVideo ? "#" : `/profile/${videoData?.user?.id}`}
              className={`no-underline ${isYouTubeVideo ? "pointer-events-none" : ""}`}
            >
              <div className="flex gap-2">
                <div>
                  <img
                    className="w-12 h-12 rounded-full"
                    src={(videoData.user?.profilePicture) || avatar}
                    alt="profile picture"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = avatar;
                    }}
                  />
                </div>
                <div className="flex flex-col gap-">
                  <div className="font-semibold text-sm">
                    {isYouTubeVideo ? (videoData.user?.channelName || "YouTube Channel") : videoData.user?.username}
                  </div>
                  {/* Only show subscribers for user-uploaded videos */}
                  {!isYouTubeVideo && (
                    <div className="text-gray-2 text-sm">
                      {subscriberCount} subscriber{subscriberCount > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            </Link>
            {!isYouTubeVideo && (
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
                onClick={() => handleSubscribe(videoData.user?.id)}
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
            )}
          </div>
        </div>

        {/* Comment section - only show for user uploaded videos */}
        {!isYouTubeVideo ? (
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
            {videoData.comments?.map((comment, index) => (
              <div
                key={index}
                className="flex gap-4 mt-4 pt-2 px-2 border border-solid min-h-24 rounded-lg border-zinc-200 "
              >
                <div>
                  <img
                    src={comment.user?.profilePicture || avatar}
                    className="w-12 h-12 object-cover rounded-full"
                    alt="Profile picture"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = avatar;
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <div className="font-bold text-sm">
                      @{comment.user?.username || "user"}
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
        ) : (
          <div className="p-4 mt-6 border-solid border border-zinc-200 rounded-lg bg-gray-50 text-center">
            <p className="text-gray-500">Comments are disabled for YouTube videos</p>
          </div>
        )}
      </div>

      {/* Playlist modal */}
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
                  <button
                    onClick={() => createNewPlaylist()}
                    className="bg-primary hover:bg-h-primary h-10 outline-none text-white cursor-pointer font-semibold py-2 px-4 rounded-md transition duration-200 shadow-md"
                  >
                    Create New Playlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right section */}
      <div className="mt-6 lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs Header */}
        <div className="flex bg-gray-50 p-1 rounded-t-xl">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all duration-200 flex items-center justify-center ${
              activeTab === "quiz"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Quiz
          </button>
          <button
            onClick={() => setActiveTab("transcript")}
            className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all duration-200 flex items-center justify-center ${
              activeTab === "transcript"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Transcript
          </button>
        </div>

        {/* Tabs Content */}
        <div className="p-6">
          {activeTab === "quiz" ? (
            videoData.quiz && Object.keys(videoData.quiz).length > 0 ? (
              <Quiz quizData={normalizeQuizData(videoData.quiz)} />
            ) : (
              <div className="text-center py-12">
                <div className="animate-pulse flex flex-col items-center justify-center">
                  <div className="rounded-full bg-blue-100 p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Generating quiz...</h3>
                  <p className="text-gray-600 max-w-sm">Hang tight while we prepare your questions!</p>
                </div>
              </div>
            )
          ) : (
            <Transcript transcript={videoData.transcriptLang} />
          )}
        </div>
      </div>

    </Container>
  ) 
}