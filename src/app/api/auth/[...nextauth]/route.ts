// src/app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/auth" // Volvemos a usar el alias @/

export const { GET, POST } = handlers