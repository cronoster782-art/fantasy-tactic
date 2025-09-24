"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Jugador } from "@/players";
import { Team } from "@/teams";
import { getCurrentRound } from "@/services/apiSportsService";
import { getOpponentForRound, getTeamRoster, TeamRoster } from "@/services/leagueService";
import styles from "./rival.module.css";
import React from "react";

// --- Componentes Reutilizables ---

function NumericKeypad({ value, onChange }: { value: string; onChange: (newValue: string) => void }) {
    const handleKeyPress = (key: string) => {
        if (key === 'del') {
            onChange(value.slice(0, -1));
        } else if (value.length < 4) {
            onChange(value + key);
        }
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

function JugadorCard({ jugador, onOfferClick }: { jugador: Jugador; onOfferClick: (j: Jugador) => void }) {
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
                <button className={styles.botonOferta} onClick={() => onOfferClick(jugador)}>OFERTA</button>
            </div>
        </div>
    );
}


// --- Página Principal del Rival ---
export default function RivalPage() {
    const [opponent, setOpponent] = useState<Team | null>(null);
    const [roster, setRoster] = useState<TeamRoster>({ lineup: [], suplentes: [], formation: '4-4-2' });
    const [isLoading, setIsLoading] = useState(true);
    const [currentRound, setCurrentRound] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Jugador | null>(null);
    const [offerPrice, setOfferPrice] = useState("");

    const MY_TEAM_NAME = "Naranjitos F.C.";

    useEffect(() => {
        const loadRivalData = async () => {
            setIsLoading(true);
            const round = await getCurrentRound();
            setCurrentRound(round);
            const rival = getOpponentForRound(MY_TEAM_NAME, round);
            
            if (rival) {
                setOpponent(rival);
                const rivalRoster = getTeamRoster(rival.name);
                setRoster(rivalRoster);
            }
            setIsLoading(false);
        };
        loadRivalData();
    }, []);

    const handleOpenModal = (jugador: Jugador) => {
        setSelectedPlayer(jugador);
        setOfferPrice(parseInt(jugador.valor).toString());
        setModalVisible(true);
    };
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedPlayer(null);
    };

    if (isLoading) {
        return <main className={styles.main}><div className={styles.card}><h2>Buscando rival...</h2></div></main>;
    }

    if (!opponent) {
        return <main className={styles.main}><div className={styles.card}><h2>No se ha encontrado rival para {MY_TEAM_NAME} en la jornada {currentRound}.</h2></div></main>;
    }

    const todaLaPlantilla = [...roster.lineup.filter(p => p !== null), ...roster.suplentes] as Jugador[];

    return (
        <main className={`${styles.main} page-container-animated`}>
            <div className={styles.card}>
                <h2>Últimas Formaciones de {opponent.name}</h2>
                <div className={styles.formacionesContainer}>
                    <p style={{ color: '#aaa', textAlign: 'center' }}>
                        El historial de formaciones del rival estará disponible próximamente.
                    </p>
                </div>
            </div>

            <div className={styles.card}>
                <h2>Plantilla de {opponent.name}</h2>
                <div className={styles.plantillaGrid}>
                    {todaLaPlantilla.map((jugador) => (
                        <JugadorCard key={jugador.id} jugador={jugador} onOfferClick={handleOpenModal} />
                    ))}
                </div>
            </div>

            {modalVisible && selectedPlayer && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
                        <h3>Hacer oferta por</h3>
                        <h2>{selectedPlayer.nombre}</h2>
                        <div className={styles.ofertaInputContainer}>
                            <input type="text" value={offerPrice || "0"} readOnly className={styles.priceDisplay} />
                            <span>M€</span>
                        </div>
                        <NumericKeypad value={offerPrice} onChange={setOfferPrice} />
                        <button className={styles.botonEnviarOferta}>Enviar Oferta</button>
                    </div>
                </div>
            )}
        </main>
    );
}