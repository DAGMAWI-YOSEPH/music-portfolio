import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { VinylRecord } from "@/components/vinyl-record";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-5">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-[#2c2416]">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span className="text-lg sm:text-xl font-bold text-[#2c2416]">Music Portfolio</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-medium bg-[#8b5e3c] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#a0704e] transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium bg-[#2c2416] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#3d3228] transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-5 sm:space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2c2416] leading-tight">
              Your music,
              <br />
              <span className="text-[#8b5e3c]">your way</span>
            </h1>
            <p className="text-base sm:text-lg text-[#6b5d50] max-w-md mx-auto md:mx-0">
              Upload, organize, and play your personal music collection.
              Your tracks, always accessible.
            </p>
            <Link
              href={session?.user ? "/dashboard" : "/login"}
              className="inline-block bg-[#8b5e3c] text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-[#a0704e] transition-all hover:scale-105"
            >
              {session?.user ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>

          {/* Right Content - Vinyl Record */}
          <div className="flex justify-center">
            <VinylRecord isPlaying={true} size={280} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-8 border-t border-[#ddd5c8]">
        <div className="max-w-6xl mx-auto text-center text-xs text-[#9a8a7a]">
          © 2026 Music Portfolio
        </div>
      </footer>
    </div>
  );
}
