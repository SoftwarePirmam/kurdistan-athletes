"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/support", label: "Support Our Mission" },
  { href: "/ways-we-help", label: "Ways We Help" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ brand }: { brand: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <Link className="logo" href="/" onClick={close}>
        {brand}
      </Link>

      <nav className={open ? "is-open" : undefined} aria-label="Primary">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "active" : undefined}
              aria-current={active ? "page" : undefined}
              onClick={close}
            >
              {link.label}
            </Link>
          );
        })}
        {session?.user.role === "ADMIN" ? (
          <Link href="/admin" onClick={close}>
            Admin
          </Link>
        ) : null}
      </nav>

      <div className="nav-actions">
        {session ? (
          <>
            <Link href="/contact" className="join-btn" onClick={close}>
              Messages
            </Link>
            <button
              type="button"
              className="secondary-btn nav-auth-btn"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="secondary-btn nav-auth-btn" onClick={close}>
              Login
            </Link>
            <Link href="/register" className="join-btn" onClick={close}>
              Join Us
            </Link>
          </>
        )}
        <button
          className="nav-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
