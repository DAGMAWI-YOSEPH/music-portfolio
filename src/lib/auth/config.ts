import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { musicUsers, musicTracks } from "@/lib/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...DrizzleAdapter(db),
    createUser: async (data) => {
      const result = await db
        .insert(musicUsers)
        .values({
          id: data.id,
          name: data.name,
          email: data.email,
          image: data.image,
        })
        .returning();
      return result[0];
    },
    getUser: async (id) => {
      const result = await db.query.musicUsers.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      });
      return result || null;
    },
    getUserByEmail: async (email) => {
      const result = await db.query.musicUsers.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });
      return result || null;
    },
    updateUser: async (data) => {
      if (!data.id) throw new Error("User ID is required");
      const result = await db
        .update(musicUsers)
        .set({
          name: data.name,
          email: data.email,
          image: data.image,
        })
        .where((users, { eq }) => eq(users.id, data.id!))
        .returning();
      return result[0];
    },
    deleteUser: async (id) => {
      await db.delete(musicUsers).where((users, { eq }) => eq(users.id, id));
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
});
