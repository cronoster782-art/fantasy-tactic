"use client";

import { useEffect } from 'react';
import { initializeLeague } from '@/services/leagueService';

export default function LeagueInitializer() {
  useEffect(() => {
    // Esta función se ejecutará una sola vez cuando la aplicación cargue por primera vez.
    // Llama al "Director de Liga" para crear y guardar las plantillas si no existen.
    initializeLeague();
  }, []); // El array vacío [] asegura que solo se ejecute una vez.

  return null; // Este componente no renderiza nada visual.
}
