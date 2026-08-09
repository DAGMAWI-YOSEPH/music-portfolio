"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Music } from "lucide-react";
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTracks();
    }
  }, [status]);

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

  const handleDelete = async (trackId: string) => {
    if (!confirm("Are you sure you want to delete this track?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tracks?id=${trackId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTracks(tracks.filter((t) => t.id !== trackId));
        if (currentTrackIndex !== null) {
          const deletedIndex = tracks.findIndex((t) => t.id === trackId);
          if (deletedIndex < currentTrackIndex) {
            setCurrentTrackIndex(currentTrackIndex - 1);
          } else if (deletedIndex === currentTrackIndex) {
            setCurrentTrackIndex(null);
          }
        }
      }
    } catch (error) {
      console.error("Failed to delete track:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954]" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fce4ec]">
      {/* Header */}
      <header className="bg-[#191414] text-white py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span className="text-xl font-bold">Music Portfolio</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm">{session.user?.name}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-[#b3b3b3] hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#191414]">
            Welcome, {session.user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-[#535353] mt-2">
            Manage and play your music collection
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload */}
          <div className="lg:col-span-1">
            <TrackUpload onUploadComplete={fetchTracks} />
          </div>

          {/* Right Column - Player and Track List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Audio Player */}
            {tracks.length > 0 && currentTrackIndex !== null && (
              <AudioPlayer
                tracks={tracks}
                currentTrackIndex={currentTrackIndex}
                onTrackChange={setCurrentTrackIndex}
              />
            )}

            {/* Track List */}
            <TrackList
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              onTrackSelect={setCurrentTrackIndex}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
