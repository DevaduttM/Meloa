import React, { useContext, useEffect, useState } from 'react'
import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import { PiFastForwardFill } from "react-icons/pi";
import { PiRewindFill } from "react-icons/pi";
import { PlayerContext } from '@/context/PlayerContext';
import { IoArrowBack } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { AnimatePresence, motion } from 'framer-motion';
import { RxDownload } from "react-icons/rx";
import { PiRepeatLight } from "react-icons/pi";
import { useRouter } from 'next/navigation';
import { IoMdMore } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { RiPlayListAddFill } from "react-icons/ri";
import { PiPlaylist } from "react-icons/pi";

import Image from 'next/image';

const BottomPlayer = () => {

    const playState = useContext(PlayerContext);
    const [openMainPlayer, setOpenMainPlayer] = useState(false);
    const [like, setLike] = useState(false);
    const [optionDown, setOptionDown] = useState(false);
    const [playlistScreen, setPlaylistScreen] = useState(false);
    const [createPlaylistScreen, setCreatePlaylistScreen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const handlePopState = (event) => {
            if (openMainPlayer) {
                setOpenMainPlayer(false);
            }
        };
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [openMainPlayer]);



    return (
    <>
        <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={() => {setOpenMainPlayer(true); window.history.pushState(null, "")}} className="h-17 w-[97%] rounded-lg bg-[#303030ad] border-[0.5px] border-[#ffffff1e] backdrop-blur-xs flex justify-between items-center pl-[0.3rem] pr-4">
            <div className="flex items-center gap-5">
                <img src="/rock_cover.jpg" alt="Song Cover" className="h-14 w-14 rounded-md" />
                <div className="flex flex-col">
                    <span className="text-white text-md font-syne font-semibold">Song Title</span>
                    <span className="text-gray-400 font-syne text-sm">Artist Name</span>
                </div>
            </div>
            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-6">
                <button className="text-white text-2xl"><PiRewindFill /></button>
                {
                    playState.playing ? (
                        <button className="text-white text-2xl" onClick={() => playState.setPlaying(false)}><FaPause /></button>
                    ) : (
                        <button className="text-white text-2xl" onClick={() => playState.setPlaying(true)}><FaPlay /></button>
                    )
                }
                <button className="text-white text-2xl"><PiFastForwardFill /></button>
            </div>
        </motion.div>
         <AnimatePresence>       
        {
            openMainPlayer && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setOptionDown(false)}
                    className="fixed top-0 left-0 w-screen h-screen bg-[url('/rock_cover.jpg')] bg-cover bg-center z-50 flex justify-center items-center">
                    <div className="fixed top-0 left-0 bg-gradient-to-b from-[#1f1f1f57] to-[#171717] w-screen h-screen backdrop-blur-[15px] flex flex-col justify-center items-center">
                        <IoArrowBack onClick={() => setOpenMainPlayer(false)} className='absolute top-7 left-5 text-4xl text-white' />
                        <div className="absolute top-7 right-5">
                            <button onClick={(e) => {e.stopPropagation(); setPlaylistScreen(!playlistScreen)}} className="text-white text-3xl"><RiPlayListAddFill /></button>
                        </div>
                        <Image
                            src="/rock_cover.jpg"
                            alt="Song Cover"
                            width={200}
                            height={200}
                            className="rounded-lg mb-15 w-3/4 aspect-square shadow-[10px]"/>
                        <h1 className="text-white text-3xl font-syne">Track Name</h1>
                        <h1 className="text-[#9c9c9c] text-xl font-syne mb-15">Artist Name</h1>
                        <div className="w-[80%] h-2 bg-gray-500 mb-5 rounded-2xl">
                            <div className="w-[50%] h-full bg-[#27df6a] rounded-2xl"></div>
                        </div>
                        <div className="w-[80%] h-2  mb-15 flex justify-between items-center">
                            <span className="text-gray-300 font-syne text-lg">2:15</span>
                            <span className="text-gray-300 font-syne text-lg">4:30</span>
                        </div>
                        <div className="w-[70%] flex justify-around items-center">
                            <button className="text-white text-5xl"><PiRewindFill /></button>
                            {
                                playState.playing ? (
                                    <button className="text-white text-6xl" onClick={() => playState.setPlaying(false)}><FaPause /></button>
                                ) : (
                                    <button className="text-white text-6xl" onClick={() => playState.setPlaying(true)}><FaPlay /></button>
                                )
                            }
                            <button className="text-white text-5xl"><PiFastForwardFill /></button>
                        </div>
                        <div className="fixed bottom-10 w-full flex justify-around items-center">
                            <AnimatePresence mode='wait'>
                            {
                                like ? (
                                    <motion.div
                                        key="liked"
                                        initial={{ opacity: 0.6 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="flex items-center">
                                        <button className="text-red-600 text-3xl" onClick={() => setLike(false)}><IoMdHeart /></button>
                                    </motion.div>
                                ) : (
                                        <motion.div
                                            key="not-liked"
                                            initial={{ opacity: 0.6 }}
                                            animate={{ opacity: 1 }}

                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="flex items-center">
                                            <button className="text-white text-3xl" onClick={() => setLike(true)}><IoMdHeartEmpty /></button>
                                        </motion.div>
                                )
                            }
                                    </AnimatePresence>
                            <button className="text-white text-3xl"><RxDownload /></button>
                            <button className="text-white text-3xl"><PiRepeatLight /></button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        <AnimatePresence>
            {
                playlistScreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {setPlaylistScreen(false); setCreatePlaylistScreen(false)}}
                        className="fixed top-0 left-0 w-screen h-screen bg-[#0c0c0ca2] backdrop-blur-xs z-50 flex justify-center items-center">
                        <div onClick={(e) => e.stopPropagation()} className="bg-gradient-to-b from-[#b8b8b838] to-[#9696962f] backdrop-blur-2xl p-5 h-[65%] w-[85%] rounded-lg shadow-lg flex flex-col justify-start items-center ">
                            <div className="w-[95%] flex justify-between items-center mt-3 mb-5">
                                <h1 className='text-white text-2xl font-syne'>Your Playlists</h1>
                                <button onClick={() => setCreatePlaylistScreen(!createPlaylistScreen)} className="text-white text-3xl flex justify-center items-center">{createPlaylistScreen ? <PiPlaylist /> : <IoAdd />}</button>
                            </div>
                            <hr className='border-[#85858549] w-[98%]' />
                            <div className="w-[95%] h-full mt-5 mb-5 flex flex-col justify-start items-center gap-2 overflow-y-scroll scrollbar-hide">
                                { createPlaylistScreen ? (
                                    <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="w-full h-full bg-[#8d8d8d1e] rounded-lg flex flex-col justify-center items-center px-4 mb-3">
                                        <h1 className='text-white text-2xl font-syne w-[90%]'>Create Playlist</h1>
                                        <div className="flex items-center gap-3 py-5 w-[90%]">
                                            <input type="text" placeholder="Enter Playlist Name" className="text-white text-lg font-syne bg-[#8d8d8d1e] border-[0.5px] outline-none py-4 pl-3 rounded-lg focus:outline-white  w-full" />
                                        </div>
                                        <button onClick={() => setCreatePlaylistScreen(false)} className="text-black bg-[#27df6a] text-md  h-10 w-25 rounded-xl font-syne">Done</button>
                                    </motion.div>
                                ) : (
                                    [...Array(10)].map((_, index) => (
                                        <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        key={index} className="w-full bg-gradient-to-r from-[#8d8d8d1e] to-[#68686842] backdrop-blur-lg rounded-lg flex justify-between items-center px-4 mb-3">
                                            <div className="flex items-center gap-3 py-5">
                                                <Image src="/logo_img_only.png" alt="Playlist Cover" width={40} height={40} className="rounded-md" />
                                                <span className="text-white text-lg font-syne">Playlist Name {index + 1}</span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    </>
  )
}

export default BottomPlayer