export async function deleteConversation(conversationId: string): Promise<void> {
  const res = await fetch(`/api/conversations/${conversationId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete conversation");
  }
}
