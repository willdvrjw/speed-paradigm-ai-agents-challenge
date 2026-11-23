import { parseTaskInput } from "../../../lib/tasks";
import { databaseError, handleApi, json, readJson, requireSameOrigin } from "../../../lib/server/http";
import { createSupabase, requireUser, TASK_COLUMNS } from "../../../lib/server/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleApi(async () => {
    const { supabase } = await createSupabase();
    const user = await requireUser(supabase);
    const { data, error } = await supabase.from("tasks").select(TASK_COLUMNS).eq("owner_id", user.id).order("created_at", { ascending: false }).order("id");
    if (error) databaseError(error);
    return json({ tasks: data });
  });
}

export async function POST(request: Request) {
  return handleApi(async () => {
    requireSameOrigin(request);
    const input = parseTaskInput(await readJson(request));
    const { supabase } = await createSupabase();
    const user = await requireUser(supabase);
    const { data, error } = await supabase.from("tasks").insert({ ...input, owner_id: user.id }).select(TASK_COLUMNS).single();
    if (error) databaseError(error);
    return json({ task: data }, 201);
  });
}
