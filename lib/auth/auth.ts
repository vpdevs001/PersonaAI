import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { pool } from "@/lib/db/client";

/**
 * Better Auth server instance.
 *
 * - Uses the raw `pg` Pool directly (Better Auth's built-in Kysely adapter
 *   handles the SQL for us) — no ORM needed, matching the rest of this repo.
 * - Email + password only. No social providers, no email verification.
 * - `nextCookies()` must be the LAST plugin so Server Actions can set
 *   cookies on sign-in/sign-up.
 */
export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
