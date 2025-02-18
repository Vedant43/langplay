import React from 'react';
import Container from './Container';

const HomePage = ({ sidenavbar }) => {
  const options = [
    "All", "Comedy", "Education", "Music", "Mixes", "Calculus", "Indian Pop Music", "Live", 
    "Debates", "Dancing", "Cricket", "Movies", "T-Series", "Watched", "New to You", "News", "Coke Studio"
  ];

  return (
    <Container>
    <div className={sidenavbar ? "flex flex-col overflow-x-hidden flex-1 ml-[274px] min-h-screen" : "flex flex-col overflow-x-hidden flex-1 min-h-screen"}>
      {/* Options Section */}
      <div className="flex fixed top-[63px] w-full box-border gap-2.5 flex-shrink-0 h-auto overflow-x-scroll bg-white z-10">
        {options.map((item, index) => (
          <div key={index} className="flex-none h-8 px-2.5 py-0.5 bg-[#f2f2f2] text-slate-700 font-semibold rounded-md flex justify-center items-center cursor-pointer">
            {item}
          </div>
        ))}
      </div>

      {/* Main Video Section */}
      <div className={sidenavbar ? "grid gap-2.5 grid-cols-3 p-[90px_0_20px_0] bg-white" : "grid gap-[30px] grid-cols-4 p-[90px_0_20px_10px] bg-white"}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="text-slate-600 no-underline flex box-border flex-col cursor-pointer h-[316px]">
            {/* Thumbnail Box */}
            <div className="w-full relative box-border h-[216px]">
              <img
                src="https://www.vdocipher.com/blog/wp-content/uploads/2023/12/DALL%C2%B7E-2023-12-10-20.21.58-A-creative-and-visually-appealing-featured-image-for-a-blog-about-video-thumbnails-for-various-social-platforms-like-YouTube-Instagram-and-TikTok-s-1024x585.png"
                alt="thumbnail"
                className="w-full h-full rounded-[10px]"
              />
              <div className="absolute right-0 bottom-0 px-1 py-0.5 my-1 mx-1 text-xs text-slate-200 bg-black rounded-md">
                20:00
              </div>
            </div>

            {/* Title Box */}
            <div className="flex pt-2.5">
              <div className="flex w-[50px] h-[50px] items-center justify-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvPjv1lHEIpzgDk_e3Sm-e4EVOzggYdb5aHA&s"
                  alt="profile"
                  className="w-[80%] rounded-full"
                />
              </div>

              <div className="w-full p-1.5 box-border flex flex-col">
                <div className="font-semibold text-base">User 1</div>
                <div className="text-lg text-[#aaaaaa] mt-1">Channel 1</div>
                <div className="text-sm text-[#aaaaaa]">3 likes</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Container>
  )
}

export default HomePage