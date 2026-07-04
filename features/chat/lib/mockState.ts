import { PERSONAS } from "@/constants";
import type { ChatState, Message } from "./types";

const START_TIME = "2025-01-01T09:00:00.000Z";

const initialMessages: Message[] = [
  {
    id: "welcome-hitesh",
    role: "assistant",
    content: "Hi! I’m here to help you learn and build with clarity.",
    createdAt: START_TIME,
  },
  {
    id: "welcome-piyush",
    role: "assistant",
    content: "Let’s turn your idea into something practical and sharp.",
    createdAt: START_TIME,
  },
];

export const createInitialChatState = (): ChatState => ({
  activePersona: PERSONAS[0],
  messages: [initialMessages[0]],
});

export const createPersonaReply = (personaId: string, message: string): string => {
  if (personaId === "piyush") {
    return `That’s a strong idea. I’d frame it around the user problem, the first step, and the simplest outcome to validate.\n\nYou said: ${message}`;
  }

  return `Nice question. I’d break it into a clear takeaway, a practical example, and a next step you can try right away.\n\nYou said: ${message}`;
};
