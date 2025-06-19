import { NextResponse } from "next/server";
import { Innertube } from "youtubei.js";

let youtubeInstance;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if(!id) {
        return NextResponse.json(
            { error: "ID parameter is required" },
            { status: 400 }
        );
    }

    try {
        if (!youtubeInstance) {
            youtubeInstance = await Innertube.create();
        }

        const playlistResults = await youtubeInstance.getPlaylist(id);
        console.log("Playlist Results:", playlistResults.videos);

        const results = playlistResults.videos.slice(0, 10).map((video) => ({
            title: video.title?.text ?? "No Title",
            id: video.id ?? "Unknown ID",
            channel: video.author?.name ?? "Unknown",
            duration: video.length_text?.text ?? "Live",
            url: `https://www.youtube.com/watch?v=${video.id}`,
            thumbnail: video.thumbnails?.[0]?.url ?? "",
        }));

        return NextResponse.json({ results });
    } catch (err) {
        console.error("Playlist Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}