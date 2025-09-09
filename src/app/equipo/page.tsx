"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { JUGADORES_EQUIPO, JUGADORES_SUPLENTES, Jugador } from "@/players";
import { FORMACION_ACTUAL, MI_EQUIPO_INFO } from "@/equipo-data";
import { getPositionsForFormation, NOMBRES_FORMACIONES } from "@/rival-data";
import styles from "./equipo.module.css";

// --- Componentes de la Interfaz (sin cambios) ---
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

// --- Página Principal de Equipo ---
export default function EquipoPage() {
  const [titulares, setTitulares] = useState<Jugador[]>([]);
  const [suplentes, setSuplentes] = useState<Jugador[]>([]);
  const [selectedTitular, setSelectedTitular] = useState<Jugador | null>(null);
  const [formacionSeleccionada, setFormacionSeleccionada] = useState(FORMACION_ACTUAL.formacion);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerForModal, setPlayerForModal] = useState<Jugador | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // NUEVO ESTADO

  useEffect(() => {
    setTitulares(JUGADORES_EQUIPO);
    setSuplentes(JUGADORES_SUPLENTES);
  }, []);

  const handleSelectTitular = (titular: Jugador) => {
    if (selectedTitular?.id === titular.id) {
      setSelectedTitular(null);
    } else {
      setSelectedTitular(titular);
    }
  };

  const handleSelectSuplente = (suplente: Jugador) => {
    if (selectedTitular && selectedTitular.posicion === suplente.posicion) {
      const newTitulares = titulares.map(t => t.id === selectedTitular.id ? suplente : t);
      const newSuplentes = suplentes.map(s => s.id === suplente.id ? selectedTitular : s);
      setTitulares(newTitulares);
      setSuplentes(newSuplentes);
      setSelectedTitular(null);
      setHasUnsavedChanges(true); // Se ha hecho un cambio
    }
  };

  const handleFormationChange = (newFormation: string) => {
    setFormacionSeleccionada(newFormation);
    setHasUnsavedChanges(true); // Se ha hecho un cambio
  };

  const handleSaveChanges = () => {
    console.log("Guardando alineación...");
    // Aquí iría la lógica para guardar los datos en un servidor o localStorage
    setHasUnsavedChanges(false); // Se resetea el estado
  };
  
  const handleOpenModal = (jugador: Jugador) => {
    setPlayerForModal(jugador);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setPlayerForModal(null);
  };

  const posiciones = getPositionsForFormation(formacionSeleccionada);
  const todaLaPlantilla = [...titulares, ...suplentes];
  const BENCH_SIZE = 7;
  const banquillo = [...suplentes];
  while (banquillo.length < BENCH_SIZE) {
    banquillo.push(null as any);
  }

  return (
    <main className={styles.main}>
      <div className={`${styles.card} ${styles.tacticaLayout}`}>
        <div className={styles.banquilloContainer}>
            <h3>Banquillo</h3>
            <div className={styles.suplentesLista}>
                {banquillo.map((suplente, index) => 
                    suplente 
                        ? <SuplenteCard 
                            key={suplente.id} 
                            jugador={suplente} 
                            onClick={() => handleSelectSuplente(suplente)}
                            isHighlighted={!!selectedTitular && selectedTitular.posicion === suplente.posicion}
                          />
                        : <BanquilloSlotVacio key={`vacio-${index}`} />
                )}
            </div>
        </div>
        <div className={styles.campoContainer}>
            <div className={styles.headerCampo}>
                <h3>{MI_EQUIPO_INFO.nombre}</h3>
                <select 
                    className={styles.formationSelector}
                    value={formacionSeleccionada}
                    onChange={(e) => handleFormationChange(e.target.value)}
                >
                    {NOMBRES_FORMACIONES.map(nombre => (
                        <option key={nombre} value={nombre}>{nombre}</option>
                    ))}
                </select>
            </div>
            <div className={styles.campo}>
                {titulares.map((jugador, index) => (
                    <FichaEnCampo 
                        key={jugador.id} 
                        jugador={jugador} 
                        gridArea={posiciones[index]}
                        onClick={() => handleSelectTitular(jugador)}
                        isSelected={selectedTitular?.id === jugador.id}
                    />
                ))}
            </div>
            {/* NUEVO BOTÓN DE GUARDAR */}
            {hasUnsavedChanges && (
                <button className={styles.saveButton} onClick={handleSaveChanges}>
                    Guardar Alineación
                </button>
            )}
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

