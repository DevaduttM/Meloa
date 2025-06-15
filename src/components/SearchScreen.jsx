import React from "react";
import Image from "next/image";
import { FaRegCircleUser } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { RiSearch2Line } from "react-icons/ri";

const SearchScreen = () => {
  return (
    <>
      <AnimatePresence>
        <div className="h-screen w-screen flex justify-start items-center bg-[#171717] flex-col relative overflow-x-hidden overflow-y-scroll scrollbar-hide"
        >
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
            <div className="w-fit h-full flex justify-center items-center gap-2">
              <FaRegCircleUser className="text-3xl text-[#27df6a] mr-2" />
            </div>
          </div>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full flex justify-center items-center flex-col">
            <div className="relative w-full mt-10 flex items-center justify-center">
              <input
                type="text"
                className="bg-white text-black font-syne rounded-lg p-2 pl-9 outline-none w-[90%]"
                placeholder="Search..."
              />
              <RiSearch2Line className="absolute left-9 text-gray-500" />
            </div>
            <div className="h-full flex justify-center items-center flex-col">
              <RiSearch2Line className="text-6xl text-gray-600 -mt-20" />
              <h1 className="text-gray-500 text-lg font-syne mt-4">
                Search for your favorite songs !
              </h1>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
};

export default SearchScreen;
