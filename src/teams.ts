// src/teams.ts
// VERSIÓN ACTUALIZADA CON TU EQUIPO "NARANJITOS F.C." INCLUIDO EN LA LIGA

export const TEAMS = [
  { id: 1, name: "Dragones FC", logo: "/escudos/dragones_fc.png", primaryColor: "#CE2525", secondaryColor: "#FFFFFF", played: 19, won: 14, drawn: 3, lost: 2, goals: 38, points: 45 },
  { id: 2, name: "Leones United", logo: "/escudos/leones_united.png", primaryColor: "#AC0D15", secondaryColor: "#062243", played: 19, won: 13, drawn: 3, lost: 3, goals: 35, points: 42 },
  { id: 3, name: "Tiburones CF", logo: "/escudos/tiburones_cf.png", primaryColor: "#E7373E", secondaryColor: "#FFFFFF", played: 19, won: 12, drawn: 3, lost: 4, goals: 33, points: 39 },
  { id: 4, name: "Águilas Rojas", logo: "/escudos/aguilas_rojas.png", primaryColor: "#A60D1E", secondaryColor: "#FFFFFF", played: 19, won: 11, drawn: 3, lost: 5, goals: 30, points: 36 },
  { id: 5, name: "Lobos del Norte", logo: "/escudos/lobos_norte.png", primaryColor: "#0055A4", secondaryColor: "#EF3340", played: 19, won: 10, drawn: 4, lost: 5, goals: 28, points: 34 },
  { id: 6, name: "Panteras Doradas", logo: "/escudos/panteras_doradas.png", primaryColor: "#FFCD00", secondaryColor: "#000000", played: 19, won: 9, drawn: 5, lost: 5, goals: 27, points: 32 },
  { id: 7, name: "Guerreros Azules", logo: "/escudos/guerreros_azules.png", primaryColor: "#00AEEF", secondaryColor: "#FFFFFF", played: 19, won: 9, drawn: 3, lost: 7, goals: 25, points: 30 },
  { id: 8, name: "Halcones Verdes", logo: "/escudos/halcones_verdes.png", primaryColor: "#00A651", secondaryColor: "#FFFFFF", played: 19, won: 8, drawn: 4, lost: 7, goals: 24, points: 28 },
  { id: 9, name: "Toros Bravos", logo: "/escudos/toros_bravos.png", primaryColor: "#DA291C", secondaryColor: "#000000", played: 19, won: 8, drawn: 3, lost: 8, goals: 23, points: 27 },
  { id: 10, name: "Piratas del Sur", logo: "/escudos/piratas_sur.png", primaryColor: "#000000", secondaryColor: "#FFFFFF", played: 19, won: 7, drawn: 4, lost: 8, goals: 22, points: 25 },
  { id: 11, name: "Cóndores FC", logo: "/escudos/condores_fc.png", primaryColor: "#6CACE4", secondaryColor: "#FFFFFF", played: 19, won: 7, drawn: 3, lost: 9, goals: 21, points: 24 },
  { id: 12, name: "Tigres Blancos", logo: "/escudos/tigres_blancos.png", primaryColor: "#FFFFFF", secondaryColor: "#000000", played: 19, won: 6, drawn: 4, lost: 9, goals: 20, points: 22 },
  { id: 13, name: "Osos Negros", logo: "/escudos/osos_negros.png", primaryColor: "#009B48", secondaryColor: "#FFFFFF", played: 19, won: 6, drawn: 2, lost: 11, goals: 18, points: 20 },
  { id: 14, name: "Linces Rojos", logo: "/escudos/linces_rojos.png", primaryColor: "#ED1C24", secondaryColor: "#FFFFFF", played: 19, won: 5, drawn: 3, lost: 11, goals: 16, points: 18 },
  { id: 15, name: "Delfines Celestes", logo: "/escudos/delfines_celestes.png", primaryColor: "#00B2A9", secondaryColor: "#FFFFFF", played: 19, won: 4, drawn: 4, lost: 11, goals: 15, points: 16 },
  { id: 16, name: "Búhos Nocturnos", logo: "/escudos/buhos_nocturnos.png", primaryColor: "#7B2A88", secondaryColor: "#FFFFFF", played: 19, won: 4, drawn: 2, lost: 13, goals: 13, points: 14 },
  { id: 17, name: "Pumas Salvajes", logo: "/escudos/pumas_salvajes.png", primaryColor: "#EC8B00", secondaryColor: "#000000", played: 19, won: 3, drawn: 3, lost: 13, goals: 12, points: 12 },
  { id: 18, name: "Zorros Plateados", logo: "/escudos/zorros_plateados.png", primaryColor: "#D2D2D2", secondaryColor: "#000000", played: 19, won: 3, drawn: 1, lost: 15, goals: 10, points: 10 },
  // CAMBIO: Reemplazamos "Jaguares Urbanos" por tu equipo
  { id: 19, name: "Naranjitos F.C.", logo: "/escudos/naranjitos_fc.png", primaryColor: "#FFA500", secondaryColor: "#FFFFFF", played: 19, won: 2, drawn: 2, lost: 15, goals: 8, points: 8 },
  { id: 20, name: "Caballeros de Acero", logo: "/escudos/caballeros_acero.png", primaryColor: "#6A7B8B", secondaryColor: "#FFFFFF", played: 19, won: 1, drawn: 3, lost: 15, goals: 6, points: 6 },
];

export const MATCHES = [
  { id: 1, home: "Dragones FC", away: "Águilas Rojas", score: "2 - 1" },
  { id: 2, home: "Leones United", away: "Tiburones CF", score: "1 - 1" },
  { id: 3, home: "Lobos del Norte", away: "Panteras Doradas", score: "0 - 3" },
  { id: 4, home: "Guerreros Azules", away: "Halcones Verdes", score: "2 - 2" },
  { id: 5, home: "Toros Bravos", away: "Piratas del Sur", score: "1 - 0" },
  { id: 6, home: "Cóndores FC", away: "Tigres Blancos", score: "3 - 2" },
  { id: 7, home: "Osos Negros", away: "Linces Rojos", score: "0 - 1" },
  { id: 8, home: "Delfines Celestes", away: "Búhos Nocturnos", score: "2 - 2" },
  { id: 9, home: "Pumas Salvajes", away: "Zorros Plateados", score: "1 - 3" },
  { id: 10, home: "Naranjitos F.C.", away: "Caballeros de Acero", score: "0 - 0" }, // Actualizamos también un partido
];

