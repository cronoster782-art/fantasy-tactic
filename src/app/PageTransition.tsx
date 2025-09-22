"use client";

import { motion, AnimatePresence } from 'framer-motion';

// Este componente envuelve cada página para darle una animación de entrada y salida.
export default function PageTransition({ children, routeKey }: { children: React.ReactNode, routeKey: string }) {
  return (
    // 'AnimatePresence' gestiona las animaciones de los componentes que aparecen o desaparecen.
    // 'mode="wait"' asegura que la animación de salida termine antes de que empiece la de entrada.
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey} // La clave que le dice a Framer Motion que la página ha cambiado
        initial={{ opacity: 0 }} // Estado inicial: invisible
        animate={{ opacity: 1 }} // Estado final: visible
        exit={{ opacity: 0 }} // Estado de salida: se desvanece
        transition={{ duration: 0.4, ease: "easeInOut" }} // Duración y tipo de animación
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

