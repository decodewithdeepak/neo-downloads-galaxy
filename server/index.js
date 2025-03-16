
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow any origin for development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Root route for checking server status
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Route to get video information
app.get('/api/video-info', async (req, res) => {
  try {
    const { videoId } = req.query;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }
    
    console.log(`Fetching info for video ID: ${videoId}`);
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl);
    
    const videoInfo = {
      id: videoId,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      duration: formatDuration(info.videoDetails.lengthSeconds),
      author: info.videoDetails.author.name,
      isPlaylist: false
    };
    
    console.log(`Successfully fetched info for: ${videoInfo.title}`);
    res.json(videoInfo);
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to download a video
app.get('/api/download', async (req, res) => {
  try {
    const { videoId, format, quality } = req.query;
    
    if (!videoId || !format) {
      return res.status(400).json({ error: 'Video ID and format are required' });
    }
    
    console.log(`Starting download for video ID: ${videoId}, format: ${format}, quality: ${quality}`);
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl);
    
    // Generate a sanitized filename
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '').substring(0, 50);
    const filename = `${title}.${format === 'mp3' ? 'mp3' : 'mp4'}`;
    const filePath = path.join(downloadsDir, filename);
    
    // Set appropriate headers for the response
    res.header('Content-Disposition', `attachment; filename="${filename}"`);
    
    if (format === 'mp3') {
      // For MP3 audio only
      res.header('Content-Type', 'audio/mpeg');
      ytdl(videoUrl, {
        filter: 'audioonly',
        quality: quality === '320kbps' ? 'highestaudio' : (
          quality === '192kbps' ? 'highestaudio' : 'lowestaudio'
        )
      }).pipe(res);
    } else {
      // For MP4 video
      res.header('Content-Type', 'video/mp4');
      
      let videoQuality;
      switch(quality) {
        case '1080p':
          videoQuality = 'highest';
          break;
        case '720p':
          videoQuality = 'high';
          break;
        default:
          videoQuality = 'medium';
      }
      
      ytdl(videoUrl, {
        filter: 'videoandaudio',
        quality: videoQuality
      }).pipe(res);
    }
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to format duration
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API URL: http://localhost:${port}`);
});
