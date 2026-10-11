"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate } from "@/lib/utils";

type ChatMessage = {
  id: string;
  body: string;
  sender: "USER" | "ADMIN";
  createdAt: string;
};

export function ChatPanel({
  endpoint,
  emptyText,
  perspective = "user",
}: {
  endpoint: string;
  emptyText: string;
  perspective?: "user" | "admin";
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as {
        messages?: ChatMessage[];
        conversation?: { messages?: ChatMessage[] };
      };
      const next = data.messages ?? data.conversation?.messages ?? [];
      setMessages(Array.isArray(next) ? next : []);
    } catch {
      // Keep the last good thread if a poll fails.
    }
  }, [endpoint]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 3000);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim() || sending) return;

    setSending(true);
    setError("");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    setSending(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Could not send message.");
      return;
    }

    setBody("");
    await load();
  }

  return (
    <div className="chat-panel">
      <div className="chat-thread">
        {messages.length === 0 ? <p className="chat-empty">{emptyText}</p> : null}
        {messages.map((message) => {
          const mine =
            perspective === "admin"
              ? message.sender === "ADMIN"
              : message.sender === "USER";
          return (
          <article
            key={message.id}
            className={mine ? "chat-bubble user" : "chat-bubble admin"}
          >
            <p>{message.body}</p>
            <time>{formatDate(message.createdAt)}</time>
          </article>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className="chat-compose" onSubmit={onSubmit}>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={3}
          placeholder="Write your message..."
          required
        />
        {error ? <p className="form-note">{error}</p> : null}
        <button className="primary-btn" type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
