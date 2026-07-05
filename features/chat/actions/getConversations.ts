export interface ConversationSummary {
  id: string;
  personaId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getConversations(): Promise<ConversationSummary[]> {
  const res = await fetch("/api/conversations");
  if (!res.ok) {
    throw new Error("Failed to load conversations");
  }
  const data = await res.json();
  return data.conversations ?? [];
}
