import React, { useEffect, useState } from "react";
import { Container } from "../container/Container";
import { PlaylistCard } from "./PlaylistCard";
import { PlaylistItem } from "./PlaylistItem";
import { useParams } from "react-router-dom";
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
      dispatch(setSelectedPlaylist(existingPlaylist))
    } else {
      dispatch(fetchPlaylistById(playlistId))
    }

  }, [playlistId, playlists,])
  
  return (
    <Container className="w-full grid h-[calc(100vh-4rem)] pt-6 grid-cols-10">
      <div className="h-1/2 m-2 bg-black rounded-xl col-span-5">
        <PlaylistCard
          name={selectedPlaylist?.playlist?.name}
          thumbnail={selectedPlaylist?.playlist?.videos?.length > 0 ? selectedPlaylist?.playlist?.videos[0]?.Video?.thumbnailUrl : "https://files.oaiusercontent.com/file-XyrNh4QissLuMHC6affsyZ?se=2025-03-17T06%3A36%3A14Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D299%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dimage.png&sig=I05CtTv1Ttjjkx6LkaTp5FqVLIVgl3yPG5k1Af98B0A%3D"}
          count={selectedPlaylist?.count}
          time={selectedPlaylist?.playlist?.createdAt}
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
