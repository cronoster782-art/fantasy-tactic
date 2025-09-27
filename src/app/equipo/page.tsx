"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Jugador, TODOS_LOS_JUGADORES } from "@/players";
import { AVAILABLE_FORMATIONS, getPositionsForFormation, FormationName, FORMATIONS_LOGIC } from "@/rival-data";
import { getTeamRoster, saveTeamRoster, TeamRoster, buildValidLineupForFormation } from "@/services/leagueService";
import styles from "./equipo.module.css";

// CAMBIO: La selección ahora guarda el índice del hueco del titular
type Selection = { type: 'titular' | 'suplente' | 'grada'; player: Jugador; slotIndex: number; } | null;

// --- Componentes de la Interfaz ---
function EstadoIcon({ estado }: { estado: Jugador['estado'] }) {
    switch (estado.tipo) {
        case 'lesionado': return <div className={`${styles.estadoOverlay} ${styles.lesionado}`}>+</div>;
        case 'sancionado': return <div className={`${styles.estadoOverlay} ${styles.sancionado}`}>{estado.partidos}</div>;
        case 'apercibido': return <div className={`${styles.estadoOverlay} ${styles.apercibido}`}>4</div>;
        default: return null;
    }
}

function FichaEnCampo({ jugador, gridArea, onClick, isSelected, isHighlightedAsOption }: { 
    jugador: Jugador, 
    gridArea: string, 
    onClick: () => void, 
    isSelected: boolean, 
    isHighlightedAsOption?: boolean 
}) {
    return (
        <div className={`${styles.fichaEnCampo} ${isSelected ? styles.selected : ''} ${isHighlightedAsOption ? styles.highlightedOption : ''}`} style={{ gridArea }} onClick={onClick}>
            <img src={jugador.img} alt={jugador.nombre} width={50} height={50} className={styles.jugadorImagen} />
            <div className={styles.puntuacionOverlayCampo}>-</div>
            <EstadoIcon estado={jugador.estado} />
            <span className={styles.fichaNombre}>{jugador.nombre}</span>
        </div>
    );
}

function SuplenteCard({ jugador, onClick, isHighlighted, isHighlightedAsOption }: { 
    jugador: Jugador, 
    onClick: () => void, 
    isHighlighted: boolean, 
    isHighlightedAsOption?: boolean 
}) {
    return (
        <div className={`${styles.suplenteCard} ${isHighlighted ? styles.highlighted : ''} ${isHighlightedAsOption ? styles.highlightedOption : ''}`} onClick={onClick}>
            <div className={`${styles.posicionBadge} ${styles['posicion' + jugador.posicion]}`}>{jugador.posicion}</div>
            <div className={styles.suplenteImagenContainer}>
                <img src={jugador.img} alt={jugador.nombre} width={40} height={40} className={styles.jugadorImagen} />
                <EstadoIcon estado={jugador.estado} />
            </div>
            <div className={styles.suplenteInfo}>
                <span className={styles.suplenteNombre}>{jugador.nombre}</span>
            </div>
        </div>
    );
}

function BanquilloSlotVacio({ posicionEsperada }: { posicionEsperada?: string }) {
    return (
        <div className={styles.banquilloSlotVacio}>
            <span className={styles.posicionEsperada}>{posicionEsperada || '+'}</span>
        </div>
    );
}

function JugadorCard({ jugador, onSellClick, isConvocado = true, onSelectClick, isHighlighted = false, isHighlightedAsOption = false }: { 
    jugador: Jugador; 
    onSellClick: (j: Jugador) => void;
    isConvocado?: boolean;
    onSelectClick?: (j: Jugador) => void;
    isHighlighted?: boolean;
    isHighlightedAsOption?: boolean;
}) {
    const getPuntuacionClass = (p: number | null) => {
        if (p === null) return styles.noJugado;
        if (p < 0) return styles.puntosNegativos;
        if (p === 0) return styles.puntosCero;
        if (p <= 5) return styles.puntosBajos;
        if (p <= 9) return styles.puntosMedios;
        return styles.puntosAltos;
    };
    return (
        <div 
            className={`${styles.jugadorCard} ${!isConvocado ? styles.noConvocado : ''} ${isHighlighted ? styles.highlighted : ''} ${isHighlightedAsOption ? styles.highlightedOption : ''}`}
            onClick={onSelectClick ? () => onSelectClick(jugador) : undefined}
            style={{ cursor: onSelectClick ? 'pointer' : 'default' }}
        >
            <div className={`${styles.posicionBadge} ${styles['posicion' + jugador.posicion]}`}>{jugador.posicion}</div>
            {!isConvocado && <div className={styles.noConvocadoBadge}>NC</div>}
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

    // Elimina duplicados entre titular y suplentes y garantiza consistencia
    const sanitizeRoster = (r: TeamRoster): TeamRoster => {
        const seen = new Set<number>();
        // Mantener 11 slots en lineup
        const cleanLineup: (Jugador | null)[] = r.lineup.map((p) => {
            if (!p) return null;
            if (seen.has(p.id)) return null; // si por error estaba duplicado, vaciamos el slot
            seen.add(p.id);
            return p;
        });
        const cleanSuplentes: Jugador[] = [];
        for (const s of r.suplentes) {
            if (!seen.has(s.id)) {
                seen.add(s.id);
                cleanSuplentes.push(s);
            }
        }
        return { lineup: cleanLineup, suplentes: cleanSuplentes, formation: r.formation };
    };

    useEffect(() => {
        const teamRoster = getTeamRoster(MY_TEAM_NAME);
        const cleaned = sanitizeRoster(teamRoster);
        if (JSON.stringify(cleaned) !== JSON.stringify(teamRoster)) {
            // Persistimos la corrección para no arrastrar duplicados
            saveTeamRoster(MY_TEAM_NAME, cleaned);
        }
        setRoster(cleaned);
        setIsLoading(false);
    }, []);

    const updateRoster = (newRoster: TeamRoster) => {
        const cleaned = sanitizeRoster(newRoster);
        setRoster(cleaned);
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

    const handleSelectGrada = (jugadorGrada: Jugador) => {
        if (selection?.type === 'suplente' && selection.player.posicion === jugadorGrada.posicion && roster) {
            // Intercambiar prioridades dentro de 'suplentes' para que cambien quiénes son visibles (no cambiar la membresía)
            const suplentes = [...roster.suplentes];
            const jugadorSuplente = selection.player;

            const idxA = suplentes.findIndex(s => s.id === jugadorSuplente.id); // suplente visible seleccionado
            const idxB = suplentes.findIndex(s => s.id === jugadorGrada.id);     // suplente actualmente en grada

            let newSuplentes: Jugador[] = [];
            if (idxA !== -1 && idxB !== -1) {
                // Ambos existen en el array de suplentes: swap de posiciones para alterar visibilidad por distribución
                [suplentes[idxA], suplentes[idxB]] = [suplentes[idxB], suplentes[idxA]];
                newSuplentes = suplentes;
            } else {
                // Caso resiliente: si alguno no está (no debería pasar), reinsertar sin duplicados
                const cleaned = suplentes.filter(s => s.id !== jugadorSuplente.id && s.id !== jugadorGrada.id);
                const insertAt = idxA !== -1 ? Math.min(idxA, cleaned.length) : cleaned.length;
                newSuplentes = [
                    ...cleaned.slice(0, insertAt),
                    jugadorGrada, // ocupa la posición del visible seleccionado
                    ...cleaned.slice(insertAt),
                    jugadorSuplente // se va al final (grada)
                ];
            }

            updateRoster({ ...roster, suplentes: newSuplentes });
        } else {
            // Caso: Seleccionar/Deseleccionar jugador de la grada
            setSelection(prev => prev?.type === 'grada' && prev.player.id === jugadorGrada.id ? null : { type: 'grada', player: jugadorGrada, slotIndex: -1 });
        }
    };

    const handleFormationChange = (newFormationString: string) => {
        if (!roster) return;
        const newFormation = newFormationString as FormationName;
        // Construir roster único por id antes de reubicar
        const fullRosterRaw = [...roster.lineup.filter(p => p !== null) as Jugador[], ...roster.suplentes];
        const uniqueMap = new Map<number, Jugador>();
        for (const j of fullRosterRaw) uniqueMap.set(j.id, j);
        const fullRoster = Array.from(uniqueMap.values());
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
    
    // Calcular banquillo VISIBLE con distribución específica
    const banquilloDistribucion = {
        'POR': roster.suplentes.filter(j => j.posicion === 'POR').slice(0, 1),
        'DEF': roster.suplentes.filter(j => j.posicion === 'DEF').slice(0, 2),
        'MED': roster.suplentes.filter(j => j.posicion === 'MED').slice(0, 2),
        'DEL': roster.suplentes.filter(j => j.posicion === 'DEL').slice(0, 2)
    };
    
    // Jugadores que REALMENTE aparecen en el banquillo (según distribución)
    const suplentesVisibles = [
        ...banquilloDistribucion.POR,
        ...banquilloDistribucion.DEF,
        ...banquilloDistribucion.MED,
        ...banquilloDistribucion.DEL
    ];
    
    // Identificar jugadores convocados REALES (solo los que están en campo + banquillo visible)
    const titularesReales = roster.lineup.filter(p => p !== null) as Jugador[];
    const jugadoresConvocadosReales = [...titularesReales, ...suplentesVisibles];
    const jugadoresConvocados = new Set(jugadoresConvocadosReales.map(j => j.id));
    
    // Jugadores en la grada: jugadores del roster que no están en convocados visibles
    const jugadoresGrada = todaLaPlantilla.filter((j: Jugador) => !jugadoresConvocados.has(j.id));
    
    console.log('DEBUG - Total jugadores del equipo (roster actual):', todaLaPlantilla.length);
    console.log('DEBUG - Titulares:', titularesReales.length);
    console.log('DEBUG - Suplentes visibles:', suplentesVisibles.length);
    console.log('DEBUG - Total convocados:', jugadoresConvocados.size);
    console.log('DEBUG - Jugadores en grada:', jugadoresGrada.length);
    console.log('DEBUG - Nombres en grada:', jugadoresGrada.map(j => j.nombre));
    
    // Ordenar plantilla por posiciones: POR, DEF, MED, DEL  
    const plantillaOrdenada = jugadoresConvocadosReales.sort((a, b) => {
        const ordenPosiciones = { 'POR': 1, 'DEF': 2, 'MED': 3, 'DEL': 4 };
        return ordenPosiciones[a.posicion] - ordenPosiciones[b.posicion];
    });
    
    // Crear banquillo con distribución específica: 1 POR, 2 DEF, 2 MED, 2 DEL
    const BENCH_SIZE = 7;
    
    // Construir banquillo ordenado respetando la distribución
    const banquillo: (Jugador | null)[] = [
        ...banquilloDistribucion.POR,
        ...Array(1 - banquilloDistribucion.POR.length).fill(null),
        ...banquilloDistribucion.DEF,
        ...Array(2 - banquilloDistribucion.DEF.length).fill(null),
        ...banquilloDistribucion.MED,
        ...Array(2 - banquilloDistribucion.MED.length).fill(null),
        ...banquilloDistribucion.DEL,
        ...Array(2 - banquilloDistribucion.DEL.length).fill(null)
    ];

    return (
        <main className={`${styles.main} page-container-animated`}>
            <div className={`${styles.card} ${styles.tacticaLayout}`}>
                <div className={styles.banquilloContainer}>
                    <div className={styles.banquilloHeader}>
                        <h3>Banquillo</h3>
                        {hasUnsavedChanges && (
                            <button className={styles.saveButton} onClick={handleSaveChanges}>
                                Guardar Cambios
                            </button>
                        )}
                    </div>
                    <div className={styles.suplentesLista}>
                        {banquillo.map((suplente, index) => {
                            // Determinar la posición esperada según el índice
                            const posicionesEsperadas = ['POR', 'DEF', 'DEF', 'MED', 'MED', 'DEL', 'DEL'];
                            const posicionEsperada = posicionesEsperadas[index];
                            
                            return suplente ? (
                                <SuplenteCard 
                                    key={suplente.id} 
                                    jugador={suplente} 
                                    onClick={() => handleSelectSuplente(suplente)}
                                    isHighlighted={selection?.type === 'suplente' && selection.player.id === suplente.id}
                                    isHighlightedAsOption={
                                        (selection?.type === 'titular' && 
                                        selection.player.posicion === suplente.posicion &&
                                        selection.player.id !== suplente.id) ||
                                        (selection?.type === 'grada' && 
                                        selection.player.posicion === suplente.posicion &&
                                        selection.player.id !== suplente.id)
                                    }
                                />
                            ) : <BanquilloSlotVacio key={`vacio-${index}`} posicionEsperada={posicionEsperada} />;
                        })}
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
                                    isHighlightedAsOption={
                                        selection?.type === 'suplente' && 
                                        selection.player.posicion === jugadorEnPosicion.posicion &&
                                        selection.player.id !== jugadorEnPosicion.id
                                    }
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
            
            {/* Sección Grada - Jugadores no convocados justo debajo del campo */}
            {jugadoresGrada.length > 0 && (
                <div className={styles.gradaSection}>
                    <div className={styles.gradaContainer}>
                        <h3 className={styles.gradaTitle}>Grada</h3>
                        {jugadoresGrada.map((jugador: Jugador) => {
                            const esGradaSeleccionado = selection?.type === 'grada' && selection.player.id === jugador.id;
                            const esPosibleIntercambio = selection?.type === 'suplente' && selection.player.posicion === jugador.posicion;
                            
                            return (
                                <SuplenteCard 
                                    key={jugador.id} 
                                    jugador={jugador} 
                                    onClick={() => handleSelectGrada(jugador)}
                                    isHighlighted={esGradaSeleccionado}
                                    isHighlightedAsOption={esPosibleIntercambio}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            <div className={styles.card}>
                <h2>Mi Plantilla (Total: {todaLaPlantilla.length})</h2>
                <div className={styles.plantillaPorPosiciones}>
                    {['POR', 'DEF', 'MED', 'DEL'].map((posicion) => {
                        const jugadoresPosicion = plantillaOrdenada.filter(j => j.posicion === posicion);
                        const nombrePosicion = {
                            'POR': 'Porteros',
                            'DEF': 'Defensas', 
                            'MED': 'Centrocampistas',
                            'DEL': 'Delanteros'
                        };
                        const clasePosicion = {
                            'POR': 'porteros',
                            'DEF': 'defensas',
                            'MED': 'centrocampistas', 
                            'DEL': 'delanteros'
                        };
                        
                        // Mostrar todos los jugadores del equipo (convocados + grada) sin distinción
                        const jugadoresConvocadosPosicion = jugadoresPosicion;
                        const jugadoresGradaPosicion = jugadoresGrada.filter((j: Jugador) => j.posicion === posicion);
                        const todosLosJugadoresPosicion = [...jugadoresConvocadosPosicion, ...jugadoresGradaPosicion];
        
        return todosLosJugadoresPosicion.length > 0 ? (
                            <div key={posicion} className={styles.seccionPosicion}>
                                <h3 className={`${styles.tituloPosicion} ${styles[clasePosicion[posicion as keyof typeof clasePosicion]]}`}>
                                    {nombrePosicion[posicion as keyof typeof nombrePosicion]} ({todosLosJugadoresPosicion.length})
                                </h3>
                                <div className={styles.plantillaGrid}>
                                    {todosLosJugadoresPosicion.map((jugador) => (
                                        <JugadorCard 
                                            key={jugador.id} 
                                            jugador={jugador} 
                                            onSellClick={handleOpenModal}
                                            isConvocado={true}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : null;
                    })}
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