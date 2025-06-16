import React, { use, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { currentTrackContext } from "@/context/PlayerContext";
import { PlayerContext } from "@/context/PlayerContext";
import Lottie from "lottie-react";
import animationFile  from "@/assets/play_animation.json";
import { AnimatePresence, motion } from "framer-motion";

const TrackList = ({ width, data }) => {
  const track = useContext(currentTrackContext);
  const player = useContext(PlayerContext);

  useEffect(() => {
    console.log("TrackList data:", data);
    console.log("Current track context:", track);
  }, [data, track]);

  const handleTrackClick = () => {
    console.log("Setting current track to:", data);
    track.setCurrentTrack(data);
    player.setPlayerOpen(true);
    player.setPlaying(true);
    handleFetchAudio();

    setTimeout(() => {
      console.log("Track context after setting:", track);
    }, 100);
  };

  const handleFetchAudio = async () => {
    try {
      const response = await fetch(`http://localhost:5000/audio?id=${data.id}`);
      const audioData = await response.json();
      console.log("Audio data fetched:", audioData);
      if (audioData && audioData.audioUrl) {
        track.setAudioUrl(audioData.audioUrl);
        console.log("Audio URL set:", audioData.audioUrl);
      } else {
        console.error("No audio URL found in response");
      }
    } catch (error) {
      console.error("Error fetching audio data:", error);
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
          {
            track.currentTrack?.id === data.id && player.playerOpen && player.playing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex justify-center items-center bg-[#0000003a] bg-opacity-50 rounded-lg">
                <Lottie
                  animationData={animationFile}
                  loop
                  autoplay
                  style={{ width: "50%", height: "50%" }}
                />
              </motion.div>
            ) : null
          }
            </AnimatePresence>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-md font-syne">
            {data.title || "Track Title"}
          </h1>
          <h2 className="text-gray-400 text-sm font-syne">
            {data.channel || "Channel Name"}
          </h2>
        </div>
      </div>
    </>
  );
};

export default TrackList;
