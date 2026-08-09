import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS music_users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log("Created music_users table");

    await sql.query(`
      CREATE TABLE IF NOT EXISTS music_tracks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES music_users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        artist TEXT,
        album TEXT,
        duration INTEGER,
        file_url TEXT NOT NULL,
        cover_url TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log("Created music_tracks table");

    await sql.query(`
      CREATE INDEX IF NOT EXISTS idx_music_tracks_user_id ON music_tracks(user_id)
    `);
    console.log("Created index");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
