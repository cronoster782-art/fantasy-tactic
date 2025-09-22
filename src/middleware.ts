// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export default async function middleware(req: NextRequest) {
    const session = await auth();
    const { pathname } = req.nextUrl;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/create-profile');

    // 1. Si el usuario NO ha iniciado sesión y no va a una página de login/creación...
    if (!session && !isAuthPage) {
        // ...lo redirigimos a /login.
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // 2. Si el usuario SÍ ha iniciado sesión...
    if (session) {
        // @ts-ignore - Usamos el `username` que sabemos que existe en la sesión
        const hasProfile = !!session.user?.username;

        // ...pero NO tiene perfil Y NO está en la página de crear perfil...
        if (!hasProfile && pathname !== '/create-profile') {
            // ...lo forzamos a ir a /create-profile.
            return NextResponse.redirect(new URL('/create-profile', req.url));
        }
        
        // ...y si SÍ tiene perfil pero intenta ir a las páginas de login/creación...
        if (hasProfile && isAuthPage) {
            // ...lo mandamos a la página de inicio.
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};