"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPersonaById, type Persona } from "@/constants";
import { authClient } from "@/lib/auth/auth-client";
import { getUsage } from "../actions/getUsage";
import { getConversations, type ConversationSummary } from "../actions/getConversations";
import { deleteConversation as deleteConversationRequest } from "../actions/deleteConversation";
import { renameConversation as renameConversationRequest } from "../actions/renameConversation";
import { ChatHeader } from "./ChatHeader";
import { PersonaChatThread } from "./PersonaChatThread";
import { PersonaSwitcher } from "./PersonaSwitcher";
import { Sidebar } from "./Sidebar";

interface ChatWindowProps {
  initialPersona: Persona;
}

function newConversationId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ChatWindow({ initialPersona }: ChatWindowProps) {
  const router = useRouter();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activePersona, setActivePersona] = useState<Persona>(initialPersona);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const refreshConversations = () =>
    getConversations()
      .then(setConversations)
      .catch(() => {
        /* non-fatal — sidebar just keeps showing the last known list */
      });

  // Initial load: usage counter + conversation list, then land on the most
  // recently active conversation (or start a fresh, unsaved one).
  useEffect(() => {
    refreshUsage();

    let cancelled = false;
    getConversations()
      .then((list) => {
        if (cancelled) return;
        setConversations(list);
        if (list.length > 0) {
          setActiveConversationId(list[0].id);
          setActivePersona(getPersonaById(list[0].personaId) ?? initialPersona);
        } else {
          setActiveConversationId(newConversationId());
          setActivePersona(initialPersona);
        }
      })
      .catch(() => {
        if (!cancelled) setActiveConversationId(newConversationId());
      })
      .finally(() => {
        if (!cancelled) setConversationsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAfterSend = () => {
    refreshUsage();
    refreshConversations();
  };

  const handleNewChat = (persona: Persona = activePersona) => {
    setActiveConversationId(newConversationId());
    setActivePersona(persona);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (conversation: ConversationSummary) => {
    setActiveConversationId(conversation.id);
    setActivePersona(getPersonaById(conversation.personaId) ?? activePersona);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    const remainingConversations = conversations.filter((c) => c.id !== conversationId);
    setConversations(remainingConversations);

    if (conversationId === activeConversationId) {
      if (remainingConversations.length > 0) {
        handleSelectConversation(remainingConversations[0]);
      } else {
        handleNewChat(activePersona);
      }
    }

    try {
      await deleteConversationRequest(conversationId);
    } catch {
      refreshConversations();
    }
  };

  const handleRenameConversation = async (conversationId: string, title: string) => {
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, title } : c)));
    try {
      await renameConversationRequest(conversationId, title);
    } catch {
      refreshConversations();
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const isNewConversation =
    activeConversationId !== null && !conversations.some((c) => c.id === activeConversationId);

  return (
    <div className="flex min-h-screen bg-[#050505] text-[#f7f2eb]">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        loading={conversationsLoading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={handleSelectConversation}
        onNewChat={() => handleNewChat()}
        onDelete={handleDeleteConversation}
        onRename={handleRenameConversation}
      />

      <div className="flex flex-1 flex-col overflow-hidden sm:my-6 sm:ml-0 sm:mr-6 sm:rounded-[28px] sm:border sm:border-orange-500/10 sm:bg-[#080808] sm:shadow-[0_0_0_1px_rgba(255,122,26,0.04)]">
        <div className="flex flex-col gap-4 border-b border-orange-500/20 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open conversation history"
                className="rounded-lg border border-orange-500/20 bg-[#111111] px-2.5 py-2 text-sm text-[#c8bdb2] transition hover:text-[#f7f2eb] sm:hidden"
              >
                ☰
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#ff7a1a]">Persona AI</p>
                <h1 className="text-2xl font-semibold text-[#f7f2eb]">Talk to a chosen voice</h1>
              </div>
            </div>
            <PersonaSwitcher activePersona={activePersona} onSelect={handleNewChat} />
          </div>
        </div>

        <ChatHeader
          persona={activePersona}
          remaining={remaining}
          limit={limit}
          onSignOut={handleSignOut}
        />

        {activeConversationId && (
          <PersonaChatThread
            key={activeConversationId}
            persona={activePersona}
            conversationId={activeConversationId}
            isNewConversation={isNewConversation}
            remaining={remaining}
            limit={limit}
            onAfterSend={handleAfterSend}
          />
        )}
      </div>
    </div>
  );
}
