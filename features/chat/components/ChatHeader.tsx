"use client";

import type { Persona } from "@/constants";
import { PersonaAvatar } from "./PersonaAvatar";

interface ChatHeaderProps {
  persona: Persona;
  remaining: number | null;
  limit: number;
  onSignOut: () => void;
}

export function ChatHeader({ persona, remaining, limit, onSignOut }: ChatHeaderProps) {
  const isLow = remaining !== null && remaining <= 3;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-orange-500/20 px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <PersonaAvatar persona={persona} size={44} />
        <div>
          <h2 className="text-base font-semibold text-[#f7f2eb]">{persona.name}</h2>
          <p className="text-sm text-[#9f968d]">{persona.tagline}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`hidden rounded-full border px-3 py-1 text-xs font-medium tracking-wide sm:block ${
            isLow
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-orange-500/20 bg-[#111111] text-[#ff9a3c]"
          }`}
        >
          {remaining === null ? "…" : `${remaining} / ${limit} prompts left today`}
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-full border border-orange-500/20 bg-[#111111] px-3 py-1.5 text-xs font-medium text-[#c8bdb2] transition hover:bg-[#171717] hover:text-[#f7f2eb]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
