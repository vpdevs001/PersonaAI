import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { messages } from "@/lib/db/schema";

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export async function saveMessage(
  userId: string,
  personaId: string,
  role: "user" | "assistant",
  content: string,
) {
  await db.insert(messages).values({
    userId,
    personaId,
    role,
    content,
  });
}

export async function getHistory(
  userId: string,
  personaId: string,
): Promise<StoredMessage[]> {
  const rows = await db
    .select({
      id: messages.id,
      role: messages.role,
      content: messages.content,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(and(eq(messages.userId, userId), eq(messages.personaId, personaId)))
    .orderBy(asc(messages.createdAt));

  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
  }));
}
