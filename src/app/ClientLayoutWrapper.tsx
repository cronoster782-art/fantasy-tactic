// src/app/ClientLayoutWrapper.tsx
"use client";

import React from "react";
import { usePathname } from 'next/navigation';
import { SessionProvider } from "next-auth/react";
import LeagueInitializer from './leagueInitializer'; 
import PageTransition from './PageTransition'; 
import Nav from '@/components/Nav';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const noNavRoutes = ['/login', '/', '/create-profile', '/seleccionar-liga', '/configurar-liga'];
    const isNavHiddenPage = noNavRoutes.includes(pathname);

    return (
        <SessionProvider>
            <LeagueInitializer />
            
            {!isNavHiddenPage && <Nav />}
            
            <div className={!isNavHiddenPage ? 'content-padding' : ''}>
                <PageTransition routeKey={pathname}>
                    {children}
                </PageTransition>
            </div>
        </SessionProvider>
    );
}