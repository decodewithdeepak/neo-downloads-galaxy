import { VideoInfo, DownloadOption, DownloadHistoryItem } from "@/types";
import { toast } from "@/components/ui/use-toast";

// API base URL - this should point to your Express server
const API_BASE_URL = "http://localhost:5000";

// Mock function to parse YouTube URL (in real implementation this would check for valid YouTube URLs)
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

// Fetch video information from the backend API
export const fetchVideoInfo = async (url: string): Promise<VideoInfo | null> => {
  try {
    const { videoId, playlistId } = parseYouTubeUrl(url);
    
    if (!videoId && !playlistId) {
      throw new Error("Invalid YouTube URL");
    }
    
    // Real API call to our backend
    const apiUrl = `${API_BASE_URL}/api/video-info?${videoId ? `videoId=${videoId}` : ''}${playlistId ? `&playlistId=${playlistId}` : ''}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch video information");
    }
    
    const videoInfo = await response.json();
    return videoInfo;
  } catch (error) {
    toast({
      title: "Error fetching video info",
      description: (error as Error).message,
      variant: "destructive"
    });
    return null;
  }
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

// Real download function that streams from our Express backend
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
    
    // Build URL for download endpoint
    const downloadUrl = `${API_BASE_URL}/api/download?videoId=${videoInfo.id}&format=${option.format}&quality=${option.quality}`;
    
    // Fetch the file as a blob
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Download failed");
    }
    
    // Use a ReadableStream to track download progress
    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get('Content-Length') || '0');
    
    if (!reader) {
      throw new Error("Unable to read response stream");
    }
    
    // Read the data stream and track progress
    let receivedLength = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      chunks.push(value);
      receivedLength += value.length;
      
      // Calculate and report progress
      const progress = contentLength ? Math.round((receivedLength / contentLength) * 100) : 0;
      progressCallback(progress > 100 ? 100 : progress);
    }
    
    // Combine all chunks into a single Blob
    const blob = new Blob(chunks, { 
      type: option.format === "mp3" ? "audio/mp3" : "video/mp4" 
    });
    
    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Set final progress
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
    
    return true;
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
