import ytdl from '@distube/ytdl-core';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('id');

  if (!videoId || !ytdl.validateID(videoId)) {
    return NextResponse.json(
      { error: 'Invalid or missing video ID' },
      { status: 400 }
    );
  }

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Get video info with all formats
    const info = await ytdl.getInfo(url);

    // Select best audio format
    const bestAudio = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    if (!bestAudio?.url) {
      return NextResponse.json(
        { error: 'No audio stream found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: info.videoDetails.lengthSeconds,
      audioUrl: bestAudio.url,
      audioFormat: bestAudio.mimeType,
    });
  } catch (err) {
    console.error('Error fetching audio stream:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
