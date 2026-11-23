"use client";

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return <main className="app-shell"><section className="empty-state" role="alert" style={{ marginTop: 80 }}><p className="eyebrow">VOLVAMOS A INTENTARLO</p><h1 style={{ fontSize: 34 }}>Algo no salió como esperábamos.</h1><p>No pudimos mostrar tu tablero en este momento.</p><button className="button button-primary" type="button" onClick={retry}>Reintentar</button></section></main>;
}
