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

    // Obtener el escudo del rival actual (simulado por ahora)
    const getRivalShield = () => {
        // Por ahora devolvemos un escudo aleatorio, esto se conectará con la lógica real
        const escudos = [
            "/escudos/escudoatindio.png",
            "/escudos/escudoazulon.png", 
            "/escudos/escudobabazorro.png",
            "/escudos/escudobermellon.png"
        ];
        return escudos[Math.floor(Math.random() * escudos.length)];
    };

    return (
        <>
            {/* Botón de usuario flotante */}
            {session && (
                <div className={styles.floatingUserButton}>
                    <button 
                        className={styles.profileButton}
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            padding: 0, 
                            width: '100%', 
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <img
                            src="/logo-fantasy-tactic.png"
                            alt="Logo de perfil"
                            className={styles.floatingProfileImage}
                        />
                        <span className={styles.floatingUserName}>
                            {username || "Mi Perfil"}
                        </span>
                    </button>
                    {isDropdownOpen && (
                        <div className={styles.floatingDropdown}>
                            <Link href="/ajustes">Ajustes</Link>
                            <button onClick={() => signOut()}>Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            )}

            {/* Navegación vertical en el lado derecho */}
            <div className={styles.verticalNav}>
                <div className={styles.verticalNavLinks}>
                    <Link 
                        href="/liga" 
                        className={`${styles.navIcon} ${styles.ligaIcon} ${pathname === '/liga' ? styles.active : ''}`}
                        title="Liga"
                    />
                    
                    <Link 
                        href="/equipo" 
                        className={`${styles.navIcon} ${styles.equipoIcon} ${pathname === '/equipo' ? styles.active : ''}`}
                        title="Equipo"
                    />
                    
                    <Link 
                        href="/fichajes" 
                        className={`${styles.navIcon} ${styles.fichajesIcon} ${pathname === '/fichajes' ? styles.active : ''}`}
                        title="Fichajes"
                    />
                    
                    <Link 
                        href="/rival" 
                        className={`${styles.navIcon} ${styles.rivalIcon} ${pathname === '/rival' ? styles.active : ''}`}
                        title="Rival"
                    >
                        <img 
                            src={getRivalShield()} 
                            alt="Escudo rival"
                            className={styles.rivalShield}
                        />
                    </Link>
                </div>
            </div>
        </>
    );
}