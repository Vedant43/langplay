import { Container } from "../Components/container/Container"
import { VideoCard } from "../Components/Video Card/VideoCard"

    export const HomePage = () => {

        const videos = [
            {
                thumbnail: "https://source.unsplash.com/400x250/?technology",
                title: "Mastering React in 2024: Full Guide",
                channelName: "CodeWithMe",
                views: "1.2M",
                duration: "12:45"
            },
            {
                thumbnail: "https://source.unsplash.com/400x250/?programming",
                title: "Tailwind CSS Crash Course",
                channelName: "DesignDev",
                views: "870K",
                duration: "08:30"
            },
            {
                thumbnail: "https://source.unsplash.com/400x250/?coding",
                title: "Building a Full-Stack App with MERN",
                channelName: "DevJourney",
                views: "640K",
                duration: "15:20"
            },
            {
                thumbnail: "https://source.unsplash.com/400x250/?developer",
                title: "Understanding JavaScript Closures",
                channelName: "JS Ninja",
                views: "530K",
                duration: "07:10"
            },
            {
                thumbnail: "https://source.unsplash.com/400x250/?video",
                title: "How to Deploy React Apps on Vercel",
                channelName: "Code Simplified",
                views: "320K",
                duration: "06:55"
            },
            {
                thumbnail: "https://source.unsplash.com/400x250/?education",
                title: "Best AI Tools for Developers",
                channelName: "TechWorld",
                views: "1.8M",
                duration: "14:05"
            }
        ]  

        return (
            <Container>
                <div className="grid grid-cols-3 gap-4">
                    {videos.map((video, id) => (
                        <VideoCard 
                            key={id}
                            thumbnail = {video.thumbnail}
                            title = {video.title}
                            channelName = {video.channelName}
                            views = {video.views}
                            duration = {video.duration}
                        />
                    ))}
                </div>
            </Container>
        )
}