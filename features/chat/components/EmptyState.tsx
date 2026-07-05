"use client";

import type { Persona } from "@/constants";
import { EMPTY_STATE_QUOTES } from "@/constants";
import { PersonaAvatar } from "./PersonaAvatar";

interface EmptyStateProps {
  persona: Persona;
  onPick: (prompt: string) => void;
}

export function EmptyState({ persona, onPick }: EmptyStateProps) {
  const quote =
    EMPTY_STATE_QUOTES[persona.id as keyof typeof EMPTY_STATE_QUOTES] ?? "Let's get started.";

  return (
    <div className="flex h-full min-h-80 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-orange-500/20 bg-[#0d0d0d] px-6 py-10 text-center">
      <PersonaAvatar persona={persona} size={64} />
      <div>
        <p className="text-lg font-medium text-[#f7f2eb]">{persona.name}</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#8f857d]">{quote}</p>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {persona.suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPick(prompt)}
            className="rounded-full border border-orange-500/20 bg-[#141414] px-3.5 py-1.5 text-xs text-[#c8bdb2] transition hover:border-orange-500/40 hover:text-[#f7f2eb]"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
