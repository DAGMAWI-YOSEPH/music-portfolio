"use client";

import { Play, Pause, Trash2, Music } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  duration: number | null;
  fileUrl: string;
  coverUrl: string | null;
}

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
  onDelete: (trackId: string) => void;
  onClearAll: () => void;
}

export function TrackList({ tracks, currentTrackIndex, isPlaying, onTrackSelect, onDelete, onClearAll }: TrackListProps) {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (tracks.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg text-center">
        <Music className="w-12 h-12 sm:w-16 sm:h-16 text-[#c9a88c] mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#2c2416]">No tracks yet</h3>
        <p className="text-[#6b5d50] text-sm sm:text-base">Upload your first track to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-[#e8e0d4] flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#2c2416]">Your Tracks</h3>
          <p className="text-xs sm:text-sm text-[#6b5d50]">{tracks.length} tracks</p>
        </div>
        {tracks.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-[#c0392b] hover:text-[#a02010] underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-[#e8e0d4]">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-[#f5f0e8] transition-colors cursor-pointer ${
              currentTrackIndex === index ? "bg-[#f0e6d8]" : ""
            }`}
            onClick={() => onTrackSelect(index)}
          >
            {/* Artwork or Play */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#f5f0e8] flex items-center justify-center">
              {track.coverUrl ? (
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              ) : currentTrackIndex === index && isPlaying ? (
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 bg-[#8b5e3c] animate-pulse" />
                  <div className="w-0.5 h-4 bg-[#8b5e3c] animate-pulse" />
                  <div className="w-0.5 h-2 bg-[#8b5e3c] animate-pulse" />
                </div>
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b5e3c] ml-0.5" />
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate text-sm sm:text-base ${
                currentTrackIndex === index ? "text-[#8b5e3c]" : "text-[#2c2416]"
              }`}>
                {track.title}
              </p>
              <p className="text-xs sm:text-sm text-[#6b5d50] truncate">
                {track.artist || "Unknown Artist"}
                {track.album && ` · ${track.album}`}
              </p>
            </div>

            {/* Duration */}
            <span className="text-xs sm:text-sm text-[#9a8a7a] flex-shrink-0">
              {formatDuration(track.duration)}
            </span>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(track.id);
              }}
              className="p-1.5 sm:p-2 text-[#c9a88c] hover:text-[#c0392b] transition-colors flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
