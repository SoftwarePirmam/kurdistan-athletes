import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOnline, requireAdmin } from "@/lib/session";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      lastSeenAt: true,
      createdAt: true,
      conversations: {
        select: {
          id: true,
          lastMessageAt: true,
          _count: {
            select: {
              messages: {
                where: { sender: "USER", readByAdmin: false },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      lastSeenAt: user.lastSeenAt?.toISOString() ?? null,
      online: isOnline(user.lastSeenAt),
      unread: user.conversations[0]?._count.messages ?? 0,
      conversationId: user.conversations[0]?.id ?? null,
    })),
  });
}
