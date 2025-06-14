import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";

const HomeScreen = () => {

    const [shuffledGenres, setShuffledGenres] = useState([]);

  const genreDetails = [
    {
      name: "Pop",
      image: "/pop_cover.jpg",
      gradientFrom: "#EC4899",
      gradientTo: "#8B5CF6",
    },
    {
      name: "Hip-Hop",
      image: "/hiphop_cover.jpg",
      gradientFrom: "#1F2937",
      gradientTo: "#F59E0B",
    },
    {
      name: "Rock",
      image: "/rock_cover.jpg",
      gradientFrom: "#B91C1C",
      gradientTo: "#000000",
    },
    {
      name: "Electronic",
      image: "/edm_cover.jpg",
      gradientFrom: "#22D3EE",
      gradientTo: "#2563EB",
    },
    {
      name: "Jazz",
      image: "/jazz_cover.jpg",
      gradientFrom: "#FCD34D",
      gradientTo: "#D97706",
    },
    {
      name: "Classical",
      image: "/classical_cover.jpg",
      gradientFrom: "#D1D5DB",
      gradientTo: "#6B7280",
    },
  ];

  useEffect(() => {
    const shuffledGenre = getShuffledArray(genreDetails);
    setShuffledGenres(shuffledGenre);
  }, []);

  function getShuffledArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}


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
          <div className="w-full flex flex-col justify-center items-start mt-10">
            <h1 className="text-white text-2xl pl-6 font-syne">
              Trending Tracks
            </h1>
            <div className="w-full pl-6 py-8 flex flex-row justify-start items-center overflow-x-scroll scrollbar-hide">
              {[...Array(2)].map((_, outerIndex) => (
                <div
                  key={outerIndex}
                  className="min-w-[65vw] flex-col gap-5 h-full flex justify-between items-center mr-4"
                >
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-full flex justify-between items-center mb-3"
                    >
                      <div className="flex justify-center items-center gap-3 w-full">
                        <Image
                          src="/logo_img_only.png"
                          alt="Track Cover"
                          width={30}
                          height={30}
                          className="bg-[#1f1f1f] rounded-lg h-15 w-15 p-3"
                        />
                        <div className="h-full w-full flex flex-col items-start justify-center">
                          <h1 className="text-white text-md font-syne">
                            Track Title
                          </h1>
                          <h2 className="text-gray-400 text-sm font-syne">
                            Artist Name
                          </h2>
                        </div>
                      </div>
                      <IoMdMore className="text-2xl text-gray-200" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <h1 className="text-white pl-6 text-2xl font-syne">
              Popular Genres
            </h1>
            <div className="relative w-full grid grid-cols-2 grid-rows-3 gap-4 pl-3 pr-5 mt-8">
              {shuffledGenres.map((genre, index) => (
                <div
                  key={index}
                  className="relative rounded-lg h-25 w-full m-1 flex justify-center items-center overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, ${genre.gradientFrom}, ${genre.gradientTo})`,
                  }}
                >
                    <Image
                    src={genre.image}
                    alt={genre.name}
                    width={50}
                    height={50}
                    className="absolute -right-4 -bottom-4 rounded-sm h-16 w-16 object-cover -rotate-45"/>
                  <h2 className="text-white text-lg font-syne">
                    {genre.name}
                  </h2>
                </div>
              ))}
            </div>

            <h1 className="text-white pl-6 text-2xl mt-10 font-syne">
              Recommended For You
            </h1>
            <div className="w-full pl-6 py-8 flex flex-row justify-start items-center overflow-x-scroll scrollbar-hide pb-30">
              {[...Array(2)].map((_, outerIndex) => (
                <div
                  key={outerIndex}
                  className="min-w-[65vw] flex-col gap-5 h-full flex justify-between items-center mr-4"
                >
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-full flex justify-between items-center mb-3"
                    >
                      <div className="flex justify-center items-center gap-3 w-full">
                        <Image
                          src="/logo_img_only.png"
                          alt="Track Cover"
                          width={30}
                          height={30}
                          className="bg-[#1f1f1f] rounded-lg h-15 w-15 p-3"
                        />
                        <div className="h-full w-full flex flex-col items-start justify-center">
                          <h1 className=" track-title text-white text-md font-syne">
                            Track Title
                          </h1>
                          <h2 className="text-gray-400 text-sm font-syne">
                            Artist Name
                          </h2>
                        </div>
                      </div>
                      <IoMdMore className="text-2xl text-gray-200" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default HomeScreen;
