import type { UIMessage } from "ai";

export async function getHistory(personaId: string): Promise<UIMessage[]> {
  const res = await fetch(`/api/chat/history?personaId=${encodeURIComponent(personaId)}`);
  if (!res.ok) {
    throw new Error("Failed to load conversation history");
  }
  const data = await res.json();
  return data.messages ?? [];
}
