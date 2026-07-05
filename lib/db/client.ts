import { Pool, type QueryResultRow } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  (() => {
    const user = process.env.POSTGRES_USER || "persona_user";
    const pass = process.env.POSTGRES_PASSWORD || "changeme";
    const host = process.env.POSTGRES_HOST || "localhost";
    const port = process.env.POSTGRES_PORT || "5432";
    const db = process.env.POSTGRES_DB || "persona_db";
    return `postgresql://${user}:${pass}@${host}:${port}/${db}`;
  })();

export const pool = new Pool({ connectionString: DATABASE_URL });

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params);
}

const db = { pool, query };
export default db;
