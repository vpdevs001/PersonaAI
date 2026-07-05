"use client";

import type { Persona } from "@/constants";
import { PersonaAvatar } from "./PersonaAvatar";

export function TypingIndicator({ persona }: { persona: Persona }) {
  return (
    <div className="flex items-end gap-2">
      <PersonaAvatar persona={persona} size={30} />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-orange-500/15 bg-[#171717] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full"
            style={{ backgroundColor: persona.accent, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
