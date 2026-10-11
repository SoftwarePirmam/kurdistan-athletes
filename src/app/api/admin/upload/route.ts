import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

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

  // Prefer persistent data volume path used in production.
  const uploadDir = path.join(process.cwd(), "data", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  // Also write into public/uploads when it is a real directory (local/dev).
  const publicUploads = path.join(process.cwd(), "public", "uploads");
  try {
    await mkdir(publicUploads, { recursive: true });
    await writeFile(path.join(publicUploads, filename), buffer);
  } catch {
    // Symlinked production uploads already point at /app/data/uploads.
  }

  const publicPath = `/uploads/${filename}`;

  if (blockId) {
    await prisma.contentBlock.update({
      where: { id: blockId },
      data: { value: publicPath },
    });
  }

  return NextResponse.json({ path: publicPath });
}
