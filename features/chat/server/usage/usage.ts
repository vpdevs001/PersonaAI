import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { dailyUsage } from "@/lib/db/schema";

export const DAILY_LIMIT = 20;

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

/**
 * Atomically checks and increments today's usage counter for a user.
 * Must be called BEFORE the AI call, and only once per accepted message.
 *
 * Implemented as a single upsert: `INSERT ... ON CONFLICT DO UPDATE ...
 * WHERE count < limit`. If the row is new, it's inserted at count 1. If it
 * exists and is under the limit, the update bumps it by 1 atomically. If
 * it's already at the limit, the conditional update is skipped (no row is
 * returned), so we know the request should be rejected without needing an
 * explicit transaction + row lock.
 */
export async function checkAndIncrementUsage(userId: string) {
  const day = today();

  const [updated] = await db
    .insert(dailyUsage)
    .values({ userId, day, count: 1 })
    .onConflictDoUpdate({
      target: [dailyUsage.userId, dailyUsage.day],
      set: { count: sql`${dailyUsage.count} + 1` },
      setWhere: sql`${dailyUsage.count} < ${DAILY_LIMIT}`,
    })
    .returning({ count: dailyUsage.count });

  if (updated) {
    return {
      ok: true as const,
      count: updated.count,
      remaining: DAILY_LIMIT - updated.count,
      limit: DAILY_LIMIT,
    };
  }

  // Conflict happened but the WHERE guard blocked the update — the user is
  // already at (or somehow over) the limit. Read the current count back for
  // the error payload.
  const [current] = await db
    .select({ count: dailyUsage.count })
    .from(dailyUsage)
    .where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.day, day)));

  const count = current?.count ?? DAILY_LIMIT;
  return {
    ok: false as const,
    reason: "limit_exceeded",
    count,
    remaining: 0,
    limit: DAILY_LIMIT,
  };
}

/** Read-only usage lookup — does not increment. Used to render the UI counter on load. */
export async function getUsage(userId: string) {
  const day = today();
  const [row] = await db
    .select({ count: dailyUsage.count })
    .from(dailyUsage)
    .where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.day, day)));

  const count = row?.count ?? 0;
  return { count, remaining: Math.max(DAILY_LIMIT - count, 0), limit: DAILY_LIMIT };
}
