"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./configurar-liga.module.css";

type TipoEquipoInicial = "jugadores-dinero" | "solo-dinero" | "aleatorio";

export default function ConfigurarLigaPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    
    // Obtener parámetros de la URL
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const nombreLiga = searchParams.get('nombre') || "Nueva Liga";
    const tipoLiga = searchParams.get('tipo') || "publica";
    
    // Estados de configuración
    const [numeroParticipantes, setNumeroParticipantes] = useState(12);
    const [frecuenciaMercado, setFrecuenciaMercado] = useState<12 | 24>(24);
    const [permanenciaMercado, setPermanenciaMercado] = useState<1 | 2>(2);
    const [tipoEquipoInicial, setTipoEquipoInicial] = useState<TipoEquipoInicial>("jugadores-dinero");
    const [isLoading, setIsLoading] = useState(false);

    // Opciones para número de participantes (solo pares de 8 a 20)
    const opcionesParticipantes = [8, 10, 12, 14, 16, 18, 20];

    const handleCrearLiga = async () => {
        setIsLoading(true);

        // Generar código único para liga privada (si aplica)
        const esPrivada = tipoLiga === "privada";
        const codigoLiga = esPrivada ? 
            Math.random().toString(36).substring(2, 8).toUpperCase() : null;

        // Crear configuración de la liga
        const nuevaLiga = {
            id: Date.now().toString(),
            nombre: nombreLiga,
            tipo: esPrivada ? "privada" : "publica",
            codigo: codigoLiga,
            creador: session?.user?.name || "Usuario",
            fechaCreacion: new Date().toISOString(),
            configuracion: {
                numeroParticipantes,
                frecuenciaMercado,
                permanenciaMercado,
                tipoEquipoInicial
            },
            miembros: [session?.user?.name || "Usuario"],
            estado: "configuracion" // En espera de más participantes
        };

        // Guardar en localStorage
        const ligasGuardadas = JSON.parse(localStorage.getItem("fantasy-ligas") || "[]");
        ligasGuardadas.push(nuevaLiga);
        localStorage.setItem("fantasy-ligas", JSON.stringify(ligasGuardadas));

        // Actualizar sesión del usuario con la liga actual
        await update({ ligaActual: nuevaLiga.id });

        // Mostrar información de liga creada
        if (esPrivada && codigoLiga) {
            alert(`¡Liga "${nombreLiga}" creada exitosamente!
            
Código de invitación: ${codigoLiga}
Comparte este código con tus amigos.

Configuración:
• ${numeroParticipantes} participantes
• Mercado cada ${frecuenciaMercado} horas
• Jugadores ${permanenciaMercado} día(s) en mercado`);
        } else {
            alert(`¡Liga pública "${nombreLiga}" creada exitosamente!
            
Configuración:
• ${numeroParticipantes} participantes
• Mercado cada ${frecuenciaMercado} horas
• Jugadores ${permanenciaMercado} día(s) en mercado`);
        }

        setIsLoading(false);
        router.push("/liga");
    };

    return (
        <main className={`${styles.main} page-container-animated`}>
            <div className={styles.container}>
                <h1>Configurar "{nombreLiga}"</h1>
                <p>Personaliza las reglas de tu liga</p>

                {/* Número de Participantes */}
                <div className={styles.section}>
                    <h3>Participantes</h3>
                    <div className={styles.inputGroup}>
                        <label>Número de Participantes</label>
                        <div className={styles.participantesGrid}>
                            {opcionesParticipantes.map((num) => (
                                <button
                                    key={num}
                                    className={`${styles.optionButton} ${numeroParticipantes === num ? styles.active : ""}`}
                                    onClick={() => setNumeroParticipantes(num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Configuración del Mercado */}
                <div className={styles.section}>
                    <h3>Mercado de Fichajes</h3>
                    
                    <div className={styles.inputGroup}>
                        <label>Nuevos jugadores cada</label>
                        <div className={styles.optionsRow}>
                            <button
                                className={`${styles.optionButton} ${frecuenciaMercado === 12 ? styles.active : ""}`}
                                onClick={() => setFrecuenciaMercado(12)}
                            >
                                12 horas
                            </button>
                            <button
                                className={`${styles.optionButton} ${frecuenciaMercado === 24 ? styles.active : ""}`}
                                onClick={() => setFrecuenciaMercado(24)}
                            >
                                24 horas
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Jugadores permanecen en mercado</label>
                        <div className={styles.optionsRow}>
                            <button
                                className={`${styles.optionButton} ${permanenciaMercado === 1 ? styles.active : ""}`}
                                onClick={() => setPermanenciaMercado(1)}
                            >
                                1 ciclo
                            </button>
                            <button
                                className={`${styles.optionButton} ${permanenciaMercado === 2 ? styles.active : ""}`}
                                onClick={() => setPermanenciaMercado(2)}
                            >
                                2 ciclos*
                            </button>
                        </div>
                        <p className={styles.infoText}>
                            *Solo si no reciben pujas en el primer ciclo
                        </p>
                    </div>
                </div>

                {/* Tipo de Equipo Inicial */}
                <div className={styles.section}>
                    <h3>Equipos Iniciales</h3>
                    <div className={styles.inputGroup}>
                        <label>Los participantes empezarán con</label>
                        <div className={styles.equipoOptions}>
                            <button
                                className={`${styles.equipoOption} ${tipoEquipoInicial === "jugadores-dinero" ? styles.active : ""}`}
                                onClick={() => setTipoEquipoInicial("jugadores-dinero")}
                            >
                                <div className={styles.equipoIcon}>👥💰</div>
                                <div>
                                    <strong>16 Jugadores + Dinero</strong>
                                    <p>Equipo aleatorio completo y presupuesto</p>
                                </div>
                            </button>
                            
                            <button
                                className={`${styles.equipoOption} ${tipoEquipoInicial === "solo-dinero" ? styles.active : ""}`}
                                onClick={() => setTipoEquipoInicial("solo-dinero")}
                            >
                                <div className={styles.equipoIcon}>💰</div>
                                <div>
                                    <strong>Solo Dinero</strong>
                                    <p>Presupuesto completo para fichar</p>
                                </div>
                            </button>

                            <button
                                className={`${styles.equipoOption} ${tipoEquipoInicial === "aleatorio" ? styles.active : ""}`}
                                onClick={() => setTipoEquipoInicial("aleatorio")}
                            >
                                <div className={styles.equipoIcon}>🎲</div>
                                <div>
                                    <strong>16 Jugadores Aleatorios</strong>
                                    <p>Equipo completo sin dinero extra</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className={styles.actions}>
                    <button 
                        className={styles.backButton}
                        onClick={() => router.back()}
                    >
                        Volver
                    </button>
                    
                    <button 
                        className={styles.createButton}
                        onClick={handleCrearLiga}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creando Liga..." : "Crear Liga"}
                    </button>
                </div>
            </div>
        </main>
    );
}