"use client";

import type { UIMessage } from "ai";
import type { Persona } from "@/constants";
import { PersonaAvatar } from "./PersonaAvatar";

interface MessageBubbleProps {
  message: UIMessage;
  persona: Persona;
}

function getText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("\n");
}

export function MessageBubble({ message, persona }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const text = getText(message);

  if (!text) return null;

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <PersonaAvatar persona={persona} size={30} />}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm transition-all duration-200 sm:max-w-[72%] ${
          isUser
            ? "rounded-br-md bg-[#ff7a1a] text-black"
            : "rounded-bl-md border border-orange-500/15 bg-[#171717] text-[#f7f2eb]"
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}
