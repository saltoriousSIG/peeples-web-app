"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";


export function VideoFeed() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };


  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-primary/10 flex-shrink-0">
      <div className="relative aspect-video md:aspect-video bg-gradient-to-br from-amber-900/20 to-stone-900/40">
        <video
          ref={videoRef}
          key="video"
          src="https://pub-7225440c18314cf09d504db7173350c7.r2.dev/full_commercial.mp4"
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 via-transparent to-amber-900/20 pointer-events-none" />
        <div className="absolute top-3 right-3 text-right">
          <p className="text-base sm:text-xl font-bold text-white drop-shadow-lg">
            {formatTime(currentTime)}
          </p>
        </div>
        <div className="absolute top-3 left-3 bg-destructive/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          PEEPLES TV
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white transition-all rounded-full backdrop-blur-sm z-[100]"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3">
          <p className="text-white text-xs sm:text-sm font-medium">
            Mr Peeples Donut Shop
          </p>
        </div>
      </div>
    </div>
  );
}
