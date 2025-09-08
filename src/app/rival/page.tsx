"use client";

import { useState } from "react";
import Image from "next/image";
import { JUGADORES_RIVAL, JUGADORES_SUPLENTES_RIVAL, Jugador } from "@/players";
import { DATOS_RIVAL, Formacion, getPositionsForFormation } from "@/rival-data";
import styles from "./rival.module.css";

// --- Componente para el Teclado Numérico ---
function NumericKeypad({ value, onChange }: { value: string; onChange: (newValue: string) => void }) {
    const handleKeyPress = (key: string) => {
        if (key === 'del') {
            onChange(value.slice(0, -1)); // Borra el último número
        } else if (value.length < 4) { // Limita el precio a 4 dígitos
            onChange(value + key);
        }
    };

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'del'];

    return (
        <div className={styles.numericKeypad}>
            {keys.map(key => (
                <button
                    key={key}
                    onClick={() => key === 'C' ? onChange('') : handleKeyPress(key)}
                    className={styles.keypadButton}
                >
                    {key === 'del' ? '⌫' : key}
                </button>
            ))}
        </div>
    );
}

// --- Componentes de la Interfaz (sin cambios) ---
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
        <button className={styles.botonOferta} onClick={() => onOfferClick(jugador)}>OFERTA</button>
      </div>
    </div>
  );
}
function FichaRival({ gridArea, color }: { gridArea: string; color: string }) {
    return <div className={styles.fichaRival} style={{ gridArea, backgroundColor: color }}></div>;
}
function MiniCampo({ jornada, formacion, jugadores }: { jornada: number; formacion: string; jugadores: Formacion }) {
    const posiciones = getPositionsForFormation(formacion);
    return (
        <div className={styles.miniCampoContainer}>
            <h4>Jornada {jornada} ({formacion})</h4>
            <div className={styles.miniCampo}>
                {jugadores.map((jugador, index) => (
                    <FichaRival
                        key={jugador.id}
                        gridArea={posiciones[index]}
                        color={DATOS_RIVAL.colorPrimario}
                    />
                ))}
            </div>
        </div>
    );
}

// --- Página Principal del Rival ---
export default function RivalPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Jugador | null>(null);
  const [offerPrice, setOfferPrice] = useState(""); // Estado para el precio de la oferta

  const handleOpenModal = (jugador: Jugador) => {
    setSelectedPlayer(jugador);
    setOfferPrice(parseInt(jugador.valor).toString()); // Pre-rellena el precio con el valor de mercado
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPlayer(null);
  };

  const todaLaPlantilla = [...JUGADORES_RIVAL, ...JUGADORES_SUPLENTES_RIVAL];

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2>Últimas Formaciones de {DATOS_RIVAL.nombre}</h2>
        <div className={styles.formacionesContainer}>
          {DATOS_RIVAL.formacionesAnteriores.map((formacion) => (
            <MiniCampo key={formacion.jornada} {...formacion} />
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2>Plantilla Actual</h2>
        <div className={styles.plantillaGrid}>
          {todaLaPlantilla.map((jugador) => (
            <JugadorCard key={jugador.id} jugador={jugador} onOfferClick={handleOpenModal} />
          ))}
        </div>
      </div>

      {/* Ventana Modal para Ofertas (MODIFICADA) */}
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
            {/* Se añade el teclado numérico */}
            <NumericKeypad value={offerPrice} onChange={setOfferPrice} />
            <button className={styles.botonEnviarOferta}>Enviar Oferta</button>
          </div>
        </div>
      )}
    </main>
  );
}

