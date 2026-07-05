import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getHistory } from "@/features/chat/server/db/history";
import { getOwnedConversation } from "@/features/chat/server/db/conversations";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  if (!conversationId) {
    return Response.json({ error: "conversationId is required" }, { status: 400 });
  }

  const conversation = await getOwnedConversation(session.user.id, conversationId);
  if (!conversation) {
    // Either it doesn't exist yet (brand new, not-yet-persisted chat) or it
    // belongs to someone else — either way, an empty thread is the right
    // response rather than leaking which case it was.
    return Response.json({ messages: [] });
  }

  const rows = await getHistory(conversationId);

  // Shape rows as AI SDK UIMessage objects so they can be dropped straight
  // into useChat's `messages` initial state.
  const uiMessages = rows.map((row) => ({
    id: row.id,
    role: row.role,
    parts: [{ type: "text" as const, text: row.content }],
  }));

  return Response.json({ messages: uiMessages });
}
