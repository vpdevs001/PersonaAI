import type { UIMessage } from "ai";

export async function getHistory(conversationId: string): Promise<UIMessage[]> {
  const res = await fetch(`/api/chat/history?conversationId=${encodeURIComponent(conversationId)}`);
  if (!res.ok) {
    throw new Error("Failed to load conversation history");
  }
  const data = await res.json();
  return data.messages ?? [];
}
