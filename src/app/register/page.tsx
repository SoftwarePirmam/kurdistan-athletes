"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/contact";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
    };

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setLoading(false);
      setError(data?.error || "Could not create account.");
      return;
    }

    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created. Please log in.");
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <main id="main" className="auth-shell">
      <div className="auth-card">
        <h1>Join Kurdistan Athletes</h1>
        <p>Create a free account so you can contact the team and receive replies here.</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required autoComplete="name" />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
          {error ? <p className="form-note">{error}</p> : null}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="auth-links">
          <Link href={`/login?next=${encodeURIComponent(next)}`}>Already have an account?</Link>
          <Link href="/">Back home</Link>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="auth-shell"><div className="auth-card"><p>Loading...</p></div></main>}>
      <RegisterForm />
    </Suspense>
  );
}
