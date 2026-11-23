import { isTaskId, parseTaskInput } from "../../../../lib/tasks";
import { ApiError, databaseError, handleApi, json, readJson, requireSameOrigin } from "../../../../lib/server/http";
import { createSupabase, requireUser, TASK_COLUMNS } from "../../../../lib/server/supabase";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

async function taskId(context: Context): Promise<string> {
  const { id } = await context.params;
  if (!isTaskId(id)) throw new ApiError(400, "El identificador de la tarea no es válido.");
  return id;
}

export async function GET(_request: Request, context: Context) {
  return handleApi(async () => {
    const id = await taskId(context);
    const { supabase } = await createSupabase();
    const user = await requireUser(supabase);
    const { data, error } = await supabase.from("tasks").select(TASK_COLUMNS).eq("id", id).eq("owner_id", user.id).maybeSingle();
    if (error) databaseError(error);
    if (!data) throw new ApiError(404, "No encontramos esa tarea en tu espacio.");
    return json({ task: data });
  });
}

export async function PATCH(request: Request, context: Context) {
  return handleApi(async () => {
    requireSameOrigin(request);
    const id = await taskId(context);
    const input = parseTaskInput(await readJson(request), true);
    const { supabase } = await createSupabase();
    const user = await requireUser(supabase);
    const { data, error } = await supabase.from("tasks").update(input).eq("id", id).eq("owner_id", user.id).select(TASK_COLUMNS).maybeSingle();
    if (error) databaseError(error);
    if (!data) throw new ApiError(404, "No encontramos esa tarea en tu espacio.");
    return json({ task: data });
  });
}

export async function DELETE(request: Request, context: Context) {
  return handleApi(async () => {
    requireSameOrigin(request);
    const id = await taskId(context);
    const { supabase } = await createSupabase();
    const user = await requireUser(supabase);
    const { data, error } = await supabase.from("tasks").delete().eq("id", id).eq("owner_id", user.id).select("id").maybeSingle();
    if (error) databaseError(error);
    if (!data) throw new ApiError(404, "No encontramos esa tarea en tu espacio.");
    return json({ ok: true });
  });
}
