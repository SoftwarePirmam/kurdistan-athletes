import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { isOnline, requireAdmin } from "@/lib/session";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  if (!session) redirect("/login?next=/admin/users");

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    include: {
      conversations: {
        select: {
          id: true,
          _count: {
            select: {
              messages: { where: { sender: "USER", readByAdmin: false } },
            },
          },
        },
      },
    },
  });

  return (
    <AdminShell title="Users" subtitle="Everyone who registered on the website.">
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Chat</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const conversationId = user.conversations[0]?.id;
              const unread = user.conversations[0]?._count.messages ?? 0;
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${isOnline(user.lastSeenAt) ? "online" : "offline"}`}>
                      {isOnline(user.lastSeenAt) ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    {conversationId ? (
                      <Link href={`/admin/messages?c=${conversationId}`}>
                        Open {unread ? `(${unread})` : ""}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
