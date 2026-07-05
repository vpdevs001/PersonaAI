import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getUsage } from "@/features/chat/server/usage/usage";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const usage = await getUsage(session.user.id);
  return Response.json({ usage });
}
