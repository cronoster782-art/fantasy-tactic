// src/app/layout.tsx

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

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

export const metadata: Metadata = {
  title: "Fantasy Tactic",
  description: "Tu liga de fútbol fantasy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const bodyClassName = `${chalkFont.variable} ${poppins.variable}`;

    return (
        <html lang="es">
            <body className={bodyClassName}>
                {/* La clave está en este div que envuelve todo */}
                <div className="app-container">
                    <ClientLayoutWrapper>
                        {children}
                    </ClientLayoutWrapper>
                </div>
            </body>
        </html>
    );
}