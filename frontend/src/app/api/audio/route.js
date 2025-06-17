import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

  export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("id");
    console.log("Received video ID:", videoId);

    if (!videoId || !ytdl.validateID(videoId)) {
        return NextResponse.json(
            { error: "Invalid or missing video ID" },
            { status: 400 }
        );
    }

    try {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await ytdl.getInfo(url, { requestOptions: { headers: { 'User-Agent': USER_AGENT } } });

        const bestAudio = ytdl.chooseFormat(info.formats, {
            quality: 'highestaudio',
            filter: 'audioonly',
        });

        if (!bestAudio?.url) {
            return NextResponse.json(
                { error: "No audio stream found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            title: info.videoDetails.title,
            author: info.videoDetails.author.name,
            audioFormat: bestAudio.mimeType,
            audioUrl: bestAudio.url,
            duration: info.videoDetails.lengthSeconds,
        });
    } catch (error) {
        console.error("Error fetching video info:", error);
        return NextResponse.json(
            { error: "Failed to retrieve video information" },
            { status: 500 }
        );
    }
}