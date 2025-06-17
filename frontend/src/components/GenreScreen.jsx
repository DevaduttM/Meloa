import React, { useContext, useEffect, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { PiShuffleFill } from "react-icons/pi";
import { FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import TrackList from "./TrackList";
import { GenreScreenContext, PlayFromPlaylistContext, currentTrackContext, PlayerContext } from "@/context/PlayerContext";
import { handleFetchAudio } from "@/utils/apicalls";

const GenreScreen = ({data}) => {
    const [genrePlaylist, setGenrePlaylist] = useState([]);
    const [loading, setLoading] = useState(true);

    const plstctx = useContext(PlayFromPlaylistContext);
    const track = useContext(currentTrackContext);
    const player = useContext(PlayerContext);

    useEffect(() => {
        const getGenrePlaylist = async () => {
            try{
                const response = await fetch(`/api/genreplaylist?id=${data.id}`);
                const result = await response.json();
                setGenrePlaylist(result.results || []);
                plstctx.setPlaylistSongs(result.results || []);
                console.log("Genre Playlist:", result);
            } catch (error) {
                console.error("Error fetching genre playlist:", error);
            } finally {
                setLoading(false);
            }
        }
        getGenrePlaylist();
    }, [data.id]);

    const genrectx = useContext(GenreScreenContext);

    const PlaylistPlay = () => {
        console.log("Playing Playlist");
        plstctx.setPlayingFromPlaylist(true);
        plstctx.setPlaylistSongs(genrePlaylist);
        plstctx.setPlaylistIndex(0);
        track.setCurrentTrack(prev => [...prev, genrePlaylist[0]]);
        track.setCurrentIndex((prev) => prev + 1);
        player.setPlayerOpen(true);
        handleFetchAudio(genrePlaylist[0], track, player);
        console.log("Playlist:", genrePlaylist);
    }


    const shufflePlay = () => {

        console.log("Shuffling Playlist");
        const shuffledPlaylist = [...plstctx.playlistSongs].sort(() => Math.random() - 0.5);
        plstctx.setPlaylistSongs(shuffledPlaylist);
        plstctx.setPlayingFromPlaylist(true);
        plstctx.setPlaylistIndex(0);
        track.setCurrentTrack(prev => [...prev, shuffledPlaylist[0]]);
        track.setCurrentIndex((prev) => prev + 1);
        player.setPlayerOpen(true);
        handleFetchAudio(shuffledPlaylist[0], track, player);
        console.log("Shuffled Playlist:", shuffledPlaylist);
    }
  return (
    <>
        <div className="z-0 min-h-screen w-screen bg-[#171717] flex flex-col fixed top-0 left-0">
          <IoArrowBack
            onClick={() => genrectx.setOpenGenre(false)}
            className="fixed top-7 z-60 left-5 text-4xl text-white"
          />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-screen h-screen bg-cover bg-center z-50 flex justify-center items-center"
          style={{ backgroundImage: `url(${data.image})` }}
        >
          <div className="bg-gradient-to-b from-[#1f1f1f7c] to-[#171717] w-screen h-screen backdrop-blur-[15px] flex flex-col justify-start items-center overflow-y-scroll scrollbar-hide">
            <Image
              src={data.image}
              alt="Song Cover"
              width={200}
              height={200}
              className="rounded-lg mb-10 mt-30 w-1/2 aspect-square shadow-[10px]"
            />
            <h1 className="text-white text-3xl font-syne mb-15">
              {data.name}
            </h1>

            <div className="w-[80%] flex justify-around items-center">
              <button onClick={() => PlaylistPlay()} className="text-[#27df6a] text-2xl shadow-2xl flex justify-center items-center py-3 bg-[#8d8d8d31] backdrop-blur-lg border-none outline-none p-3 rounded-lg w-45">
                <FaPlay />
                <span className="ml-4 text-xl text-[#ffffffe0] font-syne">
                  Play
                </span>
              </button>
              <button onClick={() => shufflePlay()} className="text-[#27df6a] text-2xl shadow-2xl flex justify-center items-center py-3 bg-[#8d8d8d31] backdrop-blur-lg border-none outline-none p-3 rounded-lg w-45">
                <PiShuffleFill />
                <span className="ml-4 text-xl text-[#ffffffe0] font-syne">
                  Shuffle
                </span>
              </button>
            </div>
            <div className="w-full flex flex-col mt-10 justify-start items-center pb-35">
              {genrePlaylist.map((data, index) => (
                <div
                  key={index}
                  
                  className="w-[90%] flex justify-start items-center p-2 rounded-lg "
                >
                  <div className="flex justify-center items-center">
                    <h1 className="text-[#ffffffd7] text-2xl font-syne mr-5">{`${
                      index + 1 < 10 ? `0${index + 1}` : index + 1
                    }`}</h1>
                  </div>
                  <TrackList width={"w-full"} data={data} index={index} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default GenreScreen