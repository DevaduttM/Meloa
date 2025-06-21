import React, { useContext, useState } from "react";
import Image from "next/image";
import { FaRegCircleUser } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { RiSearch2Line } from "react-icons/ri";
import TrackList from "./TrackList";
import { currentTrackContext, GenreScreenContext, PlayerContext, PlaylistContext } from '@/context/PlayerContext';
import { RxCross2 } from "react-icons/rx";
import TrackShimmer from "./TrackShimmer";



const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Searching for:", searchQuery);
      handleSearch(searchQuery);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    var updatedSearchQuery = searchQuery.trim() + " music video";
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(updatedSearchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data.results.slice(0, 5) || []);
      console.log("Search results:", data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setSearchPerformed(true);
    setLoading(false);
  };

  const player = useContext(PlayerContext);

  return (
    <>
    <GenreScreenContext.Provider value={{ openGenre: false, setOpenGenre: () => {} }}>
      <PlaylistContext.Provider value={{ openPlaylistScreen: false, setOpenPlaylistScreen: () => {} }}>
      <AnimatePresence>
        <div className="h-screen w-screen flex justify-start items-center bg-[#171717] flex-col relative overflow-x-hidden overflow-y-scroll scrollbar-hide">
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
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full flex justify-center items-center flex-col"
          >
            <div className="relative w-[90%] mt-10 flex items-center justify-center">
              <input
                type="text"
                className="bg-white text-black font-syne rounded-lg p-2 pl-9 outline-none w-full"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setSearchPerformed(false)}}
                onKeyDown={handleKeyDown}
              />
              <RxCross2
                className={`absolute right-3 text-gray-500 cursor-pointer ${searchQuery ? 'block' : 'hidden'}`}
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setSearchPerformed(false);
                }}
              />
              <RiSearch2Line className="absolute left-3 text-gray-500" />
            </div>
            <div className="h-full flex justify-center items-center flex-col">
              <>
                {searchQuery ? (
                  <>
                    <div className={`text-gray-500 md:pl-[2.5%] text-lg md:w-[95vw] font-syne mt-4 h-full justify-start flex-col items-center pt-6 px-5 ${searchResults.length > 0 && searchPerformed == true ? 'hidden' : ''}`}>
                      <h1 className={` ${loading ? 'hidden' : 'text-gray-500 md:w-full md:text-center text-lg font-syne mt-4'}`}>Searching for {searchQuery}</h1>
                      {loading && 
                        <>
                          {
                            [...Array(5)].map((_, index) => {
                              return <TrackShimmer key={index} page={"search"} />;
                            })
                          }
                        </>
                      }
                    </div>
                    {searchResults.length > 0 && searchPerformed == true ? (
                      <div className="w-screen h-full gap-4 px-5 md:pl-[5%] overflow-y-scroll scrollbar-hide flex flex-col items-center mt-10">
                        {searchResults.map((result, index) => (
                          <TrackList
                            width="w-full"
                            key={index}
                            data={result}
                            index={index}
                          />
                        ))}
                      </div>
                    ) : (

                      <h2 className={`text-gray-500 text-lg font-syne mt-4 ${searchPerformed ? '' : 'hidden'}`}>
                        No results found
                      </h2>
                    )}
                  </>
                ) : (
                  <>
                    <RiSearch2Line className="text-6xl text-gray-600 -mt-20" />
                    <h1 className="text-gray-500 text-lg font-syne mt-4">
                      Search for your favorite songs !
                    </h1>
                  </>
                )}
              </>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
      </PlaylistContext.Provider>
    </GenreScreenContext.Provider>
    </>
  );
};

export default SearchScreen;
