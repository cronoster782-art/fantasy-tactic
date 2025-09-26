"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./seleccionar-liga.module.css";

type TipoLiga = "publica" | "privada";
type ModoSeleccion = "crear" | "unirse";

export default function SeleccionarLigaPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [modo, setModo] = useState<ModoSeleccion>("crear");
    const [tipoLiga, setTipoLiga] = useState<TipoLiga>("publica");
    const [nombreLiga, setNombreLiga] = useState("");
    const [codigoInvitacion, setCodigoInvitacion] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCrearLiga = async () => {
        if (!nombreLiga.trim()) {
            alert("Por favor, introduce un nombre para la liga.");
            return;
        }
        
        // Redirigir a la página de configuración con el tipo de liga y nombre
        const tipoParam = tipoLiga === "privada" ? "privada" : "publica";
        const nombreParam = encodeURIComponent(nombreLiga.trim());
        router.push(`/configurar-liga?tipo=${tipoParam}&nombre=${nombreParam}`);
    };

    const handleUnirseALiga = async () => {
        if (tipoLiga === "privada" && !codigoInvitacion.trim()) {
            alert("Por favor, introduce el código de invitación.");
            return;
        }

        setIsLoading(true);

        // Buscar liga disponible
        const ligasGuardadas = JSON.parse(localStorage.getItem("fantasy-ligas") || "[]");
        let ligaEncontrada = null;

        if (tipoLiga === "publica") {
            // Buscar primera liga pública disponible
            ligaEncontrada = ligasGuardadas.find((liga: any) => liga.tipo === "publica");
        } else {
            // Buscar liga por código
            ligaEncontrada = ligasGuardadas.find((liga: any) => 
                liga.tipo === "privada" && liga.codigo === codigoInvitacion.toUpperCase()
            );
        }

        if (!ligaEncontrada) {
            alert(tipoLiga === "publica" ? 
                "No hay ligas públicas disponibles en este momento." :
                "Código de invitación inválido.");
            setIsLoading(false);
            return;
        }

        // Agregar usuario a la liga
        if (!ligaEncontrada.miembros.includes(session?.user?.name || "Usuario")) {
            ligaEncontrada.miembros.push(session?.user?.name || "Usuario");
            localStorage.setItem("fantasy-ligas", JSON.stringify(ligasGuardadas));
        }

        // Actualizar sesión del usuario
        await update({ ligaActual: ligaEncontrada.id });

        setIsLoading(false);
        router.push("/liga");
    };

    return (
        <main className={`${styles.main} page-container-animated`}>
            <div className={styles.container}>
                <h1>Selecciona tu Liga</h1>
                <p>Elige cómo quieres participar en Fantasy Tactic</p>

                {/* Selector de Modo */}
                <div className={styles.modeSelector}>
                    <button 
                        className={`${styles.modeButton} ${modo === "crear" ? styles.active : ""}`}
                        onClick={() => setModo("crear")}
                    >
                        Crear Liga
                    </button>
                    <button 
                        className={`${styles.modeButton} ${modo === "unirse" ? styles.active : ""}`}
                        onClick={() => setModo("unirse")}
                    >
                        Unirse a Liga
                    </button>
                </div>

                {/* Selector de Tipo de Liga */}
                <div className={styles.typeSelector}>
                    <h3>{modo === "crear" ? "Tipo de liga a crear" : "Tipo de liga para unirse"}</h3>
                    <div className={styles.typeButtons}>
                        <button 
                            className={`${styles.typeButton} ${tipoLiga === "publica" ? styles.active : ""}`}
                            onClick={() => setTipoLiga("publica")}
                        >
                            <div className={styles.typeIcon}>🌍</div>
                            <div>
                                <strong>Pública</strong>
                                <p>Cualquiera puede unirse</p>
                            </div>
                        </button>
                        <button 
                            className={`${styles.typeButton} ${tipoLiga === "privada" ? styles.active : ""}`}
                            onClick={() => setTipoLiga("privada")}
                        >
                            <div className={styles.typeIcon}>🔒</div>
                            <div>
                                <strong>Privada</strong>
                                <p>Solo por invitación</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Formularios según el modo */}
                <div className={styles.formSection}>
                    {modo === "crear" && (
                        <div className={styles.form}>
                            <h3>Crear Nueva Liga</h3>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nombre de la liga"
                                value={nombreLiga}
                                onChange={(e) => setNombreLiga(e.target.value)}
                                maxLength={30}
                            />
                            {tipoLiga === "privada" && (
                                <p className={styles.info}>
                                    Se generará un código de invitación automáticamente
                                </p>
                            )}
                            <button 
                                className={styles.actionButton}
                                onClick={handleCrearLiga}
                                disabled={isLoading || !nombreLiga.trim()}
                            >
                                {isLoading ? "Creando..." : "Crear Liga"}
                            </button>
                        </div>
                    )}

                    {modo === "unirse" && (
                        <div className={styles.form}>
                            <h3>Unirse a Liga</h3>
                            {tipoLiga === "privada" && (
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Código de invitación"
                                    value={codigoInvitacion}
                                    onChange={(e) => setCodigoInvitacion(e.target.value.toUpperCase())}
                                    maxLength={6}
                                />
                            )}
                            {tipoLiga === "publica" && (
                                <p className={styles.info}>
                                    Se te unirá a una liga pública disponible automáticamente
                                </p>
                            )}
                            <button 
                                className={styles.actionButton}
                                onClick={handleUnirseALiga}
                                disabled={isLoading || (tipoLiga === "privada" && !codigoInvitacion.trim())}
                            >
                                {isLoading ? "Uniéndose..." : "Unirse a Liga"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Botón para continuar sin liga (temporal) */}
                <button 
                    className={styles.skipButton}
                    onClick={() => router.push("/liga")}
                >
                    Continuar sin liga (temporal)
                </button>
            </div>
        </main>
    );
}