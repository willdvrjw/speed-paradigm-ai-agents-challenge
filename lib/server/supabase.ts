import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Task, TaskInput } from "../tasks";
import { ApiError } from "./http";

type Database = {
  public: {
    Tables: { tasks: {
      Row: Task & { owner_id: string };
      Insert: TaskInput & { owner_id: string };
      Update: Partial<TaskInput>;
      Relationships: [];
    } };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export const TASK_COLUMNS = "id,title,description,status,priority,created_at,updated_at" as const;

function publicKeyOnly(key: string): boolean {
  if (key.startsWith("sb_publishable_")) return true;
  try {
    const payload = key.split(".")[1];
    return Boolean(payload) && JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).role === "anon";
  } catch { return false; }
}

export async function createSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !publicKeyOnly(key)) {
    throw new ApiError(503, "El espacio no está disponible todavía. Vuelve a intentarlo en un momento.");
  }
  let storageKey: string;
  try { storageKey = `sb-${new URL(url).hostname.split(".")[0]}-auth-token`; }
  catch { throw new ApiError(503, "El espacio no está disponible todavía. Vuelve a intentarlo en un momento."); }
  const cookieStore = await cookies();
  const hasSessionCookie = cookieStore.getAll().some(({ name }) => name === storageKey || name.startsWith(`${storageKey}.`));
  const supabase = createServerClient<Database>(url, key, {
    cookieOptions: { name: storageKey, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" },
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(items) {
        for (const { name, value, options } of items) {
          cookieStore.set(name, value, { ...options, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
        }
      },
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(15_000) }),
    },
  });
  return { supabase, hasSessionCookie };
}

export function authUnavailable(error: { status?: number } | null): boolean {
  return Boolean(error && (error.status === undefined || error.status === 0 || error.status === 429 || error.status >= 500));
}

export async function requireUser(supabase: SupabaseClient<Database>): Promise<User> {
  const { data, error } = await supabase.auth.getUser();
  if (authUnavailable(error)) throw new ApiError(503, "No pudimos comprobar tu espacio. Vuelve a intentarlo.");
  if (error || !data.user) throw new ApiError(401, "No pudimos recuperar tu sesión. Recarga la página para volver a intentarlo.");
  return data.user;
}
