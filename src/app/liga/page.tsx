"use client";

import { useState } from "react";
import Link from "next/link";
import { TEAMS, MATCHES } from "@/teams";
import styles from "./liga.module.css";

// Definimos los tipos aquí para que el archivo sea autocontenido
export type Team = {
  id: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals: number;
  points: number;
};
type Match = {
  id: number;
  home: string;
  away: string;
  score: string;
  jornada: number;
};

export default function Liga() {
  const [jornadaActual, setJornadaActual] = useState(1);

  const sortedTeams = [...TEAMS].sort(
    (a, b) => b.points - a.points || b.goals - a.goals
  );
  
  const partidosJornada = MATCHES.filter(
    (match) => match.jornada === jornadaActual
  );

  return (
    <main className={`${styles.main} page-fade-in`}>
      
      {/* Partidos de la jornada (arriba) */}
      <section className={styles.card}>
        <div className={styles["jornada-header"]}>
          <button
            onClick={() => setJornadaActual((j) => Math.max(1, j - 1))}
          >
            ◀
          </button>
          <h2>Jornada {jornadaActual}</h2>
          <button onClick={() => setJornadaActual((j) => Math.min(38, j + 1))}>
            ▶
          </button>
        </div>

        <div className={styles["table-container"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Local</th>
                <th>Resultado</th>
                <th>Visitante</th>
              </tr>
            </thead>
            <tbody>
              {partidosJornada.map((match) => (
                <tr key={match.id}>
                  <td>{match.home}</td>
                  <td className={styles.resultadoCell}>
                    <span style={{ fontWeight: "bold" }}>{match.score}</span>
                    <Link
                      href={`/enfrentamiento/${match.id}`}
                      className={styles.enJuegoBtn}
                    >
                      En juego
                    </Link>
                  </td>
                  <td>{match.away}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Clasificación (debajo de los partidos) */}
      <section className={styles.card}>
        <h2>Clasificación</h2>
        <div className={styles["table-container"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Equipo</th>
                <th>PJ</th>
                <th>G</th>
                <th>E</th>
                <th>P</th>
                <th>GF</th>
                <th>Pts</th>
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
                    <td>{index + 1}</td>
                    <td>{team.name}</td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.drawn}</td>
                    <td>{team.lost}</td>
                    <td>{team.goals}</td>
                    <td>{team.points}</td>
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

