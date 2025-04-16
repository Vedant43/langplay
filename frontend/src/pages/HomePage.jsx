import { useEffect, useState } from "react";
import { PlaylistCard } from "../Components/Playlist/PlaylistCard";
import VideoApi from "../api/VideoApi";
import { VideoCard } from "../Components/Video Card/VideoCard";
import { useDispatch } from "react-redux";
import { fetchPlaylists } from "./../Components/redux/features/playlistSlice";
// import { setPlaylists } from "./../Components/redux/features/playlistSlice";

  export const HomeFeed = () => {
    const [videos, setVideos] = useState([]);
    const [userCreatedPlaylists, setUserCreatedPlaylists] = useState([]);
    const [youtubePlaylists, setYoutubePlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
  
    useEffect(() => {
      const fetchFeed = async () => {
        try {
          const response = await VideoApi.fetchHomeFeed();
          console.log("Home feed:", response);
    
          setVideos(response.storedVideos || []);
    
          const formattedUserPlaylists = (response.storedPlaylists || [])
            .filter((playlist) => playlist.type === "USER_CREATED")
            .map((playlist) => ({
              ...playlist,
              count: playlist._count?.videos || 0,
            }));
    
          const formattedYoutubePlaylists = (response.storedPlaylists || [])
            .filter((playlist) => playlist.type === "YOUTUBE")
            .map((playlist) => ({
              ...playlist,
              count: playlist._count?.videos || 0,
            }));
    
          setUserCreatedPlaylists(formattedUserPlaylists);
          setYoutubePlaylists(formattedYoutubePlaylists);
    
          // Optional: update Redux manually using the working data
          // dispatch(setPlaylists([...formattedUserPlaylists, ...formattedYoutubePlaylists]));
        } catch (error) {
          console.error("Error fetching feed:", error.response?.data || error.message);
          setError("Failed to load feed. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchFeed();
    }, [dispatch]);

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      {userCreatedPlaylists.length > 0 && (
        <>
          <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userCreatedPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                name={playlist.name}
                thumbnail={playlist.thumbnailUrl}
                count={playlist.count}
                time={playlist.createdAt}
                id={playlist.id}
              />
            ))}
          </div>
        </>
      )}

      {youtubePlaylists.length > 0 && (
        <>
          <h1 className="text-2xl font-bold mt-6 mb-4">Recommended Playlists</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {youtubePlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                name={playlist.name}
                thumbnail={playlist.thumbnailUrl}
                count={playlist.count}
                time={playlist.createdAt}
                id={playlist.id}
              />
            ))}
          </div>
        </>
      )}

      <h1 className="text-2xl font-bold mt-6 mb-4">Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            source={video.source}
            id={video.id}
            thumbnail={video.thumbnailUrl || video.thumbnail}
            title={video.title}
            channelName={video.channelName || null}
            userProfilePicture={video.userProfilePicture}
            views={video.views || "0"}
            duration={video.duration || "0:00"}
            createdAt={video.createdAt || new Date().toISOString()}
          />
        ))}
      </div>
    </div>
  );
};