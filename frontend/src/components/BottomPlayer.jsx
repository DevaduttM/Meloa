import React, { useContext, useEffect, useState, useRef, use } from "react";
import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import { PiFastForwardFill } from "react-icons/pi";
import { PiRewindFill } from "react-icons/pi";
import {
  currentTrackContext,
  PlayerContext,
  PlayFromPlaylistContext,
  UserDetailsContext,
} from "@/context/PlayerContext";
import { IoArrowBack } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { RxDownload } from "react-icons/rx";
import { PiRepeatLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { IoMdMore } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { RiPlayListAddFill } from "react-icons/ri";
import { PiPlaylist } from "react-icons/pi";
import { handleFetchNext } from "@/utils/apicalls";
import { fetchPlaylists, addSongToPlaylist, addLikedSong, removeLikedSong, updateRecommendedSongs } from "@/lib/firestore";
import Lottie from "lottie-react";
import animationFile from "@/assets/loading_animation.json";

import Image from "next/image";
import { Target } from "lucide-react";
import { createPlaylist } from "@/lib/firestore";
import MessageBox from "./MessageBox";

const BottomPlayer = () => {
  const ref = useRef(null);
  const barRef = useRef(null);

  const playState = useContext(PlayerContext);
  const fromplaylstctx = useContext(PlayFromPlaylistContext);
  const userContext = useContext(UserDetailsContext);

  const [openMainPlayer, setOpenMainPlayer] = useState(false);
  const [like, setLike] = useState(false);
  const [playlistScreen, setPlaylistScreen] = useState(false);
  const [createPlaylistScreen, setCreatePlaylistScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [nextTrack, setNextTrack] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [availablePlaylists, setAvailablePlaylists] = useState([]);
  const [showMessageBox, setShowMessageBox] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handlePopState = (event) => {
      if (openMainPlayer) {
        setOpenMainPlayer(false);
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [openMainPlayer]);

  const track = useContext(currentTrackContext);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    let hasFetchedRelated = false;

    const updateProgress = () => {
      if (audio.duration) {
        const currentProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(currentProgress);
        if (currentProgress >= 90 && !hasFetchedRelated && !repeat) {
          hasFetchedRelated = true;
          fetchRelatedVideo(track?.currentTrack[track?.currentIndex]?.id);
        }
      }
    };

    const onEnded = () => {
      playState.setPlaying(false);
      setProgress(0);
      setLike(false);

      if(!repeat) {

        const nextIndex = track?.currentIndex + 1;
        if (fromplaylstctx.playingFromPlaylist) {
          const nextPlaylistIndex =
            (fromplaylstctx?.playlistIndex + 1) %
            fromplaylstctx?.playlistSongs?.length;
          const nextTrack = fromplaylstctx?.playlistSongs[nextPlaylistIndex];
          track.setCurrentIndex(nextIndex);
          fromplaylstctx.setPlaylistIndex(nextPlaylistIndex);
  
          console.log("Next Track Index:", nextIndex);
          console.log("Next Track:", nextTrack);
        }
        else{
          const nextTrack = track?.currentTrack[nextIndex];
          track.setCurrentIndex(nextIndex);
          console.log("Next Track Index:", nextIndex);
          console.log("Next Track:", nextTrack);
        }
      }


    };

    const onPlay = () => playState.setPlaying(true);
    const onPause = () => playState.setPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [track?.currentTrack?.[track?.currentIndex], repeat]);

  const fetchRelatedVideo = async (id) => {
    if (fromplaylstctx.playingFromPlaylist) {
      console.log("Playing from playlist, skipping related video fetch.");
      const nextIndex =
        (fromplaylstctx.playlistIndex + 1) %
        fromplaylstctx.playlistSongs.length;
        track.setCurrentTrack((prev) => [...prev, fromplaylstctx.playlistSongs[nextIndex]]);
        handleFetchNext(
        fromplaylstctx.playlistSongs[nextIndex],
        track,
        playState
      );
      return;
    } else {
      try {
        const response = await fetch(`/api/nextvideo?id=${id}`);
        const data = await response.json();
        console.log("Current Track: ", track.currentTrack);
        if (data && data.related) {
          if(track.currentTrack.some((t) => t.id === data.related[0].id)) {
            if(track.currentTrack.some((t) => t.id === data.related[1].id)) {
              setNextTrack(data.related[2]);
              handleFetchNext(data.related[2], track, playState);
              track.setCurrentTrack((prev) => [...prev, data.related[2]]);
              playState.setPlaying(true);
              ref.current.play();
              console.log("Related video set:", data.related[2]);
            }
            else {
              setNextTrack(data.related[1]);
              handleFetchNext(data.related[1], track, playState);
              track.setCurrentTrack((prev) => [...prev, data.related[1]]);
              playState.setPlaying(true);
              ref.current.play();
              console.log("Related video set:", data.related[1]);
            }
          }
          else {
            setNextTrack(data.related[0]);
            handleFetchNext(data.related[0], track, playState);
            track.setCurrentTrack((prev) => [...prev, data.related[0]]);
            playState.setPlaying(true);
            ref.current.play();
            console.log("Related video set:", data.related[0]);
          }
          await updateRecommendedSongs(userContext.userDetails, data.related[1]);
        } else {
          console.error("No related video found in response");
        }
      } catch (error) {
        console.error("Error fetching related video:", error);
      }
    }
  };

  const handleSeek = (e) => {
    const audio = ref.current;
    if (!audio || !barRef.current) return;

    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;

    audio.currentTime = percentage * audio.duration;
    setProgress(percentage);
  };

  // console.log("URLs: ", track?.audioUrl);

  const handleNextClick = async () => {
    if (ref.current) {
      ref.current.pause();
    }

    playState.setPlaying(false);
    setLike(false);

    const currentTrack = track.currentTrack[track.currentIndex];
    const id = currentTrack?.id;

    if (!id) {
      console.error("No current track ID found");
      return;
    }

    if (
      track.currentIndex < track.currentTrack.length - 1 || progress >= 90 &&
      !fromplaylstctx.playingFromPlaylist
    ) {
      const nextIndex = track.currentIndex + 1;
      track.setCurrentIndex(nextIndex);

      ref.current.play();
      playState.setPlaying(true);

      console.log("Next Track Index:", track.currentIndex);
      console.log("Next Track:", track.currentTrack[track.currentIndex]);
      return;
    } else if (fromplaylstctx.playingFromPlaylist) {
      const nextIndex = track.currentIndex + 1;
      const nextPlaylistIndex =
        (fromplaylstctx.playlistIndex + 1) %
        fromplaylstctx.playlistSongs.length;
      const nextTrack = fromplaylstctx.playlistSongs[nextPlaylistIndex];
      handleFetchNext(nextTrack, track, playState);
      track.setCurrentTrack((prev) => [...prev, nextTrack]);
      track.setCurrentIndex(nextIndex);
      fromplaylstctx.setPlaylistIndex(nextPlaylistIndex);
      ref.current.play();
      playState.setPlaying(true);
      return;
    } else {
          setProgress(0);
      try {
        const response = await fetch(`/api/nextvideo?id=${id}`);
        const data = await response.json();

        if (!data || !data.related || data.related.length === 0) {
          console.error("No related video found");
          return;
        }

        let nextTrack;

        if(track.currentTrack.some((t) => t.id === data.related[0].id)) {
          if(track.currentTrack.some((t) => t.id === data.related[1].id)) {
            nextTrack = data.related[2];
          } else {
            nextTrack = data.related[1];
          }
        } else {
          nextTrack = data.related[0];
        }

        track.setCurrentTrack((prev) => [...prev, nextTrack]);
        track.setCurrentIndex((prevIndex) => prevIndex + 1);

        await handleFetchNext(nextTrack, track, playState);
        await updateRecommendedSongs(userContext.userDetails, data.related[1]);

        console.log("Next Track Appended:", nextTrack);
      } catch (err) {
        console.error("Error in handleNextClick:", err);
      }
    }
  };

  const handleRewindClick = async () => {
    if (fromplaylstctx.playingFromPlaylist) {
      setProgress(0);
      ref.current.currentTime = 0;
    } else {
      if (track.currentIndex <= 0) {
        console.warn("Already at the first track. Cannot rewind further.");
        return;
      }

      if (ref.current.currentTime < 5) {
        playState.setPlaying(false);
        setProgress(0);

        track.setCurrentIndex((prevIndex) => prevIndex - 1);

        setTimeout(() => {
          ref.current.load();
          ref.current.play();
          playState.setPlaying(true);

          console.log("Rewound to Track Index:", track.currentIndex - 1);
          console.log("Track:", track.currentTrack[track.currentIndex - 1]);
        }, 0);
      } else {
        setProgress(0);
        ref.current.currentTime = 0;
      }
    }
  };

  const createNewPlaylist = async (user, PlaylistName, song) => {
    await createPlaylist(user, PlaylistName, song);
    setNewPlaylistName("");
    setCreatePlaylistScreen(false);
    setPlaylistScreen(false);
    setShowMessageBox(true);
    setTimeout(() => {
      setShowMessageBox(false);
    }, 2000);
  }

  const showPlaylists = async (user) => {
    setPlaylistScreen(!playlistScreen);
    const playlists = await fetchPlaylists(user);
    setAvailablePlaylists(playlists);

    console.log("User Playlists:", playlists);
  }

  const addToPlaylist = async (playlistId, song) => {
    await addSongToPlaylist(userContext.userDetails, playlistId, song);
    setPlaylistScreen(false);
    setShowMessageBox(true);
    setTimeout(() => {
      setShowMessageBox(false);
    }, 2000);
  }

  const handleLikeClick = async() => {
    if (like) {
      setLike(false);
      const updatedLikedSongs = userContext.likedSongs.filter(
        (likedSong) => likedSong.id !== track.currentTrack[track.currentIndex].id
      );
      userContext.setLikedSongs(updatedLikedSongs);
      await removeLikedSong(userContext.userDetails, track.currentTrack[track.currentIndex]);
    }
    else {
      setLike(true);
      const newLikedSong = track.currentTrack[track.currentIndex];
      userContext.setLikedSongs((prev) => [...prev, newLikedSong]);
      await addLikedSong(userContext.userDetails, newLikedSong);
    }
  }

  useEffect(() => {
    if(track.loadingAudio && progress < 90) {
      ref.current.pause();
      ref.current.currentTime = 0;
      setProgress(0);
    }
  }, [track.loadingAudio]);

  return (
    <>
      <audio
        ref={ref}
        loop={repeat}
        src={track?.audioUrl[track?.currentIndex]}
        preload="auto"
        controls
        className="hidden"
        autoPlay
        id="audio-player"
      ></audio>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={() => {
          setOpenMainPlayer(true);
          window.history.pushState(null, "");
        }}
        className="h-17 w-[97%] rounded-lg bg-[#303030ad] border-[0.5px] border-[#ffffff1e] backdrop-blur-xs flex justify-between items-center pl-[0.3rem] pr-4 overflow-hidden z-10"
      >
        <div className="close-data flex items-center gap-5">
          <img
            src={
              track?.currentTrack[track?.currentIndex]?.thumbnail ||
              "/logo_img_only.png"
            }
            alt="Song Cover"
            className="h-14 w-14 rounded-md object-cover"
          />
          <div className="flex flex-col overflow-hidden whitespace-nowrap relative w-[50vw]">
            <span
              className={`track-title text-white ${
                track?.currentTrack[track?.currentIndex]?.title
                  ?.split(/[\(\[\|]/)[0]
                  .trim().length > 33
                  ? "animate-scroll"
                  : ""
              } text-md font-syne font-semibold`}
            >
              {(track?.currentTrack[track?.currentIndex]?.title || "")
                .split(/[\(\[\|]/)[0]
                .trim() || "Unknown Title"}
            </span>
            <span className="text-gray-400 font-syne text-sm">
              {track?.currentTrack[track?.currentIndex]?.channel ||
                "Unknown Artist"}
            </span>
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-6"
        >
          <button disabled={track.loadingAudio} onClick={handleRewindClick} className="text-white text-2xl">
            <PiRewindFill />
          </button>
          {track.loadingAudio && progress < 90 ? (
            <Lottie animationData={animationFile} loop={true} className="h-6 w-6 p-0 scale-400 m-0" />
          ) : (
            playState.playing ? (
              <button
                className="text-white text-2xl"
                onClick={() => {
                  playState.setPlaying(false);
                  ref.current.pause();
                }}
              >
                <FaPause />
              </button>
          ) : (
            <button
              className="text-white text-2xl"
              onClick={() => {
                playState.setPlaying(true);
                ref.current.play();
              }}
            >
              <FaPlay />
            </button>
          ))}
          <button disabled={track.loadingAudio} onClick={handleNextClick} className="text-white text-2xl">
            <PiFastForwardFill />
          </button>
        </div>
        <div
          className="absolute bottom-[0.1px] left-0 h-[0.5px] bg-[#27df6a] rounded-xl"
          style={{ width: `${progress}%` }}
        ></div>
      </motion.div>
      <AnimatePresence>
        {openMainPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-screen h-screen bg-cover bg-center z-50 flex justify-center items-center"
            style={{
              backgroundImage: `url(${
                track?.currentTrack[track?.currentIndex]?.thumbnail ||
                "/logo_img_only.png"
              })`,
            }}
          >
            <div className="fixed top-0 left-0 bg-gradient-to-b from-[#1f1f1f57] to-[#171717] w-screen h-screen backdrop-blur-[15px] flex flex-col justify-center items-center">
              <IoArrowBack
                onClick={() => setOpenMainPlayer(false)}
                className="open-buttons absolute top-7 left-5 text-4xl text-white"
              />
              <div className="absolute top-7 right-5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showPlaylists(userContext.userDetails);
                  }}
                  className="open-buttons text-white text-3xl"
                >
                  <RiPlayListAddFill />
                </button>
              </div>
              <div className="track-details-open relative w-3/4 aspect-square mb-15 shadow-[10px]">
                <Image
                  src={
                    track?.currentTrack[track?.currentIndex]?.thumbnail ||
                    "/logo_img_only.png"
                  }
                  alt="Song Cover"
                  fill
                  className="rounded-lg object-cover mb-15 w-3/4 aspect-square shadow-[10px]"
                />
              </div>
              <h1
                className={`track-title-open text-white text-2xl whitespace-nowrap font-syne mx-5 ${
                  track?.currentTrack[track?.currentIndex]?.title
                    .split(/[\(\[\|]/)[0]
                    .trim().length > 40
                    ? "animate-scroll"
                    : ""
                }`}
              >
                {track?.currentTrack[track?.currentIndex]?.title
                  .split(/[\(\[\|]/)[0]
                  .trim() || "Unknown Title"}
              </h1>
              <h1 className="track-channel-open text-[#9c9c9c] text-xl font-syne mb-15">
                {track?.currentTrack[track?.currentIndex]?.channel ||
                  "Unknown Artist"}
              </h1>
              <div
                className="progress-bottom relative w-[80%] h-2 bg-gray-500 mb-5 rounded-2xl"
                onClick={handleSeek}
                ref={barRef}
              >
                <div
                  className="w-[50%] h-full bg-[#27df6a] rounded-2xl transition-all duration-200 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
                <div
                  className="absolute w-3 h-3 top-1/2 -translate-y-1/2 transorm-all duration-200 ease-in-out bg-white rounded-full shadow-2xl z-5"
                  style={{
                    left: `${progress}%`,
                    transform: "translateX(-50%)",
                  }}
                ></div>
              </div>
              <div className="time-container w-[80%] h-2  mb-15 flex justify-between items-center">
                <span className="time-text text-gray-300 font-syne text-lg">
                  {Math.floor(ref.current.currentTime / 60)}:
                  {Math.floor(ref.current.currentTime % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
                <span className="time-text text-gray-300 font-syne text-lg">
                  {Math.floor(ref.current.duration / 60)}:
                  {Math.floor(ref.current.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>
              <div className="w-[70%] flex justify-around items-center">
                <button
                  onClick={handleRewindClick}
                  className="open-buttons text-white text-5xl"
                >
                  <PiRewindFill />
                </button>
                {track.loadingAudio && progress < 90 ? (
                  <button className="open-play-btn text-white text-6xl">
                    <Lottie animationData={animationFile} loop={true} className="h-10 w-10 scale-800 m-0" />
                  </button>
                ) : (
                  playState.playing ? (
                    <button
                      className="open-play-btn text-white text-6xl"
                      onClick={() => {
                        playState.setPlaying(false);
                        ref.current.pause();
                      }}
                    >
                      <FaPause />
                    </button>
                ) : (
                  <button
                    className="open-play-btn text-white text-6xl"
                    onClick={() => {
                      playState.setPlaying(true);
                      ref.current.play();
                    }}
                  >
                    <FaPlay />
                  </button>
                ))}
                <button
                  onClick={handleNextClick}
                  className="open-buttons text-white text-5xl"
                >
                  <PiFastForwardFill />
                </button>
              </div>
              <div className="open-bottom-icons fixed bottom-10 w-full flex justify-around items-center">
                <AnimatePresence>
                  {userContext.likedSongs.some((song) => song.id === track.currentTrack[track.currentIndex].id) ? (
                    <motion.div
                      key="liked"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="open-buttons flex items-center"
                    >
                      <button
                        className="text-red-600 text-3xl"
                        onClick={handleLikeClick}
                      >
                        <IoMdHeart />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="not-liked"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="flex items-center"
                    >
                      <button
                        className="open-buttons text-white text-3xl"
                        onClick={handleLikeClick}
                      >
                        <IoMdHeartEmpty />
                      </button>
                    </motion.div>
                  ) }
                </AnimatePresence>
                <a
                  href={`http://192.168.1.7:5000/download?id=${
                    track?.currentTrack?.[track?.currentIndex]?.id
                  }`}
                  rel="noopener noreferrer"
                  className="open-buttons text-white text-3xl"
                >
                  <RxDownload />
                </a>
                <button
                  className="open-buttons text-[#27df6a] text-3xl"
                  onClick={() => setRepeat(!repeat)}
                >
                  <PiRepeatLight
                    className={
                      repeat
                        ? "text-[#27df6a]"
                        : "text-white transition-colors duration-200"
                    }
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {playlistScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setPlaylistScreen(false);
              setCreatePlaylistScreen(false);
            }}
            className="fixed top-0 left-0 w-screen h-screen bg-[#0c0c0ca2] backdrop-blur-xs z-50 flex justify-center items-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-[#b8b8b838] to-[#9696962f] backdrop-blur-2xl p-5 h-[65%] w-[85%] rounded-lg shadow-lg flex flex-col justify-start items-center "
            >
              <div className="w-[95%] flex justify-between items-center mt-3 mb-5">
                <h1 className="text-white text-2xl font-syne">
                  Add to Playlist
                </h1>
                <button
                  onClick={() => setCreatePlaylistScreen(!createPlaylistScreen)}
                  className="text-white text-3xl flex justify-center items-center"
                >
                  {createPlaylistScreen ? <PiPlaylist /> : <IoAdd />}
                </button>
              </div>
              <hr className="border-[#85858549] w-[98%]" />
              <div className="w-[95%] h-full mt-5 mb-5 flex flex-col justify-start items-center gap-2 overflow-y-scroll scrollbar-hide">
                {createPlaylistScreen ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full h-full bg-[#8d8d8d1e] rounded-lg flex flex-col justify-center items-center px-4 mb-3"
                  >
                    <h1 className="text-white text-2xl font-syne w-[90%]">
                      Create Playlist
                    </h1>
                    <div className="flex items-center gap-3 py-5 w-[90%]">
                      <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Enter Playlist Name"
                        className="text-white text-lg font-syne bg-[#8d8d8d1e] border-[0.5px] outline-none py-4 pl-3 rounded-lg focus:outline-white  w-full"
                      />
                    </div>
                    <button
                      onClick={() => createNewPlaylist(userContext.userDetails, newPlaylistName, track.currentTrack[track.currentIndex])}
                      className="text-black bg-[#27df6a] text-md  h-10 w-25 rounded-xl font-syne"
                    >
                      Done
                    </button>
                  </motion.div>
                ) : availablePlaylists.length > 0 ? (
                  availablePlaylists.map((playlist, index) => (
                    <motion.div
                      onClick={() => addToPlaylist(playlist.id, track.currentTrack[track.currentIndex])}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      key={index}
                      className="w-full bg-gradient-to-r from-[#8d8d8d1e] to-[#68686842] backdrop-blur-lg rounded-lg flex justify-between items-center px-4 mb-3"
                    >
                      <div className="flex items-center gap-3 py-5">
                        <Image
                          src="/logo_img_only.png"
                          alt="Playlist Cover"
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        <span className="text-white text-lg font-syne">
                          {playlist.name}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <h1 className="text-white text-lg font-syne">
                    No playlists available
                  </h1>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
      <AnimatePresence>
      {showMessageBox && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="">
          <MessageBox message="Added to playlist" type="success" />
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

export default BottomPlayer;
