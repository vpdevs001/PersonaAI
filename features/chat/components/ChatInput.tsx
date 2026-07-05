"use client";

import { useState, type FormEvent } from "react";

interface ChatInputProps {
  onSend: (value: string) => void;
  disabled?: boolean;
  disabledMessage?: string;
  isStreaming?: boolean;
}

export function ChatInput({ onSend, disabled, disabledMessage, isStreaming }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed || disabled || isStreaming) {
      return;
    }

    onSend(trimmed);
    setValue("");
  };

  if (disabled) {
    return (
      <div className="border-t border-orange-500/20 bg-[#080808] p-4 sm:p-5">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-sm text-red-300">
          {disabledMessage ?? "You've reached today's limit. Come back tomorrow!"}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-orange-500/20 bg-[#080808] p-4 sm:p-5">
      <div className="flex items-end gap-3 rounded-2xl border border-orange-500/20 bg-[#111111] p-3 shadow-[inset_0_0_0_1px_rgba(255,122,26,0.04)]">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={1}
          placeholder={isStreaming ? "Waiting for a reply..." : "Ask your next question..."}
          disabled={isStreaming}
          className="max-h-32 min-h-11 flex-1 resize-none border-none bg-transparent px-2 py-1 text-sm text-[#f7f2eb] outline-none placeholder:text-[#7c736b] disabled:opacity-50"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
        />
        <button
          type="submit"
          disabled={isStreaming || !value.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff7a1a] text-lg font-semibold text-black transition hover:bg-[#ff9a3c] focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          →
        </button>
      </div>
    </form>
  );
}
