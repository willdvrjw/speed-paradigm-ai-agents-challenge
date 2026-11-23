import { ApiError, handleApi, json, readJson, requireSameOrigin } from "../../../lib/server/http";
import { authUnavailable, createSupabase } from "../../../lib/server/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleApi(async () => {
    requireSameOrigin(request);
    const body = await readJson(request);
    if (typeof body !== "object" || body === null || Array.isArray(body) || Object.keys(body).length > 0) {
      throw new ApiError(400, "La solicitud de sesión no necesita datos personales.");
    }
    const { supabase, hasSessionCookie } = await createSupabase();
    const { data, error } = await supabase.auth.getUser();
    if (data.user && !error) return json({ ok: true });
    if (authUnavailable(error)) throw new ApiError(503, "No pudimos abrir tu espacio. Vuelve a intentarlo.");
    if (hasSessionCookie) throw new ApiError(401, "No pudimos recuperar tu espacio. Vuelve a intentarlo sin borrar las cookies.");
    if (error && error.name !== "AuthSessionMissingError") throw new ApiError(503, "No pudimos abrir tu espacio. Vuelve a intentarlo.");
    const result = await supabase.auth.signInAnonymously();
    if (result.error || !result.data.user) throw new ApiError(503, "No pudimos crear tu espacio. Vuelve a intentarlo en un momento.");
    return json({ ok: true });
  });
}
