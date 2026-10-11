import { prisma } from "@/lib/prisma";

export type ContentMap = Record<string, string>;

export async function getPageContent(page: string): Promise<ContentMap> {
  try {
    const blocks = await prisma.contentBlock.findMany({
      where: { page },
      orderBy: { sortOrder: "asc" },
    });

    return Object.fromEntries(blocks.map((block) => [block.key, block.value]));
  } catch {
    return {};
  }
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? fallback;
}

export function t(content: ContentMap, key: string, fallback = ""): string {
  return content[key] ?? fallback;
}
