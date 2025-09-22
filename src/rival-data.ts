// src/rival-data.ts

// --- 1. DEFINICIÓN LÓGICA (AÑADIDO) ---
// Define cuántos jugadores de campo hay en cada línea.
export const FORMATIONS_LOGIC = {
    '4-4-2': { DEF: 4, MED: 4, DEL: 2 },
    '4-3-3': { DEF: 4, MED: 3, DEL: 3 },
    '3-4-3': { DEF: 3, MED: 4, DEL: 3 },
    '3-5-2': { DEF: 3, MED: 5, DEL: 2 },
    '5-3-2': { DEF: 5, MED: 3, DEL: 2 },
    '3-3-4': { DEF: 3, MED: 3, DEL: 4 },
    '4-2-4': { DEF: 4, MED: 2, DEL: 4 },
};

// Un tipo para asegurar que solo usamos nombres de formaciones válidas
export type FormationName = keyof typeof FORMATIONS_LOGIC;

// --- LA VARIABLE QUE FALTA ---
// La lista de formaciones disponibles, generada a partir de la lógica.
export const AVAILABLE_FORMATIONS: FormationName[] = Object.keys(FORMATIONS_LOGIC) as FormationName[];


// --- 2. DEFINICIÓN VISUAL (TU CÓDIGO ORIGINAL) ---
export type Formacion = {
    id: number;
}[];

const FORMATION_VISUAL_POSITIONS: { [key: string]: string[] } = {
    "4-4-2": [
        "8 / 4 / 9 / 5", "7 / 3 / 8 / 4", "7 / 5 / 8 / 6", "6 / 2 / 7 / 3", "6 / 6 / 7 / 7",
        "5 / 3 / 6 / 4", "5 / 5 / 6 / 6", "4 / 2 / 5 / 3", "4 / 6 / 5 / 7", "2 / 3 / 3 / 4", "2 / 5 / 3 / 6"
    ],
    "4-3-3": [
        "8 / 4 / 9 / 5", "7 / 3 / 8 / 4", "7 / 5 / 8 / 6", "6 / 2 / 7 / 3", "6 / 6 / 7 / 7",
        "4 / 3 / 5 / 4", "4 / 5 / 5 / 6", "5 / 4 / 6 / 5", "2 / 2 / 3 / 3", "2 / 6 / 3 / 7", "2 / 4 / 3 / 5"
    ],
    "3-4-3": [ "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 4 / 8 / 5", "7 / 6 / 8 / 7", "4 / 2 / 5 / 3", "4 / 6 / 5 / 7", "5 / 3 / 6 / 4", "5 / 5 / 6 / 6", "2 / 2 / 3 / 3", "2 / 6 / 3 / 7", "2 / 4 / 3 / 5" ],
    "3-5-2": [ "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 4 / 8 / 5", "7 / 6 / 8 / 7", "5 / 2 / 6 / 3", "5 / 6 / 6 / 7", "5 / 4 / 6 / 5", "4 / 3 / 5 / 4", "4 / 5 / 5 / 6", "2 / 3 / 3 / 4", "2 / 5 / 3 / 6" ],
    "5-3-2": [ "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 4 / 8 / 5", "7 / 6 / 8 / 7", "6 / 1 / 7 / 2", "6 / 7 / 7 / 8", "4 / 3 / 5 / 4", "5 / 4 / 6 / 5", "4 / 5 / 5 / 6", "2 / 3 / 3 / 4", "2 / 5 / 3 / 6" ],
    "3-3-4": [ "8 / 4 / 9 / 5", "7 / 2 / 8 / 3", "7 / 4 / 8 / 5", "7 / 6 / 8 / 7", "5 / 2 / 6 / 3", "5 / 4 / 6 / 5", "5 / 6 / 6 / 7", "2 / 2 / 3 / 3", "2 / 6 / 3 / 7", "3 / 4 / 4 / 5", "2 / 4 / 3 / 5" ],
    "4-2-4": [ "8 / 4 / 9 / 5", "6 / 2 / 7 / 3", " 6 / 6 / 7 / 7", "7 / 3 / 8 / 4", "7 / 5 / 8 / 6", "5 / 3 / 6 / 4", "5 / 5 / 6 / 6", "2 / 2 / 3 / 3", "2 / 6 / 3 / 7", "3 / 4 / 4 / 5", "2 / 4 / 3 / 5" ],
};

// Tu variable NOMBRES_FORMACIONES se mantiene por si la usas en otro sitio.
export const NOMBRES_FORMACIONES = Object.keys(FORMATION_VISUAL_POSITIONS);

export function getPositionsForFormation(formation: string): string[] {
    return FORMATION_VISUAL_POSITIONS[formation] || FORMATION_VISUAL_POSITIONS["4-4-2"];
}


// --- 3. DATOS DE RIVAL (se mantiene como lo pediste) ---
export const DATOS_RIVAL = {
    nombre: "Leones United",
    colorPrimario: "#d92b2b",
    formacionesAnteriores: [
        { jornada: 17, formacion: "4-4-2", jugadores: Array.from({ length: 11 }, (_, i) => ({ id: i + 1 })) },
        { jornada: 18, formacion: "4-3-3", jugadores: Array.from({ length: 11 }, (_, i) => ({ id: i + 1 })) },
        { jornada: 19, formacion: "3-5-2", jugadores: Array.from({ length: 11 }, (_, i) => ({ id: i + 1 })) }
    ]
};