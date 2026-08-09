"use client";

import { useState, useRef } from "react";

interface TrackUploadProps {
  onUploadComplete: () => void;
}

export function TrackUpload({ onUploadComplete }: TrackUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#2c2416]">Upload Music</h3>
      <form className="space-y-3">
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
            <div className="text-left min-w-0">
              <p className="font-medium text-[#2c2416] text-sm sm:text-base truncate">
                {selectedFile ? selectedFile.name : "Select audio file"}
              </p>
            </div>
          </label>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-[#ddd5c8] rounded-lg text-[#2c2416] text-sm sm:text-base"
          placeholder="Track title"
        />
      </form>
    </div>
  );
}
