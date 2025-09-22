// src/app/ajustes/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ajustes.module.css";

export default function AjustesPage() {
    const { data: session, update } = useSession();
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        // Cuando la sesión cargue, rellenamos el campo con la URL del avatar actual
        // @ts-ignore
        if (session?.user?.avatar) {
            // @ts-ignore
            setAvatarUrl(session.user.avatar);
        }
    }, [session]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Actualizamos la sesión con la nueva URL del avatar
        await update({ avatar: avatarUrl });
        alert("¡Imagen de perfil actualizada!");
    };

    // @ts-ignore
    const currentAvatar = session?.user?.avatar || '/logo-fantasy-tactic.png'; // Asume que tu logo está en public/logo-app.png

    return (
        <main className={`${styles.main} page-container-animated`}>
            <div className={styles.card}>
                <h2>Ajustes de Perfil</h2>
                <Image
                    src={currentAvatar}
                    alt="Avatar actual"
                    width={100}
                    height={100}
                    className={styles.avatarPreview}
                    // onError para evitar errores si la URL es inválida
                    onError={(e) => { e.currentTarget.src = '/logo-fantasy-tactic.png'; }}
                />
                <form onSubmit={handleSubmit}>
                    <label htmlFor="avatar">URL de la imagen de perfil:</label>
                    <input
                        id="avatar"
                        name="avatar"
                        type="url"
                        className={styles.input}
                        placeholder="Pega la URL de tu imagen aquí"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                    <button type="submit" className={styles.button}>
                        Guardar Imagen
                    </button>
                </form>
            </div>
        </main>
    );
}