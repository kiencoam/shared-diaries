import NextAuth from "next-auth";
import { Profile as NextAuthProfile } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface Profile extends NextAuthProfile {
    picture?: string;
  }
}
