import { headers } from "next/headers";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { auth } from "@/lib/auth/auth";
import { chatModel } from "@/features/chat/server/ai/model";
import { getSystemPromptForPersona } from "@/features/chat/server/ai/personaPrompts";
import { checkModeration } from "@/features/chat/server/moderation/moderator";
import { checkAndIncrementUsage } from "@/features/chat/server/usage/usage";
import { saveMessage } from "@/features/chat/server/db/history";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const { messages, personaId } = body as { messages: UIMessage[]; personaId: string };

    if (!personaId || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "personaId and messages are required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const lastText =
      lastMessage.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("\n") ?? "";

    if (!lastText.trim()) {
      return Response.json({ error: "Empty message" }, { status: 400 });
    }

    // 1. Moderation check — happens before anything else touches the model or the counter.
    const moderation = await checkModeration(lastText);
    if (moderation?.flagged) {
      return Response.json(
        { error: "That message can't be sent — it was flagged as inappropriate." },
        { status: 400 },
      );
    }

    // 2. Rate limit — atomically checked + incremented before the model call.
    const usage = await checkAndIncrementUsage(userId);
    if (!usage.ok) {
      return Response.json(
        { error: "You've hit today's limit of prompts. Come back tomorrow!", usage },
        { status: 429 },
      );
    }

    // 3. Persist the user's message immediately (don't wait for the AI reply).
    await saveMessage(userId, personaId, "user", lastText);

    // 4. Stream the persona's reply.
    const systemPrompt = getSystemPromptForPersona(personaId);
    const result = streamText({
      model: chatModel,
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        if (text.trim()) {
          await saveMessage(userId, personaId, "assistant", text);
        }
      },
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "x-usage-remaining": String(usage.remaining),
        "x-usage-limit": String(usage.limit),
      },
    });
  } catch (err) {
    console.error("chat/send error", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
