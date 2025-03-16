import { VideoInfo, DownloadOption, DownloadProgress, DownloadHistoryItem } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Use a public API service instead of local server
const PUBLIC_API_BASE_URL = "https://youtube-data-api.netlify.app/.netlify/functions/api";

// Parse YouTube URL to extract video ID and playlist ID
export const parseYouTubeUrl = (url: string): { videoId: string | null; playlistId: string | null } => {
  try {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);
    
    // Extract video ID
    let videoId = searchParams.get("v");
    if (!videoId && urlObj.pathname.startsWith("/watch/")) {
      videoId = urlObj.pathname.split("/")[2];
    } else if (!videoId && urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.substring(1);
    }
    
    // Extract playlist ID
    const playlistId = searchParams.get("list");
    
    return { videoId, playlistId };
  } catch (error) {
    return { videoId: null, playlistId: null };
  }
};

// Function to validate if a URL is from YouTube
export const isValidYouTubeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const isYouTubeDomain = 
      urlObj.hostname === "youtube.com" || 
      urlObj.hostname === "www.youtube.com" || 
      urlObj.hostname === "youtu.be" || 
      urlObj.hostname === "m.youtube.com";
    
    const { videoId, playlistId } = parseYouTubeUrl(url);
    
    return isYouTubeDomain && (!!videoId || !!playlistId);
  } catch (error) {
    return false;
  }
};

// Fetch video information from public API
export const fetchVideoInfo = async (url: string): Promise<VideoInfo | null> => {
  try {
    const { videoId, playlistId } = parseYouTubeUrl(url);
    
    if (!videoId && !playlistId) {
      throw new Error("Invalid YouTube URL");
    }
    
    console.log(`Attempting to fetch video info for ID: ${videoId}`);
    
    // In sandbox mode, we'll simulate video info retrieval
    try {
      // Try to use the public API first
      const response = await fetch(`${PUBLIC_API_BASE_URL}/video-info?videoId=${videoId}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          id: videoId as string,
          title: data.title || "Sample Video",
          thumbnail: data.thumbnail || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
          duration: data.duration || "3:45",
          author: data.author || "YouTube Creator",
          isPlaylist: false
        };
      } else {
        // Fallback to simulated data if API fails
        console.log("API failed, using fallback data");
        return simulateVideoInfo(videoId as string);
      }
    } catch (error) {
      console.error("Error using public API, falling back to simulated data:", error);
      return simulateVideoInfo(videoId as string);
    }
  } catch (error) {
    console.error("Error fetching video info:", error);
    toast({
      title: "Error fetching video info",
      description: (error as Error).message || "Failed to fetch video data",
      variant: "destructive"
    });
    return null;
  }
};

// Function to simulate video info for demo purposes
const simulateVideoInfo = (videoId: string): VideoInfo => {
  return {
    id: videoId,
    title: "Sample YouTube Video",
    thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    duration: "3:45",
    author: "YouTube Creator",
    isPlaylist: false
  };
};

// Get available download options
export const getDownloadOptions = (isPlaylist: boolean): DownloadOption[] => {
  const videoOptions: DownloadOption[] = [
    { format: "mp4", quality: "1080p", label: "1080p MP4" },
    { format: "mp4", quality: "720p", label: "720p MP4" },
    { format: "mp4", quality: "480p", label: "480p MP4" },
    { format: "mp3", quality: "320kbps", label: "320kbps MP3" },
    { format: "mp3", quality: "192kbps", label: "192kbps MP3" },
    { format: "mp3", quality: "128kbps", label: "128kbps MP3" },
  ];
  
  const playlistOptions: DownloadOption[] = [
    { format: "mp4", quality: "720p", label: "720p MP4 (All Videos)" },
    { format: "mp3", quality: "192kbps", label: "192kbps MP3 (All Audio)" },
    { format: "mp4", quality: "zip", label: "ZIP (All Videos)" },
  ];
  
  return isPlaylist ? playlistOptions : videoOptions;
};

// Simulate download function for frontend-only operation
export const downloadVideo = async (
  videoInfo: VideoInfo,
  option: DownloadOption,
  progressCallback: (progress: number) => void
): Promise<boolean> => {
  try {
    // Set initial progress
    progressCallback(0);
    
    // Create a filename based on video title
    const sanitizedTitle = videoInfo.title.replace(/[^\w\s]/gi, "").substring(0, 50);
    const extension = option.format === "mp3" ? "mp3" : "mp4";
    const filename = `${sanitizedTitle}.${extension}`;
    
    console.log(`Simulating download for: ${filename}`);
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress <= 100) {
        progressCallback(progress);
      } else {
        clearInterval(interval);
      }
    }, 200);
    
    // Simulate download completion after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(interval);
        progressCallback(100);
        
        // Add to download history
        const historyItem: DownloadHistoryItem = {
          id: videoInfo.id,
          title: videoInfo.title,
          thumbnail: videoInfo.thumbnail,
          format: option.format,
          quality: option.quality,
          downloadDate: new Date().toISOString(),
          url: `https://www.youtube.com/watch?v=${videoInfo.id}`
        };
        
        addToDownloadHistory(historyItem);
        
        // Show a toast notification
        toast({
          title: "Download Simulated",
          description: `In sandbox mode, actual downloads are not available. In a production environment, the ${extension.toUpperCase()} file would be downloaded.`,
        });
        
        console.log("Download simulation completed");
        resolve(true);
      }, 3000);
    });
  } catch (error) {
    console.error("Download error:", error);
    toast({
      title: "Download failed",
      description: (error as Error).message,
      variant: "destructive"
    });
    progressCallback(0); // Reset progress
    return false;
  }
};

// Download history functions
export const getDownloadHistory = (): DownloadHistoryItem[] => {
  try {
    const history = localStorage.getItem("neotube-download-history");
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Failed to get download history:", error);
    return [];
  }
};

export const addToDownloadHistory = (item: DownloadHistoryItem): void => {
  try {
    const history = getDownloadHistory();
    
    // Add to the beginning of the array (newest first)
    const updatedHistory = [item, ...history].slice(0, 50); // Keep only the last 50 downloads
    
    localStorage.setItem("neotube-download-history", JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save download history:", error);
  }
};

export const clearDownloadHistory = (): void => {
  try {
    localStorage.removeItem("neotube-download-history");
  } catch (error) {
    console.error("Failed to clear download history:", error);
  }
};

// Format duration
export const formatDuration = (duration: string): string => {
  return duration;
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
