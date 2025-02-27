import { Navbar } from "../Navbar/Navbar"
import { Sidebar } from "../Sidebar/Sidebar"
import { Outlet } from "react-router-dom"

export const Layout = () => {

    const [ isSidebarOpen, setSidebarOpen ] = useState()
    return (
        <div>
            <Navbar />
            <div className="relative flex pt-16">
                <aside className="w-64 min-w-[12rem]">
                    <Sidebar />
                </aside>
                <main className="flex-1">  
                    <Outlet />
                </main>
            </div>  
        </div>
    )
}

// apply flex grow on main 