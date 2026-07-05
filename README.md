# Persona AI

Chat with two AI personas — Hitesh Choudhary and Piyush Garg — each with their own
tone via a dedicated system prompt. Email/password auth, streamed replies,
persisted per-persona conversation history, and a 20-prompts-per-day limit.

## Stack

- Next.js 16 (App Router)
- Postgres via Docker
- Better Auth (email + password only)
- `ai` + `@ai-sdk/openai` for streaming chat completions
- OpenAI Moderation endpoint for guardrails

## Setup

1. **Copy env vars**

   ```bash
   cp .env.example .env
   ```

   Fill in `OPENAI_API_KEY` and generate a real `BETTER_AUTH_SECRET`
   (e.g. `openssl rand -hex 32`).

2. **Start Postgres**

   ```bash
   docker compose up -d
   ```

   On first boot (fresh volume), Postgres automatically runs
   `lib/db/migrations/001_init.sql`, which creates:
   - Better Auth's core tables (`user`, `session`, `account`, `verification`)
   - `messages` — per-user, per-persona conversation history
   - `daily_usage` — the 20-prompts/day counter

   > If you already have an existing `pgdata` volume from before this schema
   > existed, either run the SQL file manually against your DB, or
   > `docker compose down -v` to start fresh (this deletes existing data).

3. **Install deps & run**

   ```bash
   npm install
   npm run dev
   ```

   Visit http://localhost:3000 — you'll be redirected to `/login` to create
   an account, then land on the chat UI.

## Notes

- **Avatars**: Persona cards use a gradient + initials by default. To use real
  photos, drop licensed images at `public/personas/hitesh.jpg` and
  `public/personas/piyush.jpg`, then set `photo: "/personas/hitesh.jpg"` on
  the relevant entry in `constants/personas.ts`.
- **System prompts**: intentionally placeholder text in
  `features/chat/server/ai/personaPrompts.ts` — replace with the real,
  hand-written prompts when ready.
- **Rate limit resets**: at UTC midnight (see `DAILY_LIMIT` in
  `features/chat/server/usage/usage.ts`).
