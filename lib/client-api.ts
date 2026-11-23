import type { Task, TaskInput } from "./tasks";

class RequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "RequestError";
    this.status = status;
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      credentials: "same-origin",
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error("No pudimos conectar. Comprueba tu conexión y vuelve a intentarlo.");
  }
  let body: T & { error?: string };
  try {
    body = await response.json();
  } catch {
    throw new Error("El servicio no está disponible. Vuelve a intentarlo en un momento.");
  }
  if (!response.ok) {
    throw new RequestError(response.status, body.error || "No pudimos completar la acción. Vuelve a intentarlo.");
  }
  return body;
}

export async function loadTasks(): Promise<Task[]> {
  if (typeof navigator !== "undefined" && navigator.cookieEnabled === false) {
    throw new Error("Para abrir tu espacio, permite las cookies de este sitio en tu navegador y pulsa Reintentar.");
  }
  await request<{ ok: boolean }>("/api/session", { method: "POST", body: "{}" });
  try {
    const data = await request<{ tasks: Task[] }>("/api/tasks");
    return data.tasks;
  } catch (cause) {
    if (cause instanceof RequestError && cause.status === 401) {
      throw new Error("No pudimos conservar tu sesión. Permite las cookies de este sitio y pulsa Reintentar. Si ya las permites, vuelve a cargar la página.");
    }
    throw cause;
  }
}

export async function saveTask(input: TaskInput, id?: string): Promise<Task> {
  const data = await request<{ task: Task }>(id ? `/api/tasks/${id}` : "/api/tasks", {
    method: id ? "PATCH" : "POST",
    body: JSON.stringify(input),
  });
  return data.task;
}

export async function moveTask(id: string, status: Task["status"]): Promise<Task> {
  const data = await request<{ task: Task }>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return data.task;
}

export async function removeTask(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/tasks/${id}`, { method: "DELETE" });
}
