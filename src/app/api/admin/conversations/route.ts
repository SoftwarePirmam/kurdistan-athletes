import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOnline, requireAdmin } from "@/lib/session";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    orderBy: { lastMessageAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          lastSeenAt: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          messages: {
            where: { sender: "USER", readByAdmin: false },
          },
        },
      },
    },
  });

  return NextResponse.json({
    conversations: conversations.map((conversation) => ({
      id: conversation.id,
      subject: conversation.subject,
      lastMessageAt: conversation.lastMessageAt.toISOString(),
      unread: conversation._count.messages,
      preview: conversation.messages[0]?.body ?? "",
      user: {
        id: conversation.user.id,
        name: conversation.user.name,
        email: conversation.user.email,
        online: isOnline(conversation.user.lastSeenAt),
      },
    })),
  });
}
