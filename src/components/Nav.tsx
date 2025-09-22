// src/components/Nav.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './Nav.module.css';

export default function Nav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // @ts-ignore
    const username = session?.user?.username;

    return (
        <div className={`${styles.navContainer} fixed-nav`}>
            <div className={styles.topRow}>
                {session && (
                    <div className={styles.profileMenu}>
                        <button 
                            className={styles.profileButton}
                            onClick={() => setIsDropdownOpen(prev => !prev)}
                        >
                            {username || "Mi Perfil"}
                        </button>
                        {isDropdownOpen && (
                            <div className={styles.dropdown}>
                                <Link href="/ajustes">Ajustes</Link>
                                <button onClick={() => signOut()}>Cerrar Sesión</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className={styles.bottomRow}>
                <Link href="/liga" className={`${styles.link} ${pathname === '/liga' ? styles.active : ''}`}>Liga</Link>
                <Link href="/equipo" className={`${styles.link} ${pathname === '/equipo' ? styles.active : ''}`}>Equipo</Link>
                <Link href="/fichajes" className={`${styles.link} ${pathname === '/fichajes' ? styles.active : ''}`}>Fichajes</Link>
                <Link href="/rival" className={`${styles.link} ${pathname === '/rival' ? styles.active : ''}`}>Rival</Link>
            </div>
        </div>
    );
}