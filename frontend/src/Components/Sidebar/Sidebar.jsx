import { Container } from "../container/Container"
import HomeIcon from '@mui/icons-material/Home'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import HistoryIcon from '@mui/icons-material/History'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'

export const Sidebar = () => {

    const sidebarItems = [
        {
            label: 'Home',
            icon: <HomeIcon />,
            slug: "/"
        },
        {
            label: 'Liked Videos',
            icon: <ThumbUpIcon />,
            slug: "/liked-videos"
        },
        {
            label: 'History',
            icon: <HistoryIcon />,
            slug: "/history"
        },
        {
            label: 'Playlists',
            icon: <PlaylistPlayIcon />,
            slug: "/playlists"
        },
        {
            label: 'Subscriptions',
            icon: <SubscriptionsIcon />,
            slug: "/"
        },
    ]

    return (
        <div className="flex h-screen shadow-xl">
            <Container className='flex h-full'>
                <ul className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] flex flex-col gap-4 px-9 py-8">
                    {sidebarItems.map((sidebarItem, id)=> 
                        (   
                            <li className="flex gap-4 items-center">
                                <div >
                                    {sidebarItem.icon}
                                </div>
                                <div className="text-sm font-bold">
                                    {sidebarItem.label}
                                </div>
                            </li>  
                        ) 
                    )}
                       
                </ul>
            </Container>
        </div>
    )
}