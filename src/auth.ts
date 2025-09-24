import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// --- IMPORTANTE: Aquí deberías tener una función que busque un usuario en tu base de datos ---
// Ejemplo: import { getUserWithTeamByEmail } from "@/lib/data";

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
    async jwt({ token, user, trigger, session }) {
      // --- INICIO DE LA LÓGICA MODIFICADA ---

      // 1. Al iniciar sesión por primera vez con Google
      if (user) {
        // Usamos el email del perfil de Google para buscar al usuario en nuestra base de datos
        // REEMPLAZA ESTO con tu propia lógica de base de datos
        const appUser = { 
          teamName: "FC Fantasía", 
          teamShield: "/escudos/default-shield.png" 
        }; 
        // const appUser = await getUserWithTeamByEmail(user.email!);

        // Añadimos los datos del equipo al token
        if (appUser) {
          // @ts-ignore
          token.teamName = appUser.teamName;
          // @ts-ignore
          token.teamShield = appUser.teamShield;
        }
      }

      // 2. Al actualizar la sesión (esto ya lo tenías)
      if (trigger === "update" && session) {
        // @ts-ignore
        token.username = session.username;
        // @ts-ignore
        token.avatar = session.avatar;
      }
      
      return token;
      // --- FIN DE LA LÓGICA MODIFICADA ---
    },
    
    async session({ session, token }) {
      session.user.id = token.sub!;
      // @ts-ignore
      session.user.username = token.username || null;
      // @ts-ignore
      session.user.avatar = token.avatar || null;
      
      // --- LÓGICA AÑADIDA ---
      // 3. Pasamos los datos del equipo del token a la sesión final
      // @ts-ignore
      session.user.teamName = token.teamName;
      // @ts-ignore
      session.user.teamShield = token.teamShield;
      // ------------------------
      
      session.user.name = null;
      session.user.image = null;
      return session;
    },
  },
})