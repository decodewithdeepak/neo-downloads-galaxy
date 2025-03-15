
import { useState, useEffect } from "react";
import { DownloadHistoryItem } from "@/types";
import { getDownloadHistory, clearDownloadHistory, formatDate } from "@/lib/videoUtils";
import { cn } from "@/lib/utils";

interface DownloadHistoryProps {
  className?: string;
}

const DownloadHistory = ({ className }: DownloadHistoryProps) => {
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for aesthetic purposes
    const timer = setTimeout(() => {
      const downloadHistory = getDownloadHistory();
      setHistory(downloadHistory);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClearHistory = () => {
    clearDownloadHistory();
    setHistory([]);
  };

  return (
    <div id="history" className={cn("w-full max-w-3xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-neogray-900">Download History</h2>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="neo-button-secondary text-sm"
          >
            Clear History
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="neo-card p-4 animate-pulse flex items-center gap-4"
            >
              <div className="w-24 h-16 bg-neogray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neogray-200 rounded w-3/4"></div>
                <div className="h-3 bg-neogray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="neo-card p-8 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto text-neogray-400 mb-4"
          >
            <path
              d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="text-lg font-medium text-neogray-800 mb-2">No downloads yet</h3>
          <p className="text-neogray-600">
            Your download history will appear here once you download videos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="neo-card p-4 flex flex-col sm:flex-row items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-full sm:w-24 aspect-video sm:h-16 overflow-hidden rounded bg-neogray-100">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 w-full">
                <h3 className="font-medium line-clamp-1 text-neogray-900" title={item.title}>
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-neogray-600">
                  <span>{formatDate(item.downloadDate)}</span>
                  <span className="px-2 py-0.5 bg-neogray-100 rounded-full">
                    {item.format.toUpperCase()} • {item.quality}
                  </span>
                </div>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-neoblue-500 hover:text-neoblue-600 transition-colors"
                title="Open in YouTube"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11M15 3H21M21 3V9M21 3L10 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadHistory;
