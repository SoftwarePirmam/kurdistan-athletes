import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const schema = z.object({
  body: z.string().trim().min(1).max(4000),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.message.updateMany({
    where: {
      conversationId: id,
      sender: "USER",
      readByAdmin: false,
    },
    data: { readByAdmin: true },
  });

  return NextResponse.json({
    conversation: {
      id: conversation.id,
      subject: conversation.subject,
      user: conversation.user,
      messages: conversation.messages.map((message) => ({
        id: message.id,
        body: message.body,
        sender: message.sender,
        createdAt: message.createdAt.toISOString(),
      })),
    },
  });
}

export async function POST(request: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      userId: session.user.id,
      sender: "ADMIN",
      body: parsed.data.body,
      readByAdmin: true,
      readByUser: false,
    },
  });

  await prisma.conversation.update({
    where: { id },
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
