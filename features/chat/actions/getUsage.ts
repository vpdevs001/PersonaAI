export interface UsageInfo {
  count: number;
  remaining: number;
  limit: number;
}

export async function getUsage(): Promise<UsageInfo> {
  const res = await fetch("/api/chat/usage");
  if (!res.ok) {
    throw new Error("Failed to load usage");
  }
  const data = await res.json();
  return data.usage;
}
