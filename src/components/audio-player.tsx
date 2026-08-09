"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { VinylRecord } from "./vinyl-record";

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
  onTrackChange: (index: number) => void;
}

export function AudioPlayer({ tracks, currentTrackIndex, onTrackChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="bg-[#2c2416] text-white p-4 sm:p-6 rounded-2xl shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.fileUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (currentTrackIndex < tracks.length - 1) {
            onTrackChange(currentTrackIndex + 1);
          }
        }}
      />

      <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:gap-8">
        {/* Vinyl Record */}
        <div className="flex-shrink-0">
          <VinylRecord
            isPlaying={isPlaying}
            size={160}
            coverUrl={currentTrack.coverUrl || undefined}
          />
        </div>

        {/* Player Controls */}
        <div className="flex-1 w-full">
          {/* Track Info */}
          <div className="text-center md:text-left mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">{currentTrack.title}</h2>
            {currentTrack.artist && (
              <p className="text-[#c9a88c] mt-1 text-sm sm:text-base">{currentTrack.artist}</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-3 sm:mb-4">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-[#4a3f32] rounded-lg appearance-none cursor-pointer accent-[#c9956b]"
            />
            <div className="flex justify-between text-xs text-[#9a8a7a] mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={handlePrevious}
              disabled={currentTrackIndex === 0}
              className="text-[#9a8a7a] hover:text-white transition-colors disabled:opacity-50"
            >
              <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="bg-white text-[#2c2416] p-2.5 sm:p-3 rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentTrackIndex === tracks.length - 1}
              className="text-[#9a8a7a] hover:text-white transition-colors disabled:opacity-50"
            >
              <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Volume - hidden on small screens */}
            <div className="hidden sm:flex items-center gap-2 ml-4">
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
                className="w-20 h-1 bg-[#4a3f32] rounded-lg appearance-none cursor-pointer accent-[#c9956b]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
