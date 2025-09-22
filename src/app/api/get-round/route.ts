// src/app/api/get-round/route.ts

import { NextResponse } from 'next/server';

// --- NUESTRO SISTEMA DE CACHÉ SIMPLE ---
let cachedRound: { round: number | null, timestamp: number } = {
    round: null,
    timestamp: 0,
};
// Guardaremos la respuesta en caché durante 1 hora (en milisegundos)
const CACHE_DURATION = 60 * 60 * 1000; 
// ------------------------------------


export async function GET() {
    // 1. Comprobamos si tenemos una respuesta válida en la caché
    if (cachedRound.round && (Date.now() - cachedRound.timestamp < CACHE_DURATION)) {
        console.log(`API: Devolviendo jornada DESDE LA CACHÉ: ${cachedRound.round}`);
        return NextResponse.json({ currentRound: cachedRound.round });
    }

    // Si no hay caché válida, continuamos con la lógica normal...
    console.log("API: Caché vacía o expirada. Llamando a la API externa...");

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        return NextResponse.json({ error: "La clave de API no está configurada en el servidor" }, { status: 500 });
    }

    const season = 2025;
    const leagueId = 77559;

    const fetchOptions = {
        method: 'GET',
        headers: {
            'x-apisports-key': API_KEY,
        }
    };

    const parseRoundNumber = (roundString: string): number => {
        return parseInt(roundString.replace(/[^0-9]/g, ''), 10);
    };

    try {
        const liveUrl = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}&live=all`;
        let response = await fetch(liveUrl, fetchOptions);
        let data = await response.json();

        if (data.response && data.response.length > 0) {
            const roundNumber = parseRoundNumber(data.response[0].league.round);
            // Guardamos el resultado en la caché antes de devolverlo
            cachedRound = { round: roundNumber, timestamp: Date.now() };
            return NextResponse.json({ currentRound: roundNumber });
        }

        const dateRangeUrl = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}&from=${season}-08-01&to=${new Date().toISOString().split('T')[0]}`;
        response = await fetch(dateRangeUrl, fetchOptions);
        data = await response.json();
        
        if (data.response && data.response.length > 0) {
            const lastFixture = data.response[data.response.length - 1];
            const roundNumber = parseRoundNumber(lastFixture.league.round);
            const nextRound = roundNumber + 1;
            // Guardamos el resultado en la caché
            cachedRound = { round: nextRound > 38 ? 38 : nextRound, timestamp: Date.now() };
            return NextResponse.json({ currentRound: cachedRound.round });
        }

        // Si no se encuentra nada, guardamos 1 en la caché
        cachedRound = { round: 1, timestamp: Date.now() };
        return NextResponse.json({ currentRound: 1 });

    } catch (error) {
        console.error("Error en la ruta de API /api/get-round:", error);
        return NextResponse.json({ error: "Falló la comunicación con la API externa" }, { status: 502 });
    }
}