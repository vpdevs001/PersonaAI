"use client";

import { PERSONAS, type Persona } from "@/constants";

interface PersonaSwitcherProps {
  activePersona: Persona;
  onSelect: (persona: Persona) => void;
}

export function PersonaSwitcher({
  activePersona,
  onSelect,
}: PersonaSwitcherProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-orange-500/20 bg-[#0d0d0d] p-1.5 shadow-[0_0_0_1px_rgba(255,122,26,0.08)]">
      {PERSONAS.map((persona) => {
        const isActive = activePersona.id === persona.id;

        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onSelect(persona)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-[#ff7a1a] text-black shadow-lg shadow-orange-500/20"
                : "text-[#c8bdb2] hover:bg-[#171717] hover:text-[#f7f2eb]"
            }`}
          >
            {persona.name.split(" ")[0]}
          </button>
        );
      })}
    </div>
  );
}
