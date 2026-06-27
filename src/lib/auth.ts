import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

type SessionUserToken = {
  id?: string;
  role?: Role;
  picture?: string | null;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      image?: string | null;
    };
  }
  interface User {
    role: Role;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        if (user.isBlocked) {
          throw new Error("Your account has been blocked. Please contact support.");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const jwtToken = token as typeof token & SessionUserToken;
      if (user) {
        jwtToken.id = user.id as string;
        jwtToken.role = (user as { role: Role }).role;
        jwtToken.picture = (user as { image?: string | null }).image ?? null;
      }
      return jwtToken;
    },
    async session({ session, token }) {
      const jwtToken = token as typeof token & SessionUserToken;
      if (session.user) {
        session.user.id = jwtToken.id ?? "";
        session.user.role = jwtToken.role ?? "STUDENT";
        session.user.image = jwtToken.picture ?? null;
      }
      return session;
    },
  },
});
