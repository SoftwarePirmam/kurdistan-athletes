"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function PresenceHeartbeat() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const ping = () => {
      void fetch("/api/presence", { method: "POST" });
    };

    ping();
    const id = window.setInterval(ping, 30000);
    return () => window.clearInterval(id);
  }, [status]);

  return null;
}
