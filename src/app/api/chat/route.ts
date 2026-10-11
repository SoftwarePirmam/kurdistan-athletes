import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, touchPresence } from "@/lib/session";

const schema = z.object({
  body: z.string().trim().min(1).max(4000),
});

async function getOrCreateConversation(userId: string) {
  const existing = await prisma.conversation.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.conversation.create({
    data: { userId },
  });
}

export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "ADMIN") {
    return NextResponse.json({ error: "Use admin chat endpoints." }, { status: 400 });
  }

  await touchPresence(session.user.id);

  const conversation = await getOrCreateConversation(session.user.id);

  await prisma.message.updateMany({
    where: {
      conversationId: conversation.id,
      sender: "ADMIN",
      readByUser: false,
    },
    data: { readByUser: true },
  });

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    conversationId: conversation.id,
    messages: messages.map((message) => ({
      id: message.id,
      body: message.body,
      sender: message.sender,
      createdAt: message.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "ADMIN") {
    return NextResponse.json({ error: "Admins reply from the admin panel." }, { status: 400 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  await touchPresence(session.user.id);
  const conversation = await getOrCreateConversation(session.user.id);

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      userId: session.user.id,
      sender: "USER",
      body: parsed.data.body,
      readByUser: true,
      readByAdmin: false,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });

  return NextResponse.json({
    message: {
      id: message.id,
      body: message.body,
      sender: message.sender,
      createdAt: message.createdAt.toISOString(),
    },
  });
}
