"use client"
import React, { useState } from 'react'
import { AiFillHome } from "react-icons/ai";
import { RiSearch2Line } from "react-icons/ri";
import { MdVideoLibrary } from "react-icons/md";
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import LibraryScreen from './LibraryScreen';

const Navbar = () => {

    const [page, setPage] = useState("home");

  return (
    <>
        <div className="h-screen w-screen flex justify-center items-center bg-[#171717]">
            {
                page === "home" ? (
                    <HomeScreen />
                ) : page === "search" ? (
                    <SearchScreen />
                ) : page === "library" ? (
                    <LibraryScreen />
                ) : null
            }
            <div className="fixed bottom-0 w-full h-[8%] bg-gradient-to-t from-black to-transparent backdrop-blur-lg flex items-center justify-around px-10">
                <div onClick={() => setPage("home")} className="flex h-full items-center justify-center flex-col">
                    <AiFillHome className= {`text-xl ${page === "home" ? "text-[#27df6a]" : "white"} transition-colors duration-200`} />
                    <span className={`font-syne text-xs ${page === "home" ? "text-[#27df6a]" : "white"}`}>Home</span>
                </div>
                <div onClick={() => setPage("search")} className="flex h-full items-center justify-center flex-col">
                    <RiSearch2Line className= {`text-xl ${page === "search" ? "text-[#27df6a]" : "white"} transition-colors duration-200`}  />
                    <span className={`font-syne text-xs ${page === "search" ? "text-[#27df6a]" : "white"}`}>Search</span>
                </div>
                <div onClick={() => setPage("library")} className="flex h-full items-center justify-center flex-col">
                    <MdVideoLibrary className= {`text-xl ${page === "library" ? "text-[#27df6a]" : "white"} transition-colors duration-200`} />
                    <span className={`font-syne text-xs ${page === "library" ? "text-[#27df6a]" : "white"}`}>Library</span>
                </div>
            </div>
        </div>
    </>
  )
}

export default Navbar