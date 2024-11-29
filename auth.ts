import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

console.log("process.env.GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session) {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user?.email });
        if (session.user) {
          session.user.id = sessionUser?._id.toString();
        }
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        if (!profile) {
          return false;
        }

        console.log("profile", profile);

        await connectToDB();

        // Check if user already exists in the database
        const userExists = await User.findOne({
          email: profile.email,
        });

        // If user does not exist, create a new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Error signing in", error);
        return false;
      }
    },
  },
};

export const handler = NextAuth(authOptions);
