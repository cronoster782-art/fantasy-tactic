// src/gameEngine.ts
import { Jugador, TODOS_LOS_JUGADORES } from "./players";
// Importamos nuestro motor de conexión a la API real
import { getLivePlayerScores } from "./services/apiSportsService"; 

// --- Tipos de Datos que usará el Motor ---
export type LivePlayer = Jugador & { liveScore: number | null };
export type JornadaScores = { [playerId: number]: number | null };
export type MarketPlayer = Jugador & { marketEntryDate: string; highestBid?: Bid };
export type Bid = { playerId: number; amount: number; userId: string };

// --- Lógica del Mercado de Fichajes (sin cambios) ---
export const processMarket = (): MarketPlayer[] => {
    console.log("Procesando mercado de las 7:00 AM...");
    const todayString = new Date().toISOString().split('T')[0];
    
    const bids: Bid[] = JSON.parse(localStorage.getItem('fantasyBids') || '[]');
    const oldMarket: MarketPlayer[] = JSON.parse(localStorage.getItem('fantasyMarket') || '[]');

    const bidsByPlayer: { [key: number]: Bid[] } = {};
    bids.forEach(bid => {
        if (!bidsByPlayer[bid.playerId]) bidsByPlayer[bid.playerId] = [];
        bidsByPlayer[bid.playerId].push(bid);
    });

    const soldPlayerIds = new Set<number>();
    for (const playerId in bidsByPlayer) {
        const winningBid = bidsByPlayer[playerId].reduce((max, b) => b.amount > max.amount ? b : max);
        console.log(`✅ Jugador ${playerId} vendido a ${winningBid.userId} por ${winningBid.amount}M€!`);
        soldPlayerIds.add(winningBid.playerId);
    }
    localStorage.removeItem('fantasyBids');

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const playersToKeep = oldMarket.filter(player => {
        const entryDate = new Date(player.marketEntryDate);
        return !soldPlayerIds.has(player.id) && entryDate > twoDaysAgo;
    });

    const neededPlayers = 20 - playersToKeep.length;
    if (neededPlayers > 0) {
        const currentMarketIds = new Set(playersToKeep.map(p => p.id));
        const availablePlayers = TODOS_LOS_JUGADORES.filter(p => !currentMarketIds.has(p.id));
        
        const newPlayers = availablePlayers.sort(() => 0.5 - Math.random()).slice(0, neededPlayers);
        
        const newMarket = [
            ...playersToKeep,
            ...newPlayers.map(p => ({ ...p, marketEntryDate: todayString }))
        ];
        localStorage.setItem('fantasyMarket', JSON.stringify(newMarket));
        return newMarket;
    }
    
    localStorage.setItem('fantasyMarket', JSON.stringify(playersToKeep));
    return playersToKeep;
};


// --- Lógica de Gestión de Jornadas (CONECTADA A LA API) ---
// Esta función ahora es asíncrona porque tiene que esperar la respuesta de la API.
export const initiateJornadaData = async (jornada: number): Promise<void> => {
    console.log(`Obteniendo y guardando datos REALES para la jornada ${jornada}...`);
    
    // 1. Llama al servicio de API para obtener las puntuaciones en vivo
    const livePlayers = await getLivePlayerScores(TODOS_LOS_JUGADORES);

    // 2. Convierte la respuesta en el formato que necesitamos
    const scores: JornadaScores = {};
    livePlayers.forEach(player => {
        scores[player.id] = player.liveScore;
    });

    // 3. Guarda las puntuaciones en el "mini-servidor" de tu navegador
    localStorage.setItem(`jornada_${jornada}_scores`, JSON.stringify(scores));
    console.log(`Datos de la jornada ${jornada} guardados.`);
};

// LEE los datos de una jornada que ya han sido guardados.
export const getJornadaScores = (jornada: number): JornadaScores | null => {
    const data = localStorage.getItem(`jornada_${jornada}_scores`);
    return data ? JSON.parse(data) : null;
};

