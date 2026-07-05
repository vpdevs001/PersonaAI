"use client";

import { useState } from "react";
import { getPersonaById } from "@/constants";
import type { ConversationSummary } from "../actions/getConversations";
import { formatConversationDay } from "../utils/formatting";
import { PersonaAvatar } from "./PersonaAvatar";

interface SidebarProps {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (conversation: ConversationSummary) => void;
  onNewChat: () => void;
  onDelete: (conversationId: string) => void;
  onRename: (conversationId: string, title: string) => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  loading,
  isOpen,
  onClose,
  onSelect,
  onNewChat,
  onDelete,
  onRename,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const startRename = (conversation: ConversationSummary) => {
    setEditingId(conversation.id);
    setDraftTitle(conversation.title ?? "New chat");
  };

  const commitRename = (conversationId: string) => {
    const trimmed = draftTitle.trim();
    setEditingId(null);
    if (trimmed) onRename(conversationId, trimmed);
  };

  return (
    <>
      {/* Mobile scrim */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 sm:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-orange-500/15 bg-[#0a0a0a] transition-transform duration-200 sm:static sm:z-auto sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-orange-500/15 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#ff7a1a]">Persona AI</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#8f857d] hover:text-[#f7f2eb] sm:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/25 bg-[#141414] px-3 py-2.5 text-sm font-medium text-[#f7f2eb] transition hover:border-orange-500/50 hover:bg-[#1a1a1a]"
          >
            <span className="text-base leading-none">+</span> New chat
          </button>
        </div>

        <div className="mt-3 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
          {loading ? (
            <p className="px-3 py-6 text-center text-xs text-[#7c736b]">Loading chats…</p>
          ) : conversations.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-[#7c736b]">
              No conversations yet — start one above.
            </p>
          ) : (
            conversations.map((conversation) => {
              const persona = getPersonaById(conversation.personaId);
              const isActive = conversation.id === activeConversationId;
              const isEditing = editingId === conversation.id;

              return (
                <div
                  key={conversation.id}
                  className={`group flex items-center gap-2 rounded-xl px-2 py-2 transition ${
                    isActive
                      ? "bg-[#1c1c1c] shadow-[inset_0_0_0_1px_rgba(255,122,26,0.35)]"
                      : "hover:bg-[#131313]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(conversation)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    {persona && <PersonaAvatar persona={persona} size={26} />}
                    <span className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={() => commitRename(conversation.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename(conversation.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="w-full rounded-md border border-orange-500/30 bg-[#0d0d0d] px-1.5 py-0.5 text-sm text-[#f7f2eb] outline-none"
                        />
                      ) : (
                        <span className="block truncate text-sm text-[#e7ddd3]">
                          {conversation.title ?? "New chat"}
                        </span>
                      )}
                      <span className="block truncate text-xs text-[#7c736b]">
                        {persona?.name.split(" ")[0] ?? conversation.personaId} ·{" "}
                        {formatConversationDay(conversation.updatedAt)}
                      </span>
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => startRename(conversation)}
                      aria-label="Rename conversation"
                      className="rounded-md p-1 text-xs text-[#8f857d] hover:bg-[#1f1f1f] hover:text-[#f7f2eb]"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(conversation.id)}
                      aria-label="Delete conversation"
                      className="rounded-md p-1 text-xs text-[#8f857d] hover:bg-red-500/10 hover:text-red-300"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
