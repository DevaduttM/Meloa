"use client"
import React, { useEffect, useState } from 'react'
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { RiSearch2Line, RiSearch2Fill } from "react-icons/ri";
import { MdVideoLibrary, MdOutlineVideoLibrary } from "react-icons/md";
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import LibraryScreen from './LibraryScreen';
import { motion } from 'framer-motion';
import HomeScreenShimmer from './HomeScreenShimmer';

const Navbar = () => {

    const [page, setPage] = useState("home");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

  return (
    <>
        <div className="h-screen w-screen flex justify-center items-center bg-[#171717]">
            {
                page === "home" && loading ? (
                    <HomeScreenShimmer />
                ) : page === "home" ? (
                    <HomeScreen />
                ) : page === "search" ? (
                    <SearchScreen />
                ) : page === "library" ? (
                    <LibraryScreen />
                ) : null
            }
            <div className="fixed bottom-0 w-full h-[7%] bg-gradient-to-t from-black to-[#00000052] backdrop-blur-lg flex items-center justify-around px-10">
                <div onClick={() => setPage("home")} className="flex h-full items-center justify-center flex-col">
                    {
                        page === "home" ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            <AiFillHome className= {`text-xl ${page === "home" ? "text-[#27df6a]" : "white"}`} /></motion.div>
                        ) : 
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <AiOutlineHome className= {`text-xl text-white`} /></motion.div>
                    }
                    <span className={`font-syne transition-colors duration-200 text-xs ${page === "home" ? "text-[#27df6a]" : "white"}`}>Home</span>
                </div>
                <div onClick={() => setPage("search")} className="flex h-full items-center justify-center flex-col">
                    {
                        page === "search" ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            <RiSearch2Fill className= {`text-xl ${page === "search" ? "text-[#27df6a]" : "white"} `} /></motion.div>
                        ) : 
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <RiSearch2Line className= {`text-xl text-white`} /></motion.div>
                    }
                    <span className={`font-syne transition-colors duration-200 text-xs ${page === "search" ? "text-[#27df6a]" : "white"}`}>Search</span>
                </div>
                <div onClick={() => setPage("library")} className="flex h-full items-center justify-center flex-col">
                    {
                        page === "library" ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            <MdVideoLibrary className= {`text-xl ${page === "library" ? "text-[#27df6a]" : "white"}`} /></motion.div>
                        ) : 
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <MdOutlineVideoLibrary className= {`text-xl text-white`} /></motion.div>
                    }
                    <span className={`font-syne transition-colors duration-200 text-xs ${page === "library" ? "text-[#27df6a]" : "white"}`}>Library</span>
                </div>
            </div>
        </div>
    </>
  )
}

export default Navbar