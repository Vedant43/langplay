import { Navbar } from "../Navbar/Navbar"
import { Sidebar } from "../Sidebar/Sidebar"
import { Outlet } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import useScreenType from "react-screentype-hook";

export const Layout = () => {

    const [ isSidebarOpen, setIsSidebarOpen ] = useState(false)
    const [ authStatus, setAuthStatus ] = useState(false)
    const screenType = useScreenType()
    const location = useLocation()

    const routesAllowingSidebar = ['/']
    const shouldShowSidebar = routesAllowingSidebar.includes(location.pathname) // using different variable instead of direct state to gain control over toggling

    let accessToken = localStorage.getItem('accessToken') 

    useEffect(() => {
        if(shouldShowSidebar && screenType.isDesktop) {
            setIsSidebarOpen(shouldShowSidebar)
        }    
    }, [shouldShowSidebar])

    useEffect(() => {
        if( accessToken ) {
            setAuthStatus(true)
        }
    }, [accessToken])

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
    }

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
           
            {/* {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar} // Clicking outside closes the sidebar
                >
                </div>
            )} */}

            <div 
                className={`flex pt-16 min-h-screen`}
            >
            
                <aside 
                    className={`fixed lg: min-h-screen border border-solid border-r-1 border-zinc-300`}        
                >
                    <Sidebar isSidebarOpen={isSidebarOpen}/>
                </aside>
                
                <main
                    className={`flex-1 ${isSidebarOpen ? "lg:ml-56 ml-52 " : "lg:ml-20"} transition-all duration-300 ease-in-out`}
                >
                    <Outlet />
                </main>

            </div>
        </div>
    )
}

// apply flex grow on main 