import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { messages } from "@/lib/db/schema";

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
) {
  await db.insert(messages).values({
    conversationId,
    role,
    content,
  });
}

/**
 * Ownership must be checked by the caller (see
 * `conversations.ts#getOwnedConversation`) before calling this — it
 * intentionally does not take a userId, since messages only carry a
 * conversationId now.
 */
export async function getHistory(conversationId: string): Promise<StoredMessage[]> {
  const rows = await db
    .select({
      id: messages.id,
      role: messages.role,
      content: messages.content,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
  }));
}
