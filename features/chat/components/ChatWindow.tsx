"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EMPTY_STATE_QUOTES, type Persona } from "@/constants";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { PersonaSwitcher } from "./PersonaSwitcher";
import { createInitialChatState, createPersonaReply } from "../lib/mockState";
import type { Message } from "../lib/types";

interface ChatWindowProps {
  initialPersona: Persona;
}

export function ChatWindow({ initialPersona }: ChatWindowProps) {
  const [activePersona, setActivePersona] = useState<Persona>(initialPersona);
  const [messages, setMessages] = useState<Message[]>(
    () => createInitialChatState().messages,
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePersonaChange = (persona: Persona) => {
    setActivePersona(persona);
    setMessages([]);
  };

  const handleSend = (content: string) => {
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);

    window.setTimeout(() => {
      const reply: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: createPersonaReply(activePersona.id, content),
        createdAt: new Date().toISOString(),
      };
      setMessages((current) => [...current, reply]);
    }, 300);
  };

  const emptyStateQuote = useMemo(() => {
    return (
      EMPTY_STATE_QUOTES[activePersona.id as keyof typeof EMPTY_STATE_QUOTES] ??
      "Let’s get started."
    );
  }, [activePersona.id]);

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-[#f7f2eb]">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-none border-x border-orange-500/10 bg-[#080808] shadow-[0_0_0_1px_rgba(255,122,26,0.04)] sm:my-6 sm:rounded-[28px] sm:border">
        <div className="flex flex-col gap-4 border-b border-orange-500/20 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#ff7a1a]">
                Persona AI
              </p>
              <h1 className="text-2xl font-semibold text-[#f7f2eb]">
                Talk to a chosen voice
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-orange-500/20 bg-[#111111] px-3 py-2 text-sm text-[#c8bdb2]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff7a1a]" />
              Frontend only demo
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ChatHeader persona={activePersona} />
            <div className="w-full sm:w-auto">
              <PersonaSwitcher
                activePersona={activePersona}
                onSelect={handlePersonaChange}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-orange-500/20 bg-[#0d0d0d] px-6 text-center">
              <p className="text-lg font-medium text-[#f7f2eb]">
                {activePersona.name}
              </p>
              <p className="mt-2 max-w-md text-sm leading-7 text-[#8f857d]">
                {emptyStateQuote}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
