import { pool } from "@/lib/db/client";

export const DAILY_LIMIT = 20;

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

/**
 * Atomically checks and increments today's usage counter for a user.
 * Must be called BEFORE the AI call, and only once per accepted message.
 */
export async function checkAndIncrementUsage(userId: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const day = today();
    const selectRes = await client.query(
      `SELECT count FROM daily_usage WHERE user_id = $1 AND day = $2 FOR UPDATE`,
      [userId, day],
    );

    if (selectRes.rowCount === 0) {
      await client.query(
        `INSERT INTO daily_usage (user_id, day, count) VALUES ($1, $2, 1)`,
        [userId, day],
      );
      await client.query("COMMIT");
      return { ok: true as const, count: 1, remaining: DAILY_LIMIT - 1, limit: DAILY_LIMIT };
    }

    const count = selectRes.rows[0].count as number;
    if (count >= DAILY_LIMIT) {
      await client.query("ROLLBACK");
      return { ok: false as const, reason: "limit_exceeded", count, remaining: 0, limit: DAILY_LIMIT };
    }

    const updateRes = await client.query(
      `UPDATE daily_usage SET count = count + 1 WHERE user_id = $1 AND day = $2 RETURNING count`,
      [userId, day],
    );
    await client.query("COMMIT");
    const newCount = updateRes.rows[0].count as number;
    return { ok: true as const, count: newCount, remaining: DAILY_LIMIT - newCount, limit: DAILY_LIMIT };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/** Read-only usage lookup — does not increment. Used to render the UI counter on load. */
export async function getUsage(userId: string) {
  const day = today();
  const res = await pool.query(
    `SELECT count FROM daily_usage WHERE user_id = $1 AND day = $2`,
    [userId, day],
  );
  const count = res.rowCount ? (res.rows[0].count as number) : 0;
  return { count, remaining: Math.max(DAILY_LIMIT - count, 0), limit: DAILY_LIMIT };
}
