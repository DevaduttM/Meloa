import { NextResponse } from "next/server";
import { Innertube } from "youtubei.js";
let youtubeInstance;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json(
            { error: "ID parameter is required" },
            { status: 400 }
        );
    }

    try {
        if (!youtubeInstance) {
            youtubeInstance = await Innertube.create();
        }

        const info = await youtubeInstance.getInfo(id);
        console.log("Video Info:", info);

const related = info.watch_next_feed
  .filter(video => {
    const duration = video.length_text?.text;
    if (!duration) return false;
    const parts = duration.split(":").map(Number);
    let seconds = 0;

    if (parts.length === 2) {
      // mm:ss
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // hh:mm:ss
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return seconds < 300; // less than 5 minutes
  })
  .slice(0, 3) // only take 3 videos
  .map(video => ({
    title: video.title?.text ?? "No Title",
    id: video.id ?? "Unknown ID",
    channel: video.author?.name ?? "Unknown",
    duration: video.length_text?.text ?? "Live",
    url: `https://www.youtube.com/watch?v=${video.id}`,
    thumbnail: video.thumbnails?.[0]?.url ?? "",
  }));


        console.log("Related Videos:", related);

        return NextResponse.json({related});
    } catch (error) {
        console.error("Error fetching video details:", error);
        return NextResponse.json({ error: "Failed to fetch video details" }, { status: 500 });
    }
}