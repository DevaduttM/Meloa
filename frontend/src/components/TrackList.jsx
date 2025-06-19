import React, { use, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { currentTrackContext, GenreScreenContext, PlayFromPlaylistContext, PlaylistContext } from "@/context/PlayerContext";
import { PlayerContext } from "@/context/PlayerContext";
import Lottie from "lottie-react";
import animationFile from "@/assets/play_animation.json";
import { AnimatePresence, motion } from "framer-motion";
import { handleFetchAudio } from "@/utils/apicalls";


const TrackList = ({ width, data, index }) => {
  const track = useContext(currentTrackContext);
  const player = useContext(PlayerContext);
  const playlstOpenCtx = useContext(PlaylistContext);
  const playfromplst = useContext(PlayFromPlaylistContext);
  const genrectx = useContext(GenreScreenContext);

  useEffect(() => {
    // console.log("TrackList data:", data);
    // console.log("Current track context:", track);
  }, [data, track]);

  const handleTrackClick = () => {
    if( genrectx.openGenre || playlstOpenCtx.openPlaylistScreen ){
      playfromplst.setPlayingFromPlaylist(true);
      const trackIndex = playfromplst.playlistSongs.findIndex(
        (track) => track.id === data.id
      );
      player.setPlaying(false);
      track.setCurrentTrack(prev => [...prev, playfromplst.playlistSongs[trackIndex]]);
      track.setCurrentIndex(prev => prev + 1 );
      playfromplst.setPlaylistIndex(trackIndex);
      player.setPlayerOpen(true);
      player.setPlaying(true);
      handleFetchAudio(data, track, player);
    }
    else{
      playfromplst.setPlayingFromPlaylist(false);
      player.setPlaying(false);
      track.setCurrentTrack(prev => [...prev, data]);
      track.setCurrentIndex(prev => prev + 1 );
      player.setPlayerOpen(true);
      player.setPlaying(true);
      console.log("Setting current track to:", data);
      handleFetchAudio(data, track, player);
  
      setTimeout(() => {
        console.log("Track context after setting:", track);
      }, 100);
    }
  };



  return (
    <>
      <div
        onClick={handleTrackClick}
        className={`flex items-center justify-start gap-3 ${width}`}
      >
        <div className="relative h-15 w-15 flex-shrink-0">
          <Image
            src={data.thumbnail || "/logo_img_only.png"}
            alt="Track Cover"
            fill
            className="rounded-lg object-cover bg-[#1f1f1f] shadow-lg"
          />
          <AnimatePresence>
            {track.currentTrack?.[track?.currentIndex]?.id === data.id &&
            player.playerOpen &&
            player.playing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex justify-center items-center bg-[#0000003a] bg-opacity-50 rounded-lg"
              >
                <Lottie
                  animationData={animationFile}
                  loop
                  autoplay
                  style={{ width: "50%", height: "50%" }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-md font-syne track-title">
            {data.title.split(/[\(\[\|]/)[0].trim() || "Track Title"}
          </h1>
          <h2 className="text-gray-400 text-sm font-syne track-channel">
            {data.channel || "Channel Name"}
          </h2>
        </div>
      </div>
    </>
  );
};

export default TrackList;
