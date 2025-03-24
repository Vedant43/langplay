import { Container } from "../container/Container"
import { Link } from "react-router-dom"
import HomeIcon from '@mui/icons-material/Home'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import HistoryIcon from '@mui/icons-material/History'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'
import { Box } from "@mui/material"

export const Sidebar = ({isSidebarOpen}) => {
    const sidebarItems = [
        {
            label: 'Home',
            icon: <HomeIcon />,
            slug: "/"
        },
        {
            label: 'Liked Videos',
            icon: <ThumbUpIcon />,
            slug: "/playlist/liked-videos"
        },
        {
            label: 'History',
            icon: <HistoryIcon />,
            slug: "/playlist/history"
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
        <div className="min-h-screen">
            <Container className="flex">
                <ul
                    className={`flex flex-col pt-8 overflow-hidden left-0 top-16 h-[calc(100vh-4rem)] z-20 transition-all duration-300 ${isSidebarOpen ? 'w-48' : 'hidden lg:block lg:w-12'}`}
                >
                    {sidebarItems.map((sidebarItem, index) => (
                        <li 
                            key={index}
                            className="flex items-center cursor-pointer px-4 mb-4 text-gray-1 hover:bg-slate-100 hover:h-10 hover:pl-3 hover:rounded-lg hover:text-primary transform transition duration-300"
                        >
                            <Box
                                sx={{ 
                                    color: "inherit"
                                }}
                                className="flex-shrink-0"
                            >
                                <Link 
                                    to={sidebarItem.slug}
                                    className="no-underline text-inherit"
                                >
                                    {sidebarItem.icon}
                                </Link>
                            </Box>

                            {isSidebarOpen && (
                                <div className="ml-4 text-sm text-zinc-700 font-medium">
                                    <Link 
                                        to={sidebarItem.slug}
                                        className="no-underline text-inherit"
                                    >
                                        {sidebarItem.label}
                                    </Link>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </Container>
        </div>
    )
}

// export const Sidebar = ({isSidebarOpen}) => {
//     const sidebarItems = [
//         {
//             label: 'Home',
//             icon: <HomeIcon />,
//             slug: "/"
//         },
//         {
//             label: 'Liked Videos',
//             icon: <ThumbUpIcon />,
//             slug: "/liked-videos"
//         },
//         {
//             label: 'History',
//             icon: <HistoryIcon />,
//             slug: "/history"
//         },
//         {
//             label: 'Playlists',
//             icon: <PlaylistPlayIcon />,
//             slug: "/playlists"
//         },
//         {
//             label: 'Subscriptions',
//             icon: <SubscriptionsIcon />,
//             slug: "/"
//         },
//     ]

//     return (
//         <div className="min-h-screen">
//             <Container className="flex">
//                 <ul
//                     className={`fixed left-0 top-16 overflow-hidden h-[calc(100vh-4rem)] flex flex-col pt-8 shadow-xl border-r border-gray-300 z-50 ${isSidebarOpen ? 'w-64 px-8' : 'w-16 px-4'} transition-all duration-300 ease-in-out`}
//                 >
//                     {sidebarItems.map((sidebarItem, index) => (
//                         <li 
//                             key={index}
//                             className="flex items-center cursor-pointer text-gray-1 hover:bg-slate-50 hover:w-52 hover:h-10 hover:pl-3 hover:rounded-lg hover:text-primary transform transition duration-300"
//                         >
//                             <Box
//                                 sx={{ 
//                                     color: "inherit"
//                                 }}
//                                 className="flex-shrink-0"
//                             >
//                                 <Link 
//                                     to={sidebarItem.slug}
//                                     className="no-underline text-inherit"
//                                 >
//                                     {sidebarItem.icon}
//                                 </Link>
//                             </Box>

//                             {isSidebarOpen && (
//                                 <div className="ml-4 text-sm text-zinc-700 font-bold">
//                                     <Link 
//                                         to={sidebarItem.slug}
//                                         className="no-underline text-inherit"
//                                     >
//                                         {sidebarItem.label}
//                                     </Link>
//                                 </div>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             </Container>
//         </div>
//     )
// }