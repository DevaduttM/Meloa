import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { FaRegCircleUser } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { IoListOutline } from "react-icons/io5";
import { PiSquaresFourLight } from "react-icons/pi";
import PlaylistScreen from "./PlaylistScreen";
import { GenreScreenContext, PlaylistContext, UserDetailsContext, PlayFromPlaylistContext } from "@/context/PlayerContext";
import { fetchPlaylists } from "@/lib/firestore";
import { db } from "@/lib/firebase";


const LibraryScreen = () => {
  const [layout, setLayout] = useState("list");
  const [openPlaylistScreen, setOpenPlaylistScreen] = useState(false);
  const [availablePlaylists, setAvailablePlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [likedSongsPlaylist, setLikedSongsPlaylist] = useState(false);
  const [playlistIndex, setPlaylistIndex] = useState(0);

    const playfromplstctx = useContext(PlayFromPlaylistContext);
    const dbUserDetails = useContext(UserDetailsContext)

  const userContext = useContext(UserDetailsContext)
  useEffect(() => {
    const handlePopState = (event) => {
      if (openPlaylistScreen) {
        setOpenPlaylistScreen(false);
      }
    };
      window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [openPlaylistScreen]);

  useEffect(() => {
    const loadPlaylists = async () => {
      const playlists = await fetchPlaylists(userContext.userDetails);
      setAvailablePlaylists(playlists);
    };
    loadPlaylists();
  }, [userContext.userDetails]);

  console.log("Available Playlists:", dbUserDetails?.userDetails.playlists);

  return (
    <>
    <PlaylistContext.Provider
      value={{ openPlaylistScreen, setOpenPlaylistScreen }}
    >
      <GenreScreenContext.Provider
        value={{ openGenre: false, setOpenGenre: () => {} }}
      >
      <AnimatePresence>
        <div className="h-screen w-screen flex justify-start items-center bg-[#171717] flex-col relative overflow-x-hidden overflow-y-scroll scrollbar-hide">
          <div className="top-0 w-full flex justify-between px-3 pt-7 items-center">
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
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full flex justify-center items-center flex-col"
          >
            <div className="h-full w-full flex justify-start items-center flex-col">
              <h1 className="text-white text-3xl w-full font-syne mt-8 px-8">
                Your Library
              </h1>
              <hr className="border-[#4e4e4ea8] w-[95%] my-5" />
              <div className="w-full flex justify-between items-center pr-5">
                <h1 className="text-[#a3a3a3] text-lg w-full font-syne px-8">
                  Playlists
                </h1>
                <button
                  className="text-2xl"
                  onClick={() => setLayout(layout === "list" ? "grid" : "list")}
                >
                  {layout === "list" ? (
                    <PiSquaresFourLight />
                  ) : (
                    <IoListOutline />
                  )}
                </button>
              </div>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`h-full w-full p-5 ${
                    layout === "list"
                      ? "flex flex-col justify-start items-start"
                      : "grid grid-cols-3 gap-5 place-items-start"
                  } pb-30`}
                >
                  <div
                      onClick={() => {setLikedSongsPlaylist(true); setSelectedPlaylist(userContext.likedSongs); setOpenPlaylistScreen(true); window.history.pushState(null, ""); playfromplstctx.setPlaylistSongs(userContext.likedSongs)}}
                      className={`${
                        layout === "list"
                          ? "flex items-center gap-3 mb-5 justify-start w-full"
                          : "flex flex-col items-center justify-center"
                      } `}
                    >
                      <Image
                        src="/liked_cover.jpg"
                        alt="Playlist Cover"
                        width={50}
                        height={50}
                        className={`bg-[#1f1f1f] rounded-lg ${
                          layout === "list" ? "h-15 w-15" : "h-24 w-24"
                        } `}
                      />
                      <div
                        className={`h-full w-fit flex flex-col ${
                          layout === "list"
                            ? "items-start justify-center"
                            : "items-center justify-start pt-2"
                        }`}
                      >
                        <h1 className="text-white text-lg font-syne">
                          Liked Songs
                        </h1>
                        <h1 className="text-[#a3a3a3] text-sm font-syne">
                          {userContext.likedSongs.length} Songs
                        </h1>
                      </div>
                    </div>

                  { availablePlaylists.length > 0 ? (
                  availablePlaylists.map((playlist, index) => (
                    <div
                      onClick={() => {setLikedSongsPlaylist(false); setSelectedPlaylist(playlist); setOpenPlaylistScreen(true); window.history.pushState(null, ""); playfromplstctx.setPlaylistSongs(playlist.songs); setPlaylistIndex(index)}}
                      className={`${
                        layout === "list"
                          ? "flex items-center gap-3 mb-5 justify-start w-full"
                          : "flex flex-col items-center justify-center"
                      } `}
                      key={index}
                    >
                      <Image
                        src={dbUserDetails?.userDetails?.playlists.find((p) => p.id === playlist.id)?.coverUrl || "/logo_img_only.png"}
                        alt="Playlist Cover"
                        width={50}
                        height={50}
                        className={`bg-[#1f1f1f] rounded-lg ${
                          layout === "list" ? "h-15 w-15" : "h-24 w-24 p-5"
                        } `}
                      />
                      <div
                        className={`h-full w-fit flex flex-col ${
                          layout === "list"
                            ? "items-start justify-center"
                            : "items-center justify-start pt-2"
                        }`}
                      >
                        <h1 className="text-white text-lg font-syne">
                          {playlist.name}
                        </h1>
                        <h1 className="text-[#a3a3a3] text-sm font-syne">
                          {playlist.songs.length} Songs
                        </h1>
                      </div>
                    </div>
                  ))) : (
                    <div className="w-full h-full flex justify-center items-center">
                      <h1 className="text-gray-500 text-lg font-syne">
                        No Playlists Available
                      </h1>
                      </div>
                      )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
      <AnimatePresence>
      {
        openPlaylistScreen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className=""><PlaylistScreen playlists = {selectedPlaylist} liked={likedSongsPlaylist} index={playlistIndex}/></motion.div>
      }
      </AnimatePresence>
      </GenreScreenContext.Provider>
    </PlaylistContext.Provider>
    </>

  );
};

export default LibraryScreen;
