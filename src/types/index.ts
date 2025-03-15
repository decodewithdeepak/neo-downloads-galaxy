
export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  isPlaylist: boolean;
  playlistId?: string;
  playlistTitle?: string;
  videoCount?: number;
}

export interface DownloadOption {
  format: "mp4" | "mp3";
  quality: string;
  label: string;
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  format: string;
  quality: string;
  downloadDate: string;
  url: string;
}

export interface DownloadProgress {
  status: "idle" | "loading" | "downloading" | "complete" | "error";
  progress: number;
  error?: string;
}
