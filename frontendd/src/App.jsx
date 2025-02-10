import { useState } from 'react'
import Navbar from './component/Navbar';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Video from './pages/Video';


function App() {
  const[sidenavbar,setSideNavbar]=useState(true);

  const setSideNavbarFunc=(value)=>{
    setSideNavbar(value);
  }

  return (
    <div className="p-0 m-0 box-border">
      <Navbar setSideNavbarFunc={setSideNavbarFunc} sidenavbar={sidenavbar}/>
      <Routes>
        <Route path='/' element={<Home sidenavbar={sidenavbar}/>} />
        <Route path='/watch/:id' element={<Video/>} />
      </Routes>
      
    </div>
  );
}

export default App
