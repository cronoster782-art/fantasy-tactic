// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export default async function middleware(req: NextRequest) {
  console.log(`--- MIDDLEWARE EJECUTÁNDOSE ---`);
  console.log(`Ruta solicitada: ${req.nextUrl.pathname}`);

  const session = await auth();
  
  console.log('Sesión encontrada:', session ? `Usuario ${session.user?.email}` : 'null');

  // Si el usuario no tiene sesión y la página NO es /signin, redirigimos.
  if (!session && req.nextUrl.pathname !== '/signin') {
    console.log('>>> NO HAY SESIÓN. Redirigiendo a /signin...');
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Si el usuario SÍ tiene sesión y está en /signin, lo mandamos a la app.
  if (session && req.nextUrl.pathname === '/signin') {
      console.log('>>> USUARIO CON SESIÓN EN SIGNIN. Redirigiendo a la app...');
      return NextResponse.redirect(new URL('/', req.url));
  }

  console.log('>>> ACCESO PERMITIDO. Dejando pasar.');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de solicitud excepto las que comienzan con:
     * - api (rutas API)
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo de favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};