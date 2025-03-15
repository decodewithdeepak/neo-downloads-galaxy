
import { cn } from "@/lib/utils";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  return (
    <div className={cn("text-center py-12 md:py-20 px-4", className)}>
      <div className="inline-flex items-center bg-neoblue-50 text-neoblue-600 text-sm px-3 py-1 rounded-full mb-6 animate-fade-in">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1"
        >
          <path
            d="M15.4857 20H19.4857C20.5903 20 21.4857 19.1046 21.4857 18V6C21.4857 4.89543 20.5903 4 19.4857 4H15.4857V6H19.4857V18H15.4857V20Z"
            fill="currentColor"
          />
          <path
            d="M10.1582 17.385L8.73801 15.9768L12.6572 12.0242L3.51428 12.0242C2.96199 12.0242 2.51428 11.5765 2.51428 11.0242C2.51428 10.4719 2.96199 10.0242 3.51428 10.0242L12.6572 10.0242L8.73801 6.07007L10.1582 4.64185L16.5564 11.0401L10.1582 17.385Z"
            fill="currentColor"
          />
        </svg>
        Simple, safe, and fast downloads
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-neogray-900 tracking-tight animate-slide-up">
        Download YouTube Videos <br className="hidden md:block" />
        <span className="text-neoblue-500">in the simplest way</span>
      </h1>
      
      <p className="text-neogray-600 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up animation-delay-100">
        Just paste a YouTube URL, select your preferred format and quality, and download your content instantly.
      </p>
      
      <div className="mt-8 mb-4 flex items-center justify-center space-x-4 animate-slide-up animation-delay-200">
        <div className="flex items-center text-neogray-600 text-sm">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1.5 text-neoblue-500"
          >
            <path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          MP4 format
        </div>
        <div className="flex items-center text-neogray-600 text-sm">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1.5 text-neoblue-500"
          >
            <path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          MP3 format
        </div>
        <div className="flex items-center text-neogray-600 text-sm">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1.5 text-neoblue-500"
          >
            <path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Playlist downloads
        </div>
      </div>
    </div>
  );
};

export default Hero;
