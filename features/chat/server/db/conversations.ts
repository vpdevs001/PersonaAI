import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { conversations } from "@/lib/db/schema";

export interface ConversationSummary {
  id: string;
  personaId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

const TITLE_MAX_LENGTH = 48;

/** Derive a ChatGPT-style title from the first user message. */
export function deriveTitle(firstMessage: string): string {
  const collapsed = firstMessage.replace(/\s+/g, " ").trim();
  if (collapsed.length <= TITLE_MAX_LENGTH) return collapsed || "New chat";
  return `${collapsed.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…`;
}

/** List a user's conversations, most recently active first. */
export async function listConversations(userId: string): Promise<ConversationSummary[]> {
  const rows = await db
    .select({
      id: conversations.id,
      personaId: conversations.personaId,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));

  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

/** Fetch a single conversation, scoped to its owner. Returns null if missing or not owned by userId. */
export async function getOwnedConversation(userId: string, conversationId: string) {
  const [row] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)));
  return row ?? null;
}

/**
 * Ensure a conversation row exists for the given (client-generated) id.
 * If it already exists, it must belong to `userId` (throws otherwise).
 * If it doesn't exist yet, it's created with a title derived from the
 * first message.
 */
export async function ensureConversation(params: {
  id: string;
  userId: string;
  personaId: string;
  firstMessage: string;
}) {
  const existing = await getOwnedConversation(params.userId, params.id);
  if (existing) return existing;

  // If a conversation with this id exists but belongs to someone else,
  // getOwnedConversation returns null above — double check there isn't an
  // id collision before inserting.
  const [created] = await db
    .insert(conversations)
    .values({
      id: params.id,
      userId: params.userId,
      personaId: params.personaId,
      title: deriveTitle(params.firstMessage),
    })
    .onConflictDoNothing({ target: conversations.id })
    .returning();

  if (created) return created;

  // Someone else already owns this id (extremely unlikely UUID collision,
  // or a replayed request) — re-check ownership to give a clear error.
  const owned = await getOwnedConversation(params.userId, params.id);
  if (!owned) {
    throw new Error("Conversation id is already in use by another user");
  }
  return owned;
}

/** Bump `updatedAt` so the conversation floats to the top of the sidebar. */
export async function touchConversation(conversationId: string) {
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));
}

export async function renameConversation(userId: string, conversationId: string, title: string) {
  const trimmed = title.trim().slice(0, TITLE_MAX_LENGTH);
  const [updated] = await db
    .update(conversations)
    .set({ title: trimmed || "New chat", updatedAt: new Date() })
    .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)))
    .returning({ id: conversations.id });
  return Boolean(updated);
}

export async function deleteConversation(userId: string, conversationId: string) {
  const [deleted] = await db
    .delete(conversations)
    .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)))
    .returning({ id: conversations.id });
  return Boolean(deleted);
}
