-- Create music_users table
CREATE TABLE IF NOT EXISTS music_users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create music_tracks table
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
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_music_tracks_user_id ON music_tracks(user_id);
