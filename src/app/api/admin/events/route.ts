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

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: { startsAt: "asc" },
  });

  return NextResponse.json({
    events: events.map((event) => ({
      ...event,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt?.toISOString() ?? null,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const event = await prisma.event.create({
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
}
