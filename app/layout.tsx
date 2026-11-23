import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foco — Un paso a la vez",
  description: "Organiza tus tareas en tu propio espacio, sin registro. Menos ruido, más claridad.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#10141c" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="es"><body><noscript><section className="noscript-notice" aria-labelledby="noscript-title"><h2 id="noscript-title">Activa JavaScript para usar Foco</h2><p>Tu navegador necesita JavaScript para abrir el tablero y guardar las tareas. Actívalo para este sitio y vuelve a cargar la página.</p><a className="button button-primary" href="/">Volver a cargar Foco</a></section></noscript>{children}</body></html>;
}
