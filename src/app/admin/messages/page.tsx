"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ChatPanel } from "@/components/chat-panel";
import { formatDate } from "@/lib/utils";

type ConversationItem = {
  id: string;
  subject: string;
  lastMessageAt: string;
  unread: number;
  preview: string;
  user: { id: string; name: string; email: string; online: boolean };
};

function MessagesInner() {
  const params = useSearchParams();
  const initial = params.get("c");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initial);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/conversations", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { conversations: ConversationItem[] };
    setConversations(data.conversations);
    setActiveId((current) => current || data.conversations[0]?.id || null);
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 4000);
    return () => window.clearInterval(id);
  }, [load]);

  const active = conversations.find((item) => item.id === activeId) || null;

  return (
    <AdminShell
      title="Messages"
      subtitle="Reply to registered users. Conversations update automatically."
    >
      <div className="admin-card admin-chat">
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <p className="admin-muted">No conversations yet.</p>
          ) : null}
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={`conversation-item${conversation.id === activeId ? " active" : ""}`}
              onClick={() => setActiveId(conversation.id)}
            >
              <strong>{conversation.user.name}</strong>
              <span>{conversation.user.email}</span>
              <em>{conversation.preview || "No messages yet"}</em>
              <span>
                {formatDate(conversation.lastMessageAt)}
                {conversation.user.online ? " · Online" : ""}
                {conversation.unread ? ` · ${conversation.unread} unread` : ""}
              </span>
            </button>
          ))}
        </div>

        <div>
          {active ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <strong>{active.user.name}</strong>
                <div className="admin-muted" style={{ margin: 0 }}>
                  {active.user.email}
                </div>
              </div>
              <ChatPanel
                endpoint={`/api/admin/conversations/${active.id}`}
                emptyText="No messages in this conversation yet."
                perspective="admin"
              />
            </>
          ) : (
            <p className="admin-muted">Select a conversation to reply.</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<AdminShell title="Messages"><p>Loading...</p></AdminShell>}>
      <MessagesInner />
    </Suspense>
  );
}
