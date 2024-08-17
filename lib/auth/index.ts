import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { db } from "../db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import config from "./configs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...config,
  adapter: DrizzleAdapter(db),
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "no-reply@change-detector.com",
      secret: process.env.AUTH_SECRET,
    }),
  ],
});

export async function getLoggedInUserId() {
  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  return userId;
}
