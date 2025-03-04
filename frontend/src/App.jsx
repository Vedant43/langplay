import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import avatar from "../src/assets/default-avatar.jpg"
import { Toaster } from 'react-hot-toast'
import { Layout } from "./Components/layout/Layout"
import { HomePage } from "./pages/HomePage.jsx"
import { SignUp } from "./pages/SignUp.jsx"
import { SignIn } from "./pages/SignIn.jsx"
import { setUser } from "./Components/redux/features/authSlice.js"
import UserApi from "../src/api/user.js"
function App() {

  const dispatch = useDispatch()

  // useEffect(() => {
  //   async function fetchProfileInfo() {
  //     const accessToken = localStorage.getItem("accessToken")
  //     if (accessToken) {
  //         const response = await axios.get("http://localhost:3000/api/v1/user/profile-info", {headers: { Authorization: `Bearer ${accessToken}` }},)
  //         console.log(response.data.data)
  //         dispatch(setUser(response.data.data))
  //     }
  //   } 
  //   fetchProfileInfo()
  //   }, [])

  useEffect( () => {
      const accessToken = localStorage.getItem("accessToken")

      if (accessToken){

        UserApi.fetchProfileInfo()
        .then((response) => {

          let channelName = response.channelName
          let profilePicture = response.profilePicture

          if (!profilePicture) profilePicture = avatar
          dispatch(setUser({profilePicture, channelName}))

        })
        .catch((error) => console.log(error))
      }
  
  }, [])

  return (
    <div className="font-poppins">
      <BrowserRouter>
        <Toaster
            position="bottom-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: '',
              duration: 5000,
              removeDelay: 1000,
              style: {
                background: '#363636',
                color: '#fff',
              },

            success: {
              duration: 3000,
              iconTheme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            }}
        />
        <Routes>
          <Route element={<Layout />} >
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/signin" element={<SignIn />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

// Header can be fixed in app but then we will not get different layout for different page