import React from 'react';
import SideNavbar from '../component/SideNavbar';
import HomePage from '../component/HomePage';

const Home = ({ sidenavbar }) => {
  return (
    <div className="flex w-full pt-2.5 box-border">
      <SideNavbar sidenavbar={sidenavbar} />
      <HomePage sidenavbar={sidenavbar} />
    </div>
  );
};

export default Home;
