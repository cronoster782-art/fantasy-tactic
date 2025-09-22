"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TEAMS, MATCHES, Team } from "@/teams";
import { getCurrentRound } from "@/services/apiSportsService";
import styles from "./liga.module.css";

type Match = typeof MATCHES[0];

export default function Liga() {
    const [jornadaActual, setJornadaActual] = useState<number | null>(null);
    const [liveTeams, setLiveTeams] = useState<Team[]>([]);
    const [liveMatches, setLiveMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializePage = async () => {
            const round = await getCurrentRound();
            
            setJornadaActual(round);
            setLiveTeams(TEAMS);
            setLiveMatches(MATCHES);
            
            setIsLoading(false);
        };

        initializePage();
    }, []);

    if (isLoading) {
        return (
            <main className={styles.main}>
                <div className={styles.card}>
                    <h2>Cargando datos de la liga...</h2>
                </div>
            </main>
        );
    }
    
    const sortedTeams = [...liveTeams].sort((a, b) => b.points - a.points || (b.goals - a.goals));
    const partidosJornada = liveMatches.filter((match) => match.jornada === jornadaActual);

    return (
        // CAMBIO: Usamos la nueva clase de animación
        <main className={`${styles.main} page-container-animated`}>
            <section className={styles.card}>
                <div className={styles["jornada-header"]}>
                    <button onClick={() => setJornadaActual((j) => Math.max(1, j ? j - 1 : 1))}>◀</button>
                    <h2>Jornada {jornadaActual}</h2>
                    <button onClick={() => setJornadaActual((j) => Math.min(38, j ? j + 1 : 1))}>▶</button>
                </div>
                
                <div className={styles["table-container"]}>
                    <table className={styles.table}>
                        <thead>
                            <tr><th>Local</th><th>Resultado</th><th>Visitante</th></tr>
                        </thead>
                        <tbody>
                            {partidosJornada.map((match) => (
                                <tr key={match.id}>
                                    <td>{match.home}</td>
                                    <td className={styles.resultadoCell}>
                                        <span>{match.score}</span>
                                        <Link href={`/enfrentamiento/${match.id}`} className={styles.enJuegoBtn}>
                                            Ver Partido
                                        </Link>
                                    </td>
                                    <td>{match.away}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            
            <section className={styles.card}>
                <h2>Clasificación</h2>
                <div className={styles["table-container"]}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Pos</th><th>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTeams.map((team, index) => {
                                let posClass = "";
                                if (index === 0) posClass = styles['pos-1'];
                                else if (index >= 1 && index <= 3) posClass = styles['pos-azul'];
                                else if (index >= 16) posClass = styles['pos-descenso'];

                                return (
                                    <tr key={team.id} className={posClass}>
                                        <td>{index + 1}</td><td>{team.name}</td><td>{team.played}</td><td>{team.won}</td><td>{team.drawn}</td><td>{team.lost}</td><td>{team.goals}</td><td>{team.points}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}