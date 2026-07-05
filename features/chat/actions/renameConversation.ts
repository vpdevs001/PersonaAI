export async function renameConversation(conversationId: string, title: string): Promise<void> {
  const res = await fetch(`/api/conversations/${conversationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    throw new Error("Failed to rename conversation");
  }
}
