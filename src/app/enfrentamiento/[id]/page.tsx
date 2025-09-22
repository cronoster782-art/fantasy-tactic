"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";
import { MATCHES } from '@/teams';
import { Jugador } from '@/players';
import { getTeamRoster } from '@/services/leagueService';
import styles from './enfrentamiento.module.css';
import { FormationName } from '@/rival-data';

type ZonaResultado = 'ganando' | 'empatando' | 'perdiendo';
type LivePlayer = Jugador & { liveScore: number | null };

// --- Componentes ---
function FichaEnfrentamiento({ jugador }: { jugador: LivePlayer }) {
    const getPuntuacionClass = (p: number | null) => {
        if (p === null) return styles.noJugado;
        if (p < 0) return styles.puntosNegativos;
        if (p <= 5) return styles.puntosBajos;
        if (p <= 9) return styles.puntosMedios;
        return styles.puntosAltos;
    };
    return (
        <div className={styles.fichaEnfrentamiento}>
            <Image src={jugador.img} alt={jugador.nombre} width={50} height={50} className={styles.jugadorImagen} />
            <div className={`${styles.puntuacionOverlayCampo} ${getPuntuacionClass(jugador.liveScore)}`}>
                {jugador.liveScore ?? '?'}
            </div>
            <span className={styles.fichaNombre}>{jugador.nombre}</span>
        </div>
    );
}

function ZonaDeJuego({ titulo, jugadoresLocal, jugadoresVisitante, resultado, ventaja, puntosLocal, puntosVisitante, backgroundClass }: { titulo: string, jugadoresLocal: LivePlayer[], jugadoresVisitante: LivePlayer[], resultado: ZonaResultado, ventaja?: number, puntosLocal: number, puntosVisitante: number, backgroundClass: string }) {
    const getResultadoClase = (res: ZonaResultado) => {
        switch (res) {
            case 'ganando': return styles.localGana;
            case 'perdiendo': return styles.visitanteGana;
            default: return styles.empate;
        }
    };
    const resultadoClase = getResultadoClase(resultado);
    const getPointsClass = (teamType: 'local' | 'visitante') => {
        if (resultado === 'empatando') return styles.puntosEmpatando;
        if (resultado === 'ganando') return teamType === 'local' ? styles.puntosGanando : styles.puntosPerdiendo;
        return teamType === 'local' ? styles.puntosPerdiendo : styles.puntosGanando;
    };
    return (
        <div className={`${styles.zonaEnfrentamiento} ${resultadoClase} ${backgroundClass}`}>
            <div className={styles.equipoZona}>{jugadoresLocal.map(j => <FichaEnfrentamiento key={j.id} jugador={j} />)}</div>
            <div className={styles.marcadorZona}>
                <span className={`${styles.puntosZona} ${getPointsClass('local')}`}>{puntosLocal}</span>
                <div className={styles.marcadorCentro}>
                    <h3>{titulo}</h3>
                    <span className={styles.vs}>VS</span>
                    {ventaja && <span className={styles.ventajaLocal}>Local +{ventaja}</span>}
                </div>
                <span className={`${styles.puntosZona} ${getPointsClass('visitante')}`}>{puntosVisitante}</span>
            </div>
            <div className={styles.equipoZona}>{jugadoresVisitante.map(j => <FichaEnfrentamiento key={j.id} jugador={j} />)}</div>
        </div>
    );
}

// --- Página Principal ---
export default function EnfrentamientoPage() {
    const params = useParams();
    const matchId = parseInt(params.id as string);
    
    const [match, setMatch] = useState<typeof MATCHES[0] | undefined>(undefined);
    const [equipoLocal, setEquipoLocal] = useState<LivePlayer[]>([]);
    const [equipoVisitante, setEquipoVisitante] = useState<LivePlayer[]>([]);
    const [localFormation, setLocalFormation] = useState<FormationName>('4-4-2');
    const [visitorFormation, setVisitorFormation] = useState<FormationName>('4-4-2');
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (isNaN(matchId)) {
            return;
        }

        const foundMatch = MATCHES.find(m => m.id === matchId);

        if (!foundMatch) {
            setIsLoading(false);
            return;
        }

        const rosterLocal = getTeamRoster(foundMatch.home);
        const rosterVisitante = getTeamRoster(foundMatch.away);
        
        const localWithScores = rosterLocal.lineup.map(p => ({ ...p, liveScore: Math.floor(Math.random() * 17) - 2 }));
        const rivalWithScores = rosterVisitante.lineup.map(p => ({ ...p, liveScore: Math.floor(Math.random() * 17) - 2 }));

        setMatch(foundMatch);
        setEquipoLocal(localWithScores);
        setEquipoVisitante(rivalWithScores);
        setLocalFormation(rosterLocal.formation);
        setVisitorFormation(rosterVisitante.formation);
        setIsLoading(false);

    }, [matchId]);

    if (isLoading) {
        return (
            <main className={styles.main}>
                <div className={styles.card}><h2>Cargando datos del partido...</h2></div>
            </main>
        );
    }
    
    if (!match) {
        return <main className={`${styles.main} page-container-animated`}><div className={styles.card}><h2>Partido no encontrado.</h2></div></main>;
    }
    
    const calculateZoneScore = (players: LivePlayer[], positions: ('POR' | 'DEF' | 'MED' | 'DEL')[]) => players.filter(p => positions.includes(p.posicion)).reduce((sum, p) => sum + (p.liveScore || 0), 0);
    const localDef = calculateZoneScore(equipoLocal, ['POR', 'DEF']);
    const localMid = calculateZoneScore(equipoLocal, ['MED']);
    const localFwd = calculateZoneScore(equipoLocal, ['DEL']);
    const visitanteDef = calculateZoneScore(equipoVisitante, ['POR', 'DEF']);
    const visitanteMid = calculateZoneScore(equipoVisitante, ['MED']);
    const visitanteFwd = calculateZoneScore(equipoVisitante, ['DEL']);

    const puntos = { local: [localDef, localMid, localFwd], visitante: [visitanteFwd, visitanteMid, visitanteDef] };
    const ventajas = [2, 4, 4];
    const resultados: ZonaResultado[] = [
        (puntos.visitante[0] > puntos.local[0] + ventajas[0]) ? 'perdiendo' : (puntos.local[0] > puntos.visitante[0]) ? 'ganando' : 'empatando',
        (puntos.visitante[1] > puntos.local[1] + ventajas[1]) ? 'perdiendo' : (puntos.local[1] > puntos.visitante[1]) ? 'ganando' : 'empatando',
        (puntos.visitante[2] > puntos.local[2] + ventajas[2]) ? 'perdiendo' : (puntos.local[2] > puntos.visitante[2]) ? 'ganando' : 'empatando',
    ];

    return (
        <main className={`${styles.main} page-container-animated`}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.headerTeam}>
                        <h1>{match.home}</h1>
                        <span className={styles.formationDisplay}>({localFormation})</span>
                    </div>
                    <span className={styles.vs}>VS</span>
                    <div className={styles.headerTeam}>
                        <h1>{match.away}</h1>
                        <span className={styles.formationDisplay}>({visitorFormation})</span>
                    </div>
                </div>
                <div className={styles.enfrentamientoContainer}>
                    <ZonaDeJuego titulo="Ataque vs Defensa" jugadoresLocal={equipoLocal.filter(p=>p.posicion === 'DEL')} jugadoresVisitante={equipoVisitante.filter(p=>p.posicion === 'DEF' || p.posicion === 'POR')} resultado={resultados[2]} ventaja={4} puntosLocal={puntos.local[2]} puntosVisitante={puntos.visitante[2]} backgroundClass={styles.zonaAtaque} />
                    <ZonaDeJuego titulo="Mediocampo vs Mediocampo" jugadoresLocal={equipoLocal.filter(p=>p.posicion === 'MED')} jugadoresVisitante={equipoVisitante.filter(p=>p.posicion === 'MED')} resultado={resultados[1]} ventaja={4} puntosLocal={puntos.local[1]} puntosVisitante={puntos.visitante[1]} backgroundClass={styles.zonaMedio} />
                    <ZonaDeJuego titulo="Defensa vs Ataque" jugadoresLocal={equipoLocal.filter(p=>p.posicion === 'POR' || p.posicion === 'DEF')} jugadoresVisitante={equipoVisitante.filter(p=>p.posicion === 'DEL')} resultado={resultados[0]} ventaja={2} puntosLocal={puntos.local[0]} puntosVisitante={puntos.visitante[0]} backgroundClass={styles.zonaDefensa} />
                </div>
            </div>
        </main>
    );
}