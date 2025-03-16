
import { useState } from "react";
import { isValidYouTubeUrl } from "@/lib/videoUtils";
import { cn } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  className?: string;
}

const UrlInput = ({ onSubmit, isLoading, className }: UrlInputProps) => {
  const [url, setUrl] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please enter a valid YouTube URL");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setIsError(true);
      setErrorMessage("Please enter a YouTube URL");
      return;
    }
    
    if (!isValidYouTubeUrl(url)) {
      setIsError(true);
      setErrorMessage("Please enter a valid YouTube URL");
      return;
    }
    
    setIsError(false);
    onSubmit(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (isError) {
      setIsError(false);
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-4", className)}>
      <form 
        onSubmit={handleSubmit} 
        className="transition-all duration-300"
      >
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neogray-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 12L10.5 14V10L14 12Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12.7073C2 11.3118 2 10.614 2.17882 10.0124C2.33562 9.4778 2.60093 8.98685 2.95218 8.57585C3.35312 8.10056 3.91755 7.75654 5.04641 7.0685L8.37076 5.03852C9.61302 4.27919 10.2342 3.89952 10.9048 3.75C11.4997 3.61601 12.1158 3.61601 12.7107 3.75C13.3813 3.89952 14.0024 4.27919 15.2447 5.03852L18.5691 7.0685C19.6979 7.75654 20.2624 8.10056 20.6633 8.57585C21.0146 8.98685 21.2799 9.4778 21.4367 10.0124C21.6155 10.614 21.6155 11.3118 21.6155 12.7073V16.5073C21.6155 18.3474 21.6155 19.2674 21.2822 19.9749C20.9903 20.5971 20.5191 21.1126 19.9348 21.4354C19.2699 21.7998 18.3939 21.7998 16.6419 21.7998H7.97366C6.22171 21.7998 5.34573 21.7998 4.68077 21.4354C4.0965 21.1126 3.62531 20.5971 3.3334 19.9749C3 19.2674 3 18.3474 3 16.5073V16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <input
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="Paste YouTube URL here..."
            className={cn(
              "neo-input pl-12 pr-36 py-4 text-base md:text-lg",
              isError && "border-destructive focus:ring-destructive/20 focus:border-destructive"
            )}
            disabled={isLoading}
            data-testid="url-input"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <button
              type="submit"
              className="neo-button flex items-center justify-center px-4 py-2"
              disabled={isLoading}
              data-testid="download-button"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
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
              )}
              {isLoading ? "Processing..." : "Download"}
            </button>
          </div>
        </div>
      </form>
      
      {isError && (
        <div className="animate-slide-down">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      )}
      
      <div className="text-center text-sm text-muted-foreground mt-2">
        <p>
          Make sure the backend server is running at <code className="bg-muted px-1 py-0.5 rounded">http://localhost:5000</code>
        </p>
        <p className="mt-1">
          To start the server, open a terminal in the server directory and run:
          <br />
          <code className="bg-muted px-1 py-0.5 rounded">npm start</code> or <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code>
        </p>
      </div>
    </div>
  );
};

export default UrlInput;
