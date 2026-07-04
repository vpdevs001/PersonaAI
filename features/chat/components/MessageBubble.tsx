"use client";

import { formatTime } from "../utils/formatting";
import type { Message } from "../lib/types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm transition-all duration-200 sm:max-w-[72%] ${
          isUser
            ? "bg-[#ff7a1a] text-black"
            : "border border-orange-500/20 bg-[#171717] text-[#f7f2eb]"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={`mt-2 text-[11px] ${isUser ? "text-black/70" : "text-[#8f857d]"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
