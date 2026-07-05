"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Persona } from "@/constants";
import { authClient } from "@/lib/auth/auth-client";
import { getUsage } from "../actions/getUsage";
import { ChatHeader } from "./ChatHeader";
import { PersonaChatThread } from "./PersonaChatThread";
import { PersonaSwitcher } from "./PersonaSwitcher";

interface ChatWindowProps {
  initialPersona: Persona;
}

export function ChatWindow({ initialPersona }: ChatWindowProps) {
  const router = useRouter();
  const [activePersona, setActivePersona] = useState<Persona>(initialPersona);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(20);

  const refreshUsage = () => {
    getUsage()
      .then((usage) => {
        setRemaining(usage.remaining);
        setLimit(usage.limit);
      })
      .catch(() => {
        /* non-fatal — leave last known value */
      });
  };

  useEffect(() => {
    refreshUsage();
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-[#f7f2eb]">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-none border-x border-orange-500/10 bg-[#080808] shadow-[0_0_0_1px_rgba(255,122,26,0.04)] sm:my-6 sm:rounded-[28px] sm:border">
        <div className="flex flex-col gap-4 border-b border-orange-500/20 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#ff7a1a]">Persona AI</p>
              <h1 className="text-2xl font-semibold text-[#f7f2eb]">Talk to a chosen voice</h1>
            </div>
            <PersonaSwitcher activePersona={activePersona} onSelect={setActivePersona} />
          </div>
        </div>

        <ChatHeader
          persona={activePersona}
          remaining={remaining}
          limit={limit}
          onSignOut={handleSignOut}
        />

        <PersonaChatThread
          key={activePersona.id}
          persona={activePersona}
          remaining={remaining}
          limit={limit}
          onAfterSend={refreshUsage}
        />
      </div>
    </div>
  );
}
