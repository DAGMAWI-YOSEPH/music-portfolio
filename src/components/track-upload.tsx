"use client";

interface TrackUploadProps {
  onUploadComplete: () => void;
}

export function TrackUpload({ onUploadComplete }: TrackUploadProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#2c2416]">Upload Music</h3>
      <p className="text-sm text-[#6b5d50]">Upload form placeholder</p>
    </div>
  );
}
