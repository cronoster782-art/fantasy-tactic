// src/app/api/get-scores/route.ts

import { NextResponse } from 'next/server';
// 1. IMPORTAMOS EL TIPO 'JUGADOR' PARA SABER SU ESTRUCTURA
import { Jugador } from '@/players';

const API_KEY = process.env.API_KEY;

// 2. DEFINIMOS EL TIPO PARA LOS JUGADORES CON PUNTUACIÓN
type LivePlayer = Jugador & { liveScore: number | null };

// La función para convertir el rating (sin cambios)
const convertSofaScoreToFantasyPoints = (rating: number | null): number | null => {
    if (rating === null) return null;
    if (rating >= 9.8) return 17;
    if (rating >= 9.6) return 16;
    if (rating >= 9.3) return 15;
    if (rating >= 9.0) return 14;
    if (rating >= 8.8) return 13;
    if (rating >= 8.6) return 12;
    if (rating >= 8.3) return 11;
    if (rating >= 8.0) return 10;
    if (rating >= 7.8) return 9;
    if (rating >= 7.6) return 8;
    if (rating >= 7.3) return 7;
    if (rating >= 7.0) return 6;
    if (rating >= 6.8) return 5;
    if (rating >= 6.7) return 4;
    if (rating >= 6.6) return 3;
    if (rating >= 6.4) return 2;
    if (rating >= 6.2) return 1;
    if (rating >= 6.0) return 0;
    if (rating >= 5.8) return -1;
    if (rating >= 5.6) return -2;
    if (rating >= 5.4) return -3;
    if (rating >= 5.2) return -4;
    if (rating >= 5.0) return -5;
    return -6;
};

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: "La clave de API no está configurada" }, { status: 500 });
    }

    // 3. AÑADIMOS EL TIPO A LA LISTA DE JUGADORES QUE RECIBIMOS
    const { players }: { players: Jugador[] } = await req.json();
    if (!players || !Array.isArray(players)) {
        return NextResponse.json({ error: "Se esperaba una lista de jugadores" }, { status: 400 });
    }

    const fetchOptions = {
        method: 'GET',
        headers: { 'x-apisports-key': API_KEY }
    };

    const season = 2025;
    const leagueId = 77559;

    // 4. AÑADIMOS EL TIPO AL ARRAY VACÍO
    const livePlayers: LivePlayer[] = [];

    for (const player of players) {
        if (player.sofaScoreId) {
            try {
                const url = `https://v3.football.api-sports.io/players?id=${player.sofaScoreId}&season=${season}`;
                const response = await fetch(url, fetchOptions);
                const data = await response.json();
                
                let rating: number | null = null;
                if (data.response && data.response.length > 0) {
                    const leagueStats = data.response[0].statistics.find((s: any) => s.league.id === leagueId);
                    if (leagueStats && leagueStats.games && leagueStats.games.rating) {
                        rating = parseFloat(leagueStats.games.rating);
                    }
                }
                
                const fantasyPoints = convertSofaScoreToFantasyPoints(rating);
                livePlayers.push({ ...player, liveScore: fantasyPoints });

            } catch (error) {
                console.error(`Error obteniendo datos para ${player.nombre}:`, error);
                livePlayers.push({ ...player, liveScore: null });
            }
        } else {
            livePlayers.push({ ...player, liveScore: null });
        }
    }
    
    return NextResponse.json({ livePlayers });
}