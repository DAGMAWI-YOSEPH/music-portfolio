import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const musicUsers = pgTable("music_users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const musicTracks = pgTable("music_tracks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => musicUsers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  artist: text("artist"),
  album: text("album"),
  duration: integer("duration"),
  fileUrl: text("file_url").notNull(),
  coverUrl: text("cover_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
