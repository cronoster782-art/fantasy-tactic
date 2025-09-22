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
    signIn: '/signin',
  },

  callbacks: {
    async jwt({ token, trigger, session }) {
      // Si el trigger es una "update" (desde la página de Ajustes)...
      if (trigger === "update" && session) {
        // ...actualizamos el token con los nuevos datos.
        token.username = session.username;
        token.avatar = session.avatar;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Pasamos los datos del token a la sesión final
      session.user.id = token.sub!; 
      // @ts-ignore
      session.user.username = token.username || null;
      // @ts-ignore
      session.user.avatar = token.avatar || null; // <-- LÍNEA AÑADIDA
      
      // Limpiamos los datos de Google que no queremos
      session.user.name = null;
      session.user.image = null;
      
      return session;
    },
  },
})