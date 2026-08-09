"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { AudioPlayer } from "@/components/audio-player";
import { TrackUpload } from "@/components/track-upload";
import { TrackList } from "@/components/track-list";

interface Track {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  duration: number | null;
  fileUrl: string;
  coverUrl: string | null;
}

interface User {
  name: string | null;
  email: string | null;
  image: string | null;
  id: string;
}

export function DashboardClient({ user }: { user: User }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await fetch("/api/tracks");
      if (response.ok) {
        const data = await response.json();
        setTracks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSelect = useCallback(
    (index: number) => {
      if (currentTrackIndex === index) {
        setIsPlaying((prev) => !prev);
      } else {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
      }
    },
    [currentTrackIndex]
  );

  const handleClearAll = async () => {
    if (!confirm("Delete ALL tracks? This cannot be undone.")) return;
    try {
      const response = await fetch("/api/tracks/clear", { method: "DELETE" });
      if (response.ok) {
        setTracks([]);
        setCurrentTrackIndex(null);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Failed to clear tracks:", error);
    }
  };

  const handleDelete = async (trackId: string) => {
    if (!confirm("Delete this track?")) return;
    try {
      const response = await fetch(`/api/tracks?id=${trackId}`, { method: "DELETE" });
      if (response.ok) {
        setTracks(tracks.filter((t) => t.id !== trackId));
        if (currentTrackIndex !== null) {
          const deletedIndex = tracks.findIndex((t) => t.id === trackId);
          if (deletedIndex < currentTrackIndex) {
            setCurrentTrackIndex(currentTrackIndex - 1);
          } else if (deletedIndex === currentTrackIndex) {
            setCurrentTrackIndex(null);
            setIsPlaying(false);
          }
        }
      }
    } catch (error) {
      console.error("Failed to delete track:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5e3c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <header className="bg-[#1a1410] text-white py-3 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-white">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span className="text-lg sm:text-xl font-bold">Music Portfolio</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              {user.image && (
                <img src={user.image} alt={user.name || "User"} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
              )}
              <span className="text-xs sm:text-sm hidden sm:inline">{user.name}</span>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-[#c9a88c] hover:text-white transition-colors">
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2c2416]">
              Welcome, {user.name?.split(" ")[0] || "there"}
            </h1>
            <p className="text-[#6b5d50] mt-2 text-sm sm:text-base">
              Manage and play your music collection
            </p>
          </div>
          {tracks.length > 0 && (
            <button onClick={handleClearAll} className="text-sm bg-[#c0392b] text-white px-4 py-2 rounded-lg hover:bg-[#a02010] transition-colors self-start">
              Clear all tracks
            </button>
          )}
        </div>

        {tracks.length > 0 && currentTrackIndex !== null && (
          <div className="mb-6 sm:mb-8">
            <AudioPlayer
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onTrackChange={(i) => { setCurrentTrackIndex(i); setIsPlaying(true); }}
              onPlayStateChange={setIsPlaying}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <TrackUpload onUploadComplete={fetchTracks} />
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <TrackList
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onTrackSelect={handleTrackSelect}
              onDelete={handleDelete}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
