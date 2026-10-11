"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/content", label: "Website content" },
];

export function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();

  return (
    <main id="main" className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-nav">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={active ? "active" : undefined}>
                {link.label}
              </Link>
            );
          })}
          <Link href="/">View website</Link>
        </aside>
        <div className="admin-main">
          <div className="admin-top">
            <h1>{title}</h1>
            {subtitle ? <p className="admin-muted">{subtitle}</p> : null}
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
