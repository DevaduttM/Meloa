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
import { PlayerContext, currentTrackContext, PlayFromPlaylistContext, UserDetailsContext } from "@/context/PlayerContext";
import Image from "next/image";
import { FaRegCircleUser } from "react-icons/fa6";
import withAuth from "@/lib/withAuth";
import { getUserDetails, setRecommendedSongs } from "@/lib/firestore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState([]);
  const [audioUrl, setAudioUrl] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playingFromPlaylist, setPlayingFromPlaylist] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [chunks2, setChunks2] = useState([]);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    if (!user) {
      router.replace("/signin");
      return;
    }
  }, []);

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
        // console.log("Trending data World:", dataWorld);
        // console.log("Trending data Malayalam:", dataMal);
        setTrendingSongs([...dataWorld.results || [], ...dataMal.results || []]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      }
    }

    handleTrendingSearch();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetails = JSON.parse(localStorage.getItem("user"));
      if (!userDetails) {
        console.log("No user details found in localStorage");
      } else {
        const fetchedUserDetails = await getUserDetails(userDetails);
        if (fetchedUserDetails) {
          setUserDetails(fetchedUserDetails);
          setLikedSongs(fetchedUserDetails.likedSongs || []);
          console.log("User details from localStorage:", fetchedUserDetails);
        } else {
          setUserDetails(null);
        }
      }
    };

    fetchUserDetails();
  }, []);

    function getShuffledArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

    useEffect(() => {
const chunkArray = (arr, size) => {
    const trending_grouped = [];
    for (let i = 0; i < arr.length; i += size) {
      console.log(arr.slice(i, i + size));
      trending_grouped.push(arr.slice(i, i + size));
    }
    // console.log("Chunked Trending Songs:", trending_grouped);
    return trending_grouped;
  };
  console.log("Trending Songs Slice:", trendingSongs.slice(0, 10));
  const shuffledTrendingSongs = getShuffledArray(trendingSongs);
  const slicedTrending1 = shuffledTrendingSongs.slice(0, 10);
  const slicedTrending2 = shuffledTrendingSongs.slice(10, 20);
  const chunks = chunkArray(slicedTrending1, 3);
  setChunks(chunks);
  if (userDetails?.recommendedSongs?.length > 0) {
    const chunks2 = chunkArray(userDetails?.recommendedSongs, 3);
    setChunks2(chunks2);
  }
  else {
   const chunks2 = chunkArray(slicedTrending2, 3);
    setChunks2(chunks2);
    addRecommendedSongs(slicedTrending2);
  }
}, [trendingSongs]);

const addRecommendedSongs = async (songs) => {
  if (!userDetails) return;

  try {
    await setRecommendedSongs(userDetails, songs);
  } catch (error) {
    console.error("Error adding recommended songs:", error);
  }
};

  return (
    <>
      <PlayerContext.Provider
        value={{ playing, setPlaying, playerOpen, setPlayerOpen }}
      >
        <currentTrackContext.Provider value={{currentTrack, setCurrentTrack, audioUrl, setAudioUrl, currentIndex, setCurrentIndex, loadingAudio, setLoadingAudio}}>
        <PlayFromPlaylistContext.Provider value={{playingFromPlaylist, setPlayingFromPlaylist, playlistSongs, setPlaylistSongs, playlistIndex, setPlaylistIndex}}>
          <UserDetailsContext.Provider value={{userDetails, setUserDetails, likedSongs, setLikedSongs}}>
        <div className="h-screen w-screen flex justify-center flex-col items-center bg-[#171717]">
          {page === "home" && loading ? (
            <HomeScreenShimmer />
          ) : page === "home" ? (
            <HomeScreen trendingSongs={chunks} recommendedSongs={chunks2} />
          ) : page === "search" ? (
            <SearchScreen />
          ) : page === "library" ? (
            <LibraryScreen />
          ) : null}
          <div className="fixed bottom-0 w-full h-[7%] bg-gradient-to-t from-black to-[#00000052] backdrop-blur-lg flex items-center justify-around px-10">
            <div
              onClick={() => setPage("home")}
              className="flex h-full items-center justify-center flex-col cursor-pointer"
            >
              {page === "home" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AiFillHome
                    className={`nav-icons text-xl ${
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
                  <AiOutlineHome className={`nav-icons text-xl text-white`} />
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
              className="flex h-full items-center justify-center flex-col cursor-pointer"
            >
              {page === "search" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <RiSearch2Fill
                    className={`nav-icons text-xl ${
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
                  <RiSearch2Line className={`nav-icons text-xl text-white`} />
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
              className="flex h-full items-center justify-center flex-col cursor-pointer"
            >
              {page === "library" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdVideoLibrary
                    className={`text-xl nav-icons ${
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
                  <MdOutlineVideoLibrary className={`nav-icons text-xl text-white`} />
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
          <div className="fixed bottom-[7.4%] w-full flex justify-center items-center right-0">
            {playerOpen && <BottomPlayer />}
          </div>
        }
        </UserDetailsContext.Provider>
        </PlayFromPlaylistContext.Provider>
        </currentTrackContext.Provider>
      </PlayerContext.Provider>
    </>
  );
};

export default Navbar;
