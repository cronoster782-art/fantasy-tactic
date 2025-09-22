// src/components/Nav.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './Nav.module.css';

export default function Nav() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className={`${styles.navContainer} fixed-nav`}>
            <div className={styles.topRow}>
                {/* Caso 1: La sesión está CARGANDO */}
                {status === 'loading' && (
                    <div className={styles.profileMenu}>
                        <div className={styles.profileButton}>Cargando...</div>
                    </div>
                )}

                {/* Caso 2: El usuario SÍ está autenticado (con comprobación extra) */}
                {status === 'authenticated' && session && session.user && (
                    <div className={styles.profileMenu}>
                        <button 
                            className={styles.profileButton}
                            onClick={() => setIsDropdownOpen(prev => !prev)}
                        >
                            <img 
                                src={session.user.avatar || '/logo-fantasy-tactic.png'} 
                                alt="Avatar" 
                                width={24} 
                                height={24} 
                                className={styles.profileAvatar} 
                                onError={(e) => { e.currentTarget.src = '/logo-fantasy-tactic.png'; }}
                            />
                            {session.user.username || "Mi Perfil"}
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