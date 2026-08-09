import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { musicTracks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const userId = (token?.sub || token?.id) as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.delete(musicTracks).where(eq(musicTracks.userId, userId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear tracks error:", error);
    return NextResponse.json(
      { error: "Failed to clear tracks" },
      { status: 500 }
    );
  }
}
