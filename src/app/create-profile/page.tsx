// src/app/create-profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./create-profile.module.css";

export default function CreateProfilePage() {
    const { update } = useSession();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const username = new FormData(event.currentTarget).get("username") as string;

        // 1. Actualizamos la sesión del usuario con el nuevo nombre
        await update({ username: username });

        // 2. Redirigimos a seleccionar liga
        router.push('/seleccionar-liga');
    };

    return (
        <main className={styles.main}>
            <div className={`${styles.card} page-container-animated`}>
                <h1>¡Bienvenido a Fantasy Tactic!</h1>
                <p>Elige tu nombre de Mánager para continuar.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        type="text"
                        className={styles.input}
                        placeholder="Tu nombre de Mánager"
                        required
                        minLength={3}
                        maxLength={20}
                    />
                    <button type="submit" className={styles.button}>
                        Confirmar y Entrar
                    </button>
                </form>
            </div>
        </main>
    );
}