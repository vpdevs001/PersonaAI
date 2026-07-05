import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getHistory } from "@/features/chat/server/db/history";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const personaId = searchParams.get("personaId");
  if (!personaId) {
    return Response.json({ error: "personaId is required" }, { status: 400 });
  }

  const rows = await getHistory(session.user.id, personaId);

  // Shape rows as AI SDK UIMessage objects so they can be dropped straight
  // into useChat's `messages` initial state.
  const uiMessages = rows.map((row) => ({
    id: row.id,
    role: row.role,
    parts: [{ type: "text" as const, text: row.content }],
  }));

  return Response.json({ messages: uiMessages });
}
