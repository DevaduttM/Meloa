import React, { useContext, useState } from 'react'
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


import Image from 'next/image';

const BottomPlayer = () => {

    const playState = useContext(PlayerContext);
    const [openMainPlayer, setOpenMainPlayer] = useState(false);
    const [like, setLike] = useState(false);

  return (
    <>
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpenMainPlayer(true)} className="h-17 w-[97%] rounded-lg bg-[#303030ad] border-[0.5px] border-[#ffffff1e] backdrop-blur-xs flex justify-between items-center pl-[0.3rem] pr-4">
            <div className="flex items-center gap-5">
                <img src="/pop_cover.jpg" alt="Song Cover" className="h-14 w-14 rounded-md" />
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
                    className="fixed top-0 left-0 w-screen h-screen bg-[url('/pop_cover.jpg')] bg-cover bg-center z-50 flex justify-center items-center">
                    <div className="fixed top-0 left-0 bg-gradient-to-b from-[#1f1f1f57] to-black w-screen h-screen backdrop-blur-[15px] flex flex-col justify-center items-center">
                        <IoArrowBack onClick={() => setOpenMainPlayer(false)} className='absolute top-7 left-5 text-4xl text-white' />
                        <Image
                            src="/pop_cover.jpg"
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
                            {
                                like ? (
                                    <AnimatePresence>
                                    <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center">
                                        <button className="text-red-600 text-3xl" onClick={() => setLike(false)}><IoMdHeart /></button>
                                    </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center">
                                            <button className="text-white text-3xl" onClick={() => setLike(true)}><IoMdHeartEmpty /></button>
                                        </motion.div>
                                    </AnimatePresence>
                                )
                            }
                            <button className="text-white text-3xl"><RxDownload /></button>
                            <button className="text-white text-3xl"><PiRepeatLight /></button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
  )
}

export default BottomPlayer