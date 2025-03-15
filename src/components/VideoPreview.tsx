
import { useState } from "react";
import { VideoInfo, DownloadOption } from "@/types";
import { getDownloadOptions } from "@/lib/videoUtils";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  videoInfo: VideoInfo;
  onDownload: (option: DownloadOption) => void;
  isDownloading: boolean;
  progress: number;
  className?: string;
}

const VideoPreview = ({
  videoInfo,
  onDownload,
  isDownloading,
  progress,
  className,
}: VideoPreviewProps) => {
  const [selectedOption, setSelectedOption] = useState<DownloadOption | null>(null);

  const downloadOptions = getDownloadOptions(videoInfo.isPlaylist);

  const handleOptionChange = (option: DownloadOption) => {
    setSelectedOption(option);
  };

  const handleDownload = () => {
    if (selectedOption) {
      onDownload(selectedOption);
    }
  };

  return (
    <div
      className={cn(
        "neo-card p-6 animate-scale-in w-full max-w-3xl mx-auto",
        className
      )}
    >
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-2/5 relative rounded-lg overflow-hidden shadow-md">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-full h-auto aspect-video object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
            {videoInfo.duration}
          </div>
        </div>
        
        <div className="w-full md:w-3/5 space-y-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold line-clamp-2 dark:text-white" title={videoInfo.title}>
              {videoInfo.title}
            </h2>
            <p className="text-neogray-600 dark:text-neogray-400 text-sm mt-1">{videoInfo.author}</p>
            {videoInfo.isPlaylist && (
              <div className="mt-2 inline-flex items-center bg-neogray-100 dark:bg-neogray-700 text-neogray-800 dark:text-neogray-200 text-xs px-2 py-1 rounded">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M3 7H21M3 12H21M3 17H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Playlist • {videoInfo.videoCount} videos
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-neogray-800 dark:text-neogray-200">Select format and quality:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {downloadOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionChange(option)}
                  className={cn(
                    "px-3 py-2 text-sm border rounded-lg transition-all duration-200",
                    selectedOption?.label === option.label
                      ? "bg-neoblue-50 dark:bg-neoblue-900/50 border-neoblue-300 dark:border-neoblue-700 text-neoblue-700 dark:text-neoblue-300"
                      : "border-neogray-200 dark:border-neogray-700 hover:border-neoblue-200 dark:hover:border-neoblue-700 hover:bg-neoblue-50/50 dark:hover:bg-neoblue-900/30"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {isDownloading ? (
            <div className="space-y-2">
              <div className="w-full bg-neogray-100 dark:bg-neogray-700 rounded-full h-2.5">
                <div
                  className="bg-neoblue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-neogray-600 dark:text-neogray-400">
                {progress < 100 ? `Downloading... ${Math.round(progress)}%` : "Download complete!"}
              </p>
            </div>
          ) : (
            <button
              onClick={handleDownload}
              disabled={!selectedOption}
              className={cn(
                "neo-button w-full flex items-center justify-center",
                !selectedOption && "opacity-70 cursor-not-allowed"
              )}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
