// src/rival-data.ts
// VERSIÓN CORREGIDA: Todas las formaciones han sido re-centradas para dejar un margen a los lados.

export type Formacion = {
  id: number;
}[];

// --- Diccionario de Posiciones (TODAS CORREGIDAS PARA MEJOR CENTRADO) ---
const FORMATION_POSITIONS: { [key: string]: string[] } = {
  "4-4-2": [
    "8 / 4 / 9 / 5", // POR
    "7 / 3 / 8 / 4", "7 / 5 / 8 / 6", // Centrales
    "6 / 2 / 7 / 3", "6 / 6 / 7 / 7", // Laterales
    "4 / 3 / 5 / 4", "4 / 5 / 5 / 6", // Interiores
    "3 / 2 / 4 / 3", "3 / 6 / 4 / 7", // Extremos
    "2 / 3 / 3 / 4", "2 / 5 / 3 / 6"  // Delanteros
  ],
  "4-3-3": [
    "8 / 4 / 9 / 5",   // POR
    "7 / 3 / 8 / 4",   // Central Izquierdo
    "7 / 5 / 8 / 6",   // Central Derecho
    "6 / 2 / 7 / 3",   // Lateral Izquierdo
    "6 / 6 / 7 / 7",   // Lateral Derecho
    "5 / 3 / 6 / 4",   // Interior Izquierdo
    "5 / 5 / 6 / 6",   // Interior Derecho
    "4 / 4 / 5 / 5",   // Pivote
    "2 / 2 / 3 / 3",   // Extremo Izquierdo
    "2 / 6 / 3 / 7",   // Extremo Derecho
    "1 / 4 / 2 / 5"    // Delantero Centro
  ],
  "4-5-1": [
    "8 / 4 / 9 / 5", "7 / 3 / 8 / 4", "7 / 5 / 8 / 6", "6 / 2 / 7 / 3", 
    "6 / 6 / 7 / 7", "5 / 4 / 6 / 5", "4 / 3 / 5 / 4", "4 / 5 / 5 / 6", 
    "3 / 2 / 4 / 3", "3 / 6 / 4 / 7", "1 / 4 / 2 / 5"
  ],
  "3-4-3": [
    "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 4 / 8 / 5", "7 / 6 / 8 / 7", 
    "5 / 2 / 6 / 3", "5 / 6 / 6 / 7", "4 / 3 / 5 / 4", "4 / 5 / 5 / 6", 
    "2 / 2 / 3 / 3", "2 / 6 / 3 / 7", "1 / 4 / 2 / 5"
  ],
  "3-5-2": [
    "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 4 / 8 / 5", "7 / 6 / 8 / 7", 
    "5 / 2 / 6 / 3", "5 / 6 / 6 / 7", "6 / 4 / 7 / 5", "4 / 3 / 5 / 4", 
    "4 / 5 / 5 / 6", "2 / 3 / 3 / 4", "2 / 5 / 3 / 6"
  ],
  "5-3-2": [
    "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 4 / 8 / 5", "7 / 6 / 8 / 7", 
    "6 / 1 / 7 / 2", "6 / 7 / 7 / 8", // Carrileros anchos
    "4 / 3 / 5 / 4", "4 / 4 / 5 / 5", "4 / 5 / 5 / 6", 
    "2 / 3 / 3 / 4", "2 / 5 / 3 / 6"
  ],
  "5-4-1": [
    "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 4 / 8 / 5", "7 / 6 / 8 / 7", 
    "6 / 1 / 7 / 2", "6 / 7 / 7 / 8", 
    "4 / 2 / 5 / 3", "4 / 6 / 5 / 7", 
    "4 / 3 / 5 / 4", "4 / 5 / 5 / 6", 
    "1 / 4 / 2 / 5"
  ],
  "3-3-4": [
    "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 4 / 8 / 5", "7 / 6 / 8 / 7", 
    "5 / 2 / 6 / 3", "5 / 4 / 6 / 5", "5 / 6 / 6 / 7", 
    "2 / 1 / 3 / 2", "2 / 7 / 3 / 8", 
    "2 / 3 / 3 / 4", "2 / 5 / 3 / 6"
  ],
  "4-2-4": [
    "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 6 / 8 / 7", "6 / 3 / 7 / 4", 
    "6 / 5 / 7 / 6", "5 / 3 / 6 / 4", "5 / 5 / 6 / 6", 
    "2 / 2 / 3 / 3", "2 / 6 / 3 / 7", 
    "1 / 3 / 2 / 4", "1 / 5 / 2 / 6"
  ],
};

export const NOMBRES_FORMACIONES = Object.keys(FORMATION_POSITIONS);

export function getPositionsForFormation(formation: string): string[] {
    return FORMATION_POSITIONS[formation] || FORMATION_POSITIONS["4-4-2"];
}

// Datos del rival (esto no cambia)
export const DATOS_RIVAL = {
  nombre: "Leones United",
  colorPrimario: "#d92b2b",
  formacionesAnteriores: [
    { jornada: 17, formacion: "4-4-2", jugadores: Array.from({ length: 11 }, (_, i) => ({ id: i + 1 })) },
    { jornada: 18, formacion: "4-3-3", jugadores: Array.from({ length: 11 }, (_, i) => ({ id: i + 1 })) },
    { jornada: 19, formacion: "3-5-2", jugadores: Array.from({ length: 11 }, (_, i) => ({ id: i + 1 })) }
  ]
};

