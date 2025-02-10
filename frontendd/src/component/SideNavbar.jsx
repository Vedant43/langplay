import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import VideocamIcon from '@mui/icons-material/Videocam';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import HistoryIcon from '@mui/icons-material/History';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ContentCutIcon from '@mui/icons-material/ContentCut';

const SideNavbar = ({ sidenavbar }) => {
  return (
    <div className={sidenavbar ? "fixed top-[55px] left-0 w-[275px] h-[92vh] flex flex-col p-3.5 bg-black text-white overflow-y-auto scrollbar-hidden" : "hidden"}>
      {/* Top Section */}
      <div className="flex flex-col border-b border-[#565555] pb-2.5">
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <HomeIcon />
          <div className="text-sm font-normal">Home</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <VideocamIcon />
          <div className="text-sm font-normal">Shorts</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <SubscriptionsIcon />
          <div className="text-sm font-normal">Subscription</div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex flex-col border-b border-[#565555] py-2.5">
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <div className="text-sm font-normal">You</div>
          <ChevronRightIcon />
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <RecentActorsIcon />
          <div className="text-sm font-normal">Your Channel</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <HistoryIcon />
          <div className="text-sm font-normal">History</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <PlaylistPlayIcon />
          <div className="text-sm font-normal">Playlist</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <OndemandVideoIcon />
          <div className="text-sm font-normal">Your Videos</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <HistoryIcon />
          <div className="text-sm font-normal">Watch Later</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <ThumbUpOffAltIcon />
          <div className="text-sm font-normal">Liked Videos</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <ContentCutIcon />
          <div className="text-sm font-normal">Your Clips</div>
        </div>
      </div>

      {/* Subscriptions Section */}
      <div className="flex flex-col border-b border-[#565555] py-2.5">
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <div className="text-sm font-normal">Subscriptions</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoXBdcf4NAaHCxscAxFxcSDhanmOUjCMuReA&s"
            alt="Aaj Tak"
            className="w-6 h-6 rounded-full"
          />
          <div className="text-sm font-normal">Aaj Tak</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3I8MHCoQwIr7JRNGJofutnnyXyD12S0aRBw&s"
            alt="Unacademy"
            className="w-6 h-6 rounded-full"
          />
          <div className="text-sm font-normal">Unacademy</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvh56y4giPRR4JYSsXUGXUL9Shkd6kGkOaPQ&s"
            alt="NesoAcademy"
            className="w-6 h-6 rounded-full"
          />
          <div className="text-sm font-normal">NesoAcademy</div>
        </div>
        <div className="flex gap-5 items-center p-2.5 cursor-pointer hover:bg-[#232323] hover:rounded-[15px]">
          <img
            src="https://logowik.com/content/uploads/images/ndtv9182.logowik.com.webp"
            alt="NDTV India"
            className="w-6 h-6 rounded-full"
          />
          <div className="text-sm font-normal">NDTV India</div>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;