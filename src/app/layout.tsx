"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { usePathname } from 'next/navigation';

const chalkFont = localFont({
  src: "../fonts/Chalkboy.woff2",
  display: "swap",
  variable: "--font-chalk",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bodyClassName = `${chalkFont.variable} ${poppins.variable}`;

  // Esta 'key' es un truco para que la animación se repita cada vez que cambias de página
  const animationKey = pathname; 

  return (
    <html lang="es">
      <body className={bodyClassName}>
        {pathname !== '/' && (
          <nav>
            <a href="/liga">Liga</a>
            <a href="/equipo">Equipo</a>
            <a href="/fichajes">Fichajes</a>
            <a href="/rival">Rival</a>
          </nav>
        )}
        
        {/* CAMBIO: Envolvemos cada página en este div.
            Si no es la página del logo, le aplica la clase de animación.
        */}
        <div key={animationKey} className={pathname !== '/' ? 'page-container-animated' : ''}>
          {children}
        </div>
      </body>
    </html>
  );
}

