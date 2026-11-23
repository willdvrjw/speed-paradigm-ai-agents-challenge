import "server-only";

import { NextResponse } from "next/server";
import { ValidationError } from "../tasks";
import { isSameOrigin } from "../security";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: {
    "Cache-Control": "no-store, max-age=0",
    "Vary": "Cookie, Origin",
  } });
}

export async function handleApi(action: () => Promise<NextResponse>): Promise<NextResponse> {
  try { return await action(); }
  catch (cause) {
    if (cause instanceof ApiError) return json({ error: cause.message }, cause.status);
    if (cause instanceof ValidationError) return json({ error: cause.message, fields: cause.fields }, 400);
    return json({ error: "El servicio no está disponible. Vuelve a intentarlo en un momento." }, 503);
  }
}

export function requireSameOrigin(request: Request): void {
  if (!isSameOrigin(request)) throw new ApiError(403, "No se permite esta solicitud desde otro origen.");
}

export async function readJson(request: Request): Promise<unknown> {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") ?? "")) {
    throw new ApiError(400, "Envía los datos en formato JSON.");
  }
  if (!request.body) throw new ApiError(400, "Envía un cuerpo JSON válido.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > 8192) {
        await reader.cancel();
        throw new ApiError(413, "La solicitud es demasiado grande.");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new ApiError(400, "El cuerpo JSON no es válido."); }
}

export function databaseError(error: { code?: string }): never {
  if (["23514", "23502", "22P02", "22001", "22021"].includes(error.code ?? "")) {
    throw new ApiError(400, "Los datos de la tarea no son válidos. Revisa los campos.");
  }
  throw new ApiError(503, "No pudimos guardar o recuperar tus tareas. Vuelve a intentarlo.");
}
