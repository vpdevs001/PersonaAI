import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { listConversations } from "@/features/chat/server/db/conversations";

/** Sidebar list — most recently active conversation first. */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const conversations = await listConversations(session.user.id);
  return Response.json({ conversations });
}
