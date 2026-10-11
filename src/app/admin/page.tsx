import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ONLINE_WINDOW_MS, requireAdmin } from "@/lib/session";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  if (!session) redirect("/login?next=/admin");

  const since = new Date(Date.now() - ONLINE_WINDOW_MS);

  const [totalUsers, onlineUsers, unreadMessages, conversations] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "USER", lastSeenAt: { gte: since } } }),
    prisma.message.count({ where: { sender: "USER", readByAdmin: false } }),
    prisma.conversation.count(),
  ]);

  return (
    <AdminShell
      title="Admin dashboard"
      subtitle="Live overview of members, presence, and unread conversations."
    >
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total users</span>
          <strong>{totalUsers}</strong>
        </div>
        <div className="stat-card">
          <span>Online now</span>
          <strong>{onlineUsers}</strong>
        </div>
        <div className="stat-card">
          <span>Unread messages</span>
          <strong>{unreadMessages}</strong>
        </div>
        <div className="stat-card">
          <span>Conversations</span>
          <strong>{conversations}</strong>
        </div>
      </div>
    </AdminShell>
  );
}
