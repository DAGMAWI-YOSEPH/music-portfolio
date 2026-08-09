"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  duration: number | null;
  fileUrl: string;
  coverUrl: string | null;
}

interface AudioPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onTrackChange: (index: number) => void;
  onPlayStateChange: (playing: boolean) => void;
}

export function AudioPlayer({
  tracks,
  currentTrackIndex,
  isPlaying,
  onTrackChange,
  onPlayStateChange,
}: AudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const armRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      onPlayStateChange(false);
    } else {
      audioRef.current.play().catch(() => {});
      onPlayStateChange(true);
    }
  }, [isPlaying, onPlayStateChange]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      onTrackChange(currentTrackIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      onTrackChange(currentTrackIndex + 1);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) return null;

  const rotationDeg = duration > 0 ? (currentTime / duration) * 360 : 0;

  return (
    <div className="bg-[#1a1410] text-white rounded-3xl shadow-2xl overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.fileUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          onPlayStateChange(false);
          if (currentTrackIndex < tracks.length - 1) {
            onTrackChange(currentTrackIndex + 1);
          }
        }}
        preload="metadata"
      />

      <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 p-6 sm:p-8">
        {/* Turntable */}
        <div className="relative flex-shrink-0">
          {/* Turntable base */}
          <div
            className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #2c2416 0%, #1a1410 70%, #0d0a07 100%)",
              boxShadow:
                "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Vinyl grooves */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: `${8 + i * 3.5}%`,
                  left: `${8 + i * 3.5}%`,
                  right: `${8 + i * 3.5}%`,
                  bottom: `${8 + i * 3.5}%`,
                  border: `1px solid rgba(74, 63, 50, ${0.3 + i * 0.03})`,
                }}
              />
            ))}

            {/* Spinning platter */}
            <div
              className="absolute rounded-full"
              style={{
                top: "5%",
                left: "5%",
                right: "5%",
                bottom: "5%",
                background:
                  "conic-gradient(from 0deg, #2c2416, #3a3025, #2c2416, #1a1611, #2c2416)",
                animation: isPlaying
                  ? "spin 2s linear infinite"
                  : "none",
                transform: isPlaying ? undefined : `rotate(${rotationDeg}deg)`,
              }}
            >
              {/* Album art center */}
              <div
                className="absolute rounded-full overflow-hidden flex items-center justify-center"
                style={{
                  top: "25%",
                  left: "25%",
                  right: "25%",
                  bottom: "25%",
                }}
              >
                {currentTrack.coverUrl ? (
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#3d3228] to-[#2c2416] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-10 h-10 sm:w-12 sm:h-12 fill-[#8b5e3c] opacity-60"
                    >
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Center spindle */}
              <div
                className="absolute rounded-full bg-[#1a1611] border-2 border-[#3a3025]"
                style={{
                  top: "46%",
                  left: "46%",
                  right: "46%",
                  bottom: "46%",
                }}
              />
            </div>

            {/* Tonearm */}
            <div
              ref={armRef}
              className="absolute -top-2 -right-4 sm:-right-6 origin-top-right"
              style={{
                transform: isPlaying
                  ? "rotate(18deg)"
                  : "rotate(-2deg)",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 10,
              }}
            >
              {/* Arm pivot */}
              <div className="relative">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#c9a88c] border-2 border-[#a08060] shadow-lg" />
                {/* Arm */}
                <div
                  className="absolute top-2 sm:top-3 left-0 w-24 sm:w-32 h-1.5 bg-gradient-to-r from-[#c9a88c] to-[#a08060] rounded-full"
                  style={{
                    transform: "rotate(30deg)",
                    transformOrigin: "left center",
                  }}
                >
                  {/* Headshell */}
                  <div className="absolute -right-1 -top-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#8b7a68] rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 w-full text-center lg:text-left">
          {/* Track Info */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {currentTrack.title}
            </h2>
            <p className="text-[#c9a88c] mt-1 text-sm sm:text-base">
              {currentTrack.artist || "Unknown Artist"}
              {currentTrack.album && ` · ${currentTrack.album}`}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-4 sm:mb-6">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#3a3025] rounded-full appearance-none cursor-pointer accent-[#8b5e3c]"
            />
            <div className="flex justify-between text-xs text-[#9a8a7a] mt-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-4 sm:mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentTrackIndex === 0}
              className="text-[#9a8a7a] hover:text-white transition-colors disabled:opacity-30"
            >
              <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="bg-white text-[#1a1410] w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 sm:w-7 sm:h-7" />
              ) : (
                <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1" />
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentTrackIndex === tracks.length - 1}
              className="text-[#9a8a7a] hover:text-white transition-colors disabled:opacity-30"
            >
              <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center justify-center lg:justify-start gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-[#9a8a7a] hover:text-white transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-24 h-1 bg-[#3a3025] rounded-full appearance-none cursor-pointer accent-[#8b5e3c]"
            />
          </div>

          {/* Track counter */}
          <p className="text-xs text-[#6b5d50] mt-3 sm:mt-4 text-center lg:text-left">
            Track {currentTrackIndex + 1} of {tracks.length}
          </p>
        </div>
      </div>
    </div>
  );
}
