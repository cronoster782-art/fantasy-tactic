"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Jugador } from "@/players";
import { AVAILABLE_FORMATIONS, getPositionsForFormation, FormationName, FORMATIONS_LOGIC } from "@/rival-data";
import { getTeamRoster, saveTeamRoster, TeamRoster, buildValidLineupForFormation } from "@/services/leagueService";
import styles from "./equipo.module.css";

// CAMBIO: La selección ahora guarda el índice del hueco del titular
type Selection = { type: 'titular' | 'suplente'; player: Jugador; slotIndex: number; } | null;

// --- Componentes de la Interfaz ---
function EstadoIcon({ estado }: { estado: Jugador['estado'] }) {
    switch (estado.tipo) {
        case 'lesionado': return <div className={`${styles.estadoOverlay} ${styles.lesionado}`}>+</div>;
        case 'sancionado': return <div className={`${styles.estadoOverlay} ${styles.sancionado}`}>{estado.partidos}</div>;
        case 'apercibido': return <div className={`${styles.estadoOverlay} ${styles.apercibido}`}>4</div>;
        default: return null;
    }
}

function FichaEnCampo({ jugador, gridArea, onClick, isSelected }: { jugador: Jugador, gridArea: string, onClick: () => void, isSelected: boolean }) {
    return (
        <div className={`${styles.fichaEnCampo} ${isSelected ? styles.selected : ''}`} style={{ gridArea }} onClick={onClick}>
            <Image src={jugador.img} alt={jugador.nombre} width={50} height={50} className={styles.jugadorImagen} />
            <div className={styles.puntuacionOverlayCampo}>-</div>
            <EstadoIcon estado={jugador.estado} />
            <span className={styles.fichaNombre}>{jugador.nombre}</span>
        </div>
    );
}

function SuplenteCard({ jugador, onClick, isHighlighted }: { jugador: Jugador, onClick: () => void, isHighlighted: boolean }) {
    return (
        <div className={`${styles.suplenteCard} ${isHighlighted ? styles.highlighted : ''}`} onClick={onClick}>
            <Image src={jugador.img} alt={jugador.nombre} width={40} height={40} className={styles.jugadorImagen} />
            <div className={styles.suplenteInfo}>
                <span className={styles.suplenteNombre}>{jugador.nombre}</span>
                <span className={styles.suplentePosicion}>{jugador.posicion}</span>
            </div>
            <EstadoIcon estado={jugador.estado} />
        </div>
    );
}

function BanquilloSlotVacio() {
    return <div className={styles.banquilloSlotVacio}></div>;
}

function JugadorCard({ jugador, onSellClick }: { jugador: Jugador; onSellClick: (j: Jugador) => void }) {
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
                <Image src={jugador.img} alt={jugador.nombre} width={70} height={70} className={styles.jugadorImagen} />
                <div className={styles.puntuacionOverlay}>-</div>
                <EstadoIcon estado={jugador.estado} />
            </div>
            <div className={styles.jugadorInfo}>
                <span className={styles.jugadorNombre}>{jugador.nombre}</span>
                <span className={styles.jugadorValor}>{jugador.valor}</span>
                <div className={styles.puntuaciones}>
                    {jugador.ultimasPuntuaciones.map((p, i) => <span key={i} className={getPuntuacionClass(p)}>{p ?? '-'}</span>)}
                </div>
                <button className={styles.botonVenta} onClick={() => onSellClick(jugador)}>VENTA</button>
            </div>
        </div>
    );
}

function CampoSlotVacio({ gridArea, onClick, isHighlighted }: { gridArea: string, onClick: () => void, isHighlighted: boolean }) {
    return (
        <div className={`${styles.campoSlotVacio} ${isHighlighted ? styles.highlighted : ''}`} style={{ gridArea }} onClick={onClick}>
            +
        </div>
    );
}

// --- Página Principal de Equipo ---
export default function EquipoPage() {
    const [roster, setRoster] = useState<TeamRoster | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selection, setSelection] = useState<Selection>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [playerForModal, setPlayerForModal] = useState<Jugador | null>(null);
    
    const MY_TEAM_NAME = "Naranjitos F.C.";

    useEffect(() => {
        const teamRoster = getTeamRoster(MY_TEAM_NAME);
        setRoster(teamRoster);
        setIsLoading(false);
    }, []);

    const updateRoster = (newRoster: TeamRoster) => {
        setRoster(newRoster);
        setHasUnsavedChanges(true);
        setSelection(null);
    };

    const handleSaveChanges = () => {
        if (!roster) return;
        saveTeamRoster(MY_TEAM_NAME, roster);
        setHasUnsavedChanges(false);
        console.log("Cambios guardados.");
    };
    
    const handleSelectTitular = (titular: Jugador, slotIndex: number) => {
        if (selection?.type === 'suplente' && selection.player.posicion === titular.posicion && roster) {
            // Caso: Cambiar Suplente por Titular
            const newSuplentes = [...roster.suplentes.filter(s => s.id !== selection.player.id), titular];
            const newLineup = [...roster.lineup];
            newLineup[slotIndex] = selection.player;
            updateRoster({ ...roster, lineup: newLineup, suplentes: newSuplentes });
        } else {
            // Caso: Seleccionar/Deseleccionar un titular
            setSelection(prev => prev?.slotIndex === slotIndex ? null : { type: 'titular', player: titular, slotIndex });
        }
    };

    const handleSelectSuplente = (suplente: Jugador) => {
        if (selection?.type === 'titular' && selection.player.posicion === suplente.posicion && roster) {
            // Caso: Cambiar Titular por Suplente
            const newSuplentes = [...roster.suplentes.filter(s => s.id !== suplente.id), selection.player];
            const newLineup = [...roster.lineup];
            newLineup[selection.slotIndex] = suplente;
            updateRoster({ ...roster, lineup: newLineup, suplentes: newSuplentes });
        } else {
            // Caso: Seleccionar/Deseleccionar un suplente
            setSelection(prev => prev?.type === 'suplente' && prev.player.id === suplente.id ? null : { type: 'suplente', player: suplente, slotIndex: -1 });
        }
    };

    const handleFormationChange = (newFormationString: string) => {
        if (!roster) return;
        const newFormation = newFormationString as FormationName;
        const fullRoster = [...roster.lineup.filter(p => p !== null) as Jugador[], ...roster.suplentes];
        const newValidatedRoster = buildValidLineupForFormation(fullRoster, newFormation);
        updateRoster(newValidatedRoster);
    };

    const getPositionForSlot = (index: number, formation: FormationName): Jugador['posicion'] => {
        const needs = FORMATIONS_LOGIC[formation];
        const totalDef = 1 + needs.DEF;
        const totalMed = totalDef + needs.MED;
        if (index === 0) return 'POR';
        if (index < totalDef) return 'DEF';
        if (index < totalMed) return 'MED';
        return 'DEL';
    };

    const handleSelectEmptySlot = (slotIndex: number) => {
        if (selection?.type === 'suplente' && roster) {
            const positionNeeded = getPositionForSlot(slotIndex, roster.formation);
            if (selection.player.posicion === positionNeeded) {
                // Mover suplente a hueco vacío
                const newSuplentes = roster.suplentes.filter(s => s.id !== selection.player.id);
                const newLineup = [...roster.lineup];
                newLineup[slotIndex] = selection.player;
                updateRoster({ ...roster, lineup: newLineup, suplentes: newSuplentes });
            }
        }
    };

    const handleOpenModal = (jugador: Jugador) => { setPlayerForModal(jugador); setModalVisible(true); };
    const handleCloseModal = () => { setModalVisible(false); setPlayerForModal(null); };

    if (isLoading || !roster) {
        return <main className={styles.main}><h2>Cargando equipo...</h2></main>;
    }
    
    const posiciones = getPositionsForFormation(roster.formation);
    const todaLaPlantilla = [...roster.lineup.filter(p => p !== null) as Jugador[], ...roster.suplentes];
    const BENCH_SIZE = 7;
    const banquillo = [...roster.suplentes];
    while (banquillo.length < BENCH_SIZE) { banquillo.push(null as any); }

    return (
        <main className={`${styles.main} page-container-animated`}>
            <div className={`${styles.card} ${styles.tacticaLayout}`}>
                <div className={styles.banquilloContainer}>
                    <h3>Banquillo</h3>
                    {hasUnsavedChanges && (
                        <button className={styles.saveButton} onClick={handleSaveChanges}>
                            Guardar Cambios
                        </button>
                    )}
                    <div className={styles.suplentesLista}>
                        {banquillo.map((suplente, index) => 
                            suplente ? (
                                <SuplenteCard 
                                    key={suplente.id} 
                                    jugador={suplente} 
                                    onClick={() => handleSelectSuplente(suplente)}
                                    isHighlighted={
                                        (selection?.type === 'titular' && selection.player.posicion === suplente.posicion) ||
                                        (selection?.type === 'suplente' && selection.player.id === suplente.id)
                                    }
                                />
                            ) : <BanquilloSlotVacio key={`vacio-${index}`} />
                        )}
                    </div>
                </div>
                <div className={styles.campoContainer}>
                    <div className={styles.headerCampo}>
                        <h3>{MY_TEAM_NAME}</h3>
                        <select 
                            className={styles.formationSelector}
                            value={roster.formation}
                            onChange={(e) => handleFormationChange(e.target.value)}
                        >
                            {AVAILABLE_FORMATIONS.map(nombre => (
                                <option key={nombre} value={nombre}>{nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.campo}>
                        {posiciones.map((gridPos, index) => {
                            const jugadorEnPosicion = roster.lineup[index];
                            
                            return jugadorEnPosicion ? (
                                <FichaEnCampo 
                                    key={jugadorEnPosicion.id} 
                                    jugador={jugadorEnPosicion} 
                                    gridArea={gridPos}
                                    onClick={() => handleSelectTitular(jugadorEnPosicion, index)}
                                    isSelected={selection?.slotIndex === index}
                                />
                            ) : (
                                <CampoSlotVacio 
                                    key={`vacio-${index}`} 
                                    gridArea={gridPos} 
                                    onClick={() => handleSelectEmptySlot(index)}
                                    isHighlighted={selection?.type === 'suplente' && selection.player.posicion === getPositionForSlot(index, roster.formation)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <h2>Mi Plantilla (Total: {todaLaPlantilla.length}/18)</h2>
                <div className={styles.plantillaGrid}>
                    {todaLaPlantilla.map((jugador) => (
                        <JugadorCard key={jugador.id} jugador={jugador} onSellClick={handleOpenModal} />
                    ))}
                </div>
            </div>
            
            {modalVisible && playerForModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
                        <h3>Poner en venta a</h3>
                        <h2>{playerForModal.nombre}</h2>
                        <div className={styles.ofertaInputContainer}>
                            <input type="number" placeholder="Precio venta" defaultValue={parseInt(playerForModal.valor)} />
                            <span>M€</span>
                        </div>
                        <button className={styles.botonEnviarOferta}>Poner en Venta</button>
                    </div>
                </div>
            )}
        </main>
    );
}