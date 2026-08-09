"use client";

import { Play, Trash2, Music } from "lucide-react";

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
  onTrackSelect: (index: number) => void;
  onDelete: (trackId: string) => void;
}

export function TrackList({ tracks, currentTrackIndex, onTrackSelect, onDelete }: TrackListProps) {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (tracks.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <Music className="w-16 h-16 text-[#b3b3b3] mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">No tracks yet</h3>
        <p className="text-[#535353]">Upload your first track to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-[#e0e0e0]">
        <h3 className="text-xl font-bold">Your Tracks</h3>
        <p className="text-sm text-[#535353]">{tracks.length} tracks</p>
      </div>

      <div className="divide-y divide-[#e0e0e0]">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center gap-4 p-4 hover:bg-[#f5f5f5] transition-colors ${
              currentTrackIndex === index ? "bg-[#e8f5e9]" : ""
            }`}
          >
            {/* Play Button / Index */}
            <button
              onClick={() => onTrackSelect(index)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5f5f5] hover:bg-[#1db954] hover:text-white transition-colors"
            >
              {currentTrackIndex === index ? (
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 bg-[#1db954] animate-pulse" />
                  <div className="w-0.5 h-4 bg-[#1db954] animate-pulse" />
                  <div className="w-0.5 h-2 bg-[#1db954] animate-pulse" />
                </div>
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${
                currentTrackIndex === index ? "text-[#1db954]" : ""
              }`}>
                {track.title}
              </p>
              <p className="text-sm text-[#535353] truncate">
                {track.artist || "Unknown Artist"}
                {track.album && ` • ${track.album}`}
              </p>
            </div>

            {/* Duration */}
            <span className="text-sm text-[#535353]">
              {formatDuration(track.duration)}
            </span>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(track.id)}
              className="p-2 text-[#b3b3b3] hover:text-[#e74c3c] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
