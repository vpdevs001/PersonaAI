import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { deleteConversation, renameConversation } from "@/features/chat/server/db/conversations";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title : null;
  if (!title || !title.trim()) {
    return Response.json({ error: "title is required" }, { status: 400 });
  }

  const ok = await renameConversation(session.user.id, id, title);
  if (!ok) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteConversation(session.user.id, id);
  if (!ok) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
