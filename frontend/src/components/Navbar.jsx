"use client";
import React, { useEffect, useState } from "react";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { RiSearch2Line, RiSearch2Fill } from "react-icons/ri";
import { MdVideoLibrary, MdOutlineVideoLibrary } from "react-icons/md";
import HomeScreen from "./HomeScreen";
import SearchScreen from "./SearchScreen";
import LibraryScreen from "./LibraryScreen";
import { motion } from "framer-motion";
import BottomPlayer from "./BottomPlayer";
import HomeScreenShimmer from "./HomeScreenShimmer";
import { PlayerContext, currentTrackContext } from "@/context/PlayerContext";
import Image from "next/image";
import { FaRegCircleUser } from "react-icons/fa6";

const Navbar = () => {
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [chunks, setChunks] = useState([]);

  useEffect(() => {
    const handleTrendingSearch = async () => {
      try {
        const responseWorld = await fetch(
          "/api/playlist?id=PLFcGX84jKOu7fnNxRpajpvs-Zk3Za41ul"
        );
        const dataWorld = await responseWorld.json();
        const responseMal = await fetch(
          "/api/playlist?id=PL4QNnZJr8sRPEJPqe7jZnsLPTBu1E3nIY"
        );
        const dataMal = await responseMal.json();
        console.log("Trending data World:", dataWorld);
        console.log("Trending data Malayalam:", dataMal);
        setTrendingSongs([...dataWorld.results || [], ...dataMal.results || []]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      }
    }

    handleTrendingSearch();
  }, []);

    function getShuffledArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

    useEffect(() => {
const chunkArray = (arr, size) => {
    const shuffledTrending = getShuffledArray(trendingSongs);
    const trending_grouped = [];
    for (let i = 0; i < shuffledTrending.length; i += size) {
      console.log(shuffledTrending.slice(i, i + size));
      trending_grouped.push(shuffledTrending.slice(i, i + size));
    }
    console.log("Chunked Trending Songs:", trending_grouped);
    return trending_grouped;
  };
  const chunks = chunkArray(trendingSongs, 3);
  setChunks(chunks);
}, [trendingSongs]);

  return (
    <>
      <PlayerContext.Provider
        value={{ playing, setPlaying, playerOpen, setPlayerOpen }}
      >
        <currentTrackContext.Provider value={{currentTrack, setCurrentTrack, audioUrl, setAudioUrl}}> 
        <div className="h-screen w-screen flex justify-center flex-col items-center bg-[#171717]">
          {page === "home" && loading ? (
            <HomeScreenShimmer />
          ) : page === "home" ? (
            <HomeScreen trendingSongs={chunks} />
          ) : page === "search" ? (
            <SearchScreen />
          ) : page === "library" ? (
            <LibraryScreen />
          ) : null}
          <div className="fixed bottom-0 w-full h-[7%] bg-gradient-to-t from-black to-[#00000052] backdrop-blur-lg flex items-center justify-around px-10">
            <div
              onClick={() => setPage("home")}
              className="flex h-full items-center justify-center flex-col"
            >
              {page === "home" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AiFillHome
                    className={`text-xl ${
                      page === "home" ? "text-[#27df6a]" : "white"
                    }`}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AiOutlineHome className={`text-xl text-white`} />
                </motion.div>
              )}
              <span
                className={`font-syne transition-colors duration-200 text-xs ${
                  page === "home" ? "text-[#27df6a]" : "white"
                }`}
              >
                Home
              </span>
            </div>
            <div
              onClick={() => setPage("search")}
              className="flex h-full items-center justify-center flex-col"
            >
              {page === "search" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <RiSearch2Fill
                    className={`text-xl ${
                      page === "search" ? "text-[#27df6a]" : "white"
                    } `}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <RiSearch2Line className={`text-xl text-white`} />
                </motion.div>
              )}
              <span
                className={`font-syne transition-colors duration-200 text-xs ${
                  page === "search" ? "text-[#27df6a]" : "white"
                }`}
              >
                Search
              </span>
            </div>
            <div
              onClick={() => setPage("library")}
              className="flex h-full items-center justify-center flex-col"
            >
              {page === "library" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdVideoLibrary
                    className={`text-xl ${
                      page === "library" ? "text-[#27df6a]" : "white"
                    }`}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdOutlineVideoLibrary className={`text-xl text-white`} />
                </motion.div>
              )}
              <span
                className={`font-syne transition-colors duration-200 text-xs ${
                  page === "library" ? "text-[#27df6a]" : "white"
                }`}
              >
                Library
              </span>
            </div>
          </div>
        </div>
        {
          <div className="fixed bottom-20 w-full flex justify-center items-center right-0">
            {playerOpen && <BottomPlayer />}
          </div>
        }
        </currentTrackContext.Provider>
      </PlayerContext.Provider>
    </>
  );
};

export default Navbar;
