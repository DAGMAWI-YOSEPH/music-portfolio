"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface User {
  name: string | null;
  email: string | null;
  image: string | null;
  id: string;
}

export function DashboardClient({ user }: { user: User }) {
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
        <h1 className="text-2xl font-bold text-[#2c2416]">
          Welcome, {user.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-[#6b5d50] mt-2 text-sm">Upload component goes here</p>
      </main>
    </div>
  );
}
