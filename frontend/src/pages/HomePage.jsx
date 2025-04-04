import { useEffect, useState } from "react";
import { PlaylistCard } from "../Components/Playlist/PlaylistCard"
import VideoApi from "../api/VideoApi";

export const HomeFeed = () => {
  const [videos, setVideos] = useState([]);
  const [userCreatedPlaylists, setUserCreatedPlaylists] = useState([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (error) {
        console.error("Error fetching feed:", error.response?.data || error.message);
        setError("Failed to load feed. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recommended Playlists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-56 gap-4">
        {/* {userCreatedPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} {...playlist} />
        ))} */}
        {youtubePlaylists.map((playlist) => (
          // {name, thumbnail, count, time, id}
          <PlaylistCard key={playlist.id} name={playlist.name} thumbnail={playlist.thumbnailUrl} count={playlist.count} time={playlist.createdAt} id={playlist.id}/>
        ))}
      </div>

      <h1 className="text-2xl font-bold mt-6 mb-4">Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* {videos.map((video) => (
          <PlaylistCard key={video.id} {...video} />
        ))} */}
      </div>
    </div>
  );
};
