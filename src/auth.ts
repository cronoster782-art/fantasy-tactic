// src/auth.ts

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session) {
        // Si la sesión se actualiza, pasamos los nuevos datos al token
        token.username = session.username;
        token.avatar = session.avatar;
      }
      return token;
    },
    
    async session({ session, token }) {
      session.user.id = token.sub!;
      // @ts-ignore
      session.user.username = token.username || null;
      // --- LÓGICA AÑADIDA ---
      // @ts-ignore
      session.user.avatar = token.avatar || null; // Leemos el avatar desde el token
      
      session.user.name = null;
      session.user.image = null;
      return session;
    },
  },
})