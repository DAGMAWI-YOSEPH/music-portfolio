import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { musicTracks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.delete(musicTracks).where(eq(musicTracks.userId, session.user.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear tracks error:", error);
    return NextResponse.json(
      { error: "Failed to clear tracks" },
      { status: 500 }
    );
  }
}
