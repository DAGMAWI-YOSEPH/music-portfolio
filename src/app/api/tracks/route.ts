import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { musicTracks } from "@/lib/db/schema";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userTracks = await db
    .select()
    .from(musicTracks)
    .where(eq(musicTracks.userId, session.user.id))
    .orderBy(musicTracks.createdAt);

  return NextResponse.json(userTracks);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const album = formData.get("album") as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: "File and title are required" },
        { status: 400 }
      );
    }

    let fileUrl: string;

    // Check if we're in production (Vercel) or development
    if (process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN !== "vercel_blob_rw_...") {
      // Use Vercel Blob in production
      const blob = await put(`music/${session.user.id}/${file.name}`, file, {
        access: "public",
      });
      fileUrl = blob.url;
    } else {
      // Use local file storage in development
      const uploadDir = path.join(process.cwd(), "public", "uploads", session.user.id);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, file.name);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);
      
      fileUrl = `/uploads/${session.user.id}/${file.name}`;
    }

    // Get audio duration
    const duration = await getAudioDuration(file);

    // Save track to database
    const newTrack = await db
      .insert(musicTracks)
      .values({
        userId: session.user.id,
        title,
        artist: artist || null,
        album: album || null,
        duration: duration || null,
        fileUrl,
      })
      .returning();

    return NextResponse.json(newTrack[0], { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload track" },
      { status: 500 }
    );
  }
}

async function getAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(Math.floor(audio.duration));
    };
    audio.onerror = () => {
      resolve(null);
    };
  });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get("id");

    if (!trackId) {
      return NextResponse.json(
        { error: "Track ID is required" },
        { status: 400 }
      );
    }

    // Verify the track belongs to the user
    const track = await db
      .select()
      .from(musicTracks)
      .where(eq(musicTracks.id, trackId))
      .limit(1);

    if (!track.length || track[0].userId !== session.user.id) {
      return NextResponse.json(
        { error: "Track not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the file from local storage if it's a local file
    if (track[0].fileUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", track[0].fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.delete(musicTracks).where(eq(musicTracks.id, trackId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete track" },
      { status: 500 }
    );
  }
}
