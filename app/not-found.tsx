import Link from "next/link";

export default function NotFound() {
  return <main className="app-shell"><section className="empty-state" style={{ marginTop: 80 }}><p className="eyebrow">404</p><h1 style={{ fontSize: 34 }}>Este camino no existe.</h1><p>Tu tablero sigue en su lugar.</p><Link className="button button-primary" href="/">Volver a mi tablero</Link></section></main>;
}
