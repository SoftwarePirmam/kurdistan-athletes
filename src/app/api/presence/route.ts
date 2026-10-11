import { NextResponse } from "next/server";
import { requireUser, touchPresence } from "@/lib/session";

export async function POST() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await touchPresence(session.user.id);
  return NextResponse.json({ ok: true });
}
