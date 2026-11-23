"use client";

import { useEffect, useRef, useState } from "react";
import { loadTasks, moveTask, removeTask, saveTask } from "../lib/client-api";
import { PRIORITY_LABELS, PRIORITY_VALUES, STATUS_LABELS, STATUS_VALUES, type Task, type TaskInput, type TaskPriority, type TaskStatus } from "../lib/tasks";
import { Icon } from "./icon";
import { TaskCard } from "./task-card";
import { DeleteDialog, TaskDialog } from "./task-dialog";

type DialogState = { kind: "create"; status: TaskStatus } | { kind: "edit" | "delete"; task: Task } | null;
const columnCopy: Record<TaskStatus, string> = { pending: "Todo empieza con un primer paso.", in_progress: "Una cosa a la vez, vas bien.", done: "Aquí se celebran tus avances." };

export function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [priority, setPriority] = useState<TaskPriority | "all">("all");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const initialLoad = useRef<Promise<Task[]> | null>(null);
  const moving = useRef(false);

  useEffect(() => {
    let active = true;
    initialLoad.current ??= loadTasks();
    initialLoad.current.then((data) => { if (active) { setTasks(data); setPhase("ready"); } }).catch((cause: unknown) => { if (active) { setError(cause instanceof Error ? cause.message : "No pudimos abrir tu espacio."); setPhase("error"); } });
    return () => { active = false; };
  }, []);

  async function retry() {
    setPhase("loading"); setError("");
    try { const data = await loadTasks(); setTasks(data); setPhase("ready"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos abrir tu espacio."); setPhase("error"); }
  }
  function clearFilters() { setQuery(""); setStatus("all"); setPriority("all"); }
  function create(status: TaskStatus = "pending") { setDialog({ kind: "create", status }); }
  async function save(input: TaskInput, id?: string) {
    setAnnouncement("");
    const task = await saveTask(input, id);
    setTasks((current) => id ? current.map((item) => item.id === id ? task : item) : [task, ...current]);
    setDialog(null); setError(""); setAnnouncement(id ? "Cambios guardados." : "Tarea creada.");
  }
  async function changeStatus(task: Task, nextStatus: TaskStatus) {
    if (moving.current || task.status === nextStatus) return;
    moving.current = true; setBusyId(task.id); setError(""); setAnnouncement("");
    try { const updated = await moveTask(task.id, nextStatus); setTasks((current) => current.map((item) => item.id === updated.id ? updated : item)); setAnnouncement(`Tarea movida a ${STATUS_LABELS[nextStatus].toLowerCase()}.`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos cambiar el estado."); }
    finally { moving.current = false; setBusyId(null); }
  }
  async function deleteTask(task: Task) {
    setAnnouncement("");
    await removeTask(task.id);
    setTasks((current) => current.filter((item) => item.id !== task.id)); setDialog(null); setError(""); setAnnouncement("Tarea eliminada.");
  }

  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const visible = tasks.filter((task) => (status === "all" || task.status === status) && (priority === "all" || task.priority === priority) && (!normalizedQuery || `${task.title} ${task.description}`.toLocaleLowerCase("es").includes(normalizedQuery)));
  const filtering = Boolean(query || status !== "all" || priority !== "all");
  const counts = { pending: 0, in_progress: 0, done: 0 };
  for (const task of tasks) counts[task.status] += 1;
  const ready = phase === "ready";

  return (
    <div className="app-shell">
      <a className="skip-link" href="#tablero">Ir al tablero</a>
      <header className="site-header"><a className="brand" href="/" aria-label="Foco, inicio"><span className="brand-mark" aria-hidden="true"><span /></span>foco<span className="brand-period">.</span></a><span className="workspace-badge"><Icon name="lock" size={14} />Tu espacio personal</span></header>
      <main>
        <section className="hero" aria-labelledby="page-title"><div><p className="eyebrow"><span className="small-line" />MENOS RUIDO, MÁS CLARIDAD</p><h1 id="page-title">Haz espacio para<br />lo <span>importante.</span></h1><p className="hero-description">Organiza tus pendientes, encuentra tu ritmo<br className="desktop-break" /> y avanza una tarea a la vez.</p></div><div className="hero-action"><button id="new-task-button" className="button button-primary button-large" type="button" onClick={() => create()} disabled={!ready}><Icon name="plus" />Nueva tarea</button><p>Un pequeño paso también cuenta.</p></div></section>

        <div className="stats" aria-label="Resumen de tus tareas">{STATUS_VALUES.map((value, index) => <div className={`stat stat-${value}`} key={value}><span className="stat-icon" aria-hidden="true">{value === "done" ? <Icon name="check" /> : value === "in_progress" ? <Icon name="clock" /> : <span className="pending-ring" />}</span><div><p>{["Por hacer", "En marcha", "Terminadas"][index]}</p><strong>{ready ? String(counts[value]).padStart(2, "0") : "—"}</strong></div><span className="stat-label">{["DA EL PRIMER PASO", "SIGUE ASÍ", "BIEN HECHO"][index]}</span></div>)}</div>

        <section id="tablero" className="board-section" aria-labelledby="board-title" aria-busy={phase === "loading"}>
          <div className="section-heading"><h2 id="board-title">Tu tablero <span>{ready ? `${tasks.length} ${tasks.length === 1 ? "tarea" : "tareas"}` : ""}</span></h2><span className="saved-note"><span className="live-dot" />{ready ? "Tus cambios se guardan al instante" : "Preparando tu espacio"}</span></div>
          <div className="filters"><div className="search-field"><label className="sr-only" htmlFor="task-search">Buscar tareas</label><Icon name="search" size={19} /><input id="task-search" type="search" placeholder="Buscar por título o descripción…" value={query} onChange={(event) => setQuery(event.target.value)} disabled={!ready} /></div><div className="filter-field"><label htmlFor="status-filter">Estado</label><select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus | "all")} disabled={!ready}><option value="all">Todos los estados</option>{STATUS_VALUES.map((value) => <option value={value} key={value}>{STATUS_LABELS[value]}</option>)}</select></div><div className="filter-field"><label htmlFor="priority-filter">Prioridad</label><select id="priority-filter" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority | "all")} disabled={!ready}><option value="all">Todas las prioridades</option>{PRIORITY_VALUES.map((value) => <option value={value} key={value}>{PRIORITY_LABELS[value]}</option>)}</select></div>{filtering ? <button className="clear-filters" type="button" onClick={clearFilters}>Limpiar filtros</button> : null}</div>

          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
          {error ? <div className="error-panel" role="alert"><Icon name="info" /><div><strong>No pudimos completar la acción</strong><p>{error}</p></div><button type="button" className="button button-secondary" onClick={retry}><Icon name="refresh" size={16} />Reintentar</button></div> : null}

          {phase === "loading" ? <div className="loading-board" role="status"><span className="loading-spinner" />Abriendo tu espacio…<p>Un momento para poner todo en su lugar.</p></div> : null}
          {ready && tasks.length === 0 ? <div className="empty-state"><span className="empty-mark" aria-hidden="true"><Icon name="check" size={28} /></span><p className="eyebrow">UN NUEVO COMIENZO</p><h3>Tu próximo paso empieza aquí.</h3><p>No tienes tareas todavía. Dale un lugar a eso<br className="desktop-break" /> que tienes en mente y empieza a avanzar.</p><button className="button button-primary" type="button" onClick={() => create()}><Icon name="plus" size={18} />Crear mi primera tarea</button></div> : null}
          {ready && tasks.length > 0 && visible.length === 0 ? <div className="empty-state empty-results"><Icon name="search" size={32} /><h3>No encontramos esas tareas.</h3><p>Prueba otra búsqueda o ajusta los filtros.</p><button className="button button-secondary" type="button" onClick={clearFilters}>Limpiar filtros</button></div> : null}
          {ready && visible.length > 0 ? <><p className="results-count" role="status">{filtering ? `${visible.length} de ${tasks.length} tareas coinciden con tus filtros` : ""}</p><div className="columns">{STATUS_VALUES.filter((value) => status === "all" || status === value).map((value) => { const items = visible.filter((task) => task.status === value); return <section className={`column column-${value}`} key={value} aria-labelledby={`column-${value}`}><div className="column-heading"><h3 id={`column-${value}`}><span className="status-dot" />{STATUS_LABELS[value]}<span className="column-count">{items.length}</span></h3><button type="button" className="icon-button" aria-label={`Crear tarea en ${STATUS_LABELS[value]}`} onClick={() => create(value)}><Icon name="plus" size={19} /></button></div><div className="column-tasks">{items.map((task) => <TaskCard key={task.id} task={task} busy={busyId === task.id} onEdit={(task) => setDialog({ kind: "edit", task })} onDelete={(task) => setDialog({ kind: "delete", task })} onMove={changeStatus} />)}{items.length === 0 ? <div className="column-empty"><span aria-hidden="true">{value === "done" ? "✓" : "○"}</span><p>{columnCopy[value]}</p></div> : null}</div></section>; })}</div></> : null}
        </section>
        <aside className="privacy-note"><Icon name="lock" size={15} /><p>Sin registro. Solo tus tareas, en tu espacio.<span> Conserva las cookies para volver a él; al borrarlas perderás el acceso.</span></p></aside>
      </main>
      <footer className="site-footer"><span>foco. <span>Haz menos ruido. Haz más espacio.</span></span><span>Hecho para avanzar, a tu ritmo.</span></footer>
      {dialog?.kind === "create" ? <TaskDialog key="create" initialStatus={dialog.status} onClose={() => setDialog(null)} onSave={save} /> : null}
      {dialog?.kind === "edit" ? <TaskDialog key={dialog.task.id} task={dialog.task} onClose={() => setDialog(null)} onSave={save} /> : null}
      {dialog?.kind === "delete" ? <DeleteDialog task={dialog.task} onClose={() => setDialog(null)} onDelete={deleteTask} /> : null}
    </div>
  );
}
