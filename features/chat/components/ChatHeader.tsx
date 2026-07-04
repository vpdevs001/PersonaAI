"use client";

import type { Persona } from "@/constants";

interface ChatHeaderProps {
  persona: Persona;
}

export function ChatHeader({ persona }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-orange-500/20 px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-500/40 bg-[#161616] text-sm font-semibold text-[#ff7a1a]">
          {persona.avatar}
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#f7f2eb]">{persona.name}</h2>
          <p className="text-sm text-[#9f968d]">{persona.tagline}</p>
        </div>
      </div>
      <div className="hidden rounded-full border border-orange-500/20 bg-[#111111] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[#ff9a3c] sm:block">
        Live UI
      </div>
    </div>
  );
}
