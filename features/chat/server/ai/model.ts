import { createOpenAI } from "@ai-sdk/openai";

const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Centralized so the model name only needs to change in one place.
export const CHAT_MODEL_ID = "gpt-4o-mini";

export const chatModel = openaiProvider(CHAT_MODEL_ID);
