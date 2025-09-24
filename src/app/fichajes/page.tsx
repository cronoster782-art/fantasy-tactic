"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { JUGADORES_LIBRES as ALL_FREE_PLAYERS, Jugador } from "@/players";
import styles from "./fichajes.module.css";

// --- Tipos de Datos Mejorados ---
type MarketPlayer = Jugador & {
    marketEntryDate: string;
};
// Nuevo tipo para guardar las pujas
type Bid = {
    playerId: number;
    amount: number;
    userId: string; // En un futuro, aquí iría el ID del usuario real
};

// --- Componentes (sin cambios) ---
function NumericKeypad({ value, onChange }: { value: string; onChange: (newValue: string) => void }) {
    const handleKeyPress = (key: string) => {
        if (key === 'del') { onChange(value.slice(0, -1)); } 
        else if (value.length < 4) { onChange(value + key); }
    };
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'del'];
    return (
        <div className={styles.numericKeypad}>
            {keys.map(key => (
                <button key={key} onClick={() => key === 'C' ? onChange('') : handleKeyPress(key)} className={styles.keypadButton}>
                    {key === 'del' ? '⌫' : key}
                </button>
            ))}
        </div>
    );
}
function EstadoIcon({ estado }: { estado: Jugador['estado'] }) {
  switch (estado.tipo) {
    case 'lesionado': return <div className={`${styles.estadoOverlay} ${styles.lesionado}`}>+</div>;
    case 'sancionado': return <div className={`${styles.estadoOverlay} ${styles.sancionado}`}>{estado.partidos}</div>;
    case 'apercibido': return <div className={`${styles.estadoOverlay} ${styles.apercibido}`}>4</div>;
    default: return null;
  }
}
function JugadorCard({ jugador, onBidClick }: { jugador: Jugador; onBidClick: (j: Jugador) => void }) {
  const getPuntuacionClass = (p: number | null) => {
    if (p === null) return styles.noJugado;
    if (p < 0) return styles.puntosNegativos;
    if (p === 0) return styles.puntosCero;
    if (p <= 5) return styles.puntosBajos;
    if (p <= 9) return styles.puntosMedios;
    return styles.puntosAltos;
  };
  return (
    <div className={styles.jugadorCard}>
      <div className={styles.posicionBadge}>{jugador.posicion}</div>
      <div className={styles.jugadorImagenContainer}>
        <img src={jugador.img} alt={jugador.nombre} width={70} height={70} className={styles.jugadorImagen} />
        <div className={styles.puntuacionOverlay}>-</div>
        <EstadoIcon estado={jugador.estado} />
      </div>
      <div className={styles.jugadorInfo}>
        <span className={styles.jugadorNombre}>{jugador.nombre}</span>
        <span className={styles.jugadorValor}>{jugador.valor}</span>
        <div className={styles.puntuaciones}>
          {jugador.ultimasPuntuaciones.map((p, i) => <span key={i} className={getPuntuacionClass(p)}>{p ?? '-'}</span>)}
        </div>
        <button className={styles.botonPujar} onClick={() => onBidClick(jugador)}>PUJAR</button>
      </div>
    </div>
  );
}

// --- Página Principal de Fichajes ---
export default function FichajesPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Jugador | null>(null);
  const [bidPrice, setBidPrice] = useState("");
  const [marketPlayers, setMarketPlayers] = useState<MarketPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulamos un ID de usuario para las pujas
  const a_simulated_userId = "user_fantasy_tactic";

  useEffect(() => {
    const initializeMarket = () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const marketResetHour = 7;

      const storedMarketData = localStorage.getItem('fantasyMarket');
      const storedMarket: MarketPlayer[] = storedMarketData ? JSON.parse(storedMarketData) : [];
      
      const storedBidsData = localStorage.getItem('fantasyBids');
      const storedBids: Bid[] = storedBidsData ? JSON.parse(storedBidsData) : [];
      
      const lastUpdateString = localStorage.getItem('marketLastUpdate') || "2000-01-01";
      const lastUpdateDate = new Date(lastUpdateString);

      const needsUpdate = !storedMarketData || (today.toDateString() !== lastUpdateDate.toDateString() && today.getHours() >= marketResetHour);

      if (needsUpdate) {
        console.log("ACTUALIZACIÓN DIARIA DEL MERCADO...");
        
        // 1. Procesar pujas del día anterior
        const bidsByPlayer: { [key: number]: Bid[] } = {};
        storedBids.forEach(bid => {
            if (!bidsByPlayer[bid.playerId]) bidsByPlayer[bid.playerId] = [];
            bidsByPlayer[bid.playerId].push(bid);
        });

        const soldPlayerIds = new Set<number>();
        for (const playerId in bidsByPlayer) {
            const playerBids = bidsByPlayer[playerId];
            const winningBid = playerBids.reduce((max, bid) => bid.amount > max.amount ? bid : max);
            console.log(`✅ Jugador ${playerId} vendido a ${winningBid.userId} por ${winningBid.amount}M€!`);
            soldPlayerIds.add(winningBid.playerId);
            // En una app real, aquí se añadiría el jugador al equipo del ganador.
        }
        localStorage.removeItem('fantasyBids'); // Limpiamos las pujas ya procesadas

        // 2. Filtrar jugadores que expiran (2 días sin pujas) o han sido vendidos
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);

        const playersToKeep = storedMarket.filter(player => {
            const entryDate = new Date(player.marketEntryDate);
            const wasSold = soldPlayerIds.has(player.id);
            const isExpired = entryDate <= twoDaysAgo;
            if (isExpired && !wasSold) console.log(`🗑️ Jugador ${player.id} (${player.nombre}) ha expirado del mercado.`);
            return !wasSold && !isExpired;
        });

        // 3. Rellenar el mercado hasta 20 jugadores
        const neededPlayers = 20 - playersToKeep.length;
        if (neededPlayers > 0) {
            const currentMarketIds = new Set(playersToKeep.map(p => p.id));
            const availablePlayers = ALL_FREE_PLAYERS.filter(p => !currentMarketIds.has(p.id) && !soldPlayerIds.has(p.id));
            const shuffled = availablePlayers.sort(() => 0.5 - Math.random());
            const newPlayers: MarketPlayer[] = shuffled.slice(0, neededPlayers).map(p => ({
                ...p,
                marketEntryDate: todayString,
            }));
            
            const newMarket = [...playersToKeep, ...newPlayers];
            setMarketPlayers(newMarket);
            localStorage.setItem('fantasyMarket', JSON.stringify(newMarket));
        } else {
            setMarketPlayers(playersToKeep);
            localStorage.setItem('fantasyMarket', JSON.stringify(playersToKeep));
        }
        localStorage.setItem('marketLastUpdate', todayString);
      } else {
        setMarketPlayers(storedMarket);
      }
      setIsLoading(false);
    };

    initializeMarket();
  }, []);

  const handleBidSubmit = () => {
    if (!selectedPlayer || !bidPrice) return;

    const currentBidsData = localStorage.getItem('fantasyBids');
    const currentBids: Bid[] = currentBidsData ? JSON.parse(currentBidsData) : [];

    const newBid: Bid = {
        playerId: selectedPlayer.id,
        amount: parseInt(bidPrice),
        userId: a_simulated_userId
    };

    // Filtramos pujas antiguas del mismo usuario para el mismo jugador
    const otherBids = currentBids.filter(b => !(b.playerId === newBid.playerId && b.userId === newBid.userId));
    
    localStorage.setItem('fantasyBids', JSON.stringify([...otherBids, newBid]));
    console.log(`Puja guardada: ${newBid.amount}M€ por el jugador ${newBid.playerId}`);
    handleCloseModal();
  };

  const handleOpenModal = (jugador: Jugador) => {
    setSelectedPlayer(jugador);
    setBidPrice(parseInt(jugador.valor).toString());
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPlayer(null);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2>Mercado de Fichajes</h2>
        {isLoading ? (
            <p>Cargando mercado...</p>
        ) : (
            <div className={styles.plantillaGrid}>
            {marketPlayers.map((jugador) => (
                <JugadorCard key={jugador.id} jugador={jugador} onBidClick={handleOpenModal} />
            ))}
            </div>
        )}
      </div>

      {modalVisible && selectedPlayer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            <h3>Hacer puja por</h3>
            <h2>{selectedPlayer.nombre}</h2>
            <div className={styles.ofertaInputContainer}>
              <input type="text" value={bidPrice || "0"} readOnly className={styles.priceDisplay} />
              <span>M€</span>
            </div>
            <NumericKeypad value={bidPrice} onChange={setBidPrice} />
            <button className={styles.botonEnviarOferta} onClick={handleBidSubmit}>Enviar Puja</button>
          </div>
        </div>
      )}
    </main>
  );
}

