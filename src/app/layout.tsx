// src/app/(auth)/layout.tsx

import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Creamos un contenedor que ocupa toda la pantalla
    // y le aplicamos el fondo de pizarra directamente aquí.
    <div style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: "url('/pizarra.jpg') no-repeat center center fixed",
        backgroundSize: 'cover',
    }}>
        {children}
    </div>
  );
}