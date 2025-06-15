import React from 'react'
import Image from 'next/image'
import { FaRegCircleUser } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from 'lucide-react';
import {RiSearch2Line} from "react-icons/ri";

const SearchScreen = () => {
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-screen w-screen flex justify-start items-center bg-[#171717] flex-col relative overflow-x-hidden overflow-y-scroll scrollbar-hide"
        >
          <div className="relative w-full mt-10 flex items-center justify-center">
            <input type="text" className="bg-white text-black font-syne rounded-lg p-2 pl-9 outline-none w-[90%]" placeholder="Search..." />
            <RiSearch2Line className="absolute left-9 text-gray-500" />
          </div>
          <div className="h-full flex justify-center items-center flex-col">
            <RiSearch2Line className="text-6xl text-gray-600 -mt-20" />
            <h1 className="text-gray-500 text-lg font-syne mt-4">Search for your favorite songs !</h1>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default SearchScreen