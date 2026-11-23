import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foco — Un paso a la vez",
  description: "Organiza tus tareas en tu propio espacio, sin registro. Menos ruido, más claridad.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#10141c" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
