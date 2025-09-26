"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [logoShown, setLogoShown] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró el logo en esta visita/sesión
    const hasSeenLogoThisVisit = sessionStorage.getItem('fantasy-logo-shown-this-visit');
    
    if (!hasSeenLogoThisVisit) {
      // Mostrar logo siempre al inicio de cada visita
      setLogoShown(true);
      sessionStorage.setItem('fantasy-logo-shown-this-visit', 'true');
      
      const timer = setTimeout(() => {
        handleNavigation();
      }, 4500);
      
      return () => clearTimeout(timer);
    } else {
      // Ya se mostró el logo en esta visita, navegar inmediatamente
      handleNavigation();
    }
  }, [session, status, router]);

  const handleNavigation = () => {
    if (status === "loading") return; // Esperamos a que cargue la sesión

    if (!session) {
      // No hay sesión, ir a login
      router.push("/login");
      return;
    }

    // Hay sesión, verificar el estado del usuario
    // @ts-ignore
    const username = session?.user?.username;
    
    if (!username) {
      // Usuario sin perfil creado
      router.push("/create-profile");
      return;
    }

    // Verificar si el usuario tiene una liga
    // @ts-ignore
    const ligaActual = session?.user?.ligaActual;
    
    if (!ligaActual) {
      // Usuario sin liga
      router.push("/seleccionar-liga");
      return;
    }

    // Usuario completo, ir a la aplicación
    router.push("/liga");
  };

  // Si no necesitamos mostrar el logo, mostrar loading
  if (!logoShown) {
    return (
      <main className={styles.container}>
        <div className={styles.logoWrapper}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </main>
    );
  }

  // Mostrar logo con animación
  return (
    <main className={styles.container}>
      <div className={styles.logoWrapper}>
        <img
          src="/logo-fantasy-tactic.png"
          alt="Logo de Fantasy Tactic"
          width={250}
          height={250}
          style={{ background: 'transparent' }}
          className={styles.logoAnimation}
        />
      </div>
    </main>
  );
}

