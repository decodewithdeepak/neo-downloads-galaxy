
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import UrlInput from "@/components/UrlInput";
import VideoPreview from "@/components/VideoPreview";
import DownloadHistory from "@/components/DownloadHistory";
import { VideoInfo, DownloadOption, DownloadProgress } from "@/types";
import { fetchVideoInfo, downloadVideo } from "@/lib/videoUtils";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    status: "idle",
    progress: 0,
  });

  const handleUrlSubmit = async (url: string) => {
    setLoading(true);
    try {
      const info = await fetchVideoInfo(url);
      setVideoInfo(info);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch video information",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (option: DownloadOption) => {
    if (!videoInfo) return;

    setDownloadProgress({
      status: "downloading",
      progress: 0,
    });

    try {
      const success = await downloadVideo(
        videoInfo,
        option,
        (progress) => {
          setDownloadProgress({
            status: progress < 100 ? "downloading" : "complete",
            progress,
          });
        }
      );

      if (success) {
        toast({
          title: "Download Complete",
          description: "Your download has completed successfully",
        });
      }
    } catch (error) {
      setDownloadProgress({
        status: "error",
        progress: 0,
        error: (error as Error).message,
      });
      
      toast({
        title: "Download Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pb-20">
        <Hero />
        
        <div className="mb-16">
          <UrlInput 
            onSubmit={handleUrlSubmit} 
            isLoading={loading} 
            className={videoInfo ? "mb-8" : "mb-0"}
          />
          
          {videoInfo && (
            <VideoPreview
              videoInfo={videoInfo}
              onDownload={handleDownload}
              isDownloading={downloadProgress.status === "downloading"}
              progress={downloadProgress.progress}
              className="mt-8"
            />
          )}
        </div>
        
        <DownloadHistory className="mt-16" />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
