import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { musicTracks } from "@/lib/db/schema";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

async function getUserId(request: NextRequest) {
  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("Auth token:", token ? { sub: token.sub, id: token.id, email: token.email } : null);
  return (token?.sub || token?.id) as string | undefined;
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userTracks = await db
    .select()
    .from(musicTracks)
    .where(eq(musicTracks.userId, userId))
    .orderBy(musicTracks.createdAt);

  return NextResponse.json(userTracks);
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const artwork = formData.get("artwork") as File | null;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const album = formData.get("album") as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: "File and title are required" },
        { status: 400 }
      );
    }

    const sanitize = (name: string) =>
      name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_");

    const ext = file.name.split(".").pop() || "bin";
    const safeName = `${Date.now()}-${sanitize(file.name.replace(/\.[^/.]+$/, ""))}.${ext}`;

    const blob = await put(
      `music/${userId}/${safeName}`,
      file,
      { access: "public" }
    );

    let coverUrl: string | null = null;
    if (artwork && artwork.size > 0) {
      const artExt = artwork.name.split(".").pop() || "png";
      const artSafeName = `${Date.now()}-${sanitize(artwork.name.replace(/\.[^/.]+$/, ""))}.${artExt}`;
      const artBlob = await put(
        `artwork/${userId}/${artSafeName}`,
        artwork,
        { access: "public" }
      );
      coverUrl = artBlob.url;
    }

    const newTrack = await db
      .insert(musicTracks)
      .values({
        userId,
        title,
        artist: artist || null,
        album: album || null,
        fileUrl: blob.url,
        coverUrl,
      })
      .returning();

    return NextResponse.json(newTrack[0], { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    const msg =
      error?.name === "DOMException"
        ? `DOMException: ${error.message} (pattern: ${error.pattern || "n/a"})`
        : error instanceof Error
          ? error.message
          : "Failed to upload track";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const userId = await getUserId(request);

  if (!userId) {
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

    if (!track.length || track[0].userId !== userId) {
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
