import { isTaskId, parseTaskInput, type Task } from "../../../lib/tasks";
import { ApiError, databaseError, handleApi, json, readJson, requireSameOrigin } from "../../../lib/server/http";
import { createSupabase, requireUser, TASK_COLUMNS } from "../../../lib/server/supabase";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 500;
const TIMESTAMP_CURSOR = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/;
type TaskCursor = Pick<Task, "id" | "created_at">;

function readCursor(row: TaskCursor, previous: TaskCursor | null): TaskCursor {
  if (!isTaskId(row.id) || !TIMESTAMP_CURSOR.test(row.created_at) || row.id === previous?.id) {
    throw new ApiError(503, "No pudimos recuperar todas tus tareas. Vuelve a intentarlo.");
  }
  // Preserve PostgreSQL's fractional precision; converting to Date could skip rows.
  return { id: row.id, created_at: row.created_at };
}

export async function GET() {
  return handleApi(async () => {
    const { supabase } = await createSupabase();
    const user = await requireUser(supabase);
    const tasks: Task[] = [];
    let cursor: TaskCursor | null = null;
    while (true) {
      let query = supabase.from("tasks").select(TASK_COLUMNS).eq("owner_id", user.id)
        .order("created_at", { ascending: false }).order("id", { ascending: false }).limit(PAGE_SIZE);
      if (cursor) {
        query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
      }
      const { data, error } = await query;
      if (error) databaseError(error);
      if (!data) throw new ApiError(503, "No pudimos recuperar todas tus tareas. Vuelve a intentarlo.");
      if (data.length === 0) break;
      const nextCursor = readCursor(data[data.length - 1], cursor);
      tasks.push(...data);
      cursor = nextCursor;
    }
    return json({ tasks });
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
