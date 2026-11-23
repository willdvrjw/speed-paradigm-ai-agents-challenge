export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
