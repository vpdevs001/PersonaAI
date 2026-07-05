import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/lib/db/schema";

// Raw `pg` pool — kept exported for anything that still needs a direct
// connection (e.g. the Better Auth Drizzle adapter uses `db`, not this,
// but a shared pool avoids opening multiple connection pools).
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Drizzle instance — this is now the single query interface for the app.
export const db = drizzle(pool, { schema });

export default db;
