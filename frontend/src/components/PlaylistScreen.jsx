import React, { useState, useContext, useRef } from "react";
import Image from "next/image";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { PiRewindFill, PiFastForwardFill, PiRepeatLight } from "react-icons/pi";
import { RiPlayListAddFill } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { PiShuffleFill } from "react-icons/pi";
import {
  PlaylistContext,
  PlayFromPlaylistContext,
  currentTrackContext,
  UserDetailsContext,
} from "@/context/PlayerContext";
import { PlayerContext } from "@/context/PlayerContext";
import BottomPlayer from "./BottomPlayer";
import TrackList from "./TrackList";
import { handleFetchAudio, uploadToCloudinary } from "@/utils/apicalls";
import { FiEdit3 } from "react-icons/fi";
import { updatePlaylistCover, updatePlaylistName } from "@/lib/firestore";
import MessageBox from "./MessageBox";

const PlaylistScreen = ({ playlists, liked, index }) => {
  const dbUserDetails = useContext(UserDetailsContext);

  console.log(
    "user Details playlist:",
    dbUserDetails.userDetails.playlists[0].id == playlists.id
  );

  const [like, setLike] = useState(false);
  const [playlistScreen, setPlaylistScreen] = useState(false);
  const [uploadScreen, setUploadScreen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [editedPlaylistName, setEditedPlaylistName] = useState(
    playlists.name || "No Name"
  );
  const [edit, setEdit] = useState(false);
  const [playlistCoverURL, setPlaylistCoverURL] = useState(
    dbUserDetails.userDetails.playlists[index].coverUrl || "/logo_img_only.png"
  );
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxMessage, setMessageBoxMessage] = useState("");

  const playlistctx = useContext(PlaylistContext);
  const playerctx = useContext(PlayerContext);
  const plstctx = useContext(PlayFromPlaylistContext);
  const track = useContext(currentTrackContext);
  const player = useContext(PlayerContext);

  const inputRef = useRef(null);

  const fileRef = useRef(null);

  const PlaylistPlay = () => {
    console.log("Playing Playlist");
    plstctx.setPlayingFromPlaylist(true);
    plstctx.setPlaylistSongs(playlists.songs);
    plstctx.setPlaylistIndex(0);
    track.setCurrentTrack((prev) => [...prev, playlists.songs[0]]);
    track.setCurrentIndex((prev) => prev + 1);
    player.setPlayerOpen(true);
    handleFetchAudio(playlists.songs[0], track, player);
    console.log("Playlist:", playlists.songs);
  };

  const shufflePlay = () => {
    console.log("Shuffling Playlist");
    const shuffledPlaylist = [...plstctx.playlistSongs].sort(
      () => Math.random() - 0.5
    );
    plstctx.setPlaylistSongs(shuffledPlaylist);
    plstctx.setPlayingFromPlaylist(true);
    plstctx.setPlaylistIndex(0);
    track.setCurrentTrack((prev) => [...prev, shuffledPlaylist[0]]);
    track.setCurrentIndex((prev) => prev + 1);
    player.setPlayerOpen(true);
    handleFetchAudio(shuffledPlaylist[0], track, player);
    console.log("Shuffled Playlist:", shuffledPlaylist);
  };

    const changePlaylistName = async () => {
        setEdit(false);
        if (editedPlaylistName.trim() === "") {
            setEditedPlaylistName(playlists.name || "No Name");
            alert("Name cannot be empty.");
            return;
          }
          try {
              await updatePlaylistName(dbUserDetails.userDetails, playlists.id, editedPlaylistName);
              dbUserDetails.userDetails.playlists[index].name = editedPlaylistName;
              setShowMessageBox(true);
              setMessageBoxMessage("Playlist name updated successfully");
              setTimeout(() => {
                  setShowMessageBox(false);
              }, 2000);
          } catch (error) {
              console.error("Error updating playlist name:", error);
          }
      };

      const changePlaylistCover = async (e) => {
              console.log("uploading image to Cloudinary...");
            const file = e.target.files[0];
            if (!file) return;
      
            try {
              const url = await uploadToCloudinary(file);
              
              console.log("Cloudinary Response:", url);
              setPlaylistCoverURL(url);
              setUploadScreen(false);
              await updatePlaylistCover(dbUserDetails.userDetails, playlists.id, url);
              if (url) {
                dbUserDetails.userDetails.playlists[index].coverUrl = url;
                setMessageBoxMessage("Playlist cover updated successfully");
                setShowMessageBox(true);
                setTimeout(() => {
                  setShowMessageBox(false);
                }, 2000);
              } else {
                console.error("Failed to upload image to Cloudinary");
              }
            } catch (error) {
              console.error("Error uploading image:", error);
            }
          }

  return (
    <>
      <div
        className="z-0 min-h-screen w-screen bg-[#171717] flex flex-col fixed top-0 left-0"
        onClick={() => {setUploadScreen(false); setEdit(false);}}
      >
        <IoArrowBack
          onClick={() => playlistctx.setOpenPlaylistScreen(false)}
          className="fixed top-7 z-60 left-5 text-4xl text-white"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-screen h-screen bg-cover bg-center z-50 flex justify-center items-center"
          style={
            playlistCoverURL !==
            "/logo_img_only.png"
              ? {
                  backgroundImage: `url(${dbUserDetails.userDetails.playlists[index].coverUrl})`,
                }
              : { backgroundImage: "url('/playlist_default_cover.jpg')" }
          }
        >
          <div className="bg-gradient-to-b from-[#1f1f1f57] to-[#171717] w-screen h-screen backdrop-blur-[15px] flex flex-col justify-start items-center overflow-y-scroll scrollbar-hide">
            <div
              className="relative w-[35vw] aspect-square flex justify-center items-center"
              onClick={(e) => {
                e.stopPropagation();
                setUploadScreen(true);
              }}
            >
              <AnimatePresence>
                {uploadScreen && (
                  <motion.div
                    onClick={() => fileRef.current.click()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0 left-0 w-full aspect-square mt-30 bg-[#000000be] rounded-lg flex justify-center items-center"
                  >
                    <p className="text-white font-syne">Change Picture</p>
                    <input type="file" ref={fileRef} onChange={changePlaylistCover} className="hidden" />
                  </motion.div>
                )}
              </AnimatePresence>
              <Image
                src={
                  liked
                    ? "/liked_cover.jpg"
                    : playlistCoverURL ||
                      "/logo_img_only.png"
                }
                alt="Song Cover"
                width={200}
                height={200}
                className="rounded-lg bg-[#1f1f1f] mb-10 mt-30 w-[35vw] aspect-square shadow-[10px]"
              />
            </div>
            <div onClick={(e) => e.stopPropagation() }className="relative w-fit flex justify-start items-center mb-10">
              <input
                className="text-white text-3xl font-syne w-[80vw] h-10 rounded-lg flex justify-center text-center items-center"
                value={liked ? "Liked Songs" : editedPlaylistName}
                readOnly={!edit}
                onChange={(e) => setEditedPlaylistName(e.target.value)}
                ref={inputRef}
              />
              <AnimatePresence>
                {edit ? (
                  <motion.div
                    key={"save-button"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={changePlaylistName}
                      className={` w-20 h-[75%] absolute right-2 top-1/2 -translate-y-1/2 justify-center items-center bg-[#27df6a] text-black font-syne rounded-lg`}
                    >
                      Save
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={"edit-icon"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className=""
                  >
                    <FiEdit3
                      onClick={(e) => {
                        e.stopPropagation();
                        setEdit(true);
                        inputRef.current.focus();
                      }}
                      className={` z-2 absolute right-3 top-1/2 -translate-1/2`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="w-[80%] flex justify-around items-center">
              <button
                onClick={PlaylistPlay}
                className="text-[#27df6a] text-2xl shadow-2xl flex justify-center items-center py-3 bg-[#8d8d8d31] backdrop-blur-lg border-none outline-none p-3 rounded-lg w-45"
              >
                <FaPlay />
                <span className="ml-4 text-xl text-[#ffffffe0] font-syne">
                  Play
                </span>
              </button>
              <button
                onClick={shufflePlay}
                className="text-[#27df6a] text-2xl shadow-2xl flex justify-center items-center py-3 bg-[#8d8d8d31] backdrop-blur-lg border-none outline-none p-3 rounded-lg w-45"
              >
                <PiShuffleFill />
                <span className="ml-4 text-xl text-[#ffffffe0] font-syne">
                  Shuffle
                </span>
              </button>
            </div>
            <div className="w-full flex flex-col mt-10 justify-start items-center pb-35">
              {liked ? (
                playlists.length > 0 ? (
                  playlists.map((song, index) => (
                    <div
                      key={index}
                      className="w-[90%] flex justify-start items-center p-2 rounded-lg "
                    >
                      <div className="flex justify-center items-center">
                        <h1 className="text-[#ffffffd7] text-2xl font-syne mr-5">{`${
                          index + 1 < 10 ? `0${index + 1}` : index + 1
                        }`}</h1>
                      </div>
                      <TrackList width={"w-full"} data={song} />
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-lg font-syne mt-4 h-full justify-start flex-col items-center pt-6 px-5">
                    <h1 className="text-gray-500 text-lg font-syne mt-4">
                      No liked songs found
                    </h1>
                  </div>
                )
              ) : (
                playlists.songs.map((song, index) => (
                  <div
                    key={index}
                    className="w-[90%] flex justify-start items-center p-2 rounded-lg "
                  >
                    <div className="flex justify-center items-center">
                      <h1 className="text-[#ffffffd7] text-2xl font-syne mr-5">{`${
                        index + 1 < 10 ? `0${index + 1}` : index + 1
                      }`}</h1>
                    </div>
                    <TrackList width={"w-full"} data={song} />
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
              {showMessageBox && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="">
                  <MessageBox message={messageBoxMessage} type="success" />
                </motion.div>
              )}
      </div>
    </>
  );
};

export default PlaylistScreen;
