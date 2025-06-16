import React, { useState, useContext } from "react";
import Image from "next/image";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { PiRewindFill, PiFastForwardFill, PiRepeatLight } from "react-icons/pi";
import { RiPlayListAddFill } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { PiShuffleFill } from "react-icons/pi";
import { PlaylistContext } from "@/context/PlayerContext";
import { PlayerContext } from "@/context/PlayerContext";
import BottomPlayer from "./BottomPlayer";
import TrackList from "./TrackList";

const PlaylistScreen = () => {
  const [like, setLike] = useState(false);
  const [playlistScreen, setPlaylistScreen] = useState(false);

  const playlistctx = useContext(PlaylistContext);
  const playerctx = useContext(PlayerContext);

  return (
    <>
      <div className="z-50 min-h-screen w-screen bg-[#171717] flex flex-col fixed top-0 left-0">
          <IoArrowBack
            onClick={() => playlistctx.setOpenPlaylistScreen(false)}
            className="fixed top-7 z-60 left-5 text-4xl text-white"
          />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-screen h-screen bg-[url('/rock_cover.jpg')] bg-cover bg-center z-50 flex justify-center items-center"
        >
          <div className="bg-gradient-to-b from-[#1f1f1f57] to-[#171717] w-screen h-screen backdrop-blur-[15px] flex flex-col justify-start items-center overflow-y-scroll scrollbar-hide">
            <Image
              src="/rock_cover.jpg"
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg mb-10 mt-30 w-1/2 aspect-square shadow-[10px]"
            />
            <h1 className="text-white text-3xl font-syne mb-15">
              Playlist Name
            </h1>

            <div className="w-[80%] flex justify-around items-center">
              <button className="text-[#27df6a] text-2xl shadow-2xl flex justify-center items-center py-3 bg-[#8d8d8d31] backdrop-blur-lg border-none outline-none p-3 rounded-lg w-45">
                <FaPlay />
                <span className="ml-4 text-xl text-[#ffffffe0] font-syne">
                  Play
                </span>
              </button>
              <button className="text-[#27df6a] text-2xl shadow-2xl flex justify-center items-center py-3 bg-[#8d8d8d31] backdrop-blur-lg border-none outline-none p-3 rounded-lg w-45">
                <PiShuffleFill />
                <span className="ml-4 text-xl text-[#ffffffe0] font-syne">
                  Shuffle
                </span>
              </button>
            </div>
            <div className="w-full flex flex-col mt-10 justify-start items-center pb-24">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  onClick={() => {
                    playerctx.setPlayerOpen(true);
                    playerctx.setPlaying(true);
                  }}
                  className="w-[90%] flex justify-start items-center p-2 rounded-lg "
                >
                  <div className="flex justify-center items-center">
                    <h1 className="text-[#ffffffd7] text-2xl font-syne mr-5">{`${
                      index + 1 < 10 ? `0${index + 1}` : index + 1
                    }`}</h1>
                  </div>
                  <TrackList width={"w-full"} data={{ title: `Track Title ${index + 1}`, artist: "Artist Name" }} />
                </div>
              ))}
            </div>
          </div>
            <div className="z-100 w-full flex justify-center items-center mb-5 fixed bottom-0 left-0">
              {playerctx.playerOpen && <BottomPlayer />}
            </div>
        </motion.div>
      </div>
    </>
  );
};

export default PlaylistScreen;
