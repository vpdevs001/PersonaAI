import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";

/**
 * Better Auth server instance.
 *
 * - Uses the Drizzle adapter (Postgres dialect) so auth reads/writes go
 *   through the same query layer — and the same schema — as the rest of
 *   the app, instead of Better Auth's built-in Kysely adapter talking to
 *   the raw `pg` pool directly.
 * - Email + password only. No social providers, no email verification.
 * - `nextCookies()` must be the LAST plugin so Server Actions can set
 *   cookies on sign-in/sign-up.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
