// src/app/liga/page.tsx

import { TEAMS, MATCHES } from "@/teams";
import styles from "./liga.module.css";

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

export type Match = {
  id: number;
  home: string;
  away: string;
  score: string;
};

export default function Liga() {
  const sortedTeams = [...TEAMS].sort((a, b) => b.points - a.points || b.goals - a.goals);
  const topScorers = [...TEAMS].sort((a, b) => b.goals - a.goals).slice(0, 3);

  return (
    <main className={styles.main}>
      <h1></h1>

      {/* Clasificación */}
      <section className={styles.card}>
        <h2>Clasificación</h2>
        <div className={styles['table-container']}>
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

      {/* Partidos de la jornada */}
      <section className={styles.card}>
        <h2>Jornada</h2>
        <div className={styles['table-container']}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Local</th>
                <th>Resultado</th>
                <th>Visitante</th>
              </tr>
            </thead>
            <tbody>
              {MATCHES.map((match, index) => (
                <tr key={index}>
                  <td>{match.home}</td>
                  <td style={{ fontWeight: "bold" }}>{match.score}</td>
                  <td>{match.away}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Máximos Goleadores */}
      <section className={styles.card}>
        <h2>Máximos Goleadores</h2>
        <div className={styles['table-container']}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Equipo</th>
                <th>Goles</th>
              </tr>
            </thead>
            <tbody>
              {topScorers.map((team, idx) => (
                <tr key={team.id}>
                  <td>{idx + 1}</td>
                  <td>{team.name}</td>
                  <td>{team.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}