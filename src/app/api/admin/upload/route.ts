import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ensureUploadDir } from "@/lib/uploads";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const blockId = String(form.get("blockId") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 8MB." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(extension)
    ? extension
    : "jpg";
  const filename = `${randomUUID()}.${safeExt}`;

  const uploadDir = await ensureUploadDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const publicPath = `/uploads/${filename}`;

  if (blockId) {
    await prisma.contentBlock.update({
      where: { id: blockId },
      data: { value: publicPath },
    });
  }

  return NextResponse.json({ path: publicPath });
}
