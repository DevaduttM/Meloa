import React, { createContext, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";
import { PlayerContext, GenreScreenContext, currentTrackContext, PlaylistContext, AccountScreenOpenContext, UserDetailsContext } from "@/context/PlayerContext";
import TrackList from "./TrackList";
import { handleFetchAudio } from "@/utils/apicalls";
import PlaylistScreen from "./PlaylistScreen";
import GenreScreen from "./GenreScreen";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";
import AccountScreen from "./AccountScreen";
import MessageBox from "./MessageBox";

const HomeScreen = ({trendingSongs, recommendedSongs}) => {
  const [shuffledGenres, setShuffledGenres] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [openGenre, setOpenGenre] = useState(false);
  const [genreScreenDetails, setGenreScreenDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [accountScreenOpen, setAccountScreenOpen] = useState(false);

  const player = useContext(PlayerContext);
  const track = useContext(currentTrackContext);
  const dbUserDetails = useContext(UserDetailsContext)

  const router = useRouter();

  console.log("dbuserDetails",dbUserDetails)
    console.log("loading audio: ", track.loadingAudio);

  const genreDetails = [
    {
      name: "Pop",
      image: "/pop_cover.jpg",
      gradientFrom: "#EC4899",
      gradientTo: "#8B5CF6",
      id: "PLplXQ2cg9B_qrCVd1J_iId5SvP8Kf_BfS"
    },
    {
      name: "Hip-Hop",
      image: "/hiphop_cover.jpg",
      gradientFrom: "#1F2937",
      gradientTo: "#F59E0B",
      id: "PL3-sRm8xAzY-556lOpSGH6wVzyofoGpzU"
    },
    {
      name: "Rock",
      image: "/rock_cover.jpg",
      gradientFrom: "#B91C1C",
      gradientTo: "#000000",
      id: "PLVQ7g3e6O27cH8KG9mktLWH8zcqiwTntP"
    },
    {
      name: "Electronic",
      image: "/edm_cover.jpg",
      gradientFrom: "#22D3EE",
      gradientTo: "#2563EB",
      id: "PLQdn7YisXz3Nzy1sgAMMXA8P4Qd-RMGL7"
    },
    {
      name: "Bollywood",
      image: "/bollywood_cover.jpg",
      gradientFrom: "#FCD34D",
      gradientTo: "#D97706",
      id: "PL9bw4S5ePsEEqCMJSiYZ-KTtEjzVy0YvK"
    },
    {
      name: "Classical",
      image: "/classical_cover.jpg",
      gradientFrom: "#D1D5DB",
      gradientTo: "#6B7280",
      id: "PLO_1AmtK1TMRi01-V_tdHKDLBu7cNWIgf"
    },
  ];

  useEffect(() => {
    try{
      const userDetails = JSON.parse(window.localStorage.getItem("user"));
      setUserDetails(userDetails);
    }
    catch (error) {
      console.error("Error parsing user details:", error);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (openGenre) {
        setOpenGenre(false);
      }
    };
      window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [openGenre]);

    

  // useEffect(() => {
  //   const shuffledGenre = getShuffledArray(genreDetails);
  //   setShuffledGenres(shuffledGenre);
  // }, [null]);

  // function getShuffledArray(array) {
  //   return [...array].sort(() => Math.random() - 0.5);
  // }

  // console.log("Trending Songs:", trendingSongs);

  useEffect(() => {
    const onPopState = (event) => {
      if (accountScreenOpen) {
        setAccountScreenOpen(false);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [accountScreenOpen]);

  console.log("User Details:", dbUserDetails.userDetails.photoURL);


  return (
    <>
    <GenreScreenContext.Provider value={{ openGenre, setOpenGenre }}>
      <PlaylistContext.Provider value={{ openPlaylistScreen: false, setOpenPlaylistScreen: () => {} }}>
        <AccountScreenOpenContext.Provider value={{ accountScreenOpen, setAccountScreenOpen }}>
      <AnimatePresence>
        <div className="h-screen w-screen flex justify-start items-center bg-[#171717] flex-col relative overflow-x-hidden overflow-y-scroll scrollbar-hide">
          <div className="top-0 w-full flex justify-between px-3 pt-7 items-center md:px-5">
            <div className="w-fit h-full flex justify-center items-center gap-2">
              <Image
                src="/logo_img_only.png"
                alt="Logo"
                width={35}
                height={35}
              />
              <h1 className="text-transparent bg-gradient-to-r from-[#27df6a] to-[#afafaf] bg-clip-text text-3xl font-bold font-syne">
                Meloa
              </h1>
            </div>
            <div onClick={() => {setAccountScreenOpen(true); window.history.pushState({}, null);}} className="w-fit h-full flex justify-center items-center gap-2 cursor-pointer">
              {
                dbUserDetails?.userDetails.photoURL ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src={dbUserDetails.userDetails.photoURL}
                      alt="User Avatar"
                      width={35}
                      height={35}
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <FaRegCircleUser className="text-3xl text-[#27df6a] mr-2" />
                )}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col justify-center items-start mt-10 md:px-6"
          >
            <h1 className="text-white text-2xl pl-6 font-syne">
              Trending Tracks
            </h1>
            <div className="w-full pl-6 py-8 flex flex-row justify-start items-center overflow-x-scroll scrollbar-hide">
              {trendingSongs.map((chunk, outerIndex) => (
                <div
                  key={outerIndex}
                  className="home-trending min-w-[65vw] md:min-w-[35vw] xl:min-w-[25vw] flex-col gap-5 h-full flex justify-between items-center mr-4"
                >
                  {chunk.map((item, index) => (
                    <div
                      key={index}
                      className="w-full h-full flex justify-between items-start mb-3"
                    >
                      <TrackList
                        data={item}
                        width="w-full"
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <h1 className="text-white pl-6 text-2xl font-syne">
              Popular Genres
            </h1>
            <div className="relative w-full grid grid-cols-2 grid-rows-3 md:grid-cols-6 md:grid-rows-1 gap-4 pl-3 pr-5 mt-8">
              {genreDetails.map((genre, index) => (
                <div
                onClick={() => {setOpenGenre(true); window.history.pushState({}, null); setGenreScreenDetails(genre);}}
                  key={index}
                  className="relative rounded-lg h-25 md:h-[10vw] w-full m-1 flex justify-center items-center overflow-hidden cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${genre.gradientFrom}, ${genre.gradientTo})`,
                  }}
                >
                  <Image
                    src={genre.image}
                    alt={genre.name}
                    width={50}
                    height={50}
                    className="absolute -right-4 -bottom-4 rounded-sm h-16 w-16 md:w-18 xl:h-25 md:h-18 xl:w-25 object-cover -rotate-45"
                  />
                  <h2 className="text-white text-lg font-syne z-2">{genre.name}</h2>
                  
                </div>
              ))}
            </div>

            <h1 className="text-white pl-6 text-2xl mt-10 font-syne">
              Recommended For You
            </h1>
            <div className={`w-full pl-6 py-8 flex flex-row justify-start items-center overflow-x-scroll scrollbar-hide ${player.playerOpen ? "pb-40" : "pb-30"}`}>
              {recommendedSongs.map((chunk, outerIndex) => (
                <div
                  key={outerIndex}
                  className="home-trending min-w-[65vw] md:min-w-[35vw] xl:min-w-[25vw] flex-col gap-5 h-full flex justify-between items-center mr-4"
                >
                  {chunk.map((item, index) => (
                    <div
                      key={index}
                      className="w-full h-full flex justify-between items-start mb-3"
                    >
                      <TrackList
                        data={item}
                        width="w-full"
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
      <AnimatePresence>
      {
                    openGenre ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className=""><GenreScreen data={genreScreenDetails} /></motion.div>
                    ) : null
                  }
      </AnimatePresence>

      <AnimatePresence>
      {
                    accountScreenOpen ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className=""><AccountScreen /></motion.div>
                    ) : null
                  }
      </AnimatePresence>

      </AccountScreenOpenContext.Provider>
      </PlaylistContext.Provider>
      </GenreScreenContext.Provider >
    </>
  );
};

export default HomeScreen;
