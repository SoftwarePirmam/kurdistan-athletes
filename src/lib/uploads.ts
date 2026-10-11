import { mkdir } from "fs/promises";
import path from "path";

export function getUploadRoots() {
  const cwd = process.cwd();
  return [
    path.join(cwd, "data", "uploads"),
    path.join(cwd, "public", "uploads"),
  ];
}

export async function ensureUploadDir() {
  const primary = getUploadRoots()[0];
  await mkdir(primary, { recursive: true });
  return primary;
}

export function resolveUploadPath(relativePath: string) {
  const cleaned = relativePath.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!cleaned || cleaned.includes("..")) {
    return null;
  }

  for (const root of getUploadRoots()) {
    const absolute = path.resolve(root, cleaned);
    if (absolute.startsWith(path.resolve(root) + path.sep) || absolute === path.resolve(root)) {
      return absolute;
    }
  }

  return null;
}

export function contentTypeFor(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
