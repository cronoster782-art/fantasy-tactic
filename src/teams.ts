// src/teams.ts
// VERSIÓN ACTUALIZADA: Se incluye un calendario completo de 38 jornadas.

export type Team = {
  id: number;
  apiId: number;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals: number;
  points: number;
};

export const TEAMS: Team[] = [
  { id: 1, apiId: 548, name: "Dragones FC", logo: "/escudos/dragones_fc.png", primaryColor: "#CE2525", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 2, apiId: 531, name: "Leones United", logo: "/escudos/leones_united.png", primaryColor: "#AC0D15", secondaryColor: "#062243", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 3, apiId: 533, name: "Tiburones CF", logo: "/escudos/tiburones_cf.png", primaryColor: "#E7373E", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 4, apiId: 546, name: "Águilas Rojas", logo: "/escudos/aguilas_rojas.png", primaryColor: "#A60D1E", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 5, apiId: 542, name: "Lobos del Norte", logo: "/escudos/lobos_norte.png", primaryColor: "#0055A4", secondaryColor: "#EF3340", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 6, apiId: 538, name: "Panteras Doradas", logo: "/escudos/panteras_doradas.png", primaryColor: "#FFCD00", secondaryColor: "#000000", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 7, apiId: 530, name: "Guerreros Azules", logo: "/escudos/guerreros_azules.png", primaryColor: "#00AEEF", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 8, apiId: 724, name: "Halcones Verdes", logo: "/escudos/halcones_verdes.png", primaryColor: "#00A651", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 9, apiId: 547, name: "Toros Bravos", logo: "/escudos/toros_bravos.png", primaryColor: "#DA291C", secondaryColor: "#000000", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 10, apiId: 540, name: "Piratas del Sur", logo: "/escudos/piratas_sur.png", primaryColor: "#000000", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 11, apiId: 727, name: "Cóndores FC", logo: "/escudos/condores_fc.png", primaryColor: "#6CACE4", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 12, apiId: 728, name: "Tigres Blancos", logo: "/escudos/tigres_blancos.png", primaryColor: "#FFFFFF", secondaryColor: "#000000", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 13, apiId: 797, name: "Osos Negros", logo: "/escudos/osos_negros.png", primaryColor: "#009B48", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 14, apiId: 720, name: "Linces Rojos", logo: "/escudos/linces_rojos.png", primaryColor: "#ED1C24", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 15, apiId: 532, name: "Delfines Celestes", logo: "/escudos/delfines_celestes.png", primaryColor: "#00B2A9", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 16, apiId: 550, name: "Búhos Nocturnos", logo: "/escudos/buhos_nocturnos.png", primaryColor: "#7B2A88", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 17, apiId: 545, name: "Pumas Salvajes", logo: "/escudos/pumas_salvajes.png", primaryColor: "#EC8B00", secondaryColor: "#000000", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 18, apiId: 534, name: "Zorros Plateados", logo: "/escudos/zorros_plateados.png", primaryColor: "#D2D2D2", secondaryColor: "#000000", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 19, apiId: 543, name: "Naranjitos F.C.", logo: "/escudos/naranjitos_fc.png", primaryColor: "#FFA500", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
  { id: 20, apiId: 723, name: "Caballeros de Acero", logo: "/escudos/caballeros_acero.png", primaryColor: "#6A7B8B", secondaryColor: "#FFFFFF", played: 0, won: 0, drawn: 0, lost: 0, goals: 0, points: 0 },
];

// Función para generar el calendario completo
const generateFixtures = (teams: Team[]) => {
    const fixtures = [];
    const numTeams = teams.length;
    let matchId = 1;

    for (let round = 0; round < (numTeams - 1) * 2; round++) {
        const jornada = round + 1;
        for (let i = 0; i < numTeams / 2; i++) {
            const homeIndex = (round + i) % (numTeams - 1);
            let awayIndex = (numTeams - 1 - i + round) % (numTeams - 1);
            if (i === 0) {
                awayIndex = numTeams - 1;
            }

            const homeTeam = teams[homeIndex];
            const awayTeam = teams[awayIndex];

            if (jornada <= numTeams - 1) {
                 fixtures.push({ id: matchId++, home: homeTeam.name, away: awayTeam.name, score: " - ", jornada, status: 'pendiente' as const });
            } else {
                 fixtures.push({ id: matchId++, home: awayTeam.name, away: homeTeam.name, score: " - ", jornada, status: 'pendiente' as const });
            }
        }
    }
    return fixtures;
};


export const MATCHES = generateFixtures(TEAMS);

