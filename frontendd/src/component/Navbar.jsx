import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = ({ setSideNavbarFunc, sidenavbar }) => {
  const [userPic, setUserPic] = useState("https://media.istockphoto.com/id/1087531642/vector/male-face-silhouette-or-icon-man-avatar-profile-unknown-or-anonymous-person-vector.jpg?s=612x612&w=0&k=20&c=FEppaMMfyIYV2HJ6Ty8tLmPL1GX6Tz9u9Y8SCRrkD-o=");
  const [navbarModal, setNavbarModal] = useState(false);

  const handleClickModal = () => {
    setNavbarModal(prev => !prev);
  };

  const sideNavbarFunc = () => {
    setSideNavbarFunc(!sidenavbar);
  };

  return (
    <div className="fixed top-0 w-full flex items-center justify-between px-4 py-2.5 bg-black z-10 h-14">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={sideNavbarFunc}
        >
          <MenuIcon className="text-white" />
        </div>
        <div className="flex items-center cursor-pointer">
          <YouTubeIcon className="text-red-600 text-[34px]" />
          <div className="text-white text-xl font-semibold font-oswald ml-1">
            NeoTube
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex items-center gap-2 w-1/2">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full h-10 bg-[#121212] text-white px-4 rounded-l-full border border-[#3a3939] focus:outline-none placeholder:text-base"
          />
          <div className="w-16 h-10 bg-[#2a2a2a] flex items-center justify-center rounded-r-full border border-[#2a2a2a] cursor-pointer">
            <SearchIcon className="text-white text-[28px]" />
          </div>
        </div>
        <div className="w-10 h-10 bg-[#2a2a2a] rounded-full flex items-center justify-center cursor-pointer">
          <KeyboardVoiceIcon className="text-white" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5 relative">
        <VideoCallIcon className="text-white text-[30px] cursor-pointer" />
        <NotificationsIcon className="text-white text-[30px] cursor-pointer" />
        <img
          src={userPic}
          onClick={handleClickModal}
          className="w-8 h-8 rounded-full cursor-pointer"
          alt="Profile"
        />

        {navbarModal && (
          <div className="absolute top-12 right-0 w-32 bg-[#555555] rounded overflow-hidden transform scale-90 transition-all duration-300">
            <div className="px-2.5 py-2 hover:bg-[#222121] cursor-pointer">Profile</div>
            <div className="px-2.5 py-2 hover:bg-[#222121] cursor-pointer">Logout</div>
            <div className="px-2.5 py-2 hover:bg-[#222121] cursor-pointer">Login</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;