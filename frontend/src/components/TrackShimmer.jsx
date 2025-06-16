import React from "react";

const TrackShimmer = () => {
  return (
    <div
      className="w-[93vw] h-18 bg-[#1f1f1f] rounded-md animate-pulse flex justify-between items-center mb-3"
    >
      <div className="flex p-[6px] justify-center items-center gap-3 w-full">
        <div className="h-14 w-18 bg-[#222222] rounded-md" />
        <div className="h-full w-full flex flex-col gap-2 items-start justify-center">
          <div className="h-5 w-40 bg-[#222222] rounded-md" />
          <div className="h-3 w-20 bg-[#222222] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default TrackShimmer;
