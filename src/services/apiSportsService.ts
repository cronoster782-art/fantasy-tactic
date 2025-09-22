// src/services/apiSportsService.ts
import { Jugador } from "../players";

export type LivePlayer = Jugador & { liveScore: number | null };

/**
 * Obtiene las puntuaciones en vivo para una lista de jugadores.
 * Llama a nuestra propia ruta de API /api/get-scores para obtener los datos de forma segura.
 */
export const getLivePlayerScores = async (players: Jugador[]): Promise<LivePlayer[]> => {
    try {
        const response = await fetch('/api/get-scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ players }),
        });

        if (!response.ok) {
            console.error("Error al llamar a /api/get-scores:", response.statusText);
            return players.map(p => ({ ...p, liveScore: null })); // Devolver nulls si falla
        }

        const data = await response.json();
        return data.livePlayers;

    } catch (error) {
        console.error("Error en la función getLivePlayerScores:", error);
        return players.map(p => ({ ...p, liveScore: null }));
    }
};

/**
 * Obtiene la jornada actual de la liga.
 * Llama a nuestra propia ruta de API /api/get-round.
 */
export const getCurrentRound = async (): Promise<number> => {
    try {
        const response = await fetch('/api/get-round');

        if (!response.ok) {
            console.error("Error al llamar a /api/get-round:", response.statusText);
            return 1;
        }

        const data = await response.json();
        return data.currentRound;

    } catch (error) {
        console.error("Error en la función getCurrentRound:", error);
    }
    
    return 1;
};