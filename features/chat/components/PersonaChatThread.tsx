"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import type { Persona } from "@/constants";
import { getHistory } from "../actions/getHistory";
import { ChatInput } from "./ChatInput";
import { EmptyState } from "./EmptyState";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface PersonaChatThreadProps {
  persona: Persona;
  remaining: number | null;
  limit: number;
  onAfterSend: () => void;
}

export function PersonaChatThread({ persona, remaining, limit, onAfterSend }: PersonaChatThreadProps) {
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: persona.id,
    transport: new DefaultChatTransport({
      api: "/api/chat/send",
      body: { personaId: persona.id },
    }),
    onFinish: () => onAfterSend(),
  });

  useEffect(() => {
    let cancelled = false;
    getHistory(persona.id)
      .then((history) => {
        if (!cancelled) setMessages(history);
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const isStreaming = status === "submitted" || status === "streaming";
  const limitReached = remaining !== null && remaining <= 0;

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        {loadingHistory ? (
          <div className="flex h-full min-h-80 items-center justify-center text-sm text-[#7c736b]">
            Loading conversation…
          </div>
        ) : messages.length === 0 ? (
          <EmptyState persona={persona} onPick={handleSend} />
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} persona={persona} />
            ))}
            {isStreaming && messages[messages.length - 1]?.role === "user" && (
              <TypingIndicator persona={persona} />
            )}
            {error && (
              <p className="text-center text-xs text-red-300">
                {error.message || "Something went wrong. Please try again."}
              </p>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        isStreaming={isStreaming}
        disabled={limitReached}
        disabledMessage={`You've reached your ${limit} messages for today with ${persona.name.split(" ")[0]}. Come back tomorrow!`}
      />
    </>
  );
}
