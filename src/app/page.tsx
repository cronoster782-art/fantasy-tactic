"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Mantenemos el temporizador en 4.5 segundos
    const timer = setTimeout(() => {
      router.push("/liga");
    }, 4500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className={styles.container}>
      <div className={styles.logoWrapper}>
        <Image
          src="/logo-fantasy-tactic.png"
          alt="Logo de Fantasy Tactic"
          width={250}
          height={250}
          priority
          placeholder="empty"
          style={{ background: 'transparent' }}
        />
      </div>
    </main>
  );
}

