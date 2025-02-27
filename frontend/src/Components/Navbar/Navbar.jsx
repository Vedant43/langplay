import { Container } from "../container/Container"
import MovieIcon from '@mui/icons-material/Movie'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import { Link } from "react-router-dom"

export const Navbar = () => {

    return (
        <header className="fixed top-0 w-full h-16 border border-b-slate-300 bg-white shadow-md z-50">
            <Container className="">
                <nav className="flex items-center justify-between px-4 py-2">
                    {/* Left section */}
                    <div className="flex items-center ">    
                        <div className="">
                            {/* <div className="flex items-center justify-center"> */}
                            <Link>
                                <MovieIcon sx={{fontSize: 42, color:"black"}} />
                            </Link>
                            {/* </div> */}
                        </div>
                        <div>
                            <h1 className="text-xl px-2 font-bold text-slate-900">NeoTube</h1>
                        </div>
                    </div>

                    {/* Middle section */}
                    <div className="w-1/2 flex items-center justify-between">
                        <div className="flex w-full">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full h-10 text-black px-4 rounded-l-full border focus:outline-none border-[#a9a9a9] placeholder:text-base"
                            />
                            <div className="w-16 h-10 flex items-center justify-center border border-[#a9a9a9] rounded-r-full bg-zinc-200 cursor-pointer">  
                                <SearchIcon className="text-slate-500 text-[28px]" />
                            </div>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center justify-center gap-2">
                        <div className="">
                            <Button 
                                variant="text" 
                                sx={{color:"black", borderRadius:2, ":hover": {
                                    background:"rgba(0, 0, 0, 0.1)"
                                }}} 
                            >
                                Log in
                            </Button>
                        </div>
                        <div>
                            <Button 
                                variant="contained" 
                                sx={{borderRadius: 2, backgroundColor:"black" , fontSize:12, width:80, paddingX:0}}
                            >
                                Sign up 
                            </Button>
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
    )
}