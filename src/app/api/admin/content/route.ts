import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const updateSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().min(1),
      value: z.string(),
    }),
  ),
});

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = new URL(request.url).searchParams.get("page") || "home";

  const blocks = await prisma.contentBlock.findMany({
    where: { page },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ blocks });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.updates.map((item) =>
      prisma.contentBlock.update({
        where: { id: item.id },
        data: { value: item.value },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
