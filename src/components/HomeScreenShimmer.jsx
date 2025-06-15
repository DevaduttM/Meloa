import React from 'react'
import Image from 'next/image'
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdMore } from 'react-icons/io'
import { motion } from 'framer-motion'



const HomeScreenShimmer = () => {
  return (
    <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-screen w-screen flex justify-start items-center bg-[#171717] flex-col relative overflow-x-hidden overflow-y-scroll scrollbar-hide"
        >
          <div className="w-full flex flex-col justify-center items-start mt-10">
            <div className="bg-[#1f1f1f] ml-6 h-7 w-[35%] rounded-md animate-pulse"/>
            <div className="w-full pl-6 py-8 flex flex-row justify-start items-center overflow-x-scroll scrollbar-hide">
              {[...Array(2)].map((_, outerIndex) => (
                <div
                  key={outerIndex}
                  className="min-w-[65vw] flex-col gap-5 h-full flex justify-between items-center mr-4"
                >
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-full bg-[#1f1f1f] rounded-md animate-pulse flex justify-between items-center mb-3"
                    >
                      <div className="flex p-[6px] justify-center items-center gap-3 w-full">
                        <div className="h-14 w-18 bg-[#222222] rounded-md"/>
                        <div className="h-full w-full flex flex-col gap-2 items-start justify-center">
                          <div className="h-5 w-40 bg-[#222222] rounded-md"/>
                          <div className="h-3 w-20 bg-[#222222] rounded-md"/>
                        </div>
                      </div>
                      <div className="h-6 w-2 bg-[#222222] rounded-md mr-3"/>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-[#1f1f1f] ml-6 h-7 w-[35%] rounded-md animate-pulse"/>
            <div className="relative w-full grid grid-cols-2 grid-rows-3 gap-4 pl-3 pr-5 mt-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="relative bg-[#1f1f1f] animate-pulse rounded-md h-25 w-full m-1 flex justify-center items-center overflow-hidden"
                >
                    <div className="h-5 w-30 bg-[#222222] rounded-md animate-pulse"/>
                </div>
              ))}
            </div>

            <div className="bg-[#1f1f1f] ml-6 h-7 w-[50%] mt-10 rounded-md animate-pulse"/>
            <div className="w-full pl-6 py-8 flex flex-row justify-start items-center overflow-x-scroll scrollbar-hide pb-30">
              {[...Array(2)].map((_, outerIndex) => (
                <div
                  key={outerIndex}
                  className="min-w-[65vw] flex-col gap-5 h-full flex justify-between items-center mr-4"
                >
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-full bg-[#1f1f1f] animate-pulse rounded-md flex justify-between items-center mb-3"
                    >
                      <div className="flex p-[6px] justify-center items-center gap-3 w-full">
                        <div className="h-14 w-18 bg-[#222222] rounded-md"/>
                        <div className="h-full w-full flex flex-col gap-2 items-start justify-center">
                          <div className="h-5 w-40 bg-[#222222] rounded-md"/>
                          <div className="h-3 w-20 bg-[#222222] rounded-md"/>
                        </div>
                      </div>
                      <div className="h-6 w-2 bg-[#222222] rounded-md mr-3"/>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
  )
}

export default HomeScreenShimmer