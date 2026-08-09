"use client";

import { useState, useRef } from "react";
import { Upload, Music, X, ImageIcon } from "lucide-react";

interface TrackUploadProps {
  onUploadComplete: () => void;
}

export function TrackUpload({ onUploadComplete }: TrackUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("audio/")) {
        setError("Please select an audio file");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setSuccess(false);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleArtworkSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file for artwork");
        return;
      }
      setSelectedArtwork(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => setArtworkPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !title) {
      setError("Please select a file and enter a title");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title);
      if (artist) formData.append("artist", artist);
      if (album) formData.append("album", album);
      if (selectedArtwork) formData.append("artwork", selectedArtwork);

      const response = await fetch("/api/tracks", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload track");
      }

      setSelectedFile(null);
      setSelectedArtwork(null);
      setArtworkPreview(null);
      setTitle("");
      setArtist("");
      setAlbum("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (artworkInputRef.current) artworkInputRef.current.value = "";
      setSuccess(true);
      onUploadComplete();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload track");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#2c2416]">Upload Music</h3>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Artwork Upload */}
        <div>
          <input
            type="file"
            ref={artworkInputRef}
            onChange={handleArtworkSelect}
            className="hidden"
            id="artwork-upload"
          />
          <label
            htmlFor="artwork-upload"
            className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-[#ddd5c8] rounded-xl cursor-pointer hover:border-[#8b5e3c] transition-colors overflow-hidden"
          >
            {artworkPreview ? (
              <img
                src={artworkPreview}
                alt="Artwork preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#c9a88c] mb-1 sm:mb-2" />
                <p className="text-[#6b5d50] text-sm sm:text-base">Click to add artwork</p>
                <p className="text-xs text-[#9a8a7a]">JPG, PNG (optional)</p>
              </>
            )}
          </label>
        </div>

        {/* Audio File Input */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="flex items-center gap-3 w-full p-3 sm:p-4 border-2 border-dashed border-[#ddd5c8] rounded-xl cursor-pointer hover:border-[#8b5e3c] transition-colors"
          >
            <Music className="w-6 h-6 sm:w-8 sm:h-8 text-[#8b5e3c] flex-shrink-0" />
            <div className="text-left min-w-0">
              <p className="font-medium text-[#2c2416] text-sm sm:text-base truncate">
                {selectedFile ? selectedFile.name : "Select audio file"}
              </p>
              <p className="text-xs sm:text-sm text-[#6b5d50]">
                {selectedFile
                  ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                  : "MP3, WAV, OGG, etc."}
              </p>
            </div>
            {selectedFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="ml-auto text-[#9a8a7a] hover:text-[#c0392b] flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </label>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs sm:text-sm font-medium mb-1 text-[#2c2416]">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-[#ddd5c8] rounded-lg focus:outline-none focus:border-[#8b5e3c] text-[#2c2416] text-sm sm:text-base"
            placeholder="Track title"
            required
          />
        </div>

        {/* Artist */}
        <div>
          <label htmlFor="artist" className="block text-xs sm:text-sm font-medium mb-1 text-[#2c2416]">
            Artist
          </label>
          <input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-[#ddd5c8] rounded-lg focus:outline-none focus:border-[#8b5e3c] text-[#2c2416] text-sm sm:text-base"
            placeholder="Artist name"
          />
        </div>

        {/* Album */}
        <div>
          <label htmlFor="album" className="block text-xs sm:text-sm font-medium mb-1 text-[#2c2416]">
            Album
          </label>
          <input
            type="text"
            id="album"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-[#ddd5c8] rounded-lg focus:outline-none focus:border-[#8b5e3c] text-[#2c2416] text-sm sm:text-base"
            placeholder="Album name"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-[#c0392b] text-xs sm:text-sm bg-red-50 p-2 rounded-lg">{error}</p>
        )}

        {/* Success */}
        {success && (
          <p className="text-green-700 text-xs sm:text-sm bg-green-50 p-2 rounded-lg">Track uploaded successfully!</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isUploading || !selectedFile || !title}
          className="w-full bg-[#8b5e3c] text-white py-2.5 sm:py-3 rounded-full font-semibold hover:bg-[#a0704e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isUploading ? "Uploading..." : "Upload Track"}
        </button>
      </form>
    </div>
  );
}
