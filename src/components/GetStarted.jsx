import React from 'react'
import Image from "next/image";
import { motion } from "framer-motion";
import Link from 'next/link';

const GetStarted = () => {
  return (
    <>
        <motion.div 
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5}}
        className="h-screen w-screen flex items-center justify-start flex-col bg-[#171717]">
            <div className="h-[50%] flex items-center justify-center flex-col">
                <Image
                    src="/headphone.svg"
                    alt="Meloa Logo"
                    width={200}
                    height={200}
                    className="mt-4 w-1/2"/>
            </div>
            <h1 className="text-white text-4xl font-Syne mb-10">Welcome to Meloa</h1>
            <div className="w-3/4 flex items-start justify-center flex-col mb-10">
                <Image
                    src="/stream.svg"
                    alt="Meloa Logo"
                    width={25}
                    height={25}
                    className="mt-4"/>
                <p className="text-white text-lg font-Syne">
                    Your Music, Your Way
                </p>
                <p className="text-[#a8a8a8] text-[12px] font-Syne">
                    Stream, download, and discover music by genre or smart recommendations — all from one place.
                </p>
            </div>

            <div className="w-3/4 flex items-start justify-center flex-col mb-10">
                <Image
                    src="/loop.svg"
                    alt="Meloa Logo"
                    width={22}
                    height={22}
                    className="mt-4"/>
                <p className="text-white text-lg font-Syne">
                    Search. Play. Repeat.
                </p>
                <p className="text-[#a8a8a8] text-[12px] font-Syne">
                    All your favorite tracks — streamed or saved — in one simple app.
                </p>
            </div>

            <Link href='/signin' className='absolute bottom-4 w-3/4 font-bold h-[2.5rem] bg-[#27df6a] text-black rounded-3xl font-syne text-sm cursor-pointer flex justify-center items-center'>Get Started</Link>
        </motion.div>
    </>
  )
}

export default GetStarted