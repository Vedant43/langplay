import React, { useState } from 'react';
import Container from "./Container"
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Navbar = ({ toggleSidebar }) => {

  const [userPic, setUserPic] = useState("https://media.istockphoto.com/id/1087531642/vector/male-face-silhouette-or-icon-man-avatar-profile-unknown-or-anonymous-person-vector.jpg?s=612x612&w=0&k=20&c=FEppaMMfyIYV2HJ6Ty8tLmPL1GX6Tz9u9Y8SCRrkD-o=")
  const [navbarModal, setNavbarModal] = useState(false)

  const handleClickModal = () => {
    setNavbarModal(prev => !prev)
  };

    return (
        <header className="fixed top-0 w-full border border-b-slate-300 bg-white shadow-md z-50">
            <Container>
                <div className="flex items-center justify-between h-12">
                    {/* Left section */}
                    <div className="flex items-center gap-2">
                        <div onClick={toggleSidebar} className="w-10 h-10 flex items-center justify-center cursor-pointer">
                            <MenuIcon className="text-black text-[28px]" />
                        </div>
                        <div className="flex items-center cursor-pointer">
                            <YouTubeIcon className="text-red-600 text-[36px]" />
                            <div className="text-slate-800 text-xl font-semibold font-oswald ml-1">
                                NeoTube
                            </div>
                        </div>
                    </div>

                    {/* Middle section */}
                    <div className="flex items-center gap-2 w-1/2">
                        <div className="flex w-full">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full h-10 text-black px-4 rounded-l-full border border-[#e0e0e0] focus:outline-none placeholder:text-base"
                            />
                            <div className="w-16 h-10 flex items-center justify-center rounded-r-full border border-[#e0e0e0] bg-[#f8f8f8] cursor-pointer">
                                <SearchIcon className="text-slate-500 text-[28px]" />
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-[#f2f2f2] rounded-full flex items-center justify-center cursor-pointer">
                            <KeyboardVoiceIcon className="text-slate-600" />
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-3 relative">
                        {/* <VideoCallIcon className="text-slate-600 text-[30px] cursor-pointer" /> */}
                        <NotificationsIcon className="text-slate-600 cursor-pointer" />
                        <img
                            src={userPic}
                            onClick={handleClickModal}
                            className="w-10 h-10 rounded-full cursor-pointer"
                            alt="Profile"
                        />

                        {navbarModal && (
                            <div className="absolute top-12 right-0 w-32 bg-slate-200 rounded overflow-hidden transform scale-90 transition-all duration-300 ">
                                <div className="px-2.5 py-2 hover:bg-slate-300 cursor-pointer">Profile</div>
                                <div className="px-2.5 py-2 hover:bg-slate-300 cursor-pointer">Logout</div>
                                <div className="px-2.5 py-2 hover:bg-slate-300 cursor-pointer">Login</div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Navbar