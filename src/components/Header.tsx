
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("w-full py-6 px-4 md:px-8", className)}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-neoblue-500"
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
          <h1 className="text-xl font-semibold text-neogray-900 dark:text-white">neotube</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-neogray-700 dark:text-neogray-300 hover:text-neoblue-500 dark:hover:text-neoblue-400 transition-colors">Home</a>
            <a href="#history" className="text-neogray-700 dark:text-neogray-300 hover:text-neoblue-500 dark:hover:text-neoblue-400 transition-colors">History</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neogray-700 dark:text-neogray-300 hover:text-neoblue-500 dark:hover:text-neoblue-400 transition-colors">GitHub</a>
          </nav>
          
          <ThemeToggle />
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-button-secondary text-sm hidden md:flex dark:bg-neogray-800 dark:text-white dark:border-neogray-700 dark:hover:bg-neogray-700"
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
                d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.52 21.276 9.52 21.008C9.52 20.766 9.512 20.044 9.508 19.192C6.726 19.79 6.139 17.77 6.139 17.77C5.684 16.552 5.029 16.248 5.029 16.248C4.142 15.592 5.097 15.604 5.097 15.604C6.082 15.674 6.612 16.669 6.612 16.669C7.5 18.248 8.97 17.818 9.54 17.558C9.631 16.898 9.889 16.468 10.175 16.218C7.955 15.968 5.619 15.076 5.619 11.317C5.619 10.213 6.02 9.308 6.633 8.596C6.54 8.339 6.168 7.308 6.734 5.985C6.734 5.985 7.562 5.716 9.5 7.09C10.29 6.867 11.15 6.756 12 6.753C12.85 6.756 13.71 6.867 14.5 7.09C16.44 5.715 17.266 5.984 17.266 5.984C17.832 7.308 17.46 8.34 17.367 8.595C17.98 9.308 18.38 10.212 18.38 11.317C18.38 15.086 16.04 15.965 13.813 16.212C14.172 16.517 14.5 17.122 14.5 18.041C14.5 19.342 14.486 20.676 14.486 21.005C14.486 21.275 14.664 21.583 15.174 21.487C19.138 20.161 22 16.415 22 12C22 6.477 17.523 2 12 2Z"
                fill="currentColor"
              />
            </svg>
            Star on GitHub
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
