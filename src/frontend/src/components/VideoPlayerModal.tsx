import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function isVimeoUrl(url: string): boolean {
  return url.includes("vimeo.com");
}

function toEmbedUrl(url: string): string {
  // Already an embed URL
  if (url.includes("/embed/")) return url;

  // YouTube watch URL → embed
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  if (ytMatch)
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;

  // Vimeo URL → embed
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch)
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

  return url;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  videoUrl,
  title,
}: VideoPlayerModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isEmbed = isYouTubeUrl(videoUrl) || isVimeoUrl(videoUrl);
  const embedUrl = isEmbed ? toEmbedUrl(videoUrl) : videoUrl;

  // Reset state when modal opens/closes or URL changes
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(false);
    } else {
      // Stop native video playback when modal closes
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    }
  }, [isOpen]);

  const handleIframeLoad = () => setLoading(false);
  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const handleVideoLoad = () => setLoading(false);
  const handleVideoError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-surface-900 border-surface-700/50 rounded-2xl">
        <DialogHeader className="px-4 pt-4 pb-3 flex flex-row items-center justify-between border-b border-surface-700/40">
          <DialogTitle className="font-display font-bold text-white text-base sm:text-lg truncate pr-4">
            {title}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700/60 hover:bg-surface-600 flex items-center justify-center transition-colors"
            aria-label="Close video"
          >
            <X className="w-4 h-4 text-surface-300" />
          </button>
        </DialogHeader>

        <div className="relative w-full aspect-video bg-surface-950">
          {/* Loading Spinner */}
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <Loader2 className="w-10 h-10 text-electric-400 animate-spin" />
              <span className="text-surface-400 text-sm">Loading video…</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <p className="text-white font-semibold text-base">
                Video unavailable
              </p>
              <p className="text-surface-400 text-sm">
                This video could not be loaded. Please try again later.
              </p>
            </div>
          )}

          {/* Embed Player (YouTube / Vimeo) */}
          {isEmbed && !error && (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={title}
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}

          {/* Native Video Player */}
          {!isEmbed && !error && (
            <video
              ref={videoRef}
              key={videoUrl}
              src={videoUrl}
              controls
              playsInline
              autoPlay
              crossOrigin="anonymous"
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
            >
              <track kind="captions" />
            </video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
