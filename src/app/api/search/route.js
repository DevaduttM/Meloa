import { NextResponse } from "next/server";
import { Innertube } from "youtubei.js";

let youtubeInstance;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    if (!youtubeInstance) {
      youtubeInstance = await Innertube.create();
    }

    const searchResults = await youtubeInstance.search(query, {
      type: "video",
    });
    console.log("Search Results:", searchResults);

    const results = searchResults.videos.slice(0, 10).map((video) => ({
      title: video.title?.text ?? "No Title",
      id: video.video_id,
      channel: video.author?.name ?? "Unknown",
      duration: video.length_text?.text ?? "Live",
      url: `https://www.youtube.com/watch?v=${video.video_id}`,
      thumbnail:
        // 
        video.thumbnails?.[0]?.url ??
        "",
    }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Search Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
