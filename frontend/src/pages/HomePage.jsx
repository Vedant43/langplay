import { useSelector } from "react-redux"
import { Container } from "../Components/container/Container"
import { VideoCard } from "../Components/Video Card/VideoCard"
import { useEffect, useState } from "react"
import VideoApi from "../api/VideoApi"
// import avatar from "../src/assets/default-avatar.jpg";
import avatar from "../assets/default-avatar.jpg"
export const HomePage = () => {

    // const videos = [
    //         {
    //             thumbnail: "https://source.unsplash.com/400x250/?technology",
    //             title: "Mastering React in 2024: Full Guide",
    //             channelName: "CodeWithMe",
    //             views: "1.2M",
    //             duration: "12:45"
    //         },
    //         {
    //             thumbnail: "https://source.unsplash.com/400x250/?programming",
    //             title: "Tailwind CSS Crash Course",
    //             channelName: "DesignDev",
    //             views: "870K",
    //             duration: "08:30"
    //         },
    //         {
    //             thumbnail: "https://source.unsplash.com/400x250/?coding",
    //             title: "Building a Full-Stack App with MERN",
    //             channelName: "DevJourney",
    //             views: "640K",
    //             duration: "15:20"
    //         },
    //         {
    //             thumbnail: "https://source.unsplash.com/400x250/?developer",
    //             title: "Understanding JavaScript Closures",
    //             channelName: "JS Ninja",
    //             views: "530K",
    //             duration: "07:10"
    //         },
    //         {
    //             thumbnail: "https://source.unsplash.com/400x250/?video",
    //             title: "How to Deploy React Apps on Vercel",
    //             channelName: "Code Simplified",
    //             views: "320K",
    //             duration: "06:55"
    //         },
    //         {
    //             thumbnail: "https://source.unsplash.com/400x250/?education",
    //             title: "Best AI Tools for Developers",
    //             channelName: "TechWorld",
    //             views: "1.8M",
    //             duration: "14:05"
    //         }
    // ]  

    const [videos, setVideos] = useState([])

    useEffect( () => {
        VideoApi.fetchAllVideos()
        .then( videos => {
            setVideos(videos)
        })
    }, [])

    console.log(videos)

    const { authStatus, channelName } = useSelector((state) => state.auth)

    return (
        <Container>

            {channelName === null ? 
                <div className="flex w-full bg-red-100">
                    <p className="bg-red-100 text-red-800 mx-auto">!Update channel name!</p>
                </div> 
                :
                ''
            }
            {/* // without channelname user cant upload videos */}
            <div className="grid lg:grid-cols-3 p-4 gap-4">
                {videos.map((video, id) => (
                    <VideoCard 
                        key={id}
                        id={video.id}
                        thumbnail = {video.thumbnailUrl}
                        title = {video.title}
                        channelName = {video.user.username}
                        userProfilePicture = {video.user.profilePicture ?? avatar}
                        views = {video.views}
                        duration = {video.duration}
                        createdAt={video.createdAt}
                    />
                ))}
            </div>

        </Container>
    )
}