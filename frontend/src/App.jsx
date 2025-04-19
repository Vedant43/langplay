import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../src/assets/default-avatar.jpg";
import { Toaster } from "react-hot-toast";
import { Layout } from "./Components/layout/Layout";
import {HomeFeed} from "./pages/HomePage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";
import { setUser } from "./Components/redux/features/authSlice.js";
import { fetchPlaylistsIfNeeded } from "./Components/redux/features/playlistSlice.js";
import UserApi from "./api/UserApi.js";
import { VideoPage } from "./pages/VideoPage.jsx";
import ErrorBoundary from "./Components/ErrorBoundary.jsx";
import { HistoryPage } from "./pages/HistoryPage.jsx";
import { PlaylistPage } from "./pages/PlaylistPage.jsx";
import { UploadVideoPage } from "./pages/UploadVideoPage.jsx";
import { SetupProfilePage } from "./pages/ProfileSetupPage.jsx";
import { ProtectedRoutes } from "./utils/ProtectedRoutes.jsx";
import { LikedVideosPage } from "./pages/LikedVideoPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";

function App() {
  const dispatch = useDispatch();
  const { authStatus, id } = useSelector((state) => state.auth);
  const { playlistsLoaded } = useSelector((state) => state.playlist);
  const { playlists } = useSelector((state) => state.playlist);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
  
    if (accessToken) {
      UserApi.fetchProfileInfo()
      .then((response) => {
        if (!response) throw new Error("No profile info returned");
    
        const {
          id,
          username,
          channelName,
          profilePicture,
          coverPicture,
          description,
          subscribers = []
        } = response;
    
        dispatch(setUser({
          id,
          username,
          channelName,
          profilePicture: profilePicture || avatar,
          coverPicture: coverPicture || null,
          description: description || "",
          subscribers: subscribers.length,
        }));
      })
        .catch((error) => console.log("Fetch profile failed:", error));
    }
  }, []);
  

    // useEffect(() => {
    //   console.log("Id in useeffect-------", id)
    //   console.log("Ath in useeffect------------", authStatus)
    // }, [id, authStatus])

  useEffect(() => {
    if (authStatus && !playlistsLoaded) {
      dispatch(fetchPlaylistsIfNeeded());
    }
  }, [authStatus, playlistsLoaded, dispatch]);

  return (
    <div className="font-poppins">
      <ErrorBoundary>
        <BrowserRouter>
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              className: "",
              duration: 5000,
              removeDelay: 1000,
              // style: {
              //   background: '#616494',
              //   color: '#fff',
              // },

              // success: {
              //   duration: 3000,
              //   iconTheme: {
              //     primary: 'green',
              //     secondary: 'black',
              //   },
              // },
            }}
          />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomeFeed />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/video/:videoId" element={<VideoPage />} />
              <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
              <Route path="/playlist/history" element={<HistoryPage />} />
              <Route path="/playlist/liked-videos" element={<LikedVideosPage />} />
              <Route path={`/profile/:userId`} element={<ProfilePage />} />
              <Route element={ <ProtectedRoutes />} >
                <Route path="/upload-video" element={<UploadVideoPage />} />
                <Route path="/profile-update" element={<SetupProfilePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;

// Header can be fixed in app but then we will not get different layout for different page
// user has subscribed channel and he logs out from navbar then still subscibed state is true