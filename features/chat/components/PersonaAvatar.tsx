"use client";

import Image from "next/image";
import { useState } from "react";
import type { Persona } from "@/constants";

interface PersonaAvatarProps {
  persona: Persona;
  size?: number;
}

export function PersonaAvatar({ persona, size = 44 }: PersonaAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(persona.photo) && !imageFailed;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-black ring-2 ring-black/20"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        background: showPhoto
          ? undefined
          : `linear-gradient(135deg, ${persona.gradient[0]}, ${persona.gradient[1]})`,
      }}
    >
      {showPhoto ? (
        <Image
          src={persona.photo as string}
          alt={persona.name}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="text-black/80">{persona.avatar}</span>
      )}
    </div>
  );
}
