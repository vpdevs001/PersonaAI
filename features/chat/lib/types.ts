import type { Persona } from "@/constants";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatState {
  activePersona: Persona;
  messages: Message[];
}
