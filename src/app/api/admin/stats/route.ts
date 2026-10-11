import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ONLINE_WINDOW_MS, requireAdmin } from "@/lib/session";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - ONLINE_WINDOW_MS);

  const [totalUsers, onlineUsers, unreadMessages, conversations] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({
      where: {
        role: "USER",
        lastSeenAt: { gte: since },
      },
    }),
    prisma.message.count({
      where: { sender: "USER", readByAdmin: false },
    }),
    prisma.conversation.count(),
  ]);

  return NextResponse.json({
    totalUsers,
    onlineUsers,
    unreadMessages,
    conversations,
  });
}
