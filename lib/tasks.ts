export const STATUS_VALUES = ["pending", "in_progress", "done"] as const;
export const PRIORITY_VALUES = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof STATUS_VALUES)[number];
export type TaskPriority = (typeof PRIORITY_VALUES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendiente",
  in_progress: "En curso",
  done: "Hecha",
};
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export type TaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type Task = TaskInput & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type FieldErrors = Partial<Record<keyof TaskInput, string>>;

export class ValidationError extends Error {
  fields: FieldErrors;

  constructor(message: string, fields: FieldErrors = {}) {
    super(message);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export function characterCount(value: string): number {
  return Array.from(value).length;
}

export function isTaskId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function parseTaskInput(value: unknown, partial?: false): TaskInput;
export function parseTaskInput(value: unknown, partial: true): Partial<TaskInput>;
export function parseTaskInput(value: unknown, partial: boolean): TaskInput | Partial<TaskInput>;
export function parseTaskInput(value: unknown, partial = false): TaskInput | Partial<TaskInput> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ValidationError("Envía una tarea válida.");
  }
  const body = value as Record<string, unknown>;
  const keys = Object.keys(body);
  const allowed = ["title", "description", "status", "priority"];
  if (keys.length === 0 || keys.some((key) => !allowed.includes(key))) {
    throw new ValidationError("La tarea contiene campos no permitidos o está vacía.");
  }

  const fields: FieldErrors = {};
  const result: Partial<TaskInput> = {};
  if (!partial || Object.hasOwn(body, "title")) {
    if (typeof body.title !== "string" || characterCount(body.title.trim()) < 1 || characterCount(body.title.trim()) > 120 || /[\u0000-\u001f\u007f]/.test(body.title.trim())) {
      fields.title = "Escribe un título de 1 a 120 caracteres, en una sola línea.";
    } else {
      result.title = body.title.trim();
    }
  }
  if (!partial || Object.hasOwn(body, "description")) {
    if (body.description === undefined && !Object.hasOwn(body, "description") && !partial) {
      result.description = "";
    } else if (typeof body.description !== "string" || characterCount(body.description) > 500 || body.description.includes("\u0000")) {
      fields.description = "La descripción debe tener como máximo 500 caracteres.";
    } else {
      result.description = body.description;
    }
  }
  if (!partial || Object.hasOwn(body, "status")) {
    if (!Object.hasOwn(body, "status") && !partial) {
      result.status = "pending";
    } else if (typeof body.status !== "string" || !STATUS_VALUES.includes(body.status as TaskStatus)) {
      fields.status = "Elige un estado válido.";
    } else {
      result.status = body.status as TaskStatus;
    }
  }
  if (!partial || Object.hasOwn(body, "priority")) {
    if (!Object.hasOwn(body, "priority") && !partial) {
      result.priority = "medium";
    } else if (typeof body.priority !== "string" || !PRIORITY_VALUES.includes(body.priority as TaskPriority)) {
      fields.priority = "Elige una prioridad válida.";
    } else {
      result.priority = body.priority as TaskPriority;
    }
  }
  if (Object.keys(fields).length > 0) {
    throw new ValidationError("Revisa los campos de la tarea.", fields);
  }
  return result as TaskInput | Partial<TaskInput>;
}
