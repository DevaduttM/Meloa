const express = require('express');
const cors = require('cors');
const app = express();
const ytdl = require('@distube/ytdl-core');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/audio', async (req, res) => {
  const videoId = req.query.id;

  if (!videoId || !ytdl.validateID(videoId)) {
    return res.status(400).json({ error: 'Invalid or missing video ID' });
  }

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(url);

    const bestAudio = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    if (!bestAudio?.url) {
      return res.status(404).json({ error: 'No audio stream found' });
    }

    res.json({
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: info.videoDetails.lengthSeconds,
      audioUrl: bestAudio.url,
      audioFormat: bestAudio.mimeType,
    });
  } catch (err) {
    console.error('Error fetching audio stream:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/download', async (req, res) => {
    const videoId = req.query.id;
    
    if (!videoId || !ytdl.validateID(videoId)) {
        return res.status(400).json({ error: 'Invalid or missing video ID' });
    }
    
    try {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await ytdl.getInfo(url);
    
        const bestAudio = ytdl.chooseFormat(info.formats, {
        quality: 'highestaudio',
        filter: 'audioonly',
        });
    
        if (!bestAudio?.url) {
        return res.status(404).json({ error: 'No audio stream found' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title.split(/[\(\[\|]/)[0].trim()}.mp3"`);
        res.setHeader('Content-Type', bestAudio.mimeType);
        ytdl(url, { format: bestAudio }).pipe(res);
    } catch (err) {
        console.error('Error fetching audio stream:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});