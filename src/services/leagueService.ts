// src/services/leagueService.ts
import { Jugador, TODOS_LOS_JUGADORES } from "../players";
import { TEAMS, MATCHES, Team } from "../teams";
import { getLivePlayerScores } from "./apiSportsService";
import { FormationName, FORMATIONS_LOGIC, AVAILABLE_FORMATIONS } from "../rival-data";

// La alineación ahora puede contener Jugadores o nulls para los huecos vacíos.
export type TeamRoster = {
    lineup: (Jugador | null)[]; 
    formation: FormationName;
    suplentes: Jugador[];
};

export interface LeagueState {
    teams: { [teamName: string]: TeamRoster };
    market: Jugador[];
    jornadaScores: { [jornada: number]: { [playerId: number]: number | null } };
}

export const initializeLeague = (): void => {
    if (localStorage.getItem('fantasyLeagueState')) return;

    console.log("Iniciando nueva liga y creando alineaciones válidas...");
    const shuffledPlayers = [...TODOS_LOS_JUGADORES].sort(() => 0.5 - Math.random());
    const leagueState: LeagueState = { teams: {}, market: [], jornadaScores: {} };
    const ROSTER_SIZE = 18;

    TEAMS.forEach(team => {
        const teamPlayers = shuffledPlayers.splice(0, ROSTER_SIZE);
        const randomIndex = Math.floor(Math.random() * AVAILABLE_FORMATIONS.length);
        const formation: FormationName = AVAILABLE_FORMATIONS[randomIndex];
        
        // La alineación se crea con la nueva lógica robusta que incluye nulls
        const roster = buildValidLineupForFormation(teamPlayers, formation);
        leagueState.teams[team.name] = roster;
    });

    leagueState.market = shuffledPlayers;
    localStorage.setItem('fantasyLeagueState', JSON.stringify(leagueState));
    console.log("¡Nueva liga creada con alineaciones correctas!");
};

export const updateJornadaData = async (jornada: number) => {
    console.log(`Vigilante: Comprobando jornada ${jornada}...`);
    // Filtramos los nulls para no enviar jugadores vacíos a la API
    const allPlayersInJornada = TEAMS.flatMap(team => getTeamRoster(team.name).lineup.filter(p => p !== null) as Jugador[]);
    
    const livePlayers = await getLivePlayerScores(allPlayersInJornada);

    const leagueState: LeagueState = JSON.parse(localStorage.getItem('fantasyLeagueState') || '{}');
    if (!leagueState.jornadaScores) {
        leagueState.jornadaScores = {};
    }
    
    const scores: { [playerId: number]: number | null } = {};
    livePlayers.forEach(p => {
        scores[p.id] = p.liveScore;
    });

    leagueState.jornadaScores[jornada] = scores;
    localStorage.setItem('fantasyLeagueState', JSON.stringify(leagueState));
    console.log(`Datos de la jornada ${jornada} actualizados y guardados.`);
};

export const getTeamRoster = (teamName: string): TeamRoster => {
    const leagueState: LeagueState | null = JSON.parse(localStorage.getItem('fantasyLeagueState') || 'null');
    // El valor por defecto ahora crea una alineación de 11 huecos vacíos (nulls)
    return leagueState?.teams[teamName] || { lineup: Array(11).fill(null), suplentes: [], formation: '4-4-2' };
};

export const getJornadaScores = (jornada: number): { [playerId: number]: number | null } | null => {
    const leagueState: LeagueState | null = JSON.parse(localStorage.getItem('fantasyLeagueState') || 'null');
    return leagueState?.jornadaScores[jornada] || null;
};

export const getOpponentForRound = (userTeamName: string, roundNumber: number): Team | null => {
    const match = MATCHES.find(m => 
        m.jornada === roundNumber && (m.home === userTeamName || m.away === userTeamName)
    );
    if (!match) {
        return null;
    }
    const opponentName = match.home === userTeamName ? match.away : match.home;
    const opponent = TEAMS.find(team => team.name === opponentName);
    return opponent || null;
};

export const saveTeamRoster = (teamName: string, newRoster: TeamRoster) => {
    const leagueState: LeagueState | null = JSON.parse(localStorage.getItem('fantasyLeagueState') || 'null');
    if (leagueState && leagueState.teams) {
        leagueState.teams[teamName] = newRoster;
        localStorage.setItem('fantasyLeagueState', JSON.stringify(leagueState));
        console.log(`Alineación de ${teamName} guardada.`);
    }
};

export const buildValidLineupForFormation = (fullRoster: Jugador[], formationName: FormationName): TeamRoster => {
    // Creamos 11 huecos vacíos para la alineación
    const lineup: (Jugador | null)[] = Array(11).fill(null);
    const availablePlayers = [...fullRoster]; 
    const needs = FORMATIONS_LOGIC[formationName];

    const pickPlayersAndPlace = (pos: 'POR' | 'DEF' | 'MED' | 'DEL', count: number, startIndex: number) => {
        let placedCount = 0;
        for (let i = availablePlayers.length - 1; i >= 0; i--) {
            if (availablePlayers[i].posicion === pos && placedCount < count) {
                const slotIndex = lineup.indexOf(null, startIndex);
                if (slotIndex !== -1) {
                    lineup[slotIndex] = availablePlayers.splice(i, 1)[0];
                    placedCount++;
                }
            }
        }
    };

    // Construimos la alineación en orden, colocando jugadores en los huecos (nulls)
    pickPlayersAndPlace('POR', 1, 0);
    pickPlayersAndPlace('DEF', needs.DEF, 1);
    pickPlayersAndPlace('MED', needs.MED, 1 + needs.DEF);
    pickPlayersAndPlace('DEL', needs.DEL, 1 + needs.DEF + needs.MED);

    const suplentes = availablePlayers;

    return { lineup, suplentes, formation: formationName };
};