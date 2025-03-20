import React, { useEffect, useState } from "react";
import { Container } from "../container/Container";
import { PlaylistCard } from "./PlaylistCard";
import { PlaylistItem } from "./PlaylistItem";
import placeholder from "../../assets/placeholder.png"
import { fetchPlaylistById } from "../redux/features/playlistSlice";
import { setSelectedPlaylist } from "../redux/features/playlistSlice";
import { useDispatch, useSelector } from "react-redux";

export const Playlist = ( {playlistId} ) => {
  const { playlists, selectedPlaylist } = useSelector((state) => state.playlist)
  const { channelName } = useSelector((state) => state.auth)
  // const { playlistId } = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    const existingPlaylist = playlists.find((p) => p.id === Number(playlistId));

    if (existingPlaylist) {
      console.log("In if")
      dispatch(setSelectedPlaylist(existingPlaylist))
    } else {
      console.log("In else")
      dispatch(fetchPlaylistById(playlistId))
    }

  }, [playlistId, playlists,])

  useEffect( () => {
    console.log("Selected playlist from history--", selectedPlaylist)
  }, [selectedPlaylist])
  
  return (
    <Container className="w-full grid h-[calc(100vh-4rem)] pt-6 grid-cols-10">
      <div className="h-1/2 m-2 bg-black rounded-xl col-span-5"> 
        <PlaylistCard
          name={selectedPlaylist?.name}
          thumbnail={selectedPlaylist?.videos?.length > 0 ? selectedPlaylist?.videos[0]?.Video?.thumbnailUrl : placeholder}
          count={selectedPlaylist?.videos?.length}
          time={selectedPlaylist?.createdAt}
        />
      </div>
      <div className="m-3 my-4 col-span-5">
        {selectedPlaylist?.playlist?.videos?.length > 0 &&
          selectedPlaylist.playlist.videos.map((playlistItem, index) => (
            <div key={index}>
              <PlaylistItem
                id={playlistItem.Video.id}
                title={playlistItem.Video.title}
                views={playlistItem.Video.views}
                channelName={channelName}
                createdAt={playlistItem.Video.createdAt}
                thumbnailUrl={playlistItem.Video.thumbnailUrl}
                videoUrl={playlistItem.Video.videoUrl}
              />
            </div>
          ))}
      </div>
    </Container>
  );
};
