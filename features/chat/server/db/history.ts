import { pool } from "@/lib/db/client";

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
  await pool.query(
    `INSERT INTO messages (user_id, persona_id, role, content) VALUES ($1, $2, $3, $4)`,
    [userId, personaId, role, content],
  );
}

export async function getHistory(
  userId: string,
  personaId: string,
): Promise<StoredMessage[]> {
  const res = await pool.query(
    `SELECT id, role, content, created_at
     FROM messages
     WHERE user_id = $1 AND persona_id = $2
     ORDER BY created_at ASC`,
    [userId, personaId],
  );
  return res.rows.map((row) => ({
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at.toISOString(),
  }));
}
