"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";
import { TEAMS, MATCHES } from '@/teams';
import { JUGADORES_EQUIPO, JUGADORES_RIVAL, Jugador, EstadoJugador } from '@/players';
import { FORMACION_ACTUAL } from '@/equipo-data';
import { DATOS_RIVAL, getPositionsForFormation } from '@/rival-data';
import styles from './enfrentamiento.module.css';

// --- Tipos de Datos para la Simulación ---
type ZonaResultado = 'ganando' | 'empatando' | 'perdiendo' | 'neutral';
type LivePlayer = Jugador & { liveScore: number | null }; // Jugador con puntuación en vivo

// --- Componentes de la Interfaz ---
function FichaEnfrentamiento({ jugador }: { jugador: LivePlayer }) {
    const EstadoIcon = () => {
        if (!jugador.estado) return null;
        switch (jugador.estado.tipo) {
            case 'lesionado': return <div className={`${styles.estadoOverlay} ${styles.lesionado}`}>+</div>;
            case 'sancionado': return <div className={`${styles.estadoOverlay} ${styles.sancionado}`}>{jugador.estado.partidos}</div>;
            case 'apercibido': return <div className={`${styles.estadoOverlay} ${styles.apercibido}`}>4</div>;
            default: return null;
        }
    };

    return (
        <div className={styles.fichaEnfrentamiento}>
            <Image src={jugador.img} alt={jugador.nombre} width={50} height={50} className={styles.jugadorImagen} />
            {/* Muestra la puntuación en vivo */}
            <div className={styles.puntuacionOverlayCampo}>{jugador.liveScore ?? '-'}</div>
            <EstadoIcon />
            <span className={styles.fichaNombre}>{jugador.nombre}</span>
        </div>
    );
}

function ZonaDeJuego({ titulo, jugadoresLocal, jugadoresVisitante, resultado, ventaja }: { titulo: string, jugadoresLocal: LivePlayer[], jugadoresVisitante: LivePlayer[], resultado: ZonaResultado, ventaja?: number }) {
    const resultadoClase = styles[resultado] || styles.neutral;

    return (
        <div className={`${styles.zonaEnfrentamiento} ${resultadoClase}`}>
            <div className={styles.equipoZona}>
                {jugadoresLocal.map(j => <FichaEnfrentamiento key={j.id} jugador={j} />)}
            </div>
            <div className={styles.marcadorZona}>
                <h3>{titulo}</h3>
                <span className={styles.vs}>VS</span>
                {ventaja && <span className={styles.ventajaLocal}>Local +{ventaja}</span>}
            </div>
            <div className={styles.equipoZona}>
                {jugadoresVisitante.map(j => <FichaEnfrentamiento key={j.id} jugador={j} />)}
            </div>
        </div>
    );
}

// --- Página Principal del Enfrentamiento ---
export default function EnfrentamientoPage() {
    const params = useParams();
    const matchId = parseInt(params.id as string);
    const match = MATCHES.find(m => m.id === matchId);
    
    const [resultados, setResultados] = useState<ZonaResultado[]>(['neutral', 'neutral', 'neutral']);
    const [equipoLocal, setEquipoLocal] = useState<LivePlayer[]>([]);
    const [equipoVisitante, setEquipoVisitante] = useState<LivePlayer[]>([]);
    
    useEffect(() => {
        const simularPartido = () => {
            const addLiveData = (player: Jugador): LivePlayer => ({
                ...player,
                liveScore: Math.random() > 0.1 ? Math.floor(Math.random() * 15) - 2 : null,
            });

            setEquipoLocal(JUGADORES_EQUIPO.map(addLiveData));
            setEquipoVisitante(JUGADORES_RIVAL.map(addLiveData));

            const esUsuarioParticipante = true;
            const esUsuarioLocal = true;
            
            const nuevosResultados: ZonaResultado[] = [];
            for (let i = 0; i < 3; i++) {
                const res = Math.random();
                if (res < 0.33) nuevosResultados.push(esUsuarioLocal ? 'ganando' : 'perdiendo');
                else if (res < 0.66) nuevosResultados.push('empatando');
                else nuevosResultados.push(esUsuarioLocal ? 'perdiendo' : 'ganando');
            }
            
            if (esUsuarioParticipante) {
                setResultados(nuevosResultados);
            }
        };

        simularPartido();
    }, [matchId]); // Se ejecuta cada vez que cambia el ID del partido

    if (!match) {
        return <main className={styles.main}><div className={styles.card}><h2>Partido no encontrado</h2></div></main>;
    }

    const localGKDef = equipoLocal.filter(p => p.posicion === 'POR' || p.posicion === 'DEF');
    const localMid = equipoLocal.filter(p => p.posicion === 'MED');
    const localFwd = equipoLocal.filter(p => p.posicion === 'DEL');

    const visitanteGKDef = equipoVisitante.filter(p => p.posicion === 'POR' || p.posicion === 'DEF');
    const visitanteMid = equipoVisitante.filter(p => p.posicion === 'MED');
    const visitanteFwd = equipoVisitante.filter(p => p.posicion === 'DEL');

    return (
        <main className={styles.main}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1>{match.home}</h1>
                    <span className={styles.vs}>VS</span>
                    <h1>{match.away}</h1>
                </div>

                <div className={styles.enfrentamientoContainer}>
                    <ZonaDeJuego titulo="Defensa vs Ataque" jugadoresLocal={localGKDef} jugadoresVisitante={visitanteFwd} resultado={resultados[0]} ventaja={2} />
                    <ZonaDeJuego titulo="Mediocampo vs Mediocampo" jugadoresLocal={localMid} jugadoresVisitante={visitanteMid} resultado={resultados[1]} ventaja={4} />
                    <ZonaDeJuego titulo="Ataque vs Defensa" jugadoresLocal={localFwd} jugadoresVisitante={visitanteGKDef} resultado={resultados[2]} ventaja={4} />
                </div>
            </div>
        </main>
    );
}

