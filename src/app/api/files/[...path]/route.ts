import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { contentTypeFor, getUploadRoots } from "@/lib/uploads";

type Params = { params: Promise<{ path: string[] }> };

function safeJoin(root: string, relative: string) {
  const cleaned = relative.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!cleaned || cleaned.includes("..")) return null;

  const absolute = path.resolve(root, cleaned);
  const rootResolved = path.resolve(root);
  if (absolute === rootResolved || absolute.startsWith(rootResolved + path.sep)) {
    return absolute;
  }
  return null;
}

export async function GET(_request: Request, { params }: Params) {
  const { path: parts } = await params;
  const relative = parts.join("/");

  for (const root of getUploadRoots()) {
    const filePath = safeJoin(root, relative);
    if (!filePath || !existsSync(filePath)) continue;

    const data = await readFile(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentTypeFor(filePath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 });
}
