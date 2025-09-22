// next-auth.d.ts

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username?: string | null;
  }
  
  interface Session extends DefaultSession {
    user: {
      id: string;
      username?: string | null;
      avatar?: string | null; // <-- LÍNEA AÑADIDA
    } & DefaultSession["user"];
  }
}