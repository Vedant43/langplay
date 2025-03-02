import { Container } from "../container/Container"
import MovieIcon from '@mui/icons-material/Movie'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DensitySmallIcon from '@mui/icons-material/DensitySmall'
import { Link } from "react-router-dom"

export const Navbar = ({toggleSidebar}) => {

    return (
        <header 
            className="fixed top-0 w-full z-50 h-16 border border-b-slate-300 bg-white shadow-md z-100"
        >
            <Container className="">
                <nav 
                    className="flex items-center justify-between lg:px-4 py-2"
                >
                    {/* Left section */}
                    <div 
                        className="flex items-center justify-center gap-1"
                    >  
                        <div 
                            className="lg:hidden w-12"
                        >
                            <Button 
                                className="" 
                                onClick={toggleSidebar}
                            >
                                <DensitySmallIcon 
                                    sx={{
                                        fontSize: 24, 
                                        color:"black"
                                    }}
                                />
                            </Button>
                        </div>  
                        <div 
                            className=""
                        >
                            <Link>
                                <MovieIcon 
                                    sx={{
                                        fontSize: 42, 
                                        color:"#616494"
                                    }} 
                                />
                            </Link>
                            
                        </div>
                        <div>
                            <h1 
                                className="text-xl px-2 font-bold text-slate-900"
                            >
                                NeoTube
                            </h1>
                        </div>
                    </div>

                    {/* Middle section */}
                    <div 
                        className="lg:w-1/2 bg-slate-200 rounded-full hidden lg:flex items-center justify-between"
                    >
                        <div 
                            className="flex w-full"
                        >
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full h-10 text-black px-4 rounded-l-full border focus:outline-none border-[#a9a9a9] placeholder:text-base"
                            />
                            <div 
                                className="w-16 h-10 flex items-center justify-center border border-[#a9a9a9] rounded-r-fullbg-zinc-400 cursor-pointer "
                            >  
                                <SearchIcon 
                                    className="text-slate-500 text-[28px]" 
                                />
                            </div>
                        </div>
                    </div>

                     {/* Right section  */}
                    <div 
                        className="flex items-center gap-2"
                    >

                        <div 
                            className="hidden lg:block"
                        >
                            <Button 
                                variant="text" 
                                sx={{
                                    color:"black", 
                                    borderRadius:2, 
                                    ":hover": {
                                        background:"rgba(0, 0, 0, 0.1)"
                                    }
                                }} 
                            >
                                Log in
                            </Button>
                        </div>

                        <div 
                            className="hidden lg:block"
                        >
                            <Button 
                                variant="contained" 
                                sx={{
                                    borderRadius: 2, 
                                    backgroundColor:"customColor.primary" , 
                                    fontSize:12, 
                                    width:80, 
                                    paddingX:0
                                }}
                            >
                                Sign up 
                            </Button>
                        </div>

                        <div 
                            className="lg:hidden flex"
                        >
                            <Button 
                                sx={{ 
                                    minWidth: '40px', 
                                    padding: '4px' 
                                }}>
                                <SearchIcon 
                                    className="text-[24px]" 
                                />
                            </Button>

                            <Button 
                                sx={{ 
                                    minWidth: '40px', 
                                    padding: '4px' 
                                }}
                            >
                                <MoreVertIcon 
                                    className="text-[24px]" 
                                />
                            </Button>
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
    )
}

// 51547B