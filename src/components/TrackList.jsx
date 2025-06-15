import React, { use, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { currentTrackContext } from "@/context/PlayerContext";
import { PlayerContext } from "@/context/PlayerContext";

const TrackList = ({ width, data }) => {
    const track = useContext(currentTrackContext);
    const player = useContext(PlayerContext);

    useEffect(() => {
        console.log("TrackList data:", data);
        console.log("Current track context:", track);
    }, [data, track]);

    const handleTrackClick = () => {
        console.log("Setting current track to:", data);
        track.setCurrentTrack(data);
        player.setPlayerOpen(true);
        player.setPlaying(true);
        handleFetchAudio();
        
        setTimeout(() => {
            console.log("Track context after setting:", track);
        }, 100);
    };

    const handleFetchAudio = async () => {
        try{
            const response = await fetch(`/api/audio?id=${data.id}`);
            const audioData = await response.json();
            console.log("Audio data fetched:", audioData);
            if (audioData && audioData.audioUrl) {
                track.setAudioUrl(audioData.audioUrl);
                console.log("Audio URL set:", audioData.audioUrl);
            } else {
                console.error("No audio URL found in response");
            }

        } catch (error) {
            console.error("Error fetching audio data:", error);
        }
    }

    return (
        <>
            <div onClick={handleTrackClick} className={`flex items-center justify-start gap-3 ${width}`}>
                <div className="relative h-15 w-15 flex-shrink-0">
                    <Image
                        src={data.thumbnail || "/logo_img_only.png"}
                        alt="Track Cover"
                        fill
                        className="rounded-lg object-cover h-15 w-15 bg-[#1f1f1f] shadow-lg"
                    />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-md font-syne">
                        {data.title || "Track Title"}
                    </h1>
                    <h2 className="text-gray-400 text-sm font-syne">
                        {data.channel || "Channel Name"}
                    </h2>
                </div>
            </div>
        </>
    );
};

export default TrackList;