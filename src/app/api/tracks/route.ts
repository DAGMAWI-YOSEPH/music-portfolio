import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { musicTracks } from "@/lib/db/schema";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";

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

    const blob = await put(
      `music/${session.user.id}/${Date.now()}-${file.name}`,
      file,
      { access: "public" }
    );

    const newTrack = await db
      .insert(musicTracks)
      .values({
        userId: session.user.id,
        title,
        artist: artist || null,
        album: album || null,
        fileUrl: blob.url,
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
