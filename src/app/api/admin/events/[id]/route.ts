import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const schema = z.object({
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(2).max(2000),
  location: z.string().trim().min(2).max(160),
  startsAt: z.string().min(1),
  endsAt: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the event details." }, { status: 400 });
  }

  const startsAt = new Date(parsed.data.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: "Invalid start date." }, { status: 400 });
  }

  const endsAt = parsed.data.endsAt ? new Date(parsed.data.endsAt) : null;
  if (endsAt && Number.isNaN(endsAt.getTime())) {
    return NextResponse.json({ error: "Invalid end date." }, { status: 400 });
  }

  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: parsed.data.title,
        summary: parsed.data.summary,
        location: parsed.data.location,
        startsAt,
        endsAt,
        imageUrl: parsed.data.imageUrl || null,
        ctaLabel: parsed.data.ctaLabel || null,
        ctaHref: parsed.data.ctaHref || null,
        published: parsed.data.published ?? true,
      },
    });

    return NextResponse.json({
      event: {
        ...event,
        startsAt: event.startsAt.toISOString(),
        endsAt: event.endsAt?.toISOString() ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }
}
