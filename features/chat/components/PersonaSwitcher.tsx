"use client";

import { PERSONAS, type Persona } from "@/constants";
import { PersonaAvatar } from "./PersonaAvatar";

interface PersonaSwitcherProps {
  activePersona: Persona;
  onSelect: (persona: Persona) => void;
}

export function PersonaSwitcher({ activePersona, onSelect }: PersonaSwitcherProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-orange-500/15 bg-[#0d0d0d] p-1.5">
      {PERSONAS.map((persona) => {
        const isActive = activePersona.id === persona.id;

        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onSelect(persona)}
            className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-[#1c1c1c] text-[#f7f2eb] shadow-[inset_0_0_0_1px_rgba(255,122,26,0.35)]"
                : "text-[#8f857d] hover:bg-[#141414] hover:text-[#c8bdb2]"
            }`}
          >
            <PersonaAvatar persona={persona} size={28} />
            <span className="hidden sm:inline">{persona.name.split(" ")[0]}</span>
          </button>
        );
      })}
    </div>
  );
}
