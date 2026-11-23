import { Icon } from "./icon";
import { PRIORITY_LABELS, STATUS_LABELS, STATUS_VALUES, type Task, type TaskStatus } from "../lib/tasks";

const dateFormat = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: "America/Bogota" });

type Props = {
  task: Task;
  busy: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, status: TaskStatus) => void;
};

export function TaskCard({ task, busy, onEdit, onDelete, onMove }: Props) {
  return (
    <article className={`task-card ${task.status === "done" ? "task-complete" : ""}`} aria-labelledby={`task-${task.id}`} aria-busy={busy}>
      <div className="task-card-top">
        <span className={`priority priority-${task.priority}`}><span className="priority-dot" />Prioridad {PRIORITY_LABELS[task.priority].toLowerCase()}</span>
        <div className="task-actions">
          <button className="icon-button" type="button" aria-label={`Editar ${task.title}`} title="Editar tarea" disabled={busy} onClick={() => onEdit(task)}><Icon name="edit" size={17} /></button>
          <button className="icon-button danger-icon" type="button" aria-label={`Eliminar ${task.title}`} title="Eliminar tarea" disabled={busy} onClick={() => onDelete(task)}><Icon name="trash" size={17} /></button>
        </div>
      </div>
      <h3 id={`task-${task.id}`}>{task.title}</h3>
      {task.description ? <p className="task-description">{task.description}</p> : null}
      <div className="task-card-bottom">
        <time dateTime={task.created_at} title="Fecha de creación"><Icon name="clock" size={14} />{dateFormat.format(new Date(task.created_at))}</time>
        <select aria-label={`Estado de ${task.title}`} value={task.status} disabled={busy} onChange={(event) => onMove(task, event.target.value as TaskStatus)}>
          {STATUS_VALUES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
        </select>
      </div>
      {busy ? <span className="card-saving" role="status">Guardando cambio…</span> : null}
    </article>
  );
}
