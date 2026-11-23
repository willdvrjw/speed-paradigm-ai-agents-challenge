"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { characterCount, parseTaskInput, PRIORITY_LABELS, PRIORITY_VALUES, STATUS_LABELS, STATUS_VALUES, ValidationError, type FieldErrors, type Task, type TaskInput, type TaskStatus } from "../lib/tasks";
import { Icon } from "./icon";

function Modal({ title, description, busy, onClose, children }: { title: string; description: string; busy: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous?.isConnected) previous.focus();
      else document.getElementById("new-task-button")?.focus();
    };
  }, []);
  return (
    <dialog ref={ref} className="modal" aria-labelledby="modal-title" aria-describedby="modal-description" onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
      <div className="modal-heading"><div><p className="eyebrow">UN PASO A LA VEZ</p><h2 id="modal-title">{title}</h2></div><button className="icon-button" type="button" aria-label="Cerrar diálogo" disabled={busy} onClick={onClose}><Icon name="close" /></button></div>
      <p className="modal-description" id="modal-description">{description}</p>
      {children}
    </dialog>
  );
}

export function TaskDialog({ task, initialStatus = "pending", onClose, onSave }: { task?: Task; initialStatus?: TaskStatus; onClose: () => void; onSave: (input: TaskInput, id?: string) => Promise<void> }) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState(task?.status ?? initialStatus);
  const [priority, setPriority] = useState<TaskInput["priority"]>(task?.priority ?? "medium");
  const [fields, setFields] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving.current) return;
    setFields({}); setError("");
    let input: TaskInput;
    try { input = parseTaskInput({ title, description, status, priority }); }
    catch (cause) {
      if (cause instanceof ValidationError) {
        setFields(cause.fields);
        if (cause.fields.title) titleRef.current?.focus();
        else if (cause.fields.description) descriptionRef.current?.focus();
        setError(cause.message);
      }
      return;
    }
    saving.current = true; setBusy(true);
    try { await onSave(input, task?.id); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos guardar la tarea. Inténtalo de nuevo."); }
    finally { saving.current = false; setBusy(false); }
  }

  return (
    <Modal title={task ? "Editar tarea" : "Una nueva tarea"} description={task ? "Ajusta los detalles y sigue avanzando." : "Saca esa idea de tu cabeza. Dale un lugar en tu tablero."} busy={busy} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="field"><label htmlFor="task-title">Título <span className="required-mark">*</span></label><input autoFocus ref={titleRef} id="task-title" name="title" required maxLength={240} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="¿Cuál es tu próximo paso?" aria-invalid={Boolean(fields.title)} aria-describedby={`title-count${fields.title ? " title-error" : ""}`} disabled={busy} /><div className="field-foot"><span id="title-error" className="field-error">{fields.title}</span><span id="title-count">{characterCount(title)}/120</span></div></div>
        <div className="field"><label htmlFor="task-description">Descripción <span className="optional">opcional</span></label><textarea ref={descriptionRef} id="task-description" name="description" maxLength={1000} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Añade el contexto que te ayude a empezar…" aria-invalid={Boolean(fields.description)} aria-describedby={`description-count${fields.description ? " description-error" : ""}`} disabled={busy} /><div className="field-foot"><span id="description-error" className="field-error">{fields.description}</span><span id="description-count">{characterCount(description)}/500</span></div></div>
        <div className="form-grid"><div className="field"><label htmlFor="task-status">Estado</label><select id="task-status" name="status" value={status} disabled={busy} onChange={(event) => setStatus(event.target.value as TaskStatus)}>{STATUS_VALUES.map((value) => <option key={value} value={value}>{STATUS_LABELS[value]}</option>)}</select></div><div className="field"><label htmlFor="task-priority">Prioridad</label><select id="task-priority" name="priority" value={priority} disabled={busy} onChange={(event) => setPriority(event.target.value as TaskInput["priority"])}>{PRIORITY_VALUES.map((value) => <option key={value} value={value}>{PRIORITY_LABELS[value]}</option>)}</select></div></div>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <div className="modal-footer"><button className="button button-secondary" type="button" disabled={busy} onClick={onClose}>Cancelar</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? "Guardando…" : task ? "Guardar cambios" : "Crear tarea"}<Icon name="arrow" size={18} /></button></div>
      </form>
    </Modal>
  );
}

export function DeleteDialog({ task, onClose, onDelete }: { task: Task; onClose: () => void; onDelete: (task: Task) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const deleting = useRef(false);
  async function confirm() {
    if (deleting.current) return;
    deleting.current = true; setBusy(true); setError("");
    try { await onDelete(task); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos eliminar la tarea. Inténtalo de nuevo."); }
    finally { deleting.current = false; setBusy(false); }
  }
  return <Modal title="¿Eliminar esta tarea?" description="Esta acción es permanente. Puedes cancelar para conservarla." busy={busy} onClose={onClose}><div className="delete-task-name">{task.title}</div>{error ? <p role="alert" className="form-error">{error}</p> : null}<div className="modal-footer"><button autoFocus className="button button-secondary" type="button" disabled={busy} onClick={onClose}>Cancelar</button><button className="button button-danger" type="button" disabled={busy} onClick={confirm}><Icon name="trash" size={18} />{busy ? "Eliminando…" : "Eliminar tarea"}</button></div></Modal>;
}
