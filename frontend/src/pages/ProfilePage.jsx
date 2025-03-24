import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Container } from "../Components/container/Container"
import { VideoCard } from "../Components/Video Card/VideoCard";
import avatar from "../assets/default-avatar.jpg"
import { useSelector } from "react-redux";
import { PlaylistCard } from "../Components/Playlist/PlaylistCard";
import placeholder from "../assets/placeholder.png"
import UserApi from "../api/UserApi";
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import { Link } from "react-router-dom"

export const ProfilePage = () => {

    const [ userData, setUserData ] = useState({})
    const [ activeTab, setActiveTab ] = useState("Videos")
    const [ isSubscribed, setIsSubscribed ] = useState(false)
    const [ subscriptions, setSubscriptions ] = useState([])
    const [ profilePic, setProfilePic ] = useState(avatar)

    const { playlists } = useSelector((state) => state.playlist)
    const { id } = useSelector((state) => state.auth)
    const tabs = ["Videos", "Playlists", "Subscriptions"]

    useEffect( () => {
        UserApi.getUser()
        .then( response => {
            console.log(response)
            setUserData(response)
            // setProfilePic(response.profilePicture)
        })
        .catch( error => {
            console.log(error)
        })
    }, [id])

    useEffect( () => {
        console.log(playlists)
    }, [playlists])

    useEffect( () => {
        if (!userData.id) return

        UserApi.fetchSubscriptions(userData.id)
        .then(response => {
            console.log("Subscriptione----------------")
            console.log(response)
            setSubscriptions(response)
        })
        .catch(error => {
            console.log(error)
        })
    }, [userData.id])

    return (
    //banner image
    <div className="w-full">
      <div
        className="h-48 mt-6 mr-6 mb-6 ml-6 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:`url(${userData.coverPicture})`,
          backgroundSize: "cover",
        }}
      >
      </div>

      {/* profile info */}
      <div className="flex justify-between mx-10">
        <div className="flex items-center">
            <div className="mr-4">
                <img
                    // src={profilePic}
                    src={userData?.profilePicture ?? avatar}
                    alt="Profile"
                    className="w-28 h-28 rounded-full"
                />
            </div>
            <div className="flex-1 mt-3">
                <h2 className="text-2xl font-bold">
                    {userData.channelName}
                </h2>
                <p className="text-gray-600">
                    @{userData.username}
                </p>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span>{userData.subscribers?.length} Subscribers</span>
                {/* <span>•</span>
                <span>10 Following</span> */}
                </div>
            </div>
        </div>
        <div 
            className="flex items-center"
        >
            <Link 
                to="/profile-update"
                className="no-underline"
            >
                <button className="bg-primary hover:bg-h-primary text-white px-4 py-1 cursor-pointer rounded-md text-sm flex items-center">
                <EditIcon className="h-4 w-4 mr-1" /> Update
                </button>
            </Link>
        </div>
      </div>

        {/* Tabs */}
        <div className="mt-8 border-b-2 border-gray-300 px-6">
            <div className="flex flex-col relative">
                <div className="flex w-full" style={{ borderBottom: '1px solid #d1d5db' }}>
                    {tabs.map((tab) => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 text-center px-4 py-2 cursor-pointer flex items-center justify-center transition-colors duration-300 relative border-t-4
                                ${
                                    activeTab === tab
                                    ? "text-primary bg-[#D0BCDC] shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                }
                            `}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tab content */}
                <div className="mt-6 w-full">
                    {activeTab === "Videos" && (
                        <div className="grid lg:grid-cols-3 p-4 gap-4">
                            {userData.videos?.map((video, id) => (
                            <VideoCard 
                                key={id}
                                id={video.id}
                                thumbnail={video.thumbnailUrl}
                                title={video.title}
                                channelName={video.user?.username}
                                userProfilePicture={userData?.profilePicture ?? avatar}
                                views={video.views}
                                duration={video.duration}
                                createdAt={video.createdAt}
                            />
                            ))}
                        </div>
                    )}

                    {activeTab === "Playlists" && (
                        <div 
                            className="grid lg:grid-cols-3 p-4 gap-4"
                        >
                            {playlists.map((playlist, key) => (
                                <div 
                                    key={key}
                                    className="h-56" 
                                >  
                                    <Link to={`/playlist/${playlist.id}`}>
                                        <PlaylistCard
                                            name={playlist.name}
                                            thumbnail={
                                                playlist.videos.length > 0 
                                                ? playlist.videos[0].Video.thumbnailUrl
                                                : placeholder
                                            }                                    
                                            count={playlist._count.videos}
                                            time={playlist.createdAt}
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Subscriptions" && (
                        <div
                            className="flex flex-col"
                        >
                            {subscriptions.length>0 
                            ? subscriptions.map( sub => (
                                <div 
                                    className="relative flex justify-between pt-4"
                                >
                                    <div 
                                        className="flex gap-2"
                                    >
                                        <div>
                                            <img
                                                className="w-12 h-12 rounded-full"
                                                src={sub.profilePicture ?? avatar}
                                                alt="profile picture"
                                            />
                                        </div>
                                            <div 
                                                    className="flex flex-col gap-"
                                                >
                                                    <div 
                                                        className="font-semibold text-sm"
                                                    >
                                                        {sub.channelName ?? "DemoName"}
                                                    </div>
                                                    {/* handle subscriber */}
                                                    <div 
                                                        className="text-gray-2 text-sm"
                                                    >
                                                        {/* {subscriberCount} subscriber{subscriberCount > 1 ? "s" : ""} */}
                                                        @{sub.username}
                                                    </div>
                                            </div>
                                    </div>
                                    
                                    <div
                                        className={`flex items-center justify-center gap-2 w-32 cursor-pointer lg:border-solid lg:border h-12 rounded-full p-1 transition-all duration-300 ${
                                            sub.id !== id
                                            ? "text-slate-800 bg-white lg:border-zinc-400 hover:bg-gray-100 hover:scale-105"
                                            : "text-white bg-primary lg:border-zinc-200 hover:bg-primary-dark hover:scale-105"
                                        }`}
                                        onClick={() => handleSubscribe(videoData.user.id)}
                                    >   
                                        <GroupAddIcon />
                                        <span
                                            className={`text-sm ${
                                                isSubscribed ? "text-slate-800" : "text-white"
                                            }`}
                                        >
                                            {isSubscribed ? "Unsubscribe" : "Subscribe"}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-gray-1"></div>

                                </div>
                            ) )
                            : "No subscriptions"
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};