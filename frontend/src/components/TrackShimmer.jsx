import React from "react";

const TrackShimmer = ({page}) => {
  return (
    <div
      className={`w-[93vw] h-18 ${page === "search" ? "bg-[#1f1f1f]" : "bg-[#2a2a2a80] mt-2"} rounded-md animate-pulse flex justify-between items-center mb-3`}
    >
      {
        page === "genre" && (
          <div className="h-10 w-8 bg-[#222222b4] rounded-md ml-3 mr-3" />
        )
      }
      <div className="flex p-[6px] justify-center items-center gap-3 w-full">
        <div className={`h-14 w-18 ${page === "search" ? "bg-[#222222]" : "bg-[#222222b4]"} rounded-md`} />
        <div className="h-full w-full flex flex-col gap-2 items-start justify-center">
          <div className={`h-5 w-40 ${page === "search" ? "bg-[#222222]" : "bg-[#222222b4]"} rounded-md`} />
          <div className={`h-3 w-20 ${page === "search" ? "bg-[#222222]" : "bg-[#222222b4]"} rounded-md`} />
        </div>
      </div>
    </div>
  );
};

export default TrackShimmer;
